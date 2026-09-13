// Deterministic chart-path generators ported 1:1 from the Claude Design prototype.
// Same seeded LCG so the same inputs always draw the same-looking sparkline/candles.

export interface PathPair {
  line: string;
  area: string;
}

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Small inline sparkline path, points in a 0-120 x, 0-40 y box. */
export function spark(seed: number, up: boolean): string {
  let v = 20;
  const rnd = lcg(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const r = rnd() - 0.5;
    v += r * 6 + (up ? -0.42 : 0.42);
    pts.push([i * 5, Math.max(4, Math.min(36, v))]);
  }
  return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
}

/** Wandering line/area curve used for desk-signal and detail-sheet charts. */
export function curve(seed: number, w: number, h: number, up: boolean, drift: number): PathPair {
  let v = h * 0.6;
  const rnd = lcg(seed);
  const n = 42;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const r = rnd() - 0.5;
    v += r * h * 0.1 - (up ? drift : -drift) * (h / n);
    pts.push([i * (w / n), Math.max(h * 0.08, Math.min(h * 0.94, v))]);
  }
  const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
  return { line: d, area: d + 'L' + w + ' ' + h + 'L0 ' + h + 'Z' };
}

/** Line/area path through explicit values (e.g. performance equity curve). */
export function series(vals: number[], w: number, h: number): PathPair {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const pts = vals.map((v, i): [number, number] => [
    i * (w / (vals.length - 1 || 1)),
    h - 8 - ((v - min) / span) * (h - 22),
  ]);
  const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
  return { line: d, area: d + 'L' + w + ' ' + h + 'L0 ' + h + 'Z' };
}

const TF_STEP: Record<string, number> = {
  '1m': 0.0008,
  '5m': 0.0015,
  '15m': 0.0024,
  '1H': 0.0038,
  '4H': 0.0065,
  '1D': 0.0105,
};

/** Deterministic OHLC candle series seeded by symbol+timeframe, anchored to the live price. */
export function candles(sym: string, tf: string, p0: number, livePrice: number, count = 32): Candle[] {
  const key = sym + tf;
  let s = 0;
  for (let i = 0; i < key.length; i++) s = (s * 31 + key.charCodeAt(i)) % 233280;
  const rnd = lcg(s);
  const step = TF_STEP[tf] ?? 0.002;
  const vol = p0 * step;
  let c = livePrice * (1 - step * 6);
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const o = c;
    c = o + (rnd() - 0.46) * vol * 2;
    const h = Math.max(o, c) + rnd() * vol * 0.8;
    const l = Math.min(o, c) - rnd() * vol * 0.8;
    out.push({ o, h, l, c });
  }
  const shift = livePrice - out[out.length - 1].c;
  out.forEach((k) => {
    k.o += shift;
    k.h += shift;
    k.l += shift;
    k.c += shift;
  });
  return out;
}
