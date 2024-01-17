import mongoose from "mongoose";


const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Environment variable MONGO_URI must be defined");
    }

    await mongoose.connect(mongoUri);
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};



export default connectDB;
