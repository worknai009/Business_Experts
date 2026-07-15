import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { homeContent } from "./content.js";
import { HomeContent } from "./HomeContent.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    return false;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await HomeContent.findOne();
  if (!existing) {
    await HomeContent.create(homeContent);
  }
  return true;
}

const mongoReady = connectMongo().catch((error) => {
  console.warn("MongoDB unavailable, using fallback content:", error.message);
  return false;
});

app.get("/api/health", async (_request, response) => {
  const connected = await mongoReady;
  response.json({ ok: true, database: connected ? "mongodb" : "fallback" });
});

app.get("/api/home", async (_request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    response.json(homeContent);
    return;
  }

  const content = await HomeContent.findOne().lean();
  response.json(content || homeContent);
});

app.listen(port, () => {
  console.log(`Business Expert Asia API running on http://localhost:${port}`);
});
