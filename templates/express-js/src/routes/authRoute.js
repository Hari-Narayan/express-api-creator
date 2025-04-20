// const authRouterr = require("express").Router();

// const { login, register } = require("../controllers/authController");

// authRouterr.post("/login", login);

// authRouterr.post("/register", register);

// module.exports = authRouterr;

const authRouter = require("express").Router();

const {
  login,
  register,
  resetPassword,
  forgotPassword,
  changePassword,
  resetTokenPassword,
} = require("../controllers/authController");

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/reset/:token", resetTokenPassword);
authRouter.post("/change-password", changePassword);
authRouter.post("/forgot-password", forgotPassword);

module.exports = authRouter;
