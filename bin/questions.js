import inquirer from "inquirer";

import { toCamelCase } from "./helpers.js";
import { DEFAULT_PROJECT_NAME, JAVASCRIPT, TYPESCRIPT } from "./constant.js";

export const createProjectQuestions = async () => {
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "Project name?",
      default: DEFAULT_PROJECT_NAME,
      validate: (value) => {
        if (!value.trim()) return true;

        if (value.length < 3)
          return "Project name must be at least 3 characters long.";

        if (!/^[a-zA-Z0-9-_]+$/.test(value))
          return "Project name can only contain letters, numbers, dashes, and underscores.";

        return true;
      },
    },
    {
      type: "list",
      name: "language",
      default: TYPESCRIPT,
      message: "Choose language?",
      choices: [JAVASCRIPT, TYPESCRIPT],
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    return answers;
  } catch (error) {
    console.error("Error asking questions:", error);
  }
};

export const createModuleQuestions = async () => {
  const questions = [
    {
      type: "list",
      name: "language",
      default: TYPESCRIPT,
      message: "Choose language?",
      choices: [JAVASCRIPT, TYPESCRIPT],
    },
    {
      type: "input",
      name: "modelName",
      message: "Model name?",
      filter(value) {
        return toCamelCase(value);
      },
      validate: function (value) {
        if (!value.trim()) return "Please enter model name.";

        if (value.length < 3)
          return "Model name must be at least 3 characters long.";

        return true;
      },
    },
    {
      type: "input",
      name: "fields",
      message: "Enter fields (e.g., name description price):",
      filter(value) {
        return value
          .split(" ")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      },
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    return answers;
  } catch (error) {
    console.error("Error asking questions:", error);
  }
};

export const confirmBeforeProceed = async () => {
  try {
    return await inquirer.prompt([
      {
        default: true,
        type: "confirm",
        name: "proceed",
        message: "Do you want to proceed?",
      },
    ]);
  } catch (error) {
    console.error("Error asking questions:", error);
  }
};
