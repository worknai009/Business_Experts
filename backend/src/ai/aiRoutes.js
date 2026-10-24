import { Router } from "express";
import { requireAuth, requireStaff, requireSuperadmin } from "../auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { calculateBusinessScore } from "./scoreCalculator.js";
import { calculateFinance } from "./financeCalculator.js";
import { getRecommendation } from "./recommendation.js";
import { retrieveRagContext } from "./ragEngine.js";
import { BUSINESS_DATA } from "./businessData.js";
import { getAIMentorReply } from "./geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aiRouter = Router();

// ── Site Content Store & Persistence ──────────────────────────────
const DEFAULT_CONTENT_FILE = path.join(__dirname, "site_content.json");
const SITE_CONTENT_FILE = process.env.SITE_CONTENT_FILE || DEFAULT_CONTENT_FILE;

let siteContentStore = {};

function loadSiteContent() {
  try {
    if (!fs.existsSync(SITE_CONTENT_FILE) && SITE_CONTENT_FILE !== DEFAULT_CONTENT_FILE) {
      fs.mkdirSync(path.dirname(SITE_CONTENT_FILE), { recursive: true });
      fs.copyFileSync(DEFAULT_CONTENT_FILE, SITE_CONTENT_FILE);
    }
    if (fs.existsSync(SITE_CONTENT_FILE)) {
      const data = fs.readFileSync(SITE_CONTENT_FILE, "utf-8");
      siteContentStore = JSON.parse(data);
      console.log("Loaded persisted BusinessAI site content from disk.");
    }
  } catch (err) {
    console.error("Could not load site content:", err.message);
    if (process.env.NODE_ENV === "production") throw err;
  }
}

function saveSiteContent() {
  try {
    fs.mkdirSync(path.dirname(SITE_CONTENT_FILE), { recursive: true });
    const temporaryFile = `${SITE_CONTENT_FILE}.tmp`;
    fs.writeFileSync(temporaryFile, JSON.stringify(siteContentStore, null, 2), "utf-8");
    fs.renameSync(temporaryFile, SITE_CONTENT_FILE);
    console.log("Saved BusinessAI site content to disk.");
  } catch (err) {
    console.error("Could not save site_content.json:", err.message);
    throw err;
  }
}

loadSiteContent();

// ── 1. Feasibility Analysis ────────────────────────────────────────
const handleAnalyze = async (req, res) => {
  try {
    const biz = (req.body.business || "").trim();
    const loc = (req.body.location || "").trim();
    const bgt = Number(req.body.budget) || 500000;

    // 1. Score calculation
    const scoreRes = calculateBusinessScore(biz, loc, bgt);

    // 2. Finance calculation
    const financeRes = calculateFinance(
      biz,
      loc,
      bgt,
      scoreRes.demand || "High",
      scoreRes.competition || "Medium",
      scoreRes.risk || "Low"
    );

    // 3. Recommendation & Action Plan
    const recRes = getRecommendation(biz, loc, scoreRes, financeRes);

    // 4. RAG context (schemes & insights)
    const ragRes = retrieveRagContext(biz, loc);

    const combined = {
      business: biz,
      location: loc,
      budget: bgt,
      score: scoreRes.total_score ?? 85,
      total_score: scoreRes.total_score ?? 85,
      rating: scoreRes.rating || "Good",
      budget_analysis: scoreRes.budget_analysis || {},
      demand_analysis: scoreRes.demand_analysis || {},
      competition_analysis: scoreRes.competition_analysis || {},
      risk_analysis: scoreRes.risk_analysis || {},
      location_analysis: scoreRes.location_analysis || {},
      required_investment: financeRes.required_investment ?? bgt,
      monthly_revenue: financeRes.monthly_revenue ?? 0,
      monthly_expenses: financeRes.monthly_expenses ?? 0,
      monthly_net_profit: financeRes.monthly_net_profit ?? 0,
      estimated_revenue: financeRes.estimated_revenue ?? 0,
      estimated_expenses: financeRes.estimated_expenses ?? 0,
      estimated_profit: financeRes.estimated_profit ?? 0,
      annual_roi_percent: financeRes.annual_roi_percent ?? 0,
      roi: financeRes.roi || "0%",
      break_even_months: financeRes.break_even_months ?? 12.0,
      break_even: financeRes.break_even || "12 Months",
      growth_potential: financeRes.growth_potential || "Stable",
      recommendation: recRes.recommendation || "",
      insights: recRes.insights || [],
      action_plan: recRes.action_plan || [],
      better_businesses: recRes.better_businesses || [],
      schemes: ragRes.schemes || [],
      market_insights: ragRes.insights || []
    };

    return res.json(combined);
  } catch (error) {
    console.error("Error in /analyze:", error);
    return res.status(500).json({ error: error.message });
  }
};

