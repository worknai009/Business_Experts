import { analyzeBudget } from "./budget.js";
import { analyzeDemand } from "./demand.js";
import { analyzeCompetition } from "./competition.js";
import { analyzeRisk } from "./risk.js";
import { analyzeLocation } from "./location.js";

export function calculateBusinessScore(business, location, budget) {
  const budgetResult = analyzeBudget(business, budget);
  const demandResult = analyzeDemand(business);
  const competitionResult = analyzeCompetition(business);
  const riskResult = analyzeRisk(business);
  const locationResult = analyzeLocation(location);

  let totalScore =
    budgetResult.score +
    demandResult.score +
    competitionResult.score +
    riskResult.score +
    locationResult.score;

  // Budget penalty
  if (budgetResult.score === 0) {
    totalScore -= 30;
  } else if (budgetResult.score === 5) {
    totalScore -= 20;
  } else if (budgetResult.score === 10) {
    totalScore -= 10;
  }

  // Keep between 0 and 100
  if (totalScore < 0) totalScore = 0;
  if (totalScore > 100) totalScore = 100;

  let rating = "Poor";
  if (totalScore >= 85) {
    rating = "Excellent";
  } else if (totalScore >= 70) {
    rating = "Good";
  } else if (totalScore >= 50) {
    rating = "Average";
  }

  return {
    business,
    location,
    total_score: totalScore,
    rating,
    budget_analysis: budgetResult,
    demand_analysis: demandResult,
    competition_analysis: competitionResult,
    risk_analysis: riskResult,
    location_analysis: locationResult,
    demand: demandResult.level,
    competition: competitionResult.level,
    risk: riskResult.level
  };
}
