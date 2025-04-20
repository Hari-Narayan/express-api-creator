#!/usr/bin/env node

const path = require("path");
// const { execSync } = require("child_process");

const { createDynamicFiles } = require("./module-creator");
const { PROJECT_NAME, CREATE, CREATE_MCR } = require("./constant");
const {
  copyStructure,
  createEnvFile,
  installDependencies,
} = require("./project-creator");

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
  let basePath = path.basename(destinationPath);
  let templatePath = path.join(__dirname, "../templates/express-js");

  args.forEach((arg) => {
    if (["template=ts", "template=typescript"].includes(arg.toLowerCase())) {
      templateName = "TS";
      templatePath = path.join(__dirname, "../templates/express-ts");
    } else if (arg.toLowerCase().startsWith("name=")) {
      projectName = arg.split("=")[1];
      destinationPath = path.join(destinationPath, projectName);
    } else if (arg.toUpperCase() === CREATE) {
      commandType = CREATE;
    } else if (arg.toLowerCase().startsWith("mcr=")) {
      const mcr = arg.split("=")[1].split(":");
      moduleName = mcr[0];

      if (mcr.length > 1) fields = mcr[1].split(",").map((r) => r.trim());
    }
  });

  if (moduleName && !commandType) commandType = CREATE_MCR;

  if (basePath === PROJECT_NAME && !projectName) {
    projectName = PROJECT_NAME;
    destinationPath = path.join(destinationPath, "structure");
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
      await copyStructure(templatePath, destinationPath, projectName);

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
