import mongoose from "mongoose";
import { ErrorApi } from "./errorAPI.js";

export default async function DBConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "westeros"
        });
    } catch (error) {
        console.log("error: ", error);
        throw new ErrorApi(500, error.message)
    }
}
