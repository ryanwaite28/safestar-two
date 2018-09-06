export function capitalize(string) {
  let str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}
