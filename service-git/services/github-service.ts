import CONFIGS from "../config";
import { TGithubUser } from "../types";
import axiosClient from "./axios-client";

class GithubService {
  token: string;
  user: TGithubUser;
  constructor(token: string) {
    this.token = token;
  }

  async auth() {
    axiosClient.defaults.headers.common["Authorization"] =
      `bearer ${this.token}`;
    const res = await axiosClient.get("/user");
    const { login, id, node_id } = res.data;
    this.user = { login, id, node_id };
  }
  getUser(): TGithubUser {
    return this.user;
  }
  async updateGist(nameFile: string, content: string) {
    await axiosClient.patch(`/gists/${CONFIGS.GIST_ID}`, {
      gist_id: CONFIGS.GIST_ID,
      files: {
        [nameFile]: {
          content: content,
        },
      },
    });
  }
}

export default GithubService;
