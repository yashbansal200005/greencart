import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    const uri = process.env.MONGODB_URI?.replace(/\/$/, ''); // Remove trailing slash
    await mongoose.connect(`${uri}/ecom`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
