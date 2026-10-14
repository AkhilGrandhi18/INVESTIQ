import React, { useState } from 'react';

/**
 * Accessible Info Tooltip component
 * Displays plain-language financial explanations on hover or tap.
 */
export default function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <button
        type="button"
        className="tooltip-trigger"
        aria-label="More information"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible((prev) => !prev);
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      {isVisible && (
        <span className="tooltip-bubble" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
