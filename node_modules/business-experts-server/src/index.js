import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { homeContent } from "./content.js";
import { HomeContent } from "./HomeContent.js";
import { Inquiry } from "./Inquiry.js";

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

const fallbackInquiries = [];

app.post("/api/inquiries", async (request, response) => {
  const { parentName, phone, email, childName, childAge, program, message } = request.body || {};

  if (!parentName?.trim() || !phone?.trim() || !childName?.trim() || !program?.trim()) {
    response.status(400).json({
      ok: false,
      error: "parentName, phone, childName and program are required."
    });
    return;
  }

  const inquiry = {
    parentName: parentName.trim(),
    phone: phone.trim(),
    email: email?.trim() || "",
    childName: childName.trim(),
    childAge: Number(childAge) || undefined,
    program: program.trim(),
    message: message?.trim() || ""
  };

  try {
    const connected = await mongoReady;
    if (connected) {
      await Inquiry.create(inquiry);
    } else {
      fallbackInquiries.push({ ...inquiry, createdAt: new Date() });
      console.log("Inquiry received (stored in memory, MongoDB unavailable):", inquiry);
    }
    response.json({ ok: true });
  } catch (error) {
    console.error("Failed to save inquiry:", error.message);
    response.status(500).json({ ok: false, error: "Failed to save inquiry." });
  }
});

app.get("/api/inquiries", async (_request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    response.json(fallbackInquiries);
    return;
  }

  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
  response.json(inquiries);
});

app.listen(port, () => {
  console.log(`Business Expert Asia API running on http://localhost:${port}`);
});
