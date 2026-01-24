import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/checkmate";
        console.log("📡 Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Wait up to 10s
            socketTimeoutMS: 45000,
        });
        console.log("✅ MongoDB connected successfully");
        console.log(`📊 Database: ${mongoose.connection.name}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        // On serverless, don't exit. Let the request fail so Vercel can retry or show a proper error.
        throw error;
    }
};
// Connection event listeners
mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
});
export default connectDB;
