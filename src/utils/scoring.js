/**
 * INVESTIQ - Mutual Fund Scoring & Ranking Engine
 * 
 * This module calculates a normalized multi-criteria score (0-100) for
 * 2 to 5 selected mutual funds based on user risk preferences.
 */

// Weight configurations mapped to user risk preference
export const RISK_WEIGHTS = {
  Low: {
    label: "Conservative / Low Risk",
    description: "Emphasizes capital preservation, low volatility, and high risk-adjusted consistency.",
    weights: {
      return5Y: 0.12,     // 12%
      return3Y: 0.08,     // 8% (Total Returns: 20%)
      sharpeRatio: 0.35,  // 35% (Prioritizes reward per unit of risk)
      expenseRatio: 0.20, // 20% (Low fees)
      stdDev: 0.25,       // 25% (Penalizes volatility heavily)
    },
  },
  Moderate: {
    label: "Balanced / Moderate Risk",
    description: "Balanced approach between long-term growth, low management fees, and risk management.",
    weights: {
      return5Y: 0.25,     // 25%
      return3Y: 0.15,     // 15% (Total Returns: 40%)
      sharpeRatio: 0.25,  // 25%
      expenseRatio: 0.20, // 20%
      stdDev: 0.15,       // 15%
    },
  },
  High: {
    label: "Aggressive / High Risk",
    description: "Maximizes compounding power through multi-year trailing returns.",
    weights: {
      return5Y: 0.35,     // 35%
      return3Y: 0.25,     // 25% (Total Returns: 60%)
      sharpeRatio: 0.15,  // 15%
      expenseRatio: 0.15, // 15%
      stdDev: 0.10,       // 10%
    },
  },
};

/**
 * Normalizes a value between 0 and 1 using min-max scaling across selected funds.
 * @param {number} val - Current fund metric value
 * @param {number} min - Minimum value among selected funds
 * @param {number} max - Maximum value among selected funds
 * @param {boolean} higherIsBetter - True if larger value is preferable
 * @returns {number} Normalized score between 0 and 1
 */
function normalizeMetric(val, min, max, higherIsBetter = true) {
  if (max === min) {
    // If all selected funds have identical values for this metric, award equal neutral score
    return 1.0;
  }
  return higherIsBetter ? (val - min) / (max - min) : (max - val) / (max - min);
}

/**
 * Calculates comparative scores for an array of selected funds.
 * 
 * @param {Array} funds - Array of 2 to 5 mutual fund objects
 * @param {string} riskPreference - "Low" | "Moderate" | "High"
 * @returns {Array} Funds sorted descending by score with breakdown and recommendation
 */
export function rankFunds(funds, riskPreference = "Moderate") {
  if (!Array.isArray(funds) || funds.length < 2) {
    return [];
  }

  const riskConfig = RISK_WEIGHTS[riskPreference] || RISK_WEIGHTS.Moderate;
  const weights = riskConfig.weights;

  // Extract min and max bounds for each metric across the selected cohort
  const bounds = {
    return5Y: {
      min: Math.min(...funds.map((f) => f.return5Y)),
      max: Math.max(...funds.map((f) => f.return5Y)),
    },
    return3Y: {
      min: Math.min(...funds.map((f) => f.return3Y)),
      max: Math.max(...funds.map((f) => f.return3Y)),
    },
    sharpeRatio: {
      min: Math.min(...funds.map((f) => f.sharpeRatio)),
      max: Math.max(...funds.map((f) => f.sharpeRatio)),
    },
    expenseRatio: {
      min: Math.min(...funds.map((f) => f.expenseRatio)),
      max: Math.max(...funds.map((f) => f.expenseRatio)),
    },
    stdDev: {
      min: Math.min(...funds.map((f) => f.stdDev)),
      max: Math.max(...funds.map((f) => f.stdDev)),
    },
  };

  // Score each fund by weighting normalized component scores
  const scoredFunds = funds.map((fund) => {
    // Higher is better: 5Y return, 3Y return, Sharpe ratio
    const norm5Y = normalizeMetric(fund.return5Y, bounds.return5Y.min, bounds.return5Y.max, true);
    const norm3Y = normalizeMetric(fund.return3Y, bounds.return3Y.min, bounds.return3Y.max, true);
    const normSharpe = normalizeMetric(fund.sharpeRatio, bounds.sharpeRatio.min, bounds.sharpeRatio.max, true);

    // Lower is better: Expense ratio, Standard deviation
    const normExpense = normalizeMetric(fund.expenseRatio, bounds.expenseRatio.min, bounds.expenseRatio.max, false);
    const normStdDev = normalizeMetric(fund.stdDev, bounds.stdDev.min, bounds.stdDev.max, false);

    const weightedScore =
      norm5Y * weights.return5Y +
      norm3Y * weights.return3Y +
      normSharpe * weights.sharpeRatio +
      normExpense * weights.expenseRatio +
      normStdDev * weights.stdDev;

    // Convert to a neat 0 - 100 score
    const totalScore = Math.round(weightedScore * 100);

    return {
      ...fund,
      score: totalScore,
      normalized: {
        return5Y: Math.round(norm5Y * 100),
        return3Y: Math.round(norm3Y * 100),
        sharpeRatio: Math.round(normSharpe * 100),
        expenseRatio: Math.round(normExpense * 100),
        stdDev: Math.round(normStdDev * 100),
      },
      isBest: {
        return5Y: fund.return5Y === bounds.return5Y.max,
        return3Y: fund.return3Y === bounds.return3Y.max,
        sharpeRatio: fund.sharpeRatio === bounds.sharpeRatio.max,
        expenseRatio: fund.expenseRatio === bounds.expenseRatio.min,
        stdDev: fund.stdDev === bounds.stdDev.min,
      },
    };
  });

  // Sort descending by score. If tied, break tie by 5Y return then Sharpe ratio
  scoredFunds.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.return5Y !== a.return5Y) return b.return5Y - a.return5Y;
    return b.sharpeRatio - a.sharpeRatio;
  });

  // Generate plain-English reason for the top-ranked fund
  if (scoredFunds.length > 0) {
    const topFund = scoredFunds[0];
    topFund.reason = generateRecommendationReason(topFund, scoredFunds, riskPreference);
  }

  return scoredFunds;
}

/**
 * Generates a concise, plain-English 1-to-2 line reason explaining why the top fund won.
 * 
 * @param {Object} topFund - The highest-scoring fund
 * @param {Array} allScoredFunds - All scored funds in the comparison
 * @param {string} riskPreference - "Low" | "Moderate" | "High"
 * @returns {string} Plain-English explanation
 */
function generateRecommendationReason(topFund, allScoredFunds, riskPreference) {
  const strengths = [];

  if (topFund.isBest.expenseRatio) {
    strengths.push(`lowest expense ratio (${topFund.expenseRatio}%)`);
  }
  if (topFund.isBest.return5Y) {
    strengths.push(`highest 5-year annualized return (${topFund.return5Y}%)`);
  }
  if (topFund.isBest.sharpeRatio && !strengths.includes(`highest 5-year annualized return (${topFund.return5Y}%)`)) {
    strengths.push(`highest Sharpe ratio (${topFund.sharpeRatio})`);
  }
  if (topFund.isBest.stdDev) {
    strengths.push(`lowest volatility (standard deviation of ${topFund.stdDev}%)`);
  }
  if (topFund.isBest.return3Y && strengths.length < 2) {
    strengths.push(`strong 3-year return (${topFund.return3Y}%)`);
  }

  if (strengths.length >= 2) {
    const formatted = strengths.slice(0, 2).join(" and ");
    // Capitalize first letter
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return `${capitalized} among your selected funds, making it the strongest fit for your ${riskPreference.toLowerCase()} risk profile.`;
  }

  if (strengths.length === 1) {
    const capitalized = strengths[0].charAt(0).toUpperCase() + strengths[0].slice(1);
    return `${capitalized} alongside balanced risk-reward metrics across the peer group.`;
  }

  // Fallback if no single metric is absolute #1 but fund won on composite balance
  return `Delivers the most balanced blend of steady returns, low volatility, and cost efficiency under a ${riskPreference.toLowerCase()} risk preference.`;
}
