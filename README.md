````markdown
# 📈 Stock Grader - Interactive Stock Analysis Tool

A modern, browser-based stock grading application that uses a **dual-scoring system** to evaluate stocks based on business quality and investment opportunity. Metrics are **automatically fetched from financial APIs** and can be manually adjusted for personalized analysis.

![Stock Grader](https://img.shields.io/badge/React-18-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Core Functionality
- ✅ **Dual Scoring System**: Separate Business Quality (0-60) from Investment Opportunity (0-40)
- ✅ **Auto-Fetch Financial Data**: Automatically retrieves objective metrics from Finnhub & Alpha Vantage APIs
- ✅ **Real-time Scoring**: Live score updates as you adjust metrics
- ✅ **Smart Recommendations**: Automatic buy/hold/avoid recommendations based on scores
- ✅ **Local Storage**: Save/load grades without cloud account
- ✅ **Export Options**: Download grades as JSON or CSV
- ✅ **No Installation Required**: Runs on GitHub Pages or locally

### Metrics Included

**Business Quality (0-60 pts)**
- Revenue Growth (YoY)
- EPS Growth (YoY)
- Gross Margin Trend
- Operating Margin Trend
- Return on Equity (ROE)
- Balance Sheet Health (Net Debt/EBITDA)
- Share Count Trend
- Capital Allocation (Dividends + Buybacks)
- Industry Relative Strength
- Risk Deductions

**Investment Opportunity (0-40 pts)**
- Distance from 52-week High
- Valuation Discount vs Historical Average
- Insider Buying Activity
- Analyst Revisions
- Post-Earnings Reaction
- Margin of Safety
- Moving Averages (50/150/200 DMA)
- Technical Strength & Volume

---

## 🚀 Quick Start

### Option 1: Use Online (No Installation)
Visit: **https://GamersUp.github.io/stock-grader**

That's it! The app runs entirely in your browser.

### Option 2: Run Locally

**Prerequisites:**
- Node.js (v14+) - [Download here](https://nodejs.org/)
- Git

**Steps:**

```bash
# Clone the repository
git clone https://github.com/GamersUp/stock-grader.git
cd stock-grader

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

---

## 🔑 API Keys (Optional but Recommended)

The app works with or without API keys, but fetching financial data requires:

### Getting Free API Keys

1. **Finnhub** (Financial Metrics)
   - Go to: https://finnhub.io
   - Sign up for free account
   - Copy your API key
   - Create `.env.local` in project root
   - Add: `REACT_APP_FINNHUB_API_KEY=your_key_here`

2. **Alpha Vantage** (Technical Analysis)
   - Go to: https://www.alphavantage.co
   - Sign up for free account
   - Copy your API key
   - Add to `.env.local`: `REACT_APP_ALPHA_VANTAGE_API_KEY=your_key_here`

**Example `.env.local`:**
```
REACT_APP_FINNHUB_API_KEY=c123abc456def789ghi
REACT_APP_ALPHA_VANTAGE_API_KEY=Z9Z8X7X6W5W4
```

**Note:** The demo keys work but have rate limits. Free tier is usually sufficient for personal use.

---

## 📖 How to Use

### 1. Fetch Financial Data (Recommended)
- Enter a stock ticker (e.g., AAPL, MSFT, TSLA)
- Click "📊 Fetch Data"
- Wait 1-2 seconds for metrics to auto-populate
- Adjust subjective metrics as needed

### 2. Manual Entry
- Enter ticker and company name manually
- Adjust all metrics with sliders
- See live score updates

### 3. Review Results
- **Quality Score** shows business fundamentals
- **Opportunity Score** shows valuation & technical setup
- **Recommendation** summarizes the analysis

### 4. Save & Export
- Click "💾 Save Grade" to store locally
- Export as JSON (for backup) or CSV (for spreadsheet analysis)

### 5. Load Previous Grades
- Saved grades appear in "📚 Saved Grades" section
- Click "Load" to review past analysis
- Click "Delete" to remove

---

## 🎯 Scoring Logic

### Recommendation Matrix

| Quality | Opportunity | Recommendation |
|---------|-------------|-----------------|
| ≥80% | ≥70% | 🟢 **STRONG BUY** |
| ≥80% | ≥50% | 🟢 **BUY** |
| ≥70% | ≥70% | 🟢 **BUY** |
| ≥60% | ≥50% | 🟡 **HOLD** |
| <50% | ≥75% | 🔴 **AVOID** (Value Trap) |
| ≥80% | <40% | 🟡 **WAIT** (Overpriced) |
| Other | Other | 🔴 **AVOID** |

### Auto-Populated Metrics

When you fetch data, the app automatically calculates:

- **Revenue Growth**: Based on 5-year historical data
- **EPS Growth**: Based on 5-year historical data
- **ROE**: Return on equity from latest financials
- **P/E Ratio**: Current price-to-earnings ratio
- **52-Week Range**: Highest and lowest prices over past year
- **Technical Indicators**: 
  - Moving averages (50, 150, 200 day)
  - RSI (Relative Strength Index)
  - Volume trends

---

## 📊 Data Sources

| Metric Type | Source | API |
|-------------|--------|-----|
| Financial Metrics | Finnhub | HTTP REST API |
| Technical Analysis | Alpha Vantage | HTTP REST API |
| Local Storage | Browser | localStorage |

All data is fetched in real-time. Historical grades are stored locally in your browser (not on cloud).

---

## 🛠️ Customization

### Modify Score Thresholds
Edit `src/utils/calculations.ts`:

```typescript
export const getRecommendation = (
  qualityScore: number,
  opportunityScore: number
): string => {
  const qualityPercentage = (qualityScore / 60) * 100;
  const opportunityPercentage = (opportunityScore / 40) * 100;

  if (qualityPercentage >= 80 && opportunityPercentage >= 70) {
    return '🟢 STRONG BUY - High quality, strong opportunity';
  }
  // ... modify thresholds here
};
```

### Change UI Colors
Edit `tailwind.config.js` or modify className colors in components.

### Add Custom Metrics
1. Update `src/types/stock.ts` with new fields
2. Add components in `src/components/`
3. Update calculation logic in `src/utils/calculations.ts`

---

## 📱 Browser Support

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (responsive design)

---

## 🚀 Deployment to GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
Already done! Check your `homepage` field:
```json
"homepage": "https://GamersUp.github.io/stock-grader"
```

### Step 3: Build & Deploy
```bash
npm run deploy
```

Your app will be live at: `https://GamersUp.github.io/stock-grader`

### Step 4: GitHub Pages Settings (Optional)
1. Go to repo Settings → Pages
2. Verify "Build and deployment" is set to "Deploy from a branch"
3. Branch should be `gh-pages` (auto-created)

---

## 💾 Data Persistence

All your saved grades are stored locally in your browser using `localStorage`. This means:

✅ **No cloud account needed**
✅ **Your data stays private**
✅ **Works offline**
❌ **Data lost if browser cache is cleared**

To backup: Export your grades as JSON files.

---

## 🐛 Troubleshooting

### API Key Not Working
```
Error: "Unable to fetch complete data"
```
- Verify API key is correct at Finnhub.io or AlphaVantage.co
- Check rate limits (free tier: ~5 calls/min)
- Try again in a minute
- Works without keys (uses demo mode)

### Port 3000 Already in Use
```bash
# Kill existing process (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Grades Not Saving
- Check browser localStorage is enabled
- Try clearing cache and reloading
- Different browsers have separate storage

---

## 📚 Project Structure

```
stock-grader/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── QualityScores.tsx
│   │   ├── OpportunityScores.tsx
│   │   ├── SummaryDashboard.tsx
│   │   ├── DataFetcher.tsx
│   │   └── MetricInputs.tsx
│   ├── services/
│   │   ├── finnhubApi.ts
│   │   └── technicalAnalysisApi.ts
│   ├── types/
│   │   └── stock.ts
│   ├── utils/
│   │   └── calculations.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.example
```

---

## 🤝 Contributing

Contributions welcome! To add features:

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- **Finnhub** - Financial data API
- **Alpha Vantage** - Technical analysis data
- **React** - UI framework
- **Tailwind CSS** - Styling

---

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Check existing issues for solutions
- Verify API keys are set correctly

---

## 🎓 Educational Note

This tool is designed for **educational purposes and personal investment research**. Always do your own due diligence and consult with a financial advisor before making investment decisions.

**Disclaimer:** This app provides analysis tools only. Not financial advice. Past performance ≠ future results.

---

**Happy investing! 📈**
````
