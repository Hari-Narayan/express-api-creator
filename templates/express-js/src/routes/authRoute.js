import { Router } from "express";

const authRouter = Router();

import {
  login,
  register,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
