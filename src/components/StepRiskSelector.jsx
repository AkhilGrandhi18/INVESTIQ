import React from 'react';
import { RISK_WEIGHTS } from '../utils/scoring';

/**
 * Step 2: Risk Preference Selector
 * Lets the retail investor choose between Low, Moderate, and High risk,
 * visually demonstrating how weights shift between returns, volatility, and fees.
 */
export default function StepRiskSelector({
  riskPreference,
  setRiskPreference,
  selectedFunds,
  onBack,
  onProceed,
}) {
  const options = [
    {
      id: 'Low',
      title: 'Low Risk',
      tag: 'Conservative',
      desc: 'You care most about capital stability and low volatility. Higher emphasis on Standard Deviation and Sharpe Ratio.',
      weightSummary: 'Returns: 20% | Sharpe: 35% | Expense: 20% | Std Dev: 25%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'Moderate',
      title: 'Moderate Risk',
      tag: 'Balanced (Default)',
      desc: 'Balanced long-term compounding with healthy risk management. Ideal for typical retail wealth creation.',
      weightSummary: 'Returns: 40% | Sharpe: 25% | Expense: 20% | Std Dev: 15%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      id: 'High',
      title: 'High Risk',
      tag: 'Aggressive Growth',
      desc: 'You prioritize maximum return generation over 3-5 years and can tolerate market swings and short-term drawdowns.',
      weightSummary: 'Returns: 60% | Sharpe: 15% | Expense: 15% | Std Dev: 10%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="step-container" aria-labelledby="step-2-title">
      <div className="step-header-row">
        <div>
          <span className="step-pill">Step 2 of 3</span>
          <h1 id="step-2-title" className="step-title">Choose Your Risk Preference</h1>
          <p className="step-subtitle">
            INVESTIQ adjusts the scoring formula based on your tolerance for price swings versus desire for maximum returns.
          </p>
        </div>
      </div>

      {/* Selected Funds Pill Bar */}
      <div className="selected-funds-recap">
        <span className="recap-label">Selected Funds ({selectedFunds.length}):</span>
        <div className="recap-chips">
          {selectedFunds.map((fund) => (
            <span key={fund.id} className="fund-chip">
              {fund.name}
              <span className="chip-cat">{fund.category}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Risk Profile Selection Cards */}
      <div className="risk-options-grid" role="radiogroup" aria-label="Risk preference options">
        {options.map((opt) => {
          const isSelected = riskPreference === opt.id;
          return (
            <div
              key={opt.id}
              className={`risk-card ${isSelected ? 'active' : ''}`}
              onClick={() => setRiskPreference(opt.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setRiskPreference(opt.id);
                }
              }}
            >
              <div className="risk-card-header">
                <div className="risk-icon-wrapper">{opt.icon}</div>
                <div className="risk-card-title-group">
                  <h2 className="risk-title">{opt.title}</h2>
                  <span className="risk-tag">{opt.tag}</span>
                </div>
                <div className={`radio-dot ${isSelected ? 'selected' : ''}`} />
              </div>

              <p className="risk-desc">{opt.desc}</p>

              <div className="weights-box">
                <span className="weights-box-label">Scoring Weights Formula</span>
                <span className="weights-box-detail">{opt.weightSummary}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="step-actions split">
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Funds</span>
        </button>

        <button
          id="btn-to-results-step"
          type="button"
          className="btn-primary"
          onClick={onProceed}
        >
          <span>Calculate Scores & View Result</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
