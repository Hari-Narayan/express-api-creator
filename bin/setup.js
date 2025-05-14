#!/usr/bin/env node

import { join } from "path";
import { existsSync } from "fs";
import { color } from "console-log-colors";

import cloneRepo from "./clone-project.js";
import { createEnvFile, installDependencies } from "./update-files.js";
import { createDynamicFiles, createDynamicFilesTS } from "./module-creator.js";
import {
  confirmBeforeProceed,
  createModuleQuestions,
  createProjectQuestions,
} from "./questions.js";
import {
  MCR,
  CREATE,
  TEMPLATES,
  TYPESCRIPT,
  JAVASCRIPT,
  PROJECT_NAME,
} from "./constant.js";

/**
 * Main function to run generators and create files
 */
(async () => {
  try {
    let commandType = "";
    let destinationPath = process.cwd();

    process.argv.slice(2).forEach((arg) => {
      if (arg.toUpperCase() === CREATE) commandType = CREATE;
      else if (arg.toUpperCase() === MCR) commandType = MCR;
    });

    if (destinationPath.includes(PROJECT_NAME))
      destinationPath = join(destinationPath, "my-app");

    if (commandType === CREATE) {
      const answers = await createProjectQuestions();
      const { proceed } = await confirmBeforeProceed();

      if (!proceed) return;

      const { projectName, language } = answers;
      const { repoUrl } = TEMPLATES[language];

      if (existsSync(destinationPath)) {
        console.error(
          color.red(
            `❌ Directory ${projectName} already exists. Please choose a different name.`
          )
        );

        return;
      }

      await cloneRepo(repoUrl, destinationPath);
      await createEnvFile(destinationPath, projectName);
      installDependencies(destinationPath, projectName);
    } else if (commandType === MCR) {
      const { fields, modelName, language } = await createModuleQuestions();
      let showFields = [];

      fields.forEach((field) => {
        showFields = [
          ...showFields,
          {
            "Field Name": field,
            "Data Type": "String",
          },
        ];
      });

      console.log(`Model Name: ${color.bold.blue(modelName)}\nFields:`);
      console.table(showFields);

      const { proceed } = await confirmBeforeProceed();

      if (!proceed) return;

      switch (language) {
        case JAVASCRIPT:
          await createDynamicFiles(fields, modelName, destinationPath);
          break;
        case TYPESCRIPT:
          await createDynamicFilesTS(fields, modelName, destinationPath);
          break;
        default:
          break;
      }
    } else {
      console.error(
        color.red("❌ Invalid command. Please use 'create' or 'mcr'!")
      );
    }
  } catch (error) {
    console.error(color.red("❌ Error in setup.js: "), error);
  }
})();
