# NOMI TRADES

A React Native (Expo, TypeScript) implementation of the NOMI TRADES mobile trading app design,
built from the Claude Design prototype in `../project/Nomi Trades.dc.html`.

**This is a demo/simulated-trading foundation.** There is no real money, no live broker
connection, and no real financial accounts — everything (accounts, prices, positions, P/L)
is generated and mutated entirely on-device. See "Adding a real backend" below for how this
is meant to evolve.

## Running it

```
npm install
npm run ios      # or: npm run android / npm run web
```

Requires the Expo Go app (or a simulator) to preview on a device.

## Architecture

```
src/
  theme/       colors, fonts, typography — ported 1:1 from the design's palette
  types/       domain types (Account, Position, ClosedTrade, Instrument, ...)
  data/        static seed content (instrument catalog, seed accounts, profile menu, calendar)
  engine/      pure functions: chart-path math, P/L & margin formulas, performance
               aggregation, formatting — no React, no state, fully unit-testable
  store/       useTradingStore (zustand) — the single source of app state and the
               only place that mutates it. Simulates a live price feed on an interval.
  navigation/  bottom tab navigator + custom tab bar
  screens/     the 5 tabs: Accounts, Markets, Insights, Performance, Profile
  components/  presentational pieces (cards, rows, charts) and full-screen overlays
               (Terminal, instrument detail, order ticket, action sheet, toast)
```

State flows one way: screens/overlays read from `useTradingStore` and call its actions;
the store is the only thing that mutates state. Derived numbers (P/L, equity, margin,
performance rollups, chart paths) live in `src/engine/*` as pure functions rather than
inline in components, so they're reusable and testable independent of React.

## What's implemented

- **Accounts** — Real/Demo toggle, multiple accounts, per-account Trade/Deposit-or-Set-balance/
  Withdraw-or-Reset/More actions, archive & restore, Open/Pending/Closed positions.
- **Markets** — category tabs, live-ticking instrument list with sparklines.
- **Trading Terminal** — instrument switcher, candlestick chart with EMA(9) and crosshair,
  timeframes, account metrics (equity/margin/free margin/margin level), open/closed trades.
- **Instrument detail sheet** — price chart, spread/leverage/day-range stats, Buy/Sell.
- **Order ticket** — Market/Limit, lot stepper + presets, live margin calc, fill confirmation.
- **Performance** — per-account, per-period stats, 4 chart modes, win-rate by instrument.
- **Insights** — top movers, desk signals, economic calendar (static editorial content).
- **Profile** — static account/wallet/support menu matching the design.

All trading is simulated: prices drift on a client-side interval (`src/store/useTradingStore.ts`,
`startPriceFeed`), and placing/closing an order only ever mutates local store state.

## Adding a real backend / regulated broker later

The simulated trading engine is intentionally isolated behind the zustand store's action
functions (`confirmOrder`, `closePosition`, `setDemoBalance`, price ticking, etc.) and the
pure `src/engine/*` P&L/margin math. To move to a real backend:

1. Replace the seed data in `src/data/` with API-fetched account/instrument data.
2. Replace `startPriceFeed`'s local `setInterval` drift with a WebSocket/SSE price feed.
3. Replace the store actions that mutate `positions`/`accounts`/`closed` directly with calls
   to a broker/order-management API, updating local state from the server's response/push
   instead of computing it client-side.
4. The `Account.mode` field (`'Real' | 'Demo'`) is already modeled — real-money accounts should
   gate on KYC/verification status (`kyc` state, currently a placeholder) before enabling
   `confirmOrder` for `Real` accounts.

None of the screens/overlays need to change for this — they only depend on the store's
shape, not on how it's populated.
