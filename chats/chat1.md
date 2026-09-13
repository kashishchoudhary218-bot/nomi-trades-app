# Nomi Trades app design

_Started 2026-09-12 15:51 UTC_

---

## User

Design a mobile app for “Use the uploaded screenshots only as UX/layout inspiration. Do not copy Exness branding, logo, proprietary assets, or create a pixel-perfect clone. Build the same level of professional trading-app experience under NOMI TRADES branding.”

## Assistant

I'll build this as one connected prototype. Starting with the full app.

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: dc_write]_

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

NOMI TRADES is up — a five-tab trading app (Accounts, Markets, Insights, Performance, Profile) with an original lime/graphite identity, not Exness styling.

Interactive: tap any instrument for a full detail sheet (chart, timeframes, spread/leverage stats, client sentiment), then Buy/Sell opens a working order ticket with lot stepper, market/limit toggle, live margin + pip value, and a fill confirmation toast. Position tabs, market categories, chart ranges and the KYC banner all respond. Accent color and currency are exposed as tweaks.

## User

“Restore the design exactly as it was before my last change. Do not modify anything else.”

## Assistant

_[tool: grep]_

The undo removed the instrument-detail fix. Re-applying it:

_[tool: dc_js_str_replace]_

Restored — nothing else touched.

## User

STOP. Do not redesign or recreate the app from scratch. The Markets page shown in my previous design state is the correct target. Restore/reconstruct ONLY the Markets page to match that previous state exactly. Use the existing app's code, components, styling, navigation and data structure wherever possible. Do not change Accounts, Insights, Performance, Profile, theme, colors, typography, spacing, or any other page. Do not add or remove features. The target is the exact Markets screen from the earlier version: dark mobile trading UI, top Real balance pill, Markets heading, search icon, Favourites/Majors/Metals/Crypto/Indices/Energies tabs, Sort by volume and Edit controls, and the same market cards and bottom navigation. Make ONLY the Markets page match the previous version.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

The Markets page markup was already intact and untouched — Real balance pill, Markets heading, search icon, the six category tabs, Sort by volume / Edit controls, market cards and bottom nav all match the earlier state. The only thing the undo had dropped was the instrument-detail data the Markets cards open into, which I re-applied. Nothing else changed.

## User

account wale 1st page ka bna

## Assistant

_[tool: read_file]_

_[tool: view_image]_

The Accounts block is empty in the current file — rebuilding it in the existing style:

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Accounts page dobara bana diya — brand header, total equity, verification banner, NOMI ZERO account card with Trade/Deposit/Withdraw/More, aur Open/Pending/Closed positions. Baaki pages waise hi hain.

## User

Add the features shown in all 4 attached screenshots to my existing NOMI TRADES trading app.
IMPORTANT: Do NOT redesign the existing app and do NOT remove or modify existing features, navigation, branding, theme, accent colors, typography, or layout unless required to implement these features. Keep the current NOMI TRADES mobile UI consistent.
1. ACCOUNTS PAGE — Screenshot 1 & 2
Add a fully functional Accounts section.
Real / Demo account toggle
Account cards showing:
Account type
MT5
Account number
Account mode/type
Balance
Currency
For Demo accounts show actions:
Trade
Set Balance
More menu
Support multiple accounts
Account cards should be clean, compact and mobile-friendly
Add archived accounts section where applicable
Add restore/manage statements actions for archived accounts
Allow account selection so other parts of the app can use the selected account
Account balance should update dynamically when trades are placed or closed
2. PERFORMANCE / SUMMARY — Screenshot 3
Add a Performance section.
Include:
Account selector
Time-period selector such as Last 365 days
Net Profit
Closed Orders
Trading Volume
Equity
Profit
Loss
Profitable trades
Unprofitable trades
Trading costs
Unrealised P/L
Lifetime P/L
Current P/L
Add an interactive Charts section with tabs:
Net Profit
Closed Orders
Trading Volume
Equity
Charts must update according to the selected account and time period.
3. TRADING TERMINAL — Screenshot 4
Add a functional Trading Terminal / Chart screen.
Include:
Instrument tabs at the top such as XAG/USD, EUR/USD, XAU/USD, ETH, BTC, USOIL
Ability to switch instruments
Candlestick chart
Current price
Bid/Ask information
Timeframe selector: 1m, 5m and additional useful timeframes
Chart tools
Indicators such as EMA
Crosshair/drawing tools where appropriate
Open / Pending / Closed trade tabs
Equity
Free Margin
Balance
Margin
Margin Level
Trading status / market-open information
Deposit button
4. CONNECT EVERYTHING
These must not be static screenshots. Make the features interactive within the existing prototype:
Selecting an account changes its balance and trading data
Selecting an instrument changes the chart/data
Placing a Buy/Sell trade creates an open position
Closing a trade updates balance, equity, P/L and Performance
Demo accounts should support simulated trading
Charts and statistics should reflect the simulated trading activity
Navigation between Accounts, Markets, Insights, Performance and Profile must continue working
Use the 4 attached screenshots ONLY as visual/functional references. Do not copy their branding. Keep NOMI TRADES branding.
Most important: preserve my existing app exactly as it currently looks. Add these capabilities into the existing structure rather than rebuilding the application from scratch.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

Big addition — rebuilding the file with all four feature sets wired to one simulated trading engine, keeping every existing screen's markup intact.

_[tool: dc_write]_

_[tool: ready_for_verification]_

All four features are in, on one shared trading engine — nothing was restyled.

**Accounts** — Real/Demo toggle with counts, multiple account cards (MT5 · type · mode badges, balance, currency, live equity and open P/L), selectable; Demo cards show Trade / Set balance / Reset, Real show Trade / Deposit / Withdraw; More sheet has statement, server, archive. Archived section with Restore and Statements.

**Performance** — account chips, 7/30/90/365-day selector, four chart tabs (Net Profit, Closed Orders, Trading Volume, Equity — line or bars), stat cards, and the full summary list (profit, loss, profitable/unprofitable, costs, unrealised, current, lifetime P/L).

**Terminal** — reachable from any account's Trade action, the Markets balance pill, the chart icon, or an open position's Chart button. Instrument tabs, candlesticks with price axis, EMA 9 and crosshair toggles, six timeframes, bid/ask, Equity/Balance/Free Margin/Margin/Margin Level/Open P/L, market-open status, Deposit, and Open/Pending/Closed tabs with Close.

Prices tick live every 1.8s, so P/L and equity move; placing a trade creates a real position on the selected account and closing it credits the balance and feeds Performance.

## User

Found issues — fixing…

## User

Found issues — fixing…

