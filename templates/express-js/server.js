import fs from "fs";
import { configDotenv } from "dotenv";
import { expand } from "dotenv-expand";
import express, { json } from "express";
import { color } from "console-log-colors";

expand(configDotenv());

import rootRouter from "./src/routes/index.js";
import CommonHelper from "./src/helpers/commonHelper.js";
import mongooseConnect from "./src/config/mongooseConnect.js";

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || "";
const urlPrefix = process.env.URL_PREFIX || "/api";

const startServer = async () => {
  const app = express();
  app.use(json());

  const packageJson = JSON.parse(fs.readFileSync("package.json"));
  const expressVersion = packageJson.dependencies.express.toString();

  try {
    // Wait for MongoDB connection
    await mongooseConnect();

    app.get("/", (req, res) => {
      res.send(`Welcome to the ${packageJson.name} API!`);
    });

    app.use(urlPrefix, rootRouter);

    app.listen(port, () => {
      console.info(`\nServer running on ${color.blue(`${baseUrl}/`)}`);
      console.info(
        `API Base URL ${color.blue(
          `${process.env.API_BASE_URL || `${baseUrl}${urlPrefix}`}/`
        )}`
      );

      if (expressVersion.includes("4")) {
        // Generate JSON from rootRouter.stack
        const result = CommonHelper.serializeRouterStack(
          rootRouter.stack,
          `${baseUrl}${urlPrefix}`
        );

        console.table(CommonHelper.extractRoutes(result.layers));
      } else {
        console.info(
          `${color.red(
            `You are using Express version ${expressVersion}. So, serializeRouterStack and extractRoutePaths will not support.`
          )}\n${color.white(
            `NOTE: Please use Express version 4.x.x for this feature.`
          )}`
        );
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
