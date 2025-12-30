"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositories = exports.getBranch = exports.getCommit = void 0;
const config_1 = __importDefault(require("../config"));
const axios_client_1 = __importDefault(require("./axios-client"));
const getRepositories = (endCursor) => __awaiter(void 0, void 0, void 0, function* () {
    const after = endCursor ? `, after:"${endCursor}" ` : "";
    const data = yield axios_client_1.default.post(config_1.default.URL, {
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
});
exports.getRepositories = getRepositories;
const getBranch = (owner, name) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield axios_client_1.default.post(config_1.default.URL, {
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
});
exports.getBranch = getBranch;
const getCommit = (owner, name, branch, id, endCursor) => __awaiter(void 0, void 0, void 0, function* () {
    const after = endCursor ? `, after:"${endCursor}" ` : "";
    const data = yield axios_client_1.default.post(config_1.default.URL, {
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
});
exports.getCommit = getCommit;
//# sourceMappingURL=graph-ql.js.map