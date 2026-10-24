import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { validateProductionConfig } from "./productionConfig.js";

dotenv.config();
validateProductionConfig();

const { ensureAdminUser } = await import("./auth.js");
const { adminApi, publicApi } = await import("./routes.js");
const { seedDatabase } = await import("./seed.js");
const { ensureSeedMedia, seedMediaDir, uploadsDir } = await import("./seedMedia.js");
const { aiRouter } = await import("./ai/aiRoutes.js");

const app = express();
const port = process.env.PORT || 5000;

app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));
const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0));
  }
}));
app.use(express.json({ limit: "5mb" }));

let dbReady = false;

app.get("/", (_request, response) => {
  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Business Experts API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2rem 2.5rem; border-radius: 1rem; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 480px; width: 100%; text-align: center; }
          h1 { margin-top: 0; color: #38bdf8; font-size: 1.5rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
          .status { display: inline-block; background: #065f46; color: #34d399; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
          .links { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
          .btn { display: block; padding: 0.75rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; transition: all 0.2s; font-size: 0.9rem; }
          .btn-primary { background: #0284c7; color: white; }
          .btn-primary:hover { background: #0369a1; }
          .btn-secondary { background: #334155; color: #e2e8f0; }
          .btn-secondary:hover { background: #475569; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Business Experts API</h1>
          <div class="status">● Backend Running</div>
          <p>This is the Express backend API server. To view the user interface or admin dashboard, use the links below:</p>
          <div class="links">
            <a class="btn btn-primary" href="${process.env.PUBLIC_SITE_URL || "http://localhost:5180"}">Open Website →</a>
            <a class="btn btn-secondary" href="${process.env.ADMIN_SITE_URL || "http://localhost:5181"}">Open Admin Panel →</a>
            <a class="btn btn-secondary" href="${process.env.AI_SITE_URL || "http://localhost:5173"}">Open BusinessAI →</a>
            <a class="btn btn-secondary" href="/api/health">Check API Health (JSON)</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get("/health", (_request, response) => {
  response.json({ status: "healthy", service: "BusinessAI & BusinessExperts Unified Backend", version: "1.0.0" });
});

app.get("/api/health", (_request, response) => {
  const ready = dbReady && mongoose.connection.readyState === 1;
  response.status(ready ? 200 : 503).json({ ok: ready, database: ready ? "connected" : "unavailable" });
});

app.use("/api/media/seed", express.static(seedMediaDir));
app.use("/api/media/uploads", express.static(uploadsDir, { maxAge: "1h" }));

// Mount AI Engine & BusinessAI Compatibility Routes (runs independent of MongoDB ready-state)
app.use("/ai-api", aiRouter);
app.use("/api", aiRouter);
app.use("/", aiRouter);

app.use("/api", (request, response, next) => {
  if ((!dbReady || mongoose.connection.readyState !== 1) && !request.path.startsWith("/media")) {
    response.status(503).json({ ok: false, error: "Database is not connected yet. Try again shortly." });
    return;
  }
  next();
});

app.use("/api/admin", adminApi);
app.use("/api", publicApi);

app.use((_request, response) => response.status(404).json({ ok: false, error: "Not found." }));

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = error.status || 500;
  response.status(status).json({ ok: false, error: status === 413 ? "Request body is too large." : "Internal server error." });
});

async function start() {
  ensureSeedMedia();

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Business Experts Unified API running on http://localhost:${port}`);
  });

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/business_experts";
  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 4000 })
    .then(async () => {
      if (process.env.SEED_DATABASE !== "false") await seedDatabase();
      if (process.env.BOOTSTRAP_ADMIN !== "false") await ensureAdminUser();
      dbReady = true;
      console.log("MongoDB connected; startup completed.");
    })
    .catch((error) => {
      console.error(`Database startup failed: ${error.message}`);
      if (process.env.NODE_ENV === "production") process.exit(1);
    });

  let shuttingDown = false;
  async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    dbReady = false;
    const deadline = setTimeout(() => process.exit(1), 10000);
    deadline.unref();
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
