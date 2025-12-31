import CONFIGS from "./config";
import { SYMBOL } from "./constant";

function make_graph(percent: number) {
  const [done_block, empty_block] = SYMBOL.get_symbols(CONFIGS.SYMBOL_VERSION);
  const percent_quart = Math.round(percent / 12);
  return (
    done_block.repeat(percent_quart) + empty_block.repeat(8 - percent_quart)
  );
}

function make_list({
  names = null,
  texts = null,
  percents = null,
  top_num = 5,
  sort = true,
} = {}) {
  const combined_data = names.map((name: string, i: number) => [
    name,
    texts[i],
    percents[i],
  ]);
  let top_data = combined_data.slice(0, top_num);
  if (sort) {
    top_data = top_data.sort((a: number, b: number) => b[2] - a[2]);
  }
  const data_list = top_data.map(([n, t, p]) => {
    const name_part = n.substring(0, 25).padEnd(12, " ");
    const text_part = t.padStart(13, " ");
    const graph_part = make_graph(p);
    const percent_part = p.toFixed(2).padStart(5, "0");

    return `${name_part}${text_part}   ${graph_part}`;
  });

  return data_list.join("\n");
}
export { make_list, make_graph };
