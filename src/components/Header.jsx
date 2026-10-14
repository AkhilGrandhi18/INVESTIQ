import React from 'react';

/**
 * INVESTIQ Application Header with brand, tagline, sample data banner, and step indicator
 */
export default function Header({ currentStep, setStep, selectedCount }) {
  const steps = [
    { id: 1, label: "1. Select Funds", disabled: false },
    { id: 2, label: "2. Choose Risk", disabled: selectedCount < 2 },
    { id: 3, label: "3. See Result", disabled: selectedCount < 2 },
  ];

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 20L9 12L14 17L21 6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6H21V11" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-name">INVESTIQ</span>
              <span className="badge-prototype">Prototype</span>
            </div>
            <p className="brand-tagline">Which fund deserves your money?</p>
          </div>
        </div>

        {/* Prominent Sample Data Notice */}
        <div className="sample-data-notice" role="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Sample data for demonstration only. Not real fund data.</span>
        </div>
      </div>

      {/* 3 Steps Navigation */}
      <nav className="stepper-nav" aria-label="Progress steps">
        {steps.map((s) => {
          const isActive = currentStep === s.id;
          const isPassed = currentStep > s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`step-tab ${isActive ? "active" : ""} ${isPassed ? "completed" : ""} ${s.disabled ? "disabled" : ""}`}
              onClick={() => !s.disabled && setStep(s.id)}
              disabled={s.disabled}
            >
              <span className="step-number">{s.id}</span>
              <span className="step-label">{s.label.split(". ")[1]}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
