"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(code, message, details) {
        super(message);
        this._code = code;
        this._details = details;
    }
    get code() {
        return this._code;
    }
    get details() {
        return this._details;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errors.js.map