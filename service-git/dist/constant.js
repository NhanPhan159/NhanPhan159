"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAY_TIME_NAMES = exports.DAY_TIME_EMOJI = exports.SYMBOL = void 0;
const SYMBOL = {
    VERSION_1: ["█", "░"],
    VERSION_2: ["⣿", "⣀"],
    VERSION_3: ["⬛", "⬜"],
    get_symbols(version) {
        return this[`VERSION_${version}`];
    },
};
exports.SYMBOL = SYMBOL;
const DAY_TIME_EMOJI = ["🌞", "🌆", "🌃", "🌙"];
exports.DAY_TIME_EMOJI = DAY_TIME_EMOJI;
const DAY_TIME_NAMES = ["Morning", "Daytime", "Evening", "Night"];
exports.DAY_TIME_NAMES = DAY_TIME_NAMES;
//# sourceMappingURL=constant.js.map