import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { color } from "console-log-colors";
import { readFileSync, existsSync, writeFileSync } from "fs";

import { capitalizeFirstChar } from "./helpers.js";

export const createDynamicFiles = async (
  fields,
  requestedCrud,
  destinationPath
) => {
  let schema = "";
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let requestedCrudTitleCase = capitalizeFirstChar(requestedCrud);

  if (requestedCrud) {
    let dynamicRoutePath = join(__dirname, "../templates/js/route.txt");
    let dynamicModelPath = join(__dirname, "../templates/js/model.txt");
    let dynamicControllerPath = join(
      __dirname,
      "../templates/js/controller.txt"
    );

    // Fetching route data & update
    let routePath = join(destinationPath, `/src/routes`);
    let sampleRoute = readFileSync(dynamicRoutePath, "utf-8");
    sampleRoute = sampleRoute.replaceAll("_name_", requestedCrud);

    if (!existsSync(routePath)) {
      console.error(
        color.red(`❌ No proper directory structure found. ${destinationPath}`)
      );
      console.error(
        color.blue(
          "ℹ️  Run `npx express-api-creator create` to create the directory structure."
        )
      );
      return;
    }

    routePath = join(routePath, `${requestedCrud}Route.js`);

    writeFileSync(routePath, sampleRoute, { encoding: "utf8" });
    console.log(color.green("✔️  Route file created!"));

    // Fetching Controller data & update
    let sampleController = readFileSync(dynamicControllerPath, "utf-8");
    sampleController = sampleController
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase);
    let controllerPath = join(
      destinationPath,
      `/src/controllers/${requestedCrud}Controller.js`
    );

    writeFileSync(controllerPath, sampleController, { encoding: "utf8" });
    console.log(color.green("✔️  Controller file created!"));

    // Fetching Model data & update
    const schemaString = `\n  _field: { type: String, required: true },`;

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

    const modelPath = join(destinationPath, `/src/models/${requestedCrud}.js`);

    writeFileSync(modelPath, sampleModel, { encoding: "utf8" });
    console.log(color.green("✔️  Model file created!"));

    let rootRoutePath = join(destinationPath, `/src/routes/index.js`); // Replace with actual file

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
      console.log(color.green("✔️  File updated successfully!"));
    } catch (err) {
      console.error(color.red("❌ Error processing file: "), err);
    }
  }
};

export const createDynamicFilesTS = async (
  fields,
  requestedCrud,
  destinationPath
) => {
  let schema = "";
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let requestedCrudTitleCase = capitalizeFirstChar(requestedCrud);

  if (requestedCrud) {
    let dynamicLangPath = join(__dirname, "../templates/ts/lang.txt");
    let dynamicModelPath = join(__dirname, "../templates/ts/model.txt");
    let dynamicRoutePath = join(__dirname, "../templates/ts/route.txt");
    let dynamicControllerPath = join(
      __dirname,
      "../templates/ts/controller.txt"
    );

    // Fetching route data & update
    let routePath = join(destinationPath, `/src/routes`);
    let sampleRoute = readFileSync(dynamicRoutePath, "utf-8");
    sampleRoute = sampleRoute.replaceAll("_name_", requestedCrud);

    if (!existsSync(routePath)) {
      console.error(color.red("❌ No proper directory structure found."));
      console.error(
        color.blue(
          "ℹ️  Run `npx express-api-creator create` to create the directory structure."
        )
      );
      return;
    }

    routePath = join(routePath, `${requestedCrud}Route.ts`);

    writeFileSync(routePath, sampleRoute, { encoding: "utf8" });
    console.log("✔️  Route file created!");

    // Fetching Lang data & update
    let sampleLang = readFileSync(dynamicLangPath, "utf-8");
    sampleLang = sampleLang
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase);
    let langPath = join(destinationPath, `/src/langs/${requestedCrud}.ts`);

    writeFileSync(langPath, sampleLang, { encoding: "utf8" });
    console.log("✔️  Lang file created!");

    // Fetching Controller data & update
    let sampleController = readFileSync(dynamicControllerPath, "utf-8");
    sampleController = sampleController
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase);
    let controllerPath = join(
      destinationPath,
      `/src/controllers/${requestedCrud}Controller.ts`
    );

    writeFileSync(controllerPath, sampleController, { encoding: "utf8" });
    console.log("✔️  Controller file created!");

    // Fetching Model data & update
    const schemaString = `\n  _field: { type: String, required: true },`;

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

    const modelPath = join(destinationPath, `/src/models/${requestedCrud}.ts`);

    writeFileSync(modelPath, sampleModel, { encoding: "utf8" });
    console.log("✔️  Model file created!");

    let rootRoutePath = join(destinationPath, `/src/routes/index.ts`); // Replace with actual file

    try {
      let data = readFileSync(rootRoutePath, "utf-8");
      const insertBefore = `export default rootRouter;`;
      const importFile = `import ${requestedCrud}Route from "./${requestedCrud}Route.ts";`;
      const fileRequire = `rootRouter.use("/${requestedCrud}", ${requestedCrud}Route);`;

      // Insert Router require
      if (!data.includes(fileRequire))
        data = data.replace(
          insertBefore,
          `\n${importFile}\n${fileRequire}\n\n${insertBefore}`
        );

      writeFileSync(rootRoutePath, data, "utf-8");
      console.log("✔️  File updated successfully!");
    } catch (err) {
      console.error(color.red("❌ Error processing file: "), err);
    }
  }
};
