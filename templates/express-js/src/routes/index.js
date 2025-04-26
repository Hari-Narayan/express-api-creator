import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.send("You are on base API route!");
});

import authRouter from "./authRoute.js";
rootRouter.use("/auth", authRouter);

import userRouter from "./userRoute.js";
rootRouter.use("/user", userRouter);

export default rootRouter;
