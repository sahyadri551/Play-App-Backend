import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";
import chalk from 'chalk';

const port = process.env.PORT || 8000
try {
    await connectDB();
    app.listen(port,
        () => console.log(chalk.green(`->>> Server running on port ${port}`)));
} catch (error) {
    console.error(chalk.red("->>> Error connecting to MongoDB:"), error);
    process.exit(1);
}