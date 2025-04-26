import mongoose from "mongoose";

const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected successfully.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default mongooseConnect;
