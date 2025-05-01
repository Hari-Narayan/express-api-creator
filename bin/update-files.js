import { join } from "path";
import { execSync } from "child_process";
import { color } from "console-log-colors";
import { default as inquirer } from "inquirer";
import { existsSync, readFileSync, writeFileSync } from "fs";

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

    // Write back to package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));

    console.log(color.green("✔️  package.json updated successfully."));
    console.log(color.yellow("✔️  Installing dependencies..."));

    execSync("npm install", {
      cwd: projectName,
      stdio: "inherit",
    });

    console.log(color.green("\n✔️  Dependencies installed successfully."));

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
    console.error("❌ Error installing dependencies:", error.message);
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

    updateEnvFile(envPath, envExamplePath, databaseName);
  } else {
    updateEnvFile(envPath, envExamplePath, databaseName);
  }
}

const updateEnvFile = (envPath, envExamplePath, databaseName) => {
  let currentEnvContent = readFileSync(envExamplePath, "utf-8");
  currentEnvContent = currentEnvContent.replace("express-app", databaseName);

  writeFileSync(envPath, currentEnvContent, { encoding: "utf8" });
  console.log(color.green("✔️  ENV file updated!"));
};
