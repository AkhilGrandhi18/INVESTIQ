import React, { useState, useMemo } from 'react';

/**
 * Step 1: Fund Selection Component
 * Supports search, individual selection (2 to 5 funds), category quick-picks, and validation states.
 */
export default function StepFundSelection({
  allFunds,
  selectedFundIds,
  setSelectedFundIds,
  onProceed,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap'];

  // Filter list based on search and optional category tab filter
  const filteredFunds = useMemo(() => {
    return allFunds.filter((fund) => {
      const matchesSearch =
        fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All' || fund.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allFunds, searchTerm, categoryFilter]);

  const selectedCount = selectedFundIds.length;
  const isTooFew = selectedCount < 2;
  const isMaxReached = selectedCount >= 5;

  // Toggle single fund selection with limits (2 to 5)
  const toggleFund = (fundId) => {
    if (selectedFundIds.includes(fundId)) {
      setSelectedFundIds(selectedFundIds.filter((id) => id !== fundId));
    } else {
      if (isMaxReached) {
        return; // Prevent selecting more than 5
      }
      setSelectedFundIds([...selectedFundIds, fundId]);
    }
  };

  // Quick-select all 3 funds from a specific category
  const selectAllInCategory = (catName) => {
    const categoryFunds = allFunds.filter((f) => f.category === catName);
    const categoryIds = categoryFunds.map((f) => f.id);
    setSelectedFundIds(categoryIds);
  };

  const clearSelection = () => {
    setSelectedFundIds([]);
  };

  return (
    <section className="step-container" aria-labelledby="step-1-title">
      <div className="step-header-row">
        <div>
          <span className="step-pill">Step 1 of 3</span>
          <h1 id="step-1-title" className="step-title">Select Mutual Funds to Compare</h1>
          <p className="step-subtitle">
            Choose between <strong>2 and 5 mutual funds</strong> to evaluate, or click a category shortcut to auto-select funds within that peer group.
          </p>
        </div>

        {/* Selected Counter Badge */}
        <div className={`selection-status-badge ${isTooFew ? 'status-warning' : 'status-success'}`}>
          <span className="count-number">{selectedCount}</span>
          <span className="count-label">/ 5 funds selected</span>
        </div>
      </div>

      {/* Category Quick-Select Shortcuts */}
      <div className="quick-select-bar">
        <span className="quick-select-label">Quick select by category:</span>
        <div className="quick-buttons-row">
          {['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap'].map((cat) => (
            <button
              key={cat}
              type="button"
              className="btn-quick-cat"
              onClick={() => selectAllInCategory(cat)}
              title={`Auto-select all 3 ${cat} funds`}
            >
              + {cat} Group
            </button>
          ))}
          {selectedCount > 0 && (
            <button
              type="button"
              className="btn-clear"
              onClick={clearSelection}
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-controls-row">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="fund-search-input"
            type="text"
            className="search-input"
            placeholder="Search by fund name (e.g. Bluechip, Midcap, Small Cap)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="category-tabs" role="tablist" aria-label="Category filter">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={categoryFilter === cat}
              className={`cat-tab ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Message Banners */}
      {isTooFew && (
        <div className="alert-box alert-info" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <strong>Selection required:</strong> Please select at least <strong>{2 - selectedCount} more fund{selectedCount === 1 ? '' : 's'}</strong> to proceed (2 to 5 funds required for ranking).
          </div>
        </div>
      )}

      {isMaxReached && (
        <div className="alert-box alert-success" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <strong>Maximum reached:</strong> You have selected 5 funds. Deselect one if you wish to choose a different fund.
          </div>
        </div>
      )}

      {/* Funds Grid */}
      <div className="funds-grid" role="group" aria-label="Fund selection cards">
        {filteredFunds.map((fund) => {
          const isSelected = selectedFundIds.includes(fund.id);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <div
              key={fund.id}
              className={`fund-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && toggleFund(fund.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === ' ' || e.key === 'Enter') && !isDisabled) {
                  e.preventDefault();
                  toggleFund(fund.id);
                }
              }}
            >
              <div className="card-top">
                <span className={`cat-pill cat-${fund.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {fund.category}
                </span>
                <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              <h2 className="fund-name">{fund.name}</h2>

              <div className="fund-stats-preview">
                <div className="stat-item">
                  <span className="stat-label">5Y Return</span>
                  <span className="stat-val highlight-green">{fund.return5Y}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Expense</span>
                  <span className="stat-val">{fund.expenseRatio}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sharpe</span>
                  <span className="stat-val">{fund.sharpeRatio}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">AUM</span>
                  <span className="stat-val">₹{fund.aumCr.toLocaleString()} Cr</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFunds.length === 0 && (
        <div className="empty-state">
          <p>No funds found matching "{searchTerm}". Try clearing your search.</p>
          <button type="button" className="btn-secondary" onClick={() => setSearchTerm('')}>
            Reset Search
          </button>
        </div>
      )}

      {/* Floating Action Bar / Next Button */}
      <div className="step-actions">
        <button
          id="btn-to-risk-step"
          type="button"
          className="btn-primary"
          disabled={isTooFew}
          onClick={onProceed}
        >
          <span>Continue to Risk Preference</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
