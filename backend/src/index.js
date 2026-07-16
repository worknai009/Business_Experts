import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { homeContent, programSessions, siteContent } from "./content.js";
import { HomeContent } from "./HomeContent.js";
import { Inquiry } from "./Inquiry.js";
import { ProgramSession } from "./ProgramSession.js";
import { SiteContent } from "./SiteContent.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

let fallbackSiteContent = siteContent;
let fallbackProgramSessions = programSessions.map((session, index) => ({
  ...session,
  _id: `fallback-${index + 1}`,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}));
const fallbackInquiries = [];

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    return false;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  if (!(await HomeContent.findOne())) {
    await HomeContent.create(homeContent);
  }
  if (!(await SiteContent.findOne())) {
    await SiteContent.create(siteContent);
  }
  if (!(await ProgramSession.countDocuments())) {
    await ProgramSession.insertMany(programSessions);
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

app.get("/api/site-content", async (_request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    response.json(fallbackSiteContent);
    return;
  }

  const content = await SiteContent.findOne().lean();
  response.json(content || siteContent);
});

app.put("/api/admin/site-content", async (request, response) => {
  const nextContent = request.body || {};
  const connected = await mongoReady;

  if (!connected) {
    fallbackSiteContent = { ...fallbackSiteContent, ...nextContent };
    response.json(fallbackSiteContent);
    return;
  }

  const content = await SiteContent.findOneAndUpdate(
    {},
    { $set: nextContent },
    { new: true, upsert: true }
  ).lean();
  response.json(content);
});

app.get("/api/program-sessions", async (_request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    response.json(getSortedSessions().filter((session) => session.isActive));
    return;
  }

  const sessions = await ProgramSession.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  response.json(sessions);
});

app.get("/api/admin/program-sessions", async (_request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    response.json(getSortedSessions());
    return;
  }

  const sessions = await ProgramSession.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  response.json(sessions);
});

app.post("/api/admin/program-sessions", async (request, response) => {
  const session = normalizeProgramSession(request.body || {});
  if (!session.title || !session.duration || !session.suitableFor) {
    response.status(400).json({ ok: false, error: "title, duration and suitableFor are required." });
    return;
  }

  const connected = await mongoReady;
  if (!connected) {
    const created = {
      ...session,
      _id: `fallback-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    fallbackProgramSessions.push(created);
    response.status(201).json(created);
    return;
  }

  const created = await ProgramSession.create(session);
  response.status(201).json(created);
});

app.put("/api/admin/program-sessions/:id", async (request, response) => {
  const session = normalizeProgramSession(request.body || {});
  const connected = await mongoReady;

  if (!connected) {
    const index = fallbackProgramSessions.findIndex((item) => item._id === request.params.id);
    if (index === -1) {
      response.status(404).json({ ok: false, error: "Session not found." });
      return;
    }
    fallbackProgramSessions[index] = {
      ...fallbackProgramSessions[index],
      ...session,
      updatedAt: new Date()
    };
    response.json(fallbackProgramSessions[index]);
    return;
  }

  const updated = await ProgramSession.findByIdAndUpdate(request.params.id, session, {
    new: true,
    runValidators: true
  }).lean();
  if (!updated) {
    response.status(404).json({ ok: false, error: "Session not found." });
    return;
  }
  response.json(updated);
});

app.delete("/api/admin/program-sessions/:id", async (request, response) => {
  const connected = await mongoReady;
  if (!connected) {
    fallbackProgramSessions = fallbackProgramSessions.filter((item) => item._id !== request.params.id);
    response.json({ ok: true });
    return;
  }

  await ProgramSession.findByIdAndDelete(request.params.id);
  response.json({ ok: true });
});

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
    message: message?.trim() || "",
    status: "new",
    adminNote: ""
  };

  try {
    const connected = await mongoReady;
    if (connected) {
      await Inquiry.create(inquiry);
    } else {
      fallbackInquiries.unshift({
        ...inquiry,
        _id: `fallback-${Date.now()}`,
        createdAt: new Date()
      });
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

app.patch("/api/admin/inquiries/:id", async (request, response) => {
  const { status, adminNote } = request.body || {};
  const update = {};
  if (["new", "contacted", "closed"].includes(status)) {
    update.status = status;
  }
  if (typeof adminNote === "string") {
    update.adminNote = adminNote.trim();
  }

  const connected = await mongoReady;
  if (!connected) {
    const inquiry = fallbackInquiries.find((item) => item._id === request.params.id);
    if (!inquiry) {
      response.status(404).json({ ok: false, error: "Inquiry not found." });
      return;
    }
    Object.assign(inquiry, update);
    response.json(inquiry);
    return;
  }

  const inquiry = await Inquiry.findByIdAndUpdate(request.params.id, update, {
    new: true,
    runValidators: true
  }).lean();
  if (!inquiry) {
    response.status(404).json({ ok: false, error: "Inquiry not found." });
    return;
  }
  response.json(inquiry);
});

function getSortedSessions() {
  return [...fallbackProgramSessions].sort(
    (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
  );
}

function normalizeProgramSession(payload) {
  return {
    title: payload.title?.trim() || "",
    duration: payload.duration?.trim() || "",
    suitableFor: payload.suitableFor?.trim() || "",
    schedule: payload.schedule?.trim() || "",
    description: payload.description?.trim() || "",
    image: payload.image?.trim() || "",
    isActive: payload.isActive !== false,
    sortOrder: Number(payload.sortOrder) || 0
  };
}

app.listen(port, () => {
  console.log(`Business Expert Asia API running on http://localhost:${port}`);
});
