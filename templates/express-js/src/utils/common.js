const fs = require("fs");
const path = require("path");
const { color } = require("console-log-colors");

/**
 * ### Extract Route Paths
 * Extracts route paths from a router file.
 *
 * @param {string} filePath - Absolute or relative path to the router file.
 * @returns {string[]} - Array of route paths (e.g., ['/auth', '/user']).
 */
exports.extractRoutePaths = (filePath, urlPrefix) => {
  try {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, "utf-8");

    const regex = new RegExp(/rootRouter\.use\(\s*["'`]([^"'`]+)["'`]/g);
    const matches = Array.from(content.matchAll(regex));

    console.log("\n========== Route List Start ==========");

    matches.forEach((route) => {
      const exactPath = `${urlPrefix}${route[1]}/`;
      console.info(color.blue(exactPath));
    });

    console.log("=========== Route List End ===========\n");
  } catch (err) {
    console.error(`Error reading or parsing file: ${err.message}`);
    return [];
  }
};

/**
 * ### Random String Generator
 * Generates a random string of specified length.
 *
 * @param {number} length - Length of the random string to generate.
 * @returns {string} - Random string of specified length.
 */
exports.randomString = (length = 40) => {
  let result = "";
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};
