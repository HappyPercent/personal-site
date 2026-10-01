export const cx = (...names: (string | false | null | undefined)[]): string =>
  names.filter(Boolean).join(" ");

export const delay = ["", "d1", "d2", "d3", "d4"];
