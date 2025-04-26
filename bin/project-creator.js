#!/usr/bin/env node

import moment from "moment";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { default as inquirer } from "inquirer";
import {
  mkdirSync,
  lstatSync,
  existsSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  writeFileSync,
  statSync,
} from "fs";

import { PROJECT_NAME } from "./constant.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * ### Install Dependencies
 * @description Function to check if a folder exists and create it if it doesn't
 * @param {string} folderPath - The path of the folder to check/create
 */
export function installDependencies(projectName) {
  const packageJsonPath = join(process.cwd(), "package.json");
  const currPackageJsonPath = join(__dirname, "../package.json");

  if (!existsSync(packageJsonPath)) {
    console.log(
      "package.json not found. Initializing a new Node.js project..."
    );
    execSync("npm init -y", { stdio: "inherit" });
  }

  // Read package.json
  let packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  let currPackageJson = JSON.parse(readFileSync(currPackageJsonPath, "utf-8"));

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

  if ([PROJECT_NAME, "structure"].includes(projectName))
    packageJson.scripts.dev = "node --watch structure/server";

  // Write updated package.json
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Install missing dependencies
  console.log(`Installing dependencies: ${requiredDependencies.join(", ")}`);
  execSync(`npm install ${requiredDependencies.join(" ")}`, {
    stdio: "inherit",
  });

  console.log("✅ Dependencies installed & scripts added to package.json");
}

/**
 * ### Copy Structure
 * @description Function to copy the structure of a folder to another location
 * @param {*} source
 * @param {*} destination
 */
const copyStructure = async (source, destination, projectName = "") => {
  try {
    if (!existsSync(destination)) mkdirSync(destination, { recursive: true });

    const items = readdirSync(source);

    for (const item of items) {
      const sourcePath = join(source, item);
      const destPath = join(destination, item);
      const isDirectory = lstatSync(sourcePath).isDirectory();

      if (isDirectory) {
        await this.copyStructure(sourcePath, destPath); // Recursive for subdirectories
      } else {
        if (existsSync(destPath)) {
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
          let data = readFileSync(sourcePath, "utf-8");
          data = `## Copied on ${moment().format(
            "DD MMM, YYYY HH:mm:ss A"
          )}\n\n# ${projectName}\n\n${data}`;

          writeFileSync(destPath, data, "utf-8");
          console.log(`Copied and updated "${item}"`);
        } else {
          copyFileSync(sourcePath, destPath);
          console.log(`Copied "${item}"`);
        }
      }
    }
  } catch (error) {
    console.error("Error copying structure:", error);
  }
};

const copyDir = (src, dest) => {
  mkdirSync(dest, { recursive: true });
  for (const item of readdirSync(src)) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
};

/**
 * ### Create Env File
 * @description Function to create an .env file in the specified destination
 * @param {*} destination
 * @param {*} projectName
 * @returns
 */
export async function createEnvFile(destination, projectName) {
  let envPath = join(destination, ".env");

  if (existsSync(envPath)) {
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
}

const updateEnvFile = (envPath, projectName) => {
  const currentEnvPath = join(__dirname, "../.env.example");
  let currentEnvContent = readFileSync(currentEnvPath, "utf-8");
  currentEnvContent = currentEnvContent.replace("express-app", projectName);

  writeFileSync(envPath, currentEnvContent, { encoding: "utf8" });
  console.log("ENV file updated!");
};

const createProject = (templatePath, destinationPath) => {
  console.log("Copying structure...");
  copyDir(templatePath, destinationPath);
  console.log(`Project created at ${destinationPath}`);
};

export default createProject;
