#!/usr/bin/env node

import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { createDynamicFiles } from "./module-creator.js";
import { PROJECT_NAME, CREATE, CREATE_MCR } from "./constant.js";
import createProject, {
  createEnvFile,
  installDependencies,
} from "./project-creator.js";

/**
 * Main function to run generators and create files
 */
(async () => {
  let moduleName = "";
  let projectName = "";
  let commandType = "";
  let fields = ["name"];
  let templateName = "JS";
  let args = process.argv;
  let destinationPath = process.cwd();
  let basePath = destinationPath.split("\\").pop() || "";
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let templatePath = join(__dirname, "../templates/express-js");

  args.forEach((arg) => {
    if (["template=ts", "template=typescript"].includes(arg.toLowerCase())) {
      templateName = "TS";
      templatePath = join(__dirname, "../templates/express-ts");
    } else if (arg.toUpperCase() === CREATE) {
      commandType = CREATE;
    } else if (arg.toLowerCase().startsWith("mcr=")) {
      const mcr = arg.split("=")[1].split(":");
      moduleName = mcr[0];

      if (mcr.length > 1) fields = mcr[1].split(",").map((r) => r.trim());
    }
  });

  if (moduleName && !commandType) commandType = CREATE_MCR;

  if (commandType === CREATE) {
    const { userProjectName } = await inquirer.prompt([
      {
        default: "",
        type: "input",
        name: "userProjectName",
        message: "What is your project name? (leave empty for default)",
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

    if (userProjectName) {
      projectName = userProjectName;
      destinationPath = join(destinationPath, projectName);
    } else {
      projectName = PROJECT_NAME;
      destinationPath = join(destinationPath, "structure");
    }
  } else if (basePath !== PROJECT_NAME && !projectName) {
    projectName = basePath;
    destinationPath = join(destinationPath, projectName);
  } else if (basePath === PROJECT_NAME && !projectName) {
    projectName = PROJECT_NAME;
    destinationPath = join(destinationPath, "structure");
  }

  /**
   * * Print Log if the project name is same as the default project name and if the project name is not provided
   */
  if (projectName === PROJECT_NAME)
    console.log({
      args,
      fields,
      moduleName,
      projectName,
      templateName,
      templatePath,
      destinationPath,
    });

  try {
    if (commandType === CREATE) {
      createProject(templatePath, destinationPath);

      if (moduleName) await createDynamicFiles(moduleName, fields, projectName);

      await createEnvFile(destinationPath, projectName);
      installDependencies(projectName);
    } else if (commandType === CREATE_MCR) {
      await createDynamicFiles(moduleName, fields, projectName);
    } else {
      console.log("Invalid command. Please use 'create' or 'mcr'!");
    }
  } catch (error) {
    console.error("Error in setup.js:", error.message);
  }
})();
