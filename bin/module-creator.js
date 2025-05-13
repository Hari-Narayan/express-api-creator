import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { color } from "console-log-colors";
import { readFileSync, existsSync, writeFileSync } from "fs";

import { toCapitalizeFirstChar } from "./helpers.js";

export const createDynamicFiles = async (
  fields,
  requestedCrud,
  destinationPath
) => {
  let schema = "";
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let requestedCrudTitleCase = toCapitalizeFirstChar(requestedCrud);

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

    try {
      let rootRoutePath = join(destinationPath, `/src/routes/index.js`); // Replace with actual file
      let data = readFileSync(rootRoutePath, "utf-8");

      const defineRoutes = `// Define the routes`;
      const importRoutes = `// Importing the routers`;

      if (!data.includes(defineRoutes) || !data.includes(importRoutes)) {
        console.error(
          color.red(
            "❌ Error: Root route file does not contains route definitions comments."
          )
        );

        return;
      }

      const importFile = `import ${requestedCrud}Route from "./${requestedCrud}Route.js";`;
      const fileRequire = `rootRouter.use("/${requestedCrud}", auth, ${requestedCrud}Route);`;

      // Insert Router require
      if (!data.includes(fileRequire)) {
        data = data
          .replace(importRoutes, `${importFile}\n\n${importRoutes}`)
          .replace(defineRoutes, `${fileRequire}\n\n${defineRoutes}`);
      }

      writeFileSync(rootRoutePath, data, "utf-8");
      console.log(color.green("✔️  File updated successfully!"));
    } catch (err) {
      console.error(color.red("❌ Error processing file: "), err);
    }

    // Fetching route data & update
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
  }
};

export const createDynamicFilesTS = async (
  fields,
  requestedCrud,
  destinationPath
) => {
  let schema = "";
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let requestedCrudTitleCase = toCapitalizeFirstChar(requestedCrud);

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

    try {
      let rootRoutePath = join(destinationPath, `/src/routes/index.ts`); // Replace with actual file
      let data = readFileSync(rootRoutePath, "utf-8");

      const defineRoutes = `// Define the routes`;
      const importRoutes = `// Importing the routers`;

      if (!data.includes(defineRoutes) || !data.includes(importRoutes)) {
        console.error(
          color.red(
            "❌ Error: Root route file does not contains route definitions comments."
          )
        );

        return;
      }

      const importFile = `import ${requestedCrud}Route from "./${requestedCrud}Route";`;
      const fileRequire = `rootRouter.use("/${requestedCrud}", auth, ${requestedCrud}Route);`;

      // Insert Router require
      if (!data.includes(fileRequire)) {
        data = data
          .replace(importRoutes, `${importFile}\n${importRoutes}`)
          .replace(defineRoutes, `${fileRequire}\n${defineRoutes}`);
      }

      writeFileSync(rootRoutePath, data, "utf-8");
      console.log("✔️  File updated successfully!");
    } catch (err) {
      console.error(color.red("❌ Error processing file: "), err);
    }

    routePath = join(routePath, `${requestedCrud}Route.ts`);

    writeFileSync(routePath, sampleRoute, { encoding: "utf8" });
    console.log("✔️  Route file created!");

    // Fetching Lang data & update
    let sampleLang = readFileSync(dynamicLangPath, "utf-8");
    sampleLang = sampleLang
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase)
      .replaceAll("_NAME_", requestedCrud.toUpperCase());
    let langPath = join(destinationPath, `/src/lang/en/${requestedCrud}.ts`);

    writeFileSync(langPath, sampleLang, { encoding: "utf8" });
    console.log("✔️  Lang file created!");

    // Fetching Controller data & update
    let sampleController = readFileSync(dynamicControllerPath, "utf-8");
    sampleController = sampleController
      .replaceAll("_name_", requestedCrud)
      .replaceAll("_Name_", requestedCrudTitleCase)
      .replaceAll("_NAME_", requestedCrud.toUpperCase());
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
  }
};
