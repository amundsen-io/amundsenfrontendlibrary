export const toTitleCase = (str: string): string => {
  return str.split(new RegExp('[\\s+_]')).map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(" ");
}
