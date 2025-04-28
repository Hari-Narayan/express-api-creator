#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";

import { PROJECT_NAME } from "./constant.js";
import { capitalizeFirstChar } from "./helpers.js";

export async function createDynamicFiles(requestedCrud, fields, projectName) {
  let schema = "";
  let structure = "";
  let destinationPath = process.cwd();
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let requestedCrudTitleCase = capitalizeFirstChar(requestedCrud);

  if (projectName === PROJECT_NAME) structure = "/structure";

  if (requestedCrud) {
    let dynamicRoutePath = join(__dirname, "../templates/dynamic/js/route.txt");
    let dynamicControllerPath = join(
      __dirname,
      "../templates/dynamic/js/controller.txt"
    );
    let dynamicModelPath = join(__dirname, "../templates/dynamic/js/model.txt");

    // Fetching route data & update
    let sampleRoute = readFileSync(dynamicRoutePath, "utf-8");
    sampleRoute = sampleRoute.replaceAll("_name_", requestedCrud);
    let routePath = join(destinationPath, `${structure}/src/routes`);

    if (!existsSync(routePath)) {
      console.log(
        "No proper directory structure found.\nRun: `npx express-api-creator create` to create the directory structure."
      );
      return;
    }

    routePath = join(routePath, `${requestedCrud}Route.js`);

    writeFileSync(routePath, sampleRoute, { encoding: "utf8" });
    console.log("Route file created!");

    // Fetching Controller data & update
    let sampleController = readFileSync(dynamicControllerPath, "utf-8");
    sampleController = sampleController
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase);
    let controllerPath = join(
      destinationPath,
      `${structure}/src/controllers/${requestedCrud}Controller.js`
    );

    writeFileSync(controllerPath, sampleController, { encoding: "utf8" });
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

    let sampleModel = readFileSync(dynamicModelPath, "utf-8");

    sampleModel = sampleModel
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase)
      .replaceAll("_schema_", schema);

    const modelPath = join(
      destinationPath,
      `${structure}/src/models/${requestedCrud}.js`
    );

    writeFileSync(modelPath, sampleModel, { encoding: "utf8" });
    console.log("Model file created!");

    let rootRoutePath = join(
      destinationPath,
      `${structure}/src/routes/index.js`
    ); // Replace with actual file

    try {
      let data = readFileSync(rootRoutePath, "utf-8");

      const insertBefore = `export default rootRouter;`;

      const importFile = `import ${requestedCrud}Route from "./${requestedCrud}Route.js";`;
      const fileRequire = `rootRouter.use("/${requestedCrud}", ${requestedCrud}Route);`;

      // Insert Router require
      if (!data.includes(fileRequire))
        data = data.replace(
          insertBefore,
          `\n${importFile}\n${fileRequire}\n\n${insertBefore}`
        );

      writeFileSync(rootRoutePath, data, "utf-8");
      console.log("File updated successfully!");
    } catch (err) {
      console.error("Error processing file:", err);
    }
  }
}
