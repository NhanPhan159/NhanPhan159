"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const services_1 = require("./services");
const utils_1 = require("./utils");
const fs = __importStar(require("node:fs/promises"));
const dateData = {};
var repositories = [];
var lastPageInfo = null;
const githubService = new services_1.GithubService(process.env.TOKEN_ACCESS);
// main
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // auth
        yield githubService.auth();
        console.log("user: ", githubService.getUser());
        console.log("fetching repo: ...");
        const response = yield (0, services_1.getRepositories)();
        repositories = [
            ...response.data.data.user.repositories.nodes,
            ...repositories,
        ];
        lastPageInfo = response.data.data.user.repositories.pageInfo;
        while (lastPageInfo.hasNextPage) {
            const text = yield (0, services_1.getRepositories)(lastPageInfo.endCursor);
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
            const responseBranch = yield (0, services_1.getBranch)(repository.owner.login, repository.name);
            repository["branches"] = responseBranch.data.data.repository.refs.nodes;
        }
        console.log("Fetch branch: done");
        console.log("Total branches: ", repositories
            .map((repo) => (Object.assign(Object.assign({}, repo), { branches: repo.branches.length })))
            .reduce((acc, val) => val.branches + acc, 0));
        // fetch commit
        for (const repository of repositories) {
            for (const branch of repository.branches) {
                let commits = [];
                const reponseCommit = yield (0, services_1.getCommit)(repository.owner.login, repository.name, branch.name, githubService.getUser().node_id);
                // check the authenticate access
                if (!reponseCommit.data.data.repository.ref)
                    continue;
                commits = [
                    ...reponseCommit.data.data.repository.ref.target.history.nodes,
                    ...commits,
                ];
                lastPageInfo =
                    reponseCommit.data.data.repository.ref.target.history.pageInfo;
                while (lastPageInfo.hasNextPage) {
                    const reponseCommit = yield (0, services_1.getCommit)(repository.owner.login, repository.name, branch.name, githubService.getUser().node_id, lastPageInfo.endCursor);
                    if (!reponseCommit.data.data.repository.ref) {
                        lastPageInfo.hasNextPage == false;
                    }
                    else {
                        commits = [
                            ...reponseCommit.data.data.repository.ref.target.history.nodes,
                            ...commits,
                        ];
                        lastPageInfo =
                            reponseCommit.data.data.repository.ref.target.history.pageInfo;
                    }
                }
                for (const commit of commits) {
                    const dateMatch = (_a = commit.committedDate) === null || _a === void 0 ? void 0 : _a.match(/\d+-\d+-\d+/);
                    if (!dateMatch)
                        continue;
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
            if (!(repository.name in dateData))
                continue;
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
        const dt_names = dayTimes.map((_, i) => `${constant_1.DAY_TIME_EMOJI[i]} ${constant_1.DAY_TIME_NAMES[i]}`);
        const dt_texts = dayTimes.map((day_time) => `${day_time} commits`);
        const dt_percents = dayTimes.map((day_time) => sumDay === 0 ? 0 : Math.round((day_time / sumDay) * 100 * 100) / 100);
        const title = dayTimes[0] + dayTimes[1] >= dayTimes[2] + dayTimes[3]
            ? "I am an Early 🐤"
            : "I am a Night 🦉";
        stats += `**${title}** \n\n\`\`\`\n${(0, utils_1.make_list)({
            names: dt_names,
            texts: dt_texts,
            percents: dt_percents,
            top_num: 7,
            sort: false,
        })}\n\`\`\`\n`;
        yield fs.writeFile("./../stats.md", stats, { flag: "w+" });
        console.log("success write to file !!!");
    }
    catch (e) {
        console.log(e);
    }
}))();
//# sourceMappingURL=app.js.map