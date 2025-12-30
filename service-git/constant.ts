const SYMBOL = {
  VERSION_1: ["█", "░"],
  VERSION_2: ["⣿", "⣀"],
  VERSION_3: ["⬛", "⬜"],
  get_symbols(version) {
    return this[`VERSION_${version}`];
  },
};
const DAY_TIME_EMOJI = ["🌞", "🌆", "🌃", "🌙"];
const DAY_TIME_NAMES = ["Morning", "Daytime", "Evening", "Night"];

export { SYMBOL, DAY_TIME_EMOJI, DAY_TIME_NAMES };
