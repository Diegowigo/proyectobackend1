import mongoose from "mongoose";
import { config } from "./config/config.js";

export const connDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
    console.log(`Database connected`);
  } catch (error) {
    console.log(`Error connecting Database: ${error.message}`);
  }
};
