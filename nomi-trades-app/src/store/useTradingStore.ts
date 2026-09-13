import { create } from 'zustand';
import { INSTRUMENTS, findInstrument } from '../data/instruments';
import { SEED_ACCOUNTS } from '../data/accounts';
import { seedClosed, seedPositions } from '../engine/seed';
import { fmt, fmt0 } from '../engine/format';
import { pnlOfPosition } from '../engine/selectors';
import {
  Account,
  AccountMode,
  ClosedTrade,
  OrderType,
  PerfPeriod,
  PerfTab,
  Position,
  PositionTab,
  SheetState,
  Side,
  Timeframe,
  DetailTimeframe,
  TicketState,
} from '../types';

const DEMO_RESET_BALANCE = 1000000;
const TOAST_MS = 2600;
const PRICE_TICK_MS = 1800;

interface TradingState {
  // UI / navigation-adjacent state
  posTab: PositionTab;
  cat: string;
  detailSym: string | null;
  detailTf: DetailTimeframe;
  ticket: TicketState | null;
  lots: number;
  otype: OrderType;
  kyc: boolean;
  toast: string | null;
  sheet: SheetState;

  // Simulated live price feed
  px: Record<string, number>;

  // Accounts
  accMode: AccountMode;
  selAcc: string;
  accounts: Account[];

  // Trades
  positions: Position[];
  closed: ClosedTrade[];
  seq: number;

  // Terminal
  terminal: boolean;
  tSym: string;
  tTf: Timeframe;
  ema: boolean;
  cross: boolean;
  termTab: PositionTab;

  // Performance
  perfTab: PerfTab;
  perfPeriod: PerfPeriod;
}

interface TradingActions {
  startPriceFeed: () => void;
  stopPriceFeed: () => void;

  selectAccount: (id: string) => void;
  setAccMode: (mode: AccountMode) => void;
  dismissKyc: () => void;

  setPosTab: (tab: PositionTab) => void;
  setCategory: (cat: string) => void;

  openTerminal: (sym?: string, accId?: string) => void;
  closeTerminal: () => void;
  setTSym: (sym: string) => void;
  setTTf: (tf: Timeframe) => void;
  toggleEma: () => void;
  toggleCross: () => void;
  setTermTab: (tab: PositionTab) => void;

  openDetail: (sym: string) => void;
  closeDetail: () => void;
  setDetailTf: (tf: DetailTimeframe) => void;

  openTicket: (side: Side, sym: string) => void;
  closeTicket: () => void;
  setOrderType: (t: OrderType) => void;
  incLots: () => void;
  decLots: () => void;
  setLots: (v: number) => void;
  confirmOrder: () => void;
  closePosition: (id: string) => void;

  tradeAccount: (accId: string) => void;
  fundAccount: (accId: string) => void;
  secondaryAccountAction: (accId: string) => void;
  moreAccount: (accId: string) => void;
  restoreAccount: (accId: string) => void;
  archiveAccount: (accId: string) => void;
  setDemoBalance: (accId: string, value: number) => void;
  emailStatement: (accId: string) => void;

  setPerfTab: (tab: PerfTab) => void;
  setPerfPeriod: (period: PerfPeriod) => void;

  showToast: (msg: string) => void;
  closeSheet: () => void;
}

export type TradingStore = TradingState & TradingActions;

function boot(): TradingState {
  const px: Record<string, number> = {};
  INSTRUMENTS.forEach((i) => {
    px[i.sym] = i.p0;
  });
  return {
    posTab: 'open',
    cat: 'Favourites',
    detailSym: null,
    detailTf: '1H',
    ticket: null,
    lots: 0.2,
    otype: 'Market',
    kyc: true,
    toast: null,
    sheet: null,
    px,
    accMode: 'Real',
    selAcc: 'a1',
    accounts: SEED_ACCOUNTS.map((a) => ({ ...a })),
    positions: seedPositions(),
    closed: seedClosed(),
    seq: 1,
    terminal: false,
    tSym: 'XAU/USD',
    tTf: '5m',
    ema: true,
    cross: false,
    termTab: 'open',
    perfTab: 'Net Profit',
    perfPeriod: '365 days',
  };
}

