const { color } = require("console-log-colors");
const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.info(color.green("Database connected successfully.")))
  .catch((err) => console.error(err));
