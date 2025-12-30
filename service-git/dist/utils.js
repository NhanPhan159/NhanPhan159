"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_list = make_list;
exports.make_graph = make_graph;
const config_1 = __importDefault(require("./config"));
const constant_1 = require("./constant");
function make_graph(percent) {
    const [done_block, empty_block] = constant_1.SYMBOL.get_symbols(config_1.default.SYMBOL_VERSION);
    const percent_quart = Math.round(percent / 4);
    return (done_block.repeat(percent_quart) + empty_block.repeat(25 - percent_quart));
}
function make_list({ names = null, texts = null, percents = null, top_num = 5, sort = true, } = {}) {
    const combined_data = names.map((name, i) => [
        name,
        texts[i],
        percents[i],
    ]);
    let top_data = combined_data.slice(0, top_num);
    if (sort) {
        top_data = top_data.sort((a, b) => b[2] - a[2]);
    }
    const data_list = top_data.map(([n, t, p]) => {
        const name_part = n.substring(0, 25).padEnd(25, " ");
        const text_part = t.padEnd(20, " ");
        const graph_part = make_graph(p);
        const percent_part = p.toFixed(2).padStart(5, "0");
        return `${name_part}${text_part}${graph_part}   ${percent_part} % `;
    });
    return data_list.join("\n");
}
//# sourceMappingURL=utils.js.map