import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";

try {
    await connectDB();
    app.listen(process.env.PORT || 8000,
        () => console.log(`Server running on port ${process.env.PORT}`));
} catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
}