import CONFIGS from "../config";
import axiosClient from "./axios-client";

const getRepositories = async (endCursor?: string) => {
  const after = endCursor ? `, after:"${endCursor}" ` : "";
  const data = await axiosClient.post(CONFIGS.URL, {
    query: `
query {
  user(login: "NhanPhan159") {
    repositories(orderBy: {field: CREATED_AT, direction: DESC}, first: 10 ${after} ,affiliations: [OWNER, COLLABORATOR]) {
      nodes {
        primaryLanguage {
          name
        }
        name
        owner {
          login
        }
        isPrivate
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
      `,
  });
  return data;
};

const getBranch = async (owner: string, name: string) => {
  const data = await axiosClient.post(CONFIGS.URL, {
    query: `
query {
  repository(owner: "${owner}", name: "${name}") {
        refs(refPrefix: "refs/heads/", orderBy: {direction: DESC, field: TAG_COMMIT_DATE}, first:100) {
            nodes {
                name
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
  }
}
          `,
  });
  return data;
};
const getCommit = async (
  owner: string,
  name: string,
  branch: string,
  id: string,
  endCursor?: string,
) => {
  const after = endCursor ? `, after:"${endCursor}" ` : "";
  const data = await axiosClient.post(CONFIGS.URL, {
    query: `
query {
  repository(owner: "${owner}", name: "${name}") {
    ref(qualifiedName: "refs/heads/${branch}") {
      target {
        ... on Commit {
          history(author: { id: "${id}" }, first: 100 ${after}) {
            nodes {
              ... on Commit {
                additions
                deletions
                committedDate
                oid
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  }
}

          `,
  });
  return data;
};

export { getCommit, getBranch, getRepositories };
