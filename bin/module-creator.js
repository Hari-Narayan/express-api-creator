#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// const { execSync } = require("child_process");
// const { default: inquirer } = require("inquirer");

const { PROJECT_NAME } = require("./constant");
const { capitalizeFirstChar } = require("./helpers");

exports.createDynamicFiles = async (requestedCrud, fields, projectName) => {
  let schema = "";
  let structure = "";
  let destinationPath = process.cwd();
  let requestedCrudTitleCase = capitalizeFirstChar(requestedCrud);

  if (projectName === PROJECT_NAME) structure = "/structure";

  if (requestedCrud) {
    let dynamicRoutePath = path.join(
      __dirname,
      "../templates/dynamic/js/route.txt"
    );
    let dynamicControllerPath = path.join(
      __dirname,
      "../templates/dynamic/js/controller.txt"
    );
    let dynamicModelPath = path.join(
      __dirname,
      "../templates/dynamic/js/model.txt"
    );

    // Fetching route data & update
    let sampleRoute = fs.readFileSync(dynamicRoutePath, "utf-8");
    sampleRoute = sampleRoute.replaceAll("name_", requestedCrud);
    let routePath = path.join(destinationPath, `${structure}/src/routes`);

    if (!fs.existsSync(routePath)) {
      console.log(
        "No proper directory structure found.\nRun: `npx express-api-creator create` to create the directory structure."
      );
      return;
    }

    routePath = path.join(routePath, `${requestedCrud}Route.js`);

    fs.writeFileSync(routePath, sampleRoute, { encoding: "utf8" });
    console.log("Route file created!");

    // Fetching Controller data & update
    let sampleController = fs.readFileSync(dynamicControllerPath, "utf-8");
    sampleController = sampleController
      .replaceAll("name_", requestedCrud)
      .replaceAll("Name_", requestedCrudTitleCase);
    let controllerPath = path.join(
      destinationPath,
      `${structure}/src/controllers/${requestedCrud}Controller.js`
    );

    fs.writeFileSync(controllerPath, sampleController, { encoding: "utf8" });
    console.log("Controller file created!");

    // Fetching Model data & update
    const schemaString = `\n\t_field: { type: String, required: true },`;

    if (requestedCrud && fields.length === 0) {
      schema = `{
        name: { type: String, required: true },
      }`;
    } else {
      schema = "{";

      fields.forEach((field) => {
        schema += schemaString.replace("_field", field);
      });

      schema += "\n}";
    }

    let sampleModel = fs.readFileSync(dynamicModelPath, "utf-8");
    sampleModel = sampleModel
      .replaceAll("name_", requestedCrud)
      .replaceAll("Name_", requestedCrudTitleCase)
      .replaceAll("_schema", schema);

    let modelPath = path.join(
      destinationPath,
      `${structure}/src/models/${requestedCrud}.js`
    );

    fs.writeFileSync(modelPath, sampleModel, { encoding: "utf8" });
    console.log("Model file created!");

    let rootRoutePath = path.join(
      destinationPath,
      `${structure}/src/routes/index.js`
    ); // Replace with actual file

    try {
      let data = fs.readFileSync(rootRoutePath, "utf-8");

      const requireInsert = `const authRouter = require("./authRoute");`;
      const fileRequire = `const ${requestedCrud}Router = require("./${requestedCrud}Route");`;

      // Insert Router require
      if (!data.includes(fileRequire))
        data = data.replace(requireInsert, `${requireInsert}\n${fileRequire}`);

      const useInsert = `rootRouter.use("/auth", authRouter);`;
      const fileUse = `rootRouter.use("/${requestedCrud}", ${requestedCrud}Router);`;

      // Insert Router.use
      if (!data.includes(fileUse))
        data = data.replace(useInsert, `${useInsert}\n${fileUse}`);

      fs.writeFileSync(rootRoutePath, data, "utf-8");
      console.log("File updated successfully!");
    } catch (err) {
      console.error("Error processing file:", err);
    }
  }
};