let priceInterval: ReturnType<typeof setInterval> | null = null;
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useTradingStore = create<TradingStore>()((set, get) => ({
  ...boot(),

  startPriceFeed: () => {
    if (priceInterval) return;
    priceInterval = setInterval(() => {
      set((st) => {
        const px = { ...st.px };
        INSTRUMENTS.forEach((i) => {
          const drift = (Math.random() - 0.5) * 0.0016;
          px[i.sym] = Math.max(i.p0 * 0.6, px[i.sym] * (1 + drift));
        });
        return { px };
      });
    }, PRICE_TICK_MS);
  },
  stopPriceFeed: () => {
    if (priceInterval) {
      clearInterval(priceInterval);
      priceInterval = null;
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
  },

  selectAccount: (id) => set({ selAcc: id }),
  setAccMode: (mode) =>
    set((st) => {
      const first = st.accounts.find((a) => !a.archived && a.mode === mode);
      return { accMode: mode, selAcc: first ? first.id : st.selAcc };
    }),
  dismissKyc: () => set({ kyc: false }),

  setPosTab: (tab) => set({ posTab: tab }),
  setCategory: (cat) => set({ cat }),

  openTerminal: (sym, accId) =>
    set((st) => ({
      terminal: true,
      tSym: sym ?? st.tSym,
      selAcc: accId ?? st.selAcc,
      detailSym: null,
      sheet: null,
    })),
  closeTerminal: () => set({ terminal: false }),
  setTSym: (sym) => set({ tSym: sym }),
  setTTf: (tf) => set({ tTf: tf }),
  toggleEma: () => set((st) => ({ ema: !st.ema })),
  toggleCross: () => set((st) => ({ cross: !st.cross })),
  setTermTab: (tab) => set({ termTab: tab }),

  openDetail: (sym) => set({ detailSym: sym }),
  closeDetail: () => set({ detailSym: null }),
  setDetailTf: (tf) => set({ detailTf: tf }),

  openTicket: (side, sym) => set({ ticket: { side, sym } }),
  closeTicket: () => set({ ticket: null }),
  setOrderType: (t) => set({ otype: t }),
  incLots: () => set((st) => ({ lots: Math.min(20, +(st.lots + 0.05).toFixed(2)) })),
  decLots: () => set((st) => ({ lots: Math.max(0.01, +(st.lots - 0.05).toFixed(2)) })),
  setLots: (v) => set({ lots: v }),

  confirmOrder: () => {
    const st = get();
    const t = st.ticket;
    if (!t) return;
    const inst = findInstrument(t.sym);
    const entry = st.px[t.sym] + (t.side === 'Buy' ? 1 : -1) * inst.p0 * 0.00006;
    set((s) => ({
      ticket: null,
      positions: [
        { id: 'n' + s.seq, acc: s.selAcc, sym: t.sym, side: t.side, lots: s.lots, entry, ts: Date.now(), tag: s.otype === 'Limit' ? 'LIMIT' : 'MARKET' },
        ...s.positions,
      ],
      seq: s.seq + 1,
      posTab: 'open',
      termTab: 'open',
    }));
    get().showToast(t.side + ' filled · ' + st.lots.toFixed(2) + ' lot ' + t.sym);
  },

  closePosition: (id) => {
    const st = get();
    const p = st.positions.find((x) => x.id === id);
    if (!p) return;
    const gain = pnlOfPosition(st.px, p);
    set((s) => ({
      positions: s.positions.filter((x) => x.id !== id),
      accounts: s.accounts.map((a) => (a.id === p.acc ? { ...a, bal: a.bal + gain } : a)),
      closed: [
        { id: 'x' + s.seq, acc: p.acc, sym: p.sym, side: p.side, lots: p.lots, entry: p.entry, exit: s.px[p.sym], pnl: gain, cost: p.lots * 120, ts: Date.now(), tag: 'MANUAL' },
        ...s.closed,
      ],
      seq: s.seq + 1,
    }));
    const acc = st.accounts.find((a) => a.id === p.acc);
    get().showToast('Position closed · ' + (gain >= 0 ? '+' : '') + fmt(gain) + ' ' + (acc?.curr ?? 'INR'));
  },

  tradeAccount: (accId) => {
    get().selectAccount(accId);
    get().openTerminal(undefined, accId);
  },
  fundAccount: (accId) => {
    const st = get();
    const acc = st.accounts.find((a) => a.id === accId);
    set({ selAcc: accId });
    if (!acc) return;
    if (acc.mode === 'Demo') {
      set({ sheet: { kind: 'setbal', acc: accId, title: 'Set demo balance', sub: acc.label + ' #' + acc.num + ' · simulated funds only' } });
    } else {
      get().showToast('Deposit request opened · ' + acc.label);
    }
  },
  secondaryAccountAction: (accId) => {
    const st = get();
    const acc = st.accounts.find((a) => a.id === accId);
    set({ selAcc: accId });
    if (!acc) return;
    if (acc.mode === 'Demo') {
      set((s) => ({
        accounts: s.accounts.map((x) => (x.id === accId ? { ...x, bal: DEMO_RESET_BALANCE } : x)),
        positions: s.positions.filter((p) => p.acc !== accId),
      }));
      get().showToast('Demo account reset to ' + fmt0(DEMO_RESET_BALANCE) + ' ' + acc.curr);
    } else {
      get().showToast('Withdrawal to UPI started');
    }
  },
  moreAccount: (accId) => {
    const acc = get().accounts.find((a) => a.id === accId);
    if (!acc) return;
    set({ selAcc: accId, sheet: { kind: 'more', acc: accId, title: acc.label + ' · #' + acc.num, sub: 'MT5 · ' + acc.type + ' · ' + acc.mode + ' account' } });
  },
  restoreAccount: (accId) => {
    const acc = get().accounts.find((a) => a.id === accId);
    if (!acc) return;
    set((s) => ({ accounts: s.accounts.map((x) => (x.id === accId ? { ...x, archived: false } : x)), accMode: acc.mode, selAcc: accId }));
    get().showToast(acc.label + ' restored');
  },
  archiveAccount: (accId) => {
    set((s) => ({ accounts: s.accounts.map((x) => (x.id === accId ? { ...x, archived: true } : x)), sheet: null }));
    get().showToast('Account archived');
  },
  setDemoBalance: (accId, value) => {
    const acc = get().accounts.find((a) => a.id === accId);
    set((s) => ({ accounts: s.accounts.map((x) => (x.id === accId ? { ...x, bal: value } : x)), sheet: null }));
    get().showToast('Demo balance set to ' + fmt0(value) + ' ' + (acc?.curr ?? 'INR'));
  },
  emailStatement: (accId) => {
    set({ sheet: null });
    get().showToast('Statement queued for email');
  },

  setPerfTab: (tab) => set({ perfTab: tab }),
  setPerfPeriod: (period) => set({ perfPeriod: period }),

  showToast: (msg) => {
    set({ toast: msg });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), TOAST_MS);
  },
  closeSheet: () => set({ sheet: null }),
}));
