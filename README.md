# INVESTIQ

> **Which fund deserves your money?** A smart, transparent mutual fund decision engine for Indian retail investors.

---

## 📌 Project Overview & The Problem It Solves

Indian retail investors face analysis paralysis when choosing mutual funds. With hundreds of schemes advertised based on short-term past returns, retail investors frequently overlook **risk-adjusted performance (Sharpe Ratio)**, **fund volatility (Standard Deviation)**, and **ongoing fee burdens (Expense Ratio)**.

**INVESTIQ** solves this problem by allowing retail investors to compare 2 to 5 shortlisted funds side-by-side and calculate an objective composite score (0–100) calibrated to the investor's personal risk tolerance (Low, Moderate, or High).

---

## ✨ Features

- **Peer Cohort Selection (2 to 5 funds)**: Search and hand-pick funds or use one-click category quick-selects (`Large Cap`, `Mid Cap`, `Small Cap`, `Flexi Cap`).
- **Dynamic Risk Preference Modes**:
  - **Low (Conservative)**: Prioritizes volatility protection (Standard Deviation: 25%) and risk efficiency (Sharpe: 35%).
  - **Moderate (Balanced)**: Balanced 40% returns, 25% Sharpe, 20% expense ratio, 15% standard deviation.
  - **High (Aggressive)**: Maximizes multi-year compounding power (60% returns).
- **Side-by-Side Comparison Table**: Clear matrix evaluating 1Y, 3Y, and 5Y CAGR, Expense Ratio, Sharpe Ratio, Standard Deviation, and AUM with green highlights for top metrics.
- **Educational Tooltips**: Accessible, jargon-free explanations for financial metrics (Sharpe Ratio, Standard Deviation, Expense Ratio).
- **Top Fund Recommendation ("Best Match")**: Highlights the top-scoring fund with plain-English rationales generated from its standout data points (e.g. *"Lowest expense ratio and highest 5-year annualized return among your selected funds"*).
- **Zero Backend / Ultra-Fast**: Runs entirely client-side with zero external network requests or tracking.

---

## 🧮 How the Scoring Works

All scoring logic is implemented in [`src/utils/scoring.js`](src/utils/scoring.js):

1. **Min-Max Cohort Normalization**:
   For the selected 2 to 5 funds, each metric is normalized between `0.0` and `1.0`:
   - **Higher is Better** (5Y Return, 3Y Return, Sharpe Ratio):
     $$\text{Norm} = \frac{\text{Value} - \text{Min}}{\text{Max} - \text{Min}}$$
   - **Lower is Better** (Expense Ratio, Standard Deviation):
     $$\text{Norm} = \frac{\text{Max} - \text{Value}}{\text{Max} - \text{Min}}$$

2. **Weighted Composite Score**:
   Normalized scores are multiplied by risk-adjusted weights and converted to a `0–100` scale:

   | Metric | Low Risk (Conservative) | Moderate Risk (Default) | High Risk (Aggressive) |
   | :--- | :---: | :---: | :---: |
   | **5-Year Return** | 12% | 25% | 35% |
   | **3-Year Return** | 8% | 15% | 25% |
   | **Sharpe Ratio** | 35% | 25% | 15% |
   | **Expense Ratio** | 20% | 20% | 15% |
   | **Standard Deviation** | 25% | 15% | 10% |
   | **Total** | **100%** | **100%** | **100%** |

3. **Plain-English Recommendation Reason**:
   The engine detects the highest-scoring fund's standout winning metrics relative to the chosen cohort and produces a contextual justification.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern custom design system tokens (responsive, dark/light contrast)
- **Data Source**: Local illustrative JSON dataset ([`src/data/funds.json`](src/data/funds.json))
- **No external UI libraries or heavy dependencies**

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Launch

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/investiq.git
   cd investiq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at the URL shown (typically `http://localhost:5173`).

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
investiq/
├── public/
│   └── favicon.svg           # Application SVG favicon
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Mandatory educational disclaimer & footer
│   │   ├── Header.jsx        # Brand, tagline, demo notice & step navigation
│   │   ├── StepFundSelection.jsx # Step 1: Fund search, categories & limits
│   │   ├── StepRiskSelector.jsx  # Step 2: Low/Moderate/High risk selector
│   │   ├── StepResults.jsx   # Step 3: Leaderboard, Best Match & Comparison Table
│   │   └── Tooltip.jsx       # Plain-language explanation popovers
│   ├── data/
│   │   └── funds.json        # 12 illustrative funds across 4 categories
│   ├── utils/
│   │   └── scoring.js        # Min-max normalization and ranking engine
│   ├── App.jsx               # Application root and state coordination
│   ├── index.css             # Unified modern CSS design system
│   └── main.jsx              # DOM entrypoint
├── index.html                # HTML template with SEO meta tags
├── LICENSE                   # MIT License
├── package.json              # Scripts and dependencies
└── vite.config.js            # Vite configuration
```

---

## ⚠️ Limitations / Not Included

- **No live API / NAV feeds**: All fund metrics are loaded from a static local demo dataset.
- **No user accounts / authentication**: No logins, passwords, or personal profile data storage.
- **No portfolio tracking**: Does not track existing holdings, transaction history, or capital gains.
- **No transaction execution**: Does not execute trades, SIP debits, or KYC verification.
- **No tax optimization**: Does not compute STCG, LTCG, or indexation benefits.

---

## 🔮 Future Work

- **Live AMFI & Morningstar API Integration**: Fetch daily real-time NAVs, rolling returns, and updated portfolio holdings.
- **Investor Accounts & Shortlists**: Save comparison sets and receive alerts on fund manager changes or rating downgrades.
- **B2B Advisory API & Embeddable Widget**: Provide registered investment advisors (RIAs) with branded white-label widgets.
- **Category Deep Dives**: Expand beyond equity into Hybrid, Debt, and Index/ETF funds.

---

## 📜 Sample Data & Regulatory Disclaimer

> **Sample Data Notice**: All data in this application is for demonstration and prototype evaluation only. It does not reflect live or verified mutual fund figures.
>
> **Disclaimer**: INVESTIQ is an educational comparison tool and does not provide personalised investment advice. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
