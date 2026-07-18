import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const { ensureAdminUser } = await import("./auth.js");
const { adminApi, publicApi } = await import("./routes.js");
const { seedDatabase } = await import("./seed.js");
const { ensureSeedMedia, seedMediaDir, uploadsDir } = await import("./seedMedia.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

let dbReady = false;

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, database: dbReady ? "connected" : "connecting" });
});

app.use("/api/media/seed", express.static(seedMediaDir));
app.use("/api/media/uploads", express.static(uploadsDir, { maxAge: "1h" }));

app.use("/api", (request, response, next) => {
  if (!dbReady && !request.path.startsWith("/media")) {
    response.status(503).json({ ok: false, error: "Database is not connected yet. Try again shortly." });
    return;
  }
  next();
});

app.use("/api/admin", adminApi);
app.use("/api", publicApi);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ ok: false, error: "Internal server error." });
});

async function start() {
  ensureSeedMedia();

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/business_experts";
  for (let attempt = 1; attempt <= 5 && !dbReady; attempt += 1) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      dbReady = true;
    } catch (error) {
      console.warn(`MongoDB connect attempt ${attempt} failed: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (dbReady) {
    await seedDatabase();
    await ensureAdminUser();
    console.log("MongoDB connected and seeded.");
  } else {
    console.error("Could not connect to MongoDB — API will return 503 until it becomes available.");
    mongoose.connect(uri).then(async () => {
      dbReady = true;
      await seedDatabase();
      await ensureAdminUser();
      console.log("MongoDB connected (late) and seeded.");
    }).catch(() => {});
  }

  app.listen(port, () => {
    console.log(`Business Experts API running on http://localhost:${port}`);
  });
}

start();
