# Express API Creator

[![NPM version](https://img.shields.io/npm/v/express-api-creator.svg)](https://www.npmjs.com/package/express-api-creator)
[![NPM downloads](https://img.shields.io/npm/dm/express-api-creator.svg)](https://www.npmjs.com/package/express-api-creator)
[![License](https://img.shields.io/npm/l/express-api-creator.svg)](https://www.npmjs.com/package/express-api-creator)

**Express API Creator** is a powerful and flexible Node.js CLI and library designed to rapidly bootstrap and manage Express.js RESTful APIs. It simplifies the process of creating well-structured, feature-rich API backends with minimal configuration, allowing developers to focus on business logic rather than boilerplate code. Supports both JavaScript and TypeScript.

## Features

- **Create Project:**

  - **CLI:** Quickly generate a new Express.js project boilerplate.
    - `npx express-api-creator create`
  - **Languages support**
    - JavaScript
    - TypeScript

- **Create MCR (Model/Controller/Route):**

  - **CLI:** Generate Model, Controller and Route files for a new project with a single command.
    - `npx express-api-creator mcr`
    - **Note:** Be sure you are in project folder.

- **Default Routes:**

  - **Authentication:**

    - `POST /auth/login`
    - `POST /auth/register`
    - `POST /auth/reset-password`
    - `POST /auth/forgot-password`

  - **User Management:**
    - `GET /user/list`
    - `GET /user/my-profile`
    - `POST /user/upload-image`
    - `PUT /user/update-password`

- **Automatic Route Generation (Library):** Define your API endpoints and their logic in a simple configuration file or directly in your code, and `express-api-creator` can handle the route setup when used as a library.

- **Middleware Integration:** Easily integrate custom or third-party Express middleware. This includes functionalities like authentication (e.g., protecting routes with auth middleware), logging, validation, and more, applicable globally or on a per-route basis.

- **Controller Support:** Structures your API logic into controllers for better organization and maintainability. Generated controllers often include stubs for common CRUD operations and other resource-specific actions, such as:

  - `create()`: Add a new resource.
  - `update()`: Modify an existing resource.
  - `list()`: Retrieve a collection of resources.
  - `details()`: Get a single resource by its identifier.
  - `softDelete()`: Remove a resource (can be a soft delete).

- **Response:** Well structured response for succuss & error.

- **File Upload:** you can upload single image with `express-file-upload`.

- **Service Layer Abstraction:** Encourages the use of a service layer to separate business logic from request handling.

- **Error Handling:** Includes a default error handling mechanism that can be customized.

- **Asynchronous Support:** Built to work seamlessly with asynchronous operations and Promises.

- **Highly Extensible:** Designed to be flexible and allow developers to extend its core functionalities.

- **Rapid Prototyping:** Get your API up and running in minutes, ideal for quick prototyping and MVPs.

- **Structured Project Layout:** Promotes a clean and organized project structure.

## How to use

- `npx express-api-creator create`
- `cd <project-name>`
- `npx express-api-creator mcr`

## How to run

- `npm run dev`
