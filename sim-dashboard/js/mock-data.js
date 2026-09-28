/*
 * mock-data.js — fictional instruments, accounts and price generation.
 * Everything here is invented. Nothing connects to any broker or network.
 */
(function (SIM) {
  'use strict';

  // Deterministic PRNG so the chart history is stable between reloads.
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // contract: units per 1.00 lot. quote: currency P/L is denominated in.
  // vol: rough per-minute volatility as a fraction of price.
  const INSTRUMENTS = [
    { symbol: 'XAUUSD', name: 'Gold vs US Dollar',   group: 'Metals',  price: 4141.46, digits: 2, spread: 0.24,   contract: 100,    quote: 'USD', vol: 0.00045, unit: 'oz',   icon: 'gold' },
    { symbol: 'XAGUSD', name: 'Silver vs US Dollar', group: 'Metals',  price: 61.265,  digits: 3, spread: 0.03,   contract: 5000,   quote: 'USD', vol: 0.0007,  unit: 'oz',   icon: 'silver' },
    { symbol: 'EURUSD', name: 'Euro vs US Dollar',   group: 'Forex',   price: 1.13639, digits: 5, spread: 0.00008, contract: 100000, quote: 'USD', vol: 0.00012, unit: 'units', icon: 'fx' },
    { symbol: 'GBPUSD', name: 'Pound vs US Dollar',  group: 'Forex',   price: 1.32533, digits: 5, spread: 0.0001,  contract: 100000, quote: 'USD', vol: 0.00014, unit: 'units', icon: 'fx' },
    { symbol: 'USDJPY', name: 'US Dollar vs Yen',    group: 'Forex',   price: 157.156, digits: 3, spread: 0.012,   contract: 100000, quote: 'JPY', vol: 0.00013, unit: 'units', icon: 'fx' },
    { symbol: 'GBPJPY', name: 'Pound vs Yen',        group: 'Forex',   price: 208.292, digits: 3, spread: 0.02,    contract: 100000, quote: 'JPY', vol: 0.00016, unit: 'units', icon: 'fx' },
    { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar',  group: 'Crypto', price: 83512.45, digits: 2, spread: 18,   contract: 1,      quote: 'USD', vol: 0.0011,  unit: 'coin', icon: 'crypto' },
    { symbol: 'ETHUSD', name: 'Ether vs US Dollar',    group: 'Crypto', price: 2686.97,  digits: 2, spread: 1.2,  contract: 1,      quote: 'USD', vol: 0.0013,  unit: 'coin', icon: 'crypto' },
    { symbol: 'US100',  name: 'US Tech 100 Index',   group: 'Indices', price: 30418.22, digits: 2, spread: 1.0,   contract: 1,      quote: 'USD', vol: 0.00035, unit: 'contract', icon: 'index' },
    { symbol: 'US30',   name: 'US 30 Index',         group: 'Indices', price: 51421.23, digits: 2, spread: 2.0,   contract: 1,      quote: 'USD', vol: 0.0003,  unit: 'contract', icon: 'index' },
    { symbol: 'JP225',  name: 'Japan 225 Index',     group: 'Indices', price: 66012,    digits: 0, spread: 7,     contract: 1,      quote: 'JPY', vol: 0.00035, unit: 'contract', icon: 'index' },
    { symbol: 'WTI',    name: 'WTI Crude Oil',       group: 'Energy',  price: 97.49,    digits: 2, spread: 0.03,  contract: 1000,   quote: 'USD', vol: 0.0006,  unit: 'bbl', icon: 'oil' },
    { symbol: 'BRENT',  name: 'Brent Crude Oil',     group: 'Energy',  price: 103.29,   digits: 2, spread: 0.03,  contract: 1000,   quote: 'USD', vol: 0.0006,  unit: 'bbl', icon: 'oil' }
  ];

  // Fictional accounts. Numbers use the SIM- prefix so they can never be
  // mistaken for a real brokerage login.
  function defaultAccounts() {
    return [
      {
        id: 'acc-1', name: 'Standard Sim', plan: 'Standard', platform: 'Web',
        type: 'sim', number: 'SIM-4821-07', leverage: 500, currency: 'USD',
        balance: 10000, credit: 0, positions: [], history: [
          { t: Date.now() - 86400000 * 3, kind: 'Mock deposit', amount: 10000, note: 'Initial demo funds' }
        ]
      },
      {
        id: 'acc-2', name: 'Practice Sandbox', plan: 'Standard', platform: 'Web',
        type: 'practice', number: 'SIM-0093-12', leverage: 100, currency: 'USD',
        balance: 2500, credit: 0, positions: [], history: [
          { t: Date.now() - 86400000 * 9, kind: 'Mock deposit', amount: 2500, note: 'Initial demo funds' }
        ]
      }
    ];
  }

  // Build `count` candles ending at `endPrice` for a timeframe (seconds).
  // Generated backwards from the live price so the chart joins the ticker.
  function generateCandles(inst, tfSec, count, endPrice) {
    const rng = mulberry32(hashString(inst.symbol + ':' + tfSec));
    const stepVol = inst.vol * Math.sqrt(tfSec / 60);
    const now = Math.floor(Date.now() / 1000);
    const lastBucket = now - (now % tfSec);
    const out = new Array(count);
    let close = endPrice;
    for (let i = count - 1; i >= 0; i--) {
      const drift = (rng() - 0.5) * 2 * stepVol * close;
      const open = close - drift;
      const wick = stepVol * close * 0.6;
      const high = Math.max(open, close) + rng() * wick;
      const low = Math.min(open, close) - rng() * wick;
      out[i] = { t: lastBucket - (count - 1 - i) * tfSec, o: open, h: high, l: low, c: close };
      close = open;
    }
    return out;
  }

  SIM.data = { INSTRUMENTS, defaultAccounts, generateCandles, mulberry32 };
})(window.SIM = window.SIM || {});
