import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI; // Replace with your database name
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDatabase;
