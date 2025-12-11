import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Capture returned connection object
        const conn =await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Error:", error);
        process.exit(1);
    }
};

export default connectDB;