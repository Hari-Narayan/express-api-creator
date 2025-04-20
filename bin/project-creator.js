#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { default: inquirer } = require("inquirer");
const moment = require("moment");

/**
 * ### Install Dependencies
 * @description Function to check if a folder exists and create it if it doesn't
 * @param {string} folderPath - The path of the folder to check/create
 */
exports.installDependencies = (lastFolder) => {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const currPackageJsonPath = path.join(__dirname, "../package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      "package.json not found. Initializing a new Node.js project..."
    );
    execSync("npm init -y", { stdio: "inherit" });
  }

  // Read package.json
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  let currPackageJson = JSON.parse(
    fs.readFileSync(currPackageJsonPath, "utf-8")
  );

  let currDependencies = currPackageJson.dependencies;
  const exceptDependencies = ["inquirer"];

  exceptDependencies.forEach((pkg) => {
    delete currDependencies[pkg];
  });

  const requiredDependencies = Object.keys(currDependencies);

  // Add scripts to package.json
  packageJson.scripts = {
    ...packageJson.scripts,
    start: "node server",
    dev: "node --watch server",
  };

  if (lastFolder === "express-api-creator")
    packageJson.scripts.dev = "node --watch structure/server";

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Install missing dependencies
  console.log(`Installing dependencies: ${requiredDependencies.join(", ")}`);
  execSync(`npm install ${requiredDependencies.join(" ")}`, {
    stdio: "inherit",
  });

  console.log("✅ Dependencies installed & scripts added to package.json");
};

/**
 * ### Copy Structure
 * @description Function to copy the structure of a folder to another location
 * @param {*} source
 * @param {*} destination
 */
exports.copyStructure = async (source, destination, projectName = "") => {
  try {
    if (!fs.existsSync(destination))
      fs.mkdirSync(destination, { recursive: true });

    const items = fs.readdirSync(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      const isDirectory = fs.lstatSync(sourcePath).isDirectory();

      if (isDirectory) {
        await this.copyStructure(sourcePath, destPath); // Recursive for subdirectories
      } else {
        if (fs.existsSync(destPath)) {
          const { overwrite } = await inquirer.prompt([
            {
              type: "confirm",
              name: "overwrite",
              message: `File "${item}" already exists. Overwrite?`,
              default: false,
            },
          ]);

          if (!overwrite) {
            console.log(`Skipping "${item}"...`);
            continue; // Skip this file if user chooses not to overwrite
          }
        }

        if (sourcePath.includes("README.md") && projectName) {
          let data = fs.readFileSync(sourcePath, "utf-8");
          data = `## Copied on ${moment().format(
            "DD MMM, YYYY HH:mm:ss A"
          )}\n\n# ${projectName}\n\n${data}`;

          fs.writeFileSync(destPath, data, "utf-8");
          console.log(`Copied and updated "${item}"`);
        } else {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied "${item}"`);
        }
      }
    }
  } catch (error) {
    console.error("Error copying structure:", error);
  }
};

/**
 * ### Create Env File
 * @description Function to create an .env file in the specified destination
 * @param {*} destination
 * @param {*} projectName
 * @returns
 */
exports.createEnvFile = async (destination, projectName) => {
  let envPath = path.join(destination, ".env");

  if (fs.existsSync(envPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        default: false,
        type: "confirm",
        name: "overwrite",
        message: `File ".env" already exists. Overwrite?`,
      },
    ]);

    if (!overwrite) return;

    updateEnvFile(envPath, projectName);
  } else {
    updateEnvFile(envPath, projectName);
  }
};

const updateEnvFile = (envPath, projectName) => {
  const currentEnvPath = path.join(__dirname, "../.env.example");
  let currentEnvContent = fs.readFileSync(currentEnvPath, "utf-8");
  currentEnvContent = currentEnvContent.replace("express-app", projectName);

  fs.writeFileSync(envPath, currentEnvContent, { encoding: "utf8" });
  console.log("ENV file updated!");
};
