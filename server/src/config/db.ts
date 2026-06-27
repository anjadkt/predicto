import mongoose from "mongoose";
import { env } from "./env.js";

const connectDb =  async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log("DB Connected");
    
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
}

export default connectDb ;