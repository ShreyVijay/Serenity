import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import journalRoutes from "./routes/journal.routes.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/journal", journalRoutes);

app.get("/", (_, res) => res.send("Serenity backend running"));

connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
});
