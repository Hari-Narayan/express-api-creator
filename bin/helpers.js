/**
 * ### Capitalize First Character
 * @param {*} str
 * @returns - String with all characters in lowercase except the first character
 * @description - Function to capitalize the first character of a string
 */
export function capitalizeFirstChar(str = "") {
  if (!str) return str;

  const capitalized = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return capitalized;
}