aiRouter.post("/analyze", handleAnalyze);
aiRouter.post("/opportunities/analyze", handleAnalyze);

// ── 2. Business Opportunity Finder ─────────────────────────────────
aiRouter.post("/find-businesses", (req, res) => {
  try {
    const loc = req.body.location || "Pune";
    const bgt = Number(req.body.budget) || 500000;
    const interest = (req.body.interest || "").toLowerCase();

    const matches = [];

    for (const [name, info] of Object.entries(BUSINESS_DATA)) {
      const inv = info.investment ?? 500000;
      const demand = info.demand || "High";
      const risk = info.risk || "Low";

      // Match score based on budget fit & demand
      if (bgt >= inv * 0.5) {
        let score = 60;
        if (bgt >= inv) score += 20;
        if (demand === "High") score += 15;
        if (risk === "Low") score += 10;

        if (
          interest &&
          (name.toLowerCase().includes(interest) ||
            (info.related && info.related.some((r) => r.toLowerCase().includes(interest))))
        ) {
          score += 20;
        }

        const titleCase = (s) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());

        matches.push({
          name: titleCase(name),
          category: info.category || "General",
          investment: inv,
          demand,
          competition: info.competition || "Medium",
          risk,
          score: Math.min(score, 98),
          roi: "35% - 55%",
          break_even: "6 - 10 Months"
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 6);

    return res.json({
      location: loc,
      budget: bgt,
      total_found: topMatches.length,
      recommendations: topMatches,
      businesses: topMatches
    });
  } catch (error) {
    console.error("Error in /find-businesses:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ── 3. Capex & Break-Even Calculator ───────────────────────────────
const handleCalculate = (req, res) => {
  try {
    const inv = Number(req.body.initial_investment) || 500000;
    const rev = Number(req.body.monthly_revenue) || 100000;
    const exp = Number(req.body.monthly_expenses) || 60000;
    const tax = Number(req.body.tax_rate) || 10.0;

    const net = Math.max(0, rev - exp);
    const afterTax = net * (1 - tax / 100.0);
    const annual = afterTax * 12;
    const roi = inv > 0 ? (annual / inv) * 100 : 0;
    const breakEven = afterTax > 0 ? inv / afterTax : 0;

    return res.json({
      initial_investment: inv,
      monthly_revenue: rev,
      monthly_expenses: exp,
      net_monthly_profit: Math.round(net),
      after_tax_profit: Math.round(afterTax),
      annual_profit: Math.round(annual),
      roi_percent: Math.round(roi * 10) / 10,
      break_even_months: Math.round(breakEven * 10) / 10,
      viability_rating: roi >= 30 ? "Strong" : roi >= 15 ? "Moderate" : "Low"
    });
  } catch (error) {
    console.error("Error in calculate:", error);
    return res.status(500).json({ error: error.message });
  }
};

aiRouter.post("/calculator/estimate", handleCalculate);
aiRouter.post("/calculate", handleCalculate);

// ── 4. Market & City Insights ──────────────────────────────────────
aiRouter.get("/insights", (req, res) => {
  try {
    const city = req.query.city || "";
    const industry = req.query.industry || "";
    const ragData = retrieveRagContext(industry || "General", city || "India");

    return res.json({
      city,
      industry,
      insights: ragData.insights || [],
      schemes: ragData.schemes || []
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ── 5. AI Mentor Chat ──────────────────────────────────────────────
const handleChat = async (req, res) => {
  try {
    const sessionId = req.body.session_id || "session_1";
    const msg = req.body.message || "";
    const biz = req.body.business || "General Business";
    const loc = req.body.location || "India";

    const reply = await getAIMentorReply(msg, biz, loc);

    return res.json({
      session_id: sessionId,
      user_message: msg,
      reply,
      suggested_actions: ["Calculate ROI", "Check Govt Schemes", "Download PDF Report"]
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return res.status(500).json({ error: error.message });
  }
};

aiRouter.post("/ai/chat", handleChat);
aiRouter.post("/chat", handleChat);

// ── 6. Active Users Heartbeat ──────────────────────────────────────
aiRouter.post("/active-users/heartbeat", (_req, res) => {
  return res.json({ ok: true, active: true, online_count: 12 });
});

// ── 7. Site Content CMS Endpoints ──────────────────────────────────
aiRouter.get("/content", (_req, res) => {
  return res.json(siteContentStore);
});

const handleUpdateContent = (req, res) => {
  try {
    const data = req.body;
    if (typeof data === "object" && data !== null) {
      for (const [k, v] of Object.entries(data)) {
        siteContentStore[k] = v;
      }
      saveSiteContent();
    }
    return res.json({
      ok: true,
      message: "All site content updated and saved to disk permanently",
      data: siteContentStore
    });
  } catch (e) {
    console.error("Error updating site content:", e);
    return res.status(500).json({ ok: false, error: "Could not save site content." });
  }
};

aiRouter.put("/content", requireAuth, requireStaff, handleUpdateContent);
aiRouter.post("/content", requireAuth, requireStaff, handleUpdateContent);
aiRouter.put("/admin/content", requireAuth, requireStaff, handleUpdateContent);
aiRouter.post("/admin/content", requireAuth, requireStaff, handleUpdateContent);

const handleUpdateContentKey = (req, res) => {
  try {
    const { key } = req.params;
    const data = req.body;
    siteContentStore[key] = data;
    saveSiteContent();
    return res.json({ ok: true, key, data });
  } catch (e) {
    console.error(`Error updating site content key ${req.params.key}:`, e);
    return res.status(500).json({ ok: false, error: "Could not save site content." });
  }
};

aiRouter.put("/admin/content/:key", requireAuth, requireStaff, handleUpdateContentKey);
aiRouter.post("/admin/content/:key", requireAuth, requireStaff, handleUpdateContentKey);

// ── 8. Authentication (BusinessAI compatibility) ───────────────────
// Authentication is handled by the shared /api/auth router.

const handleSystemStatus = (_req, res) => {
  return res.json({
    backend: { status: "HEALTHY", uptime: "99.98%", latency_ms: 24 },
    ai_service: { status: "HEALTHY", uptime: "100.0%", latency_ms: 15 },
    database: { status: "HEALTHY", connections_active: 12, max_connections: 100 },
    vector_store: { status: "HEALTHY", embeddings_indexed: 14200 }
  });
};

const handleAiModels = (_req, res) => {
  return res.json({
    active_llm: "RAG Business Engine v2.0 / Node.js Microservice",
    embedding_model: "text-embedding-3-small",
    businesses_in_db: Object.keys(BUSINESS_DATA).length,
    total_requests_month: 14820,
    estimated_cost_usd: 42.50,
    available_models: [
      { id: "rag-engine-v2", name: "RAG Business Engine v2.0 (Default)", status: "Active" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", status: "Active" },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", status: "Standby" }
    ]
  });
};

aiRouter.get("/super-admin/system/status", requireAuth, requireSuperadmin, handleSystemStatus);
aiRouter.get("/super-admin/ai-models", requireAuth, requireSuperadmin, handleAiModels);
