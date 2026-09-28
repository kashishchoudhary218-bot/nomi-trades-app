/*
 * engine.js — local simulation engine: mock price ticks, account math,
 * mock positions and localStorage persistence. No network access.
 */
(function (SIM) {
  'use strict';

  const DEBUG = false;
  const log = (...a) => { if (DEBUG) console.log('[sim]', ...a); };
  const STORE_KEY = 'sim-desk-v1';
  const { INSTRUMENTS, defaultAccounts } = SIM.data;

  // ---------- Market ----------
  const market = {};
  INSTRUMENTS.forEach((inst) => {
    market[inst.symbol] = {
      inst,
      bid: inst.price,
      ask: inst.price + inst.spread,
      dayOpen: inst.price * (1 + (Math.random() - 0.55) * 0.04),
      dir: 0 // last tick direction: 1 up, -1 down
    };
  });

  function tickMarket() {
    Object.values(market).forEach((m) => {
      const inst = m.inst;
      const shock = (Math.random() - 0.5) * 2 * inst.vol * m.bid * 0.35;
      const next = Math.max(m.bid + shock, inst.price * 0.2);
      m.dir = next > m.bid ? 1 : next < m.bid ? -1 : 0;
      m.bid = next;
      m.ask = next + inst.spread;
    });
  }

  function quote(symbol) { return market[symbol]; }
  function changePct(symbol) { const m = market[symbol]; return ((m.bid - m.dayOpen) / m.dayOpen) * 100; }

  // Convert an amount in the instrument's quote currency to USD.
  function toUSD(amount, quoteCcy) {
    if (quoteCcy === 'USD') return amount;
    if (quoteCcy === 'JPY') return amount / market.USDJPY.bid;
    return amount;
  }

  // Price of 1 unit of the instrument in USD (for margin).
  function notionalUSD(inst, price, lots) {
    const units = inst.contract * lots;
    if (inst.symbol.startsWith('USD')) return units; // base currency is USD
    return toUSD(units * price, inst.quote);
  }

  // ---------- Accounts / persistence ----------
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.accounts) && parsed.accounts.length) return parsed;
      }
    } catch (e) { log('load failed', e); }
    const accounts = defaultAccounts();
    return { accounts, activeId: accounts[0].id, symbol: 'XAUUSD', tf: 60, hideBalance: false };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { log('save failed', e); }
  }

  function reset() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    state = load();
    emit();
  }

  function active() { return state.accounts.find((a) => a.id === state.activeId) || state.accounts[0]; }

  function positionPL(p) {
    const m = market[p.symbol];
    const exit = p.side === 'buy' ? m.bid : m.ask;
    const diff = (exit - p.open) * (p.side === 'buy' ? 1 : -1);
    return toUSD(diff * m.inst.contract * p.lots, m.inst.quote);
  }

  function positionMargin(p, leverage) {
    const m = market[p.symbol];
    return notionalUSD(m.inst, p.open, p.lots) / leverage;
  }

  function metrics(acc) {
    acc = acc || active();
    let pl = 0, margin = 0;
    acc.positions.forEach((p) => { pl += positionPL(p); margin += positionMargin(p, acc.leverage); });
    const equity = acc.balance + acc.credit + pl;
    return {
      pl, margin, equity,
      balance: acc.balance,
      credit: acc.credit,
      freeMargin: equity - margin,
      marginLevel: margin > 0 ? (equity / margin) * 100 : null,
      leverage: acc.leverage
    };
  }

  function requiredMargin(symbol, lots, acc) {
    acc = acc || active();
    const m = market[symbol];
    return notionalUSD(m.inst, m.ask, lots) / acc.leverage;
  }

  // ---------- Mock actions (all local-only) ----------
  function openPosition(symbol, side, lots) {
    const acc = active();
    const need = requiredMargin(symbol, lots, acc);
    if (need > metrics(acc).freeMargin) return { ok: false, error: 'Not enough free margin in this mock account.' };
    const m = market[symbol];
    const p = {
      id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      symbol, side, lots,
      open: side === 'buy' ? m.ask : m.bid,
      t: Date.now()
    };
    acc.positions.unshift(p);
    save(); emit();
    log('open', p);
    return { ok: true, position: p };
  }

  function closePosition(id) {
    const acc = active();
    const idx = acc.positions.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const p = acc.positions[idx];
    const pl = positionPL(p);
    acc.balance += pl;
    acc.positions.splice(idx, 1);
    acc.history.unshift({ t: Date.now(), kind: 'Closed ' + p.side.toUpperCase() + ' ' + p.symbol, amount: pl, note: p.lots.toFixed(2) + ' lots' });
    save(); emit();
    return pl;
  }

  function mockFunds(kind, amount, targetId) {
    const acc = active();
    amount = Math.round(amount * 100) / 100;
    if (!(amount > 0)) return { ok: false, error: 'Enter an amount greater than zero.' };
    if (kind === 'deposit') {
      acc.balance += amount;
      acc.history.unshift({ t: Date.now(), kind: 'Mock deposit', amount, note: 'Simulated — no real money' });
    } else {
      if (amount > metrics(acc).freeMargin) return { ok: false, error: 'Amount exceeds mock free margin.' };
      if (kind === 'withdraw') {
        acc.balance -= amount;
        acc.history.unshift({ t: Date.now(), kind: 'Mock withdrawal', amount: -amount, note: 'Simulated — no real money' });
      } else if (kind === 'transfer') {
        const target = state.accounts.find((a) => a.id === targetId);
        if (!target || target.id === acc.id) return { ok: false, error: 'Choose a different mock account.' };
        acc.balance -= amount;
        target.balance += amount;
        acc.history.unshift({ t: Date.now(), kind: 'Mock transfer out', amount: -amount, note: 'To ' + target.number });
        target.history.unshift({ t: Date.now(), kind: 'Mock transfer in', amount, note: 'From ' + acc.number });
      }
    }
    save(); emit();
    return { ok: true };
  }

  function createAccount(name, type, balance, leverage) {
    const n = String(Math.floor(1000 + Math.random() * 9000)) + '-' + String(Math.floor(10 + Math.random() * 89));
    const acc = {
      id: 'acc-' + Date.now().toString(36), name: name || 'New Sim Account', plan: 'Standard', platform: 'Web',
      type, number: 'SIM-' + n, leverage, currency: 'USD', balance, credit: 0, positions: [],
      history: [{ t: Date.now(), kind: 'Mock deposit', amount: balance, note: 'Initial demo funds' }]
    };
    state.accounts.push(acc);
    state.activeId = acc.id;
    save(); emit();
    return acc;
  }

  function update(patch) { Object.assign(state, patch); save(); emit(); }
  function updateActive(patch) { Object.assign(active(), patch); save(); emit(); }

  // ---------- Tiny event bus ----------
  const listeners = { change: [], tick: [] };
  function on(evt, fn) { listeners[evt].push(fn); }
  function emit() { listeners.change.forEach((fn) => fn()); }

  function start() {
    setInterval(() => { tickMarket(); listeners.tick.forEach((fn) => fn()); }, 1000);
  }

  SIM.engine = {
    DEBUG, log,
    get state() { return state; },
    active, metrics, quote, changePct, requiredMargin, positionPL,
    openPosition, closePosition, mockFunds, createAccount,
    update, updateActive, reset, on, start
  };
})(window.SIM = window.SIM || {});
