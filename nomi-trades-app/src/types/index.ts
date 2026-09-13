export type InstrumentCategory = 'Majors' | 'Metals' | 'Crypto' | 'Indices' | 'Energies';

export interface Instrument {
  sym: string;
  desc: string;
  mark: string;
  tint: string;
  cat: InstrumentCategory;
  /** Seed/reference price the simulated feed drifts around. */
  p0: number;
  /** Decimal places to display for this instrument's price. */
  dec: number;
  /** Multiplier used to turn a price delta into a P/L amount per lot. */
  mult: number;
}

export type AccountMode = 'Real' | 'Demo';

export interface Account {
  id: string;
  label: string;
  num: string;
  type: string;
  mode: AccountMode;
  bal: number;
  curr: string;
  archived: boolean;
}

export type OrderTag = 'MARKET' | 'LIMIT' | 'TP/SL';
export type CloseTag = 'TP HIT' | 'SL HIT' | 'MANUAL';
export type Side = 'Buy' | 'Sell';

export interface Position {
  id: string;
  acc: string;
  sym: string;
  side: Side;
  lots: number;
  entry: number;
  ts: number;
  tag: OrderTag;
}

export interface ClosedTrade {
  id: string;
  acc: string;
  sym: string;
  side: Side;
  lots: number;
  entry: number;
  exit: number;
  pnl: number;
  cost: number;
  ts: number;
  tag: CloseTag;
}

export type PositionTab = 'open' | 'pending' | 'closed';
export type OrderType = 'Market' | 'Limit';
export type PerfTab = 'Net Profit' | 'Closed Orders' | 'Trading Volume' | 'Equity';
export type PerfPeriod = '7 days' | '30 days' | '90 days' | '365 days';
export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D';
export type DetailTimeframe = '5M' | '1H' | '4H' | '1D' | '1W';

export interface TicketState {
  side: Side;
  sym: string;
}

export type SheetState =
  | { kind: 'setbal'; acc: string; title: string; sub: string }
  | { kind: 'more'; acc: string; title: string; sub: string }
  | null;
