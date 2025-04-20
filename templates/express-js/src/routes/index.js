const rootRouter = require("express").Router();

const authRouter = require("./authRoute");

rootRouter.get("/", (req, res) => {
  res.send("You are on base API route!");
});

rootRouter.use("/auth", authRouter);

module.exports = rootRouter;
