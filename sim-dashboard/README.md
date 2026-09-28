# Sim Desk — standalone trading-dashboard mockup

A local, offline-capable UI mockup for developing trading-dashboard screens.
**SIMULATION — DEMO DATA.** Every account, number, price and transaction is fictional.
It makes no network requests (other than optionally loading the Poppins web font),
does not connect to any broker, and does not modify any other website.

## Run it

**Option A: just open it**
Double-click `index.html` (or drag it into Chrome, Edge, Firefox or Safari). It uses plain `<script>` files, so it works from `file://`.

**Option B: local server** (recommended if you'll be editing the files)
```bash
cd sim-dashboard
python3 -m http.server 8080      # or: npx serve .
```
Then open http://localhost:8080.

## What's inside

```
sim-dashboard/
├── index.html        layout, overlays (popover, selector, manage drawer, forms)
├── styles.css        design tokens, light/dark, responsive breakpoints
└── js/
    ├── mock-data.js  fictional instruments + accounts, seeded candle generator
    ├── engine.js     mock tick feed, account math, mock orders/funds, localStorage
    ├── chart.js      canvas candlestick chart (zoom, crosshair, live last candle)
    └── app.js        UI wiring: routing, bindings, watchlist, ticket, forms
```

## Features

| Area | Notes |
|---|---|
| Simulation label | Sticky, non-dismissible `SIMULATION — DEMO DATA` banner, `SIMULATION` watermark on the card and chart, and `MOCK` tags on the order ticket |
| Account card | Gradient card, account selector, `+` create, balance with hide/show, P/L pill, Manage / Deposit |
| Account details | Unrealized P/L, Balance, Margin, Free Margin, Margin Level, Credit, Leverage, all computed live |
| Status styles | Green **Simulated** and orange **Practice** styles, switching the card theme with them |
| Account selector | Modal list of mock accounts plus Create New Account |
| Header popover | Account summary with Manage, Switch Account and Create New Account |
| Manage drawer | Equity and stats; Deposit / Withdraw / Transfer (mock funds only); login details (placeholders); leverage; rename; history |
| Markets | Watchlist with group filter and search, flashing ticks, TradingView-style chart with 1m–1D timeframes, OHLC legend, crosshair and wheel zoom |
| One-click order | Sell/Buy at bid/ask, spread, lot stepper, units, required margin; opens mock positions with live P/L and Close |
| Responsive | 3-column desktop → 2-column tablet → stacked mobile, with bottom-sheet modals on phones |
| Persistence | `localStorage` (key `sim-desk-v1`); **Reset data** restores the defaults |

## Development tips

- Set `DEBUG = true` in `js/engine.js` for console logging.
- Add instruments or accounts in `js/mock-data.js`.
- All colors are CSS variables in `:root` at the top of `styles.css`; dark mode follows the OS setting.
