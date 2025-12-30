import { DAY_TIME_EMOJI, DAY_TIME_NAMES } from "./constant";
import {
  getBranch,
  getCommit,
  getRepositories,
  GithubService,
} from "./services";
import { TRepository } from "./types/repository";
import { make_list } from "./utils";
import * as fs from "node:fs/promises";

const dateData = {};
var repositories: TRepository[] = [];
var lastPageInfo = null;

const githubService = new GithubService(process.env.TOKEN_ACCESS);

// main
(async () => {
  try {
    // auth
    await githubService.auth();
    console.log("user: ", githubService.getUser());
    console.log("fetching repo: ...");
    const response = await getRepositories();
    repositories = [
      ...response.data.data.user.repositories.nodes,
      ...repositories,
    ];
    lastPageInfo = response.data.data.user.repositories.pageInfo;
    while (lastPageInfo.hasNextPage) {
      const text = await getRepositories(lastPageInfo.endCursor);
      repositories = [
        ...text.data.data.user.repositories.nodes,
        ...repositories,
      ];
      lastPageInfo = text.data.data.user.repositories.pageInfo;
    }
    console.log("Total repositories:", repositories.length);
    console.log("Fetch repo: done");

    // fetching branch
    console.log("fetching branch: ...");
    for (const repository of repositories) {
      const responseBranch = await getBranch(
        repository.owner.login,
        repository.name,
      );
      repository["branches"] = responseBranch.data.data.repository.refs.nodes;
    }
    console.log("Fetch branch: done");
    console.log(
      "Total branches: ",
      repositories
        .map((repo) => ({ ...repo, branches: repo.branches.length }))
        .reduce((acc, val) => val.branches + acc, 0),
    );

    // fetch commit
    for (const repository of repositories) {
      for (const branch of repository.branches) {
        let commits = [];
        const reponseCommit = await getCommit(
          repository.owner.login,
          repository.name,
          branch.name,
          githubService.getUser().node_id,
        );
        // check the authenticate access
        if (!reponseCommit.data.data.repository.ref) continue;

        commits = [
          ...reponseCommit.data.data.repository.ref.target.history.nodes,
          ...commits,
        ];
        lastPageInfo =
          reponseCommit.data.data.repository.ref.target.history.pageInfo;
        while (lastPageInfo.hasNextPage) {
          const reponseCommit = await getCommit(
            repository.owner.login,
            repository.name,
            branch.name,
            githubService.getUser().node_id,
            lastPageInfo.endCursor,
          );

          if (!reponseCommit.data.data.repository.ref) {
            lastPageInfo.hasNextPage == false;
          } else {
            commits = [
              ...reponseCommit.data.data.repository.ref.target.history.nodes,
              ...commits,
            ];
            lastPageInfo =
              reponseCommit.data.data.repository.ref.target.history.pageInfo;
          }
        }
        for (const commit of commits) {
          const dateMatch = commit.committedDate?.match(/\d+-\d+-\d+/);
          if (!dateMatch) continue;

          // const date = dateMatch[0];
          // const curr_year = new Date(date).getFullYear();
          // const quarter = Math.floor(new Date(date).getMonth() / 3) + 1;

          if (!(repository.name in dateData)) {
            dateData[repository.name] = {};
          }

          if (!(branch.name in dateData[repository.name])) {
            dateData[repository.name][branch.name] = {};
          }

          dateData[repository.name][branch.name][commit.oid] =
            commit.committedDate;
        }
      }
    }
    // calculate activity day
    let stats = "";
    let dayTimes = Array(4).fill(0);
    let sumDay = 0;
    for (const repository of repositories) {
      if (!(repository.name in dateData)) continue;
      for (const branch of Object.values(dateData[repository.name])) {
        for (const commit_date of Object.values(branch)) {
          const date = new Date(commit_date);

          const hour = date.getHours();
          dayTimes[Math.floor(hour / 6)] += 1;
        }
      }
    }
    sumDay = dayTimes.reduce((acc, value) => (acc = value + acc), 0);
    dayTimes = [...dayTimes.slice(1), dayTimes[0]];
    const dt_names = dayTimes.map(
      (_, i) => `${DAY_TIME_EMOJI[i]} ${DAY_TIME_NAMES[i]}`,
    );

    const dt_texts = dayTimes.map((day_time) => `${day_time} commits`);

    const dt_percents = dayTimes.map((day_time) =>
      sumDay === 0 ? 0 : Math.round((day_time / sumDay) * 100 * 100) / 100,
    );

    const title =
      dayTimes[0] + dayTimes[1] >= dayTimes[2] + dayTimes[3]
        ? "I am an Early 🐤"
        : "I am a Night 🦉";

    stats += `**${title}** \n\n\`\`\`\n${make_list({
      names: dt_names,
      texts: dt_texts,
      percents: dt_percents,
      top_num: 7,
      sort: false,
    })}\n\`\`\`\n`;
    await fs.writeFile("./../stats.md", stats, { flag: "w+" });
    console.log("success write to file !!!");
  } catch (e) {
    console.log(e);
  }
})();
