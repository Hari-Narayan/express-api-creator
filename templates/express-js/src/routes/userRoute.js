import { Router } from "express";

const userRouter = Router();

import { myProfile, changePassword } from "../controllers/userController.js";

userRouter.post("/my-profile", myProfile);
userRouter.post("/change-password", changePassword);

export default userRouter;
