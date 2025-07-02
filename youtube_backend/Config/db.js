import mongoose from "mongoose";

async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is not defined in environment variables.");
            process.exit(1);
        }

        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the database successfully:", response.connection.host);
    } catch (e) {
        console.error("Error connecting to the database:", e.message);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;
