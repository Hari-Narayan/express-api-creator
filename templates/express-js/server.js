const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const dotenvExpand = require("dotenv-expand");
const { color } = require("console-log-colors");

const app = express();
dotenvExpand.expand(dotenv.config());
const port = process.env.PORT || 3000;
const urlPrefix = process.env.URL_PREFIX || "/api";

require("./src/config/connection");
const rootRouter = require("./src/routes");
const { extractRoutePaths } = require("./src/utils/common");

app.use(urlPrefix, rootRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.info(`\nServer running on ${color.blue(`${process.env.BASE_URL}/`)}`);
  console.info(`API Base URL ${color.blue(`${process.env.API_BASE_URL}/`)}`);

  const filePath = path.join(__dirname, "src/routes/index.js");
  extractRoutePaths(filePath, process.env.API_BASE_URL);
});
