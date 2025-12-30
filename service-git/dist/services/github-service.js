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
const axios_client_1 = __importDefault(require("./axios-client"));
class GithubService {
    constructor(token) {
        this.token = token;
    }
    auth() {
        return __awaiter(this, void 0, void 0, function* () {
            axios_client_1.default.defaults.headers.common["Authorization"] =
                `bearer ${this.token}`;
            const res = yield axios_client_1.default.get("/user");
            const { login, id, node_id } = res.data;
            this.user = { login, id, node_id };
        });
    }
    getUser() {
        return this.user;
    }
}
exports.default = GithubService;
//# sourceMappingURL=github-service.js.map