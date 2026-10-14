import React from 'react';

/**
 * INVESTIQ Application Footer with mandatory regulatory and educational disclaimer
 */
export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="disclaimer-card" role="note">
          <div className="disclaimer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="disclaimer-text">
            <strong>Disclaimer: </strong>
            INVESTIQ is an educational comparison tool and does not provide personalised investment advice. Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing.
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-meta">
            <span className="footer-brand">INVESTIQ</span>
            <span>•</span>
            <span>Open Source Educational Prototype</span>
            <span>•</span>
            <span>All fund metrics shown are illustrative sample data.</span>
          </div>
          <div className="footer-links">
            <span className="license-tag">MIT Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
