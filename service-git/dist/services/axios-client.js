"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../types");
const enums_1 = require("../enums");
const axiosClient = axios_1.default.create({
    baseURL: "https://api.github.com",
    withCredentials: true,
});
axiosClient.interceptors.response.use((response) => response, (e) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const error = new types_1.AppError(((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 404
        ? enums_1.ErrorCode.RESOURCE_NOT_FOUND
        : ((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 500
            ? enums_1.ErrorCode.INTERNAL_ERROR
            : enums_1.ErrorCode.UNKNOWN, ((_d = (_c = e.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || e.message, Object.assign(Object.assign({}, (((_f = (_e = e.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.details) || e.details)), { data: (_h = (_g = e.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.data }));
    throw error;
});
exports.default = axiosClient;
//# sourceMappingURL=axios-client.js.map