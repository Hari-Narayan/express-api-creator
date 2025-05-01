import { join } from "path";
import { execSync } from "child_process";
import { color } from "console-log-colors";
import {
  rmSync,
  existsSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
} from "fs";

/**
 * ### Install Dependencies
 * @description Function to check if a folder exists and create it if it doesn't
 * @param {string} destinationPath - The path to the destination folder
 * @param {string} projectName - The name of the project
 */
export function installDependencies(destinationPath, projectName) {
  try {
    // Path to package.json
    const packageJsonPath = join(destinationPath, "package.json");

    if (!existsSync(packageJsonPath)) {
      console.error("❌ package.json not found!");
      return;
    }

    const gitIgnorePath = join(destinationPath, ".gitignore");
    if (existsSync(gitIgnorePath)) unlinkSync(gitIgnorePath);

    const gitFolderPath = join(destinationPath, ".git");
    if (existsSync(gitFolderPath))
      rmSync(gitFolderPath, { recursive: true, force: true });

    // Read package.json
    let packageData = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    // Modify fields in package.json
    packageData = {
      ...packageData,
      author: "",
      version: "1.0.0",
      name: projectName,
      description: "A simple express app",
    };

    delete packageData.bugs;
    delete packageData.homepage;
    delete packageData.repository;

    // Write back to package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));

    console.log(color.green("✔️  package.json have been updated."));
    console.log(color.yellow("✔️  Installing dependencies..."));

    execSync("npm install", {
      cwd: projectName,
      stdio: "inherit",
    });

    console.log(color.green("\n✔️  Dependencies have been installed."));

    let data = readFileSync(join(destinationPath, "README.md"), "utf-8");
    data = data.replace(/express-JS/g, projectName);

    writeFileSync(join(destinationPath, "README.md"), data, "utf-8");

    console.log(color.green("✔️  README.md file updated."));
    console.log(color.blue(`\nℹ️  Run \`cd ${projectName}\``));
    console.log(
      color.blue(
        "ℹ️  Run `npm run dev` to start the server in development mode."
      )
    );
  } catch (error) {
    console.error("❌ Error installing dependencies:", error);
  }
}

/**
 * ### Create Env File
 * @description Function to create an .env file in the specified destination
 * @param {*} destination
 * @param {*} projectName
 * @returns
 */
export async function createEnvFile(destination, databaseName) {
  const envPath = join(destination, ".env");
  const envExamplePath = join(destination, ".env.example");

  if (!existsSync(envExamplePath)) {
    console.error("❌ Env example file not found!");
    return;
  }

  updateEnvFile(envPath, envExamplePath, databaseName);
}

const updateEnvFile = (envPath, envExamplePath, databaseName) => {
  let currentEnvContent = readFileSync(envExamplePath, "utf-8");
  currentEnvContent = currentEnvContent.replace("express-app", databaseName);

  writeFileSync(envPath, currentEnvContent, { encoding: "utf8" });
  console.log(color.green("✔️  ENV file created!"));
};
