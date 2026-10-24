import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const services = [
  { name: "Unified Backend (Port 5000)", cwd: path.join(__dirname, "backend"), color: "\x1b[34m" },
  { name: "BusinessExperts Web (Port 5180)", cwd: path.join(__dirname, "apps", "business-experts"), color: "\x1b[32m" },
  { name: "BusinessExperts Admin (Port 5181)", cwd: path.join(__dirname, "apps", "admin"), color: "\x1b[35m" },
  { name: "BusinessAI Portal (Port 5173)", cwd: path.join(__dirname, "apps", "business-ai"), color: "\x1b[36m" }
];

console.log("\x1b[1m\x1b[33m%s\x1b[0m", "Starting BusinessExperts & BusinessAI Unified Monorepo...\n");

const children = [];

for (const s of services) {
  const child = spawn(npmCmd, ["run", "dev"], {
    cwd: s.cwd,
    shell: true,
    stdio: "inherit"
  });

  child.on("error", (err) => {
    console.error(`${s.color}[${s.name}]\x1b[0m Failed to start:`, err.message);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${s.color}[${s.name}]\x1b[0m Exited with code ${code}`);
    }
  });

  children.push(child);
}

const shutdown = () => {
  console.log("\nShutting down all monorepo services...");
  for (const child of children) {
    try {
      if (isWin) {
        spawn("taskkill", ["/pid", child.pid, "/T", "/F"], { stdio: "ignore" });
      } else {
        child.kill("SIGTERM");
      }
    } catch {}
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
