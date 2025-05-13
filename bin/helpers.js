/**
 * ### Capitalize First Character
 * @param {*} str
 * @returns - String with all characters in lowercase except the first character
 * @description - Function to capitalize the first character of a string
 */
export function toCapitalizeFirstChar(str = "") {
  if (!str) return str;

  const capitalized = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return capitalized;
}

/**
 * ### Convert to Camel Case
 * @param {*} str - String to be converted to camel case
 * @description - Function to convert a string to camel case
 * @returns
 */
export function toCamelCase(str = "") {
  if (!str) return str;

  // Convert the string to lowercase and split it into words
  const words = str.toLowerCase().split(" ");

  // Take the first word
  const firstWord = words[0];

  // Process the rest of the words: capitalize the first letter
  const restOfWords = words.slice(1).map((word) => {
    if (word.length === 0) return ""; // Handle potential multiple spaces

    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the first word with the rest of the words
  return firstWord + restOfWords.join("");
}
