import express from "express";
import cors from "cors";
import "dotenv/config";
import mainRoute from "./src/routes/main.js";
import errorHandler from './src/utils/errorHandler.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use("/api/v1", mainRoute);
app.use(errorHandler)

export { app, port };
