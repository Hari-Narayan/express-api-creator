#!/usr/bin/env node

import { join } from "path";
import inquirer from "inquirer";
import { existsSync } from "fs";
import { color } from "console-log-colors";

import cloneRepo from "./clone-project.js";
import { CREATE, CREATE_MCR } from "./constant.js";
import { createEnvFile, installDependencies } from "./update-files.js";
import { createDynamicFiles, createDynamicFilesTS } from "./module-creator.js";

/**
 * Main function to run generators and create files
 */
(async () => {
  try {
    let moduleName = "";
    let template = "JS";
    let commandType = "";
    let fields = ["name"];
    let args = process.argv;
    let projectName = "my-app";
    let destinationPath = process.cwd();
    let repoUrl = "https://github.com/Hari-Narayan/express-JS.git";

    args.forEach((arg) => {
      if (arg.toLowerCase() === "--ts") {
        template = "TS";
        repoUrl = "https://github.com/Hari-Narayan/express-TS.git";
      } else if (arg.toUpperCase() === CREATE) {
        commandType = CREATE;
      } else if (arg.toLowerCase().startsWith("mcr=")) {
        const mcr = arg.split("=")[1].split(":");
        moduleName = mcr[0];

        if (mcr.length > 1) fields = mcr[1].split(",").map((r) => r.trim());
      }
    });

    if (moduleName && !commandType && commandType !== CREATE) {
      commandType = CREATE_MCR;
      destinationPath = join(destinationPath, projectName);
    }

    if (commandType === CREATE) {
      const { userProjectName } = await inquirer.prompt([
        {
          type: "input",
          default: "my-app",
          name: "userProjectName",
          message: "What is your project name?",
          validate: (input) => {
            if (input.trim() === "") return true;

            if (input.length < 3)
              return "Project name must be at least 3 characters long.";

            if (!/^[a-zA-Z0-9-_]+$/.test(input))
              return "Project name can only contain letters, numbers, dashes, and underscores.";

            return true;
          },
        },
      ]);

      projectName = userProjectName;
      destinationPath = join(destinationPath, projectName);

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
    } else if (commandType === CREATE_MCR && template === "JS") {
      await createDynamicFiles(fields, moduleName, destinationPath);
    } else if (commandType === CREATE_MCR && template === "TS") {
      await createDynamicFilesTS(fields, moduleName, destinationPath);
    } else {
      console.error(
        color.red("❌ Invalid command. Please use 'create' or 'mcr'!")
      );
    }
  } catch (error) {
    console.error(color.red("❌ Error in setup.js: "), error);
  }
})();
