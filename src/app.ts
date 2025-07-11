import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Donation App API");
});
app.use("/v1", indexRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });



