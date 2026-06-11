# Stock Grader

An interactive stock grading system that scores companies based on quality and opportunity metrics. Designed for value investors looking to separate business fundamentals from mispricing opportunities.

## Features

- **Dual Scoring System**: Separate Quality Score (0-60) and Opportunity Score (0-40)
- **Real-time Editing**: Adjust any metric and see live score updates
- **Comprehensive Metrics**: 
  - Business Quality (Revenue Growth, EPS Growth, Margins, ROE, Balance Sheet)
  - Mispricing Opportunity (52-week drawdown, valuation discount, insider buying, analyst revisions, post-earnings reaction)
  - Technical Health (Moving averages, relative strength, accumulation volume)
  - Management (Share count trend, capital returns)
  - Industry Analysis
  - Risk Metrics
  - Margin of Safety Score

- **Local Storage**: Save and load your grades locally (no cloud required)
- **Export**: Download your analysis as JSON or PDF

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GamersUp/stock-grader.git
cd stock-grader
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Enter Stock Ticker**: Type the stock symbol (e.g., AAPL, MSFT)
2. **Input Metrics**: Fill in financial data from your research
3. **Adjust Scores**: Edit individual category scores as needed
4. **View Composite Scores**: See real-time Quality vs. Opportunity scores
5. **Save Your Grade**: Store locally or export for records

## Scoring Breakdown

### Quality Score (0-60 points)
- Revenue Growth (6 pts)
- EPS Growth (6 pts)
- Gross Margin Trend (4 pts)
- Operating Margin Trend (4 pts)
- Return on Equity (5 pts)
- Balance Sheet Health (5 pts)
- Share Count Trend (5 pts)
- Capital Returns (5 pts)
- Industry Relative Strength (5 pts)
- Risk Deductions (0-10 pts)

### Opportunity Score (0-40 points)
- Distance from 52-week High (5 pts)
- Valuation Discount (5 pts)
- Insider Buying (5 pts)
- Analyst Revisions (5 pts)
- Post-Earnings Reaction (5 pts)
- Margin of Safety (5 pts)
- Technical: Moving Averages (3 pts)
- Technical: Relative Strength & Volume (2 pts)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Local Storage API** - Data persistence

## File Structure

```
stock-grader/
├── src/
│   ├── components/
│   │   ├── StockGrader.tsx      # Main application component
│   │   ├── QualityScores.tsx    # Quality scoring section
│   │   ├── OpportunityScores.tsx # Opportunity scoring section
│   │   ├── TechnicalMetrics.tsx  # Technical analysis section
│   │   └── SummaryDashboard.tsx  # Score summary & export
│   ├── types/
│   │   └── stock.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── calculations.ts      # Scoring calculations
│   ├── App.tsx                  # App wrapper
│   ├── index.tsx                # Entry point
│   └── index.css                # Global styles
├── public/
│   └── index.html               # HTML template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Contributing

Feel free to fork and customize this for your own investment strategy.

## License

MIT License - feel free to use this however you like.
