import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URL =", process.env.MONGO_URL);
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
};
export default connectDB;