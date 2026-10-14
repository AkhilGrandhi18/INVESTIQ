import React from 'react';
import Tooltip from './Tooltip';
import { RISK_WEIGHTS } from '../utils/scoring';

/**
 * Step 3: Results & Comparison Screen
 * Displays ranked funds with the highlighted "Best match", plain-English reason,
 * score breakdown, and comprehensive side-by-side metric comparison table with tooltips.
 */
export default function StepResults({
  scoredFunds,
  riskPreference,
  setRiskPreference,
  onBackToFunds,
  onBackToRisk,
}) {
  if (!scoredFunds || scoredFunds.length === 0) {
    return (
      <div className="empty-state">
        <p>No funds selected. Please select at least 2 funds to see recommendations.</p>
        <button type="button" className="btn-primary" onClick={onBackToFunds}>
          Go to Fund Selection
        </button>
      </div>
    );
  }

  const bestFund = scoredFunds[0];
  const riskInfo = RISK_WEIGHTS[riskPreference] || RISK_WEIGHTS.Moderate;

  return (
    <section className="step-container" aria-labelledby="step-3-title">
      <div className="step-header-row">
        <div>
          <span className="step-pill">Step 3 of 3</span>
          <h1 id="step-3-title" className="step-title">Fund Ranking & Comparative Analysis</h1>
          <p className="step-subtitle">
            Normalized 0–100 scoring based on your <strong>{riskPreference} Risk</strong> preference.
          </p>
        </div>

        {/* Quick Risk Switcher */}
        <div className="risk-quick-toggle">
          <span className="quick-toggle-label">Risk Profile:</span>
          <div className="toggle-group">
            {['Low', 'Moderate', 'High'].map((r) => (
              <button
                key={r}
                type="button"
                className={`toggle-btn ${riskPreference === r ? 'active' : ''}`}
                onClick={() => setRiskPreference(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Winner / Best Match Hero Card */}
      <div className="best-match-card" role="region" aria-label="Top mutual fund recommendation">
        <div className="best-match-badge-row">
          <span className="badge-best-match">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Best Match
          </span>
          <span className="best-match-cat">{bestFund.category}</span>
        </div>

        <div className="best-match-main">
          <div className="best-match-info">
            <h2 className="best-match-name">{bestFund.name}</h2>
            <div className="best-match-reason-box">
              <span className="reason-label">Why it's recommended:</span>
              <p className="best-match-reason">"{bestFund.reason}"</p>
            </div>
          </div>

          <div className="best-match-score-badge">
            <span className="score-num">{bestFund.score}</span>
            <span className="score-denom">/ 100</span>
            <span className="score-label">INVESTIQ Score</span>
          </div>
        </div>

        <div className="best-match-key-metrics">
          <div className="metric-pill">
            <span className="m-label">5Y Return</span>
            <span className="m-val">{bestFund.return5Y}% p.a.</span>
          </div>
          <div className="metric-pill">
            <span className="m-label">3Y Return</span>
            <span className="m-val">{bestFund.return3Y}% p.a.</span>
          </div>
          <div className="metric-pill">
            <span className="m-label">Expense Ratio</span>
            <span className="m-val">{bestFund.expenseRatio}%</span>
          </div>
          <div className="metric-pill">
            <span className="m-label">Sharpe Ratio</span>
            <span className="m-val">{bestFund.sharpeRatio}</span>
          </div>
          <div className="metric-pill">
            <span className="m-label">Std Deviation</span>
            <span className="m-val">{bestFund.stdDev}%</span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard / Rankings List */}
      <div className="section-block">
        <h2 className="section-heading">Fund Rankings Leaderboard</h2>
        <div className="rankings-list">
          {scoredFunds.map((fund, index) => {
            const isWinner = index === 0;
            return (
              <div key={fund.id} className={`ranking-row ${isWinner ? 'winner-row' : ''}`}>
                <div className="rank-position">
                  <span className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : 'rank-other'}`}>
                    #{index + 1}
                  </span>
                </div>

                <div className="rank-fund-details">
                  <div className="rank-fund-title-row">
                    <span className="rank-fund-name">{fund.name}</span>
                    <span className="cat-pill small">{fund.category}</span>
                    {isWinner && <span className="mini-badge-winner">Best Match</span>}
                  </div>
                  <div className="rank-fund-stats-summary">
                    <span>5Y: <strong>{fund.return5Y}%</strong></span>
                    <span>•</span>
                    <span>Expense: <strong>{fund.expenseRatio}%</strong></span>
                    <span>•</span>
                    <span>Sharpe: <strong>{fund.sharpeRatio}</strong></span>
                    <span>•</span>
                    <span>StdDev: <strong>{fund.stdDev}%</strong></span>
                    <span>•</span>
                    <span>AUM: <strong>₹{fund.aumCr.toLocaleString()} Cr</strong></span>
                  </div>
                </div>

                <div className="rank-score-column">
                  <div className="score-bar-wrapper">
                    <div className="score-bar-track">
                      <div
                        className={`score-bar-fill ${isWinner ? 'fill-winner' : ''}`}
                        style={{ width: `${fund.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="rank-score-text">
                    <strong>{fund.score}</strong> / 100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="section-block">
        <div className="table-header-heading">
          <div>
            <h2 className="section-heading">Side-by-Side Fund Comparison</h2>
            <p className="section-description">
              Direct comparison of all metrics. The best metric across your selected funds is highlighted in green.
            </p>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="th-metric">Metric / Property</th>
                {scoredFunds.map((fund, index) => (
                  <th key={fund.id} className={`th-fund ${index === 0 ? 'th-winner' : ''}`}>
                    <div className="table-fund-header">
                      {index === 0 && <span className="th-best-pill">Best Match</span>}
                      <span className="table-fund-name">{fund.name}</span>
                      <span className="cat-pill small">{fund.category}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* INVESTIQ Score */}
              <tr className="tr-highlight">
                <td className="td-label">
                  <strong>INVESTIQ Score</strong>
                </td>
                {scoredFunds.map((fund, idx) => (
                  <td key={fund.id} className={`td-val ${idx === 0 ? 'td-winner-cell' : ''}`}>
                    <span className={`score-tag ${idx === 0 ? 'score-tag-top' : ''}`}>
                      {fund.score} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* 5-Year Return */}
              <tr>
                <td className="td-label">
                  <span className="metric-name-with-desc">
                    5-Year Return (p.a.)
                    <span className="metric-sub">Annualized 5Y CAGR</span>
                  </span>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className={`td-val ${fund.isBest.return5Y ? 'cell-best' : ''}`}>
                    <span className="value-number">{fund.return5Y}%</span>
                    {fund.isBest.return5Y && <span className="badge-best-tag">Highest</span>}
                  </td>
                ))}
              </tr>

              {/* 3-Year Return */}
              <tr>
                <td className="td-label">
                  <span className="metric-name-with-desc">
                    3-Year Return (p.a.)
                    <span className="metric-sub">Annualized 3Y CAGR</span>
                  </span>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className={`td-val ${fund.isBest.return3Y ? 'cell-best' : ''}`}>
                    <span className="value-number">{fund.return3Y}%</span>
                    {fund.isBest.return3Y && <span className="badge-best-tag">Highest</span>}
                  </td>
                ))}
              </tr>

              {/* 1-Year Return */}
              <tr>
                <td className="td-label">
                  <span className="metric-name-with-desc">
                    1-Year Return
                    <span className="metric-sub">Absolute trailing 12M</span>
                  </span>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className="td-val">
                    <span className="value-number">{fund.return1Y}%</span>
                  </td>
                ))}
              </tr>

              {/* Expense Ratio with Tooltip */}
              <tr>
                <td className="td-label">
                  <Tooltip text="The annual percentage fee charged by the fund management team. A lower expense ratio means more of your investment capital stays invested and compounds over time.">
                    <span className="metric-with-tooltip">
                      Expense Ratio
                      <span className="metric-sub">Lower is better</span>
                    </span>
                  </Tooltip>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className={`td-val ${fund.isBest.expenseRatio ? 'cell-best' : ''}`}>
                    <span className="value-number">{fund.expenseRatio}%</span>
                    {fund.isBest.expenseRatio && <span className="badge-best-tag">Lowest Fee</span>}
                  </td>
                ))}
              </tr>

              {/* Sharpe Ratio with Tooltip */}
              <tr>
                <td className="td-label">
                  <Tooltip text="Measures risk-adjusted return. A higher Sharpe ratio means the fund generates better returns for each unit of risk taken beyond a risk-free benchmark.">
                    <span className="metric-with-tooltip">
                      Sharpe Ratio
                      <span className="metric-sub">Higher is better</span>
                    </span>
                  </Tooltip>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className={`td-val ${fund.isBest.sharpeRatio ? 'cell-best' : ''}`}>
                    <span className="value-number">{fund.sharpeRatio}</span>
                    {fund.isBest.sharpeRatio && <span className="badge-best-tag">Best Risk-Adjusted</span>}
                  </td>
                ))}
              </tr>

              {/* Standard Deviation with Tooltip */}
              <tr>
                <td className="td-label">
                  <Tooltip text="Measures volatility or price swings. A lower standard deviation indicates more stable, consistent returns with less unpredictability.">
                    <span className="metric-with-tooltip">
                      Standard Deviation
                      <span className="metric-sub">Lower volatility is better</span>
                    </span>
                  </Tooltip>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className={`td-val ${fund.isBest.stdDev ? 'cell-best' : ''}`}>
                    <span className="value-number">{fund.stdDev}%</span>
                    {fund.isBest.stdDev && <span className="badge-best-tag">Lowest Volatility</span>}
                  </td>
                ))}
              </tr>

              {/* AUM */}
              <tr>
                <td className="td-label">
                  <span className="metric-name-with-desc">
                    AUM (Size)
                    <span className="metric-sub">Total Assets Under Mgmt</span>
                  </span>
                </td>
                {scoredFunds.map((fund) => (
                  <td key={fund.id} className="td-val">
                    <span className="value-number">₹{fund.aumCr.toLocaleString()} Cr</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons to Re-configure */}
      <div className="step-actions split">
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToFunds}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Change Selected Funds</span>
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToRisk}
        >
          <span>Change Risk Preference</span>
        </button>
      </div>
    </section>
  );
}
