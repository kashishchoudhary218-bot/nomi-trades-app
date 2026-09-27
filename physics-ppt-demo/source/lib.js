// Shared design system for the Electricity demo decks
const pptxgen = require('pptxgenjs');
const path = require('path');

const C = {
  BG: 'F8F7F3', INK: '101820', NAVY: '25354A', MUTED: '6B7480', SOFT: '9AA1AA',
  LINE: 'DDD8CE', CARD: 'FFFFFF', CRIM: 'B4232C', CRIMT: 'F6E3E1',
  YEL: 'F2B632', YELT: 'FCEBB6', NAVYT: 'E7EBF0', GREEN: '2F7D4F', GREENT: 'E3F0E7',
  INK2: '1B2733',
};
const EF = 'Inter';
const HF = 'Noto Sans Devanagari';
const NF = 'Caveat';
const W = 13.333, H = 7.5, M = 0.7;
const IMG = (f) => path.join(__dirname, 'img', f);

function newDeck(title) {
  const p = new pptxgen();
  p.layout = 'LAYOUT_WIDE';
  p.title = title;
  p.author = 'Physics Demo — Electricity';
  p.theme = { headFontFace: EF, bodyFontFace: EF };
  return p;
}

// ---------- text helpers ----------
function norm(runs, base) {
  if (typeof runs === 'string') return [{ text: runs, options: {} }];
  return runs.map((r) => (typeof r === 'string' ? { text: r, options: {} } : r));
}
function T(s, runs, o) {
  const opt = Object.assign({
    fontFace: EF, fontSize: 20, color: C.INK, margin: 0, valign: 'top', isTextBox: true,
    paraSpaceAfter: 0,
  }, o);
  s.addText(norm(runs), opt);
}
const en = (text, o = {}) => ({ text, options: Object.assign({ fontFace: EF }, o) });
const hi = (text, o = {}) => ({ text, options: Object.assign({ fontFace: HF }, o) });
const br = (o = {}) => ({ text: '', options: Object.assign({ breakLine: true }, o) });
// text with line break after
const L = (text, o = {}) => ({ text, options: Object.assign({ breakLine: true }, o) });

// ---------- shapes ----------
function rect(s, x, y, w, h, fill, o = {}) {
  s.addShape('rect', Object.assign({ x, y, w, h, fill: { color: fill }, line: { type: 'none' } }, o));
}
function rrect(s, x, y, w, h, fill, o = {}) {
  s.addShape('roundRect', Object.assign({ x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { type: 'none' } }, o));
}
function oval(s, x, y, w, h, fill, o = {}) {
  s.addShape('ellipse', Object.assign({ x, y, w, h, fill: { color: fill }, line: { type: 'none' } }, o));
}
// line from (x1,y1) to (x2,y2)
function line(s, x1, y1, x2, y2, color, width = 1.5, o = {}) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  const ln = Object.assign({ color, width }, o);
  s.addShape('line', { x, y, w, h, flipH: x2 < x1, flipV: y2 < y1, line: ln });
}
function arrow(s, x1, y1, x2, y2, color, width = 2, o = {}) {
  line(s, x1, y1, x2, y2, color, width, Object.assign({ endArrowType: 'triangle' }, o));
}
function poly(s, pts, color, width = 2.25) {
  // pts in absolute inches
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x || 0.01, h = Math.max(...ys) - y || 0.01;
  s.addShape('custGeom', {
    x, y, w, h,
    points: pts.map((p, i) => (i === 0 ? { x: p[0] - x, y: p[1] - y, moveTo: true } : { x: p[0] - x, y: p[1] - y })),
    line: { color, width }, fill: { type: 'none' },
  });
}
// zig-zag resistor symbol centered vertically at y, from x to x+w
function resistorSym(s, x, y, w, color = C.INK, amp = 0.16, n = 6, width = 2.25) {
  const pts = [[x, y]];
  const lead = w * 0.18, zw = w - 2 * lead;
  pts.push([x + lead, y]);
  for (let i = 0; i < n; i++) {
    const xx = x + lead + (zw / n) * (i + 0.5);
    pts.push([xx, y + (i % 2 === 0 ? -amp : amp)]);
  }
  pts.push([x + lead + zw, y]);
  pts.push([x + w, y]);
  poly(s, pts, color, width);
}
// battery cell symbol (long + short plate) centred at (cx, cy), vertical plates
function cellSym(s, cx, cy, color = C.INK) {
  line(s, cx - 0.06, cy - 0.28, cx - 0.06, cy + 0.28, color, 2.5);
  line(s, cx + 0.08, cy - 0.15, cx + 0.08, cy + 0.15, color, 5);
}
// horizontal cylinder wire. x,y = top-left, len, thick
function wire(s, x, y, len, thick, color = 'C98A4B', o = {}) {
  s.addShape('can', Object.assign({
    x: x + len / 2 - thick / 2, y: y + thick / 2 - len / 2, w: thick, h: len,
    rotate: 90, fill: { color }, line: { color: '8A5A2B', width: 0.75 }, adjustPoint: 0.18,
  }, o));
}

// fraction: centred at cx, top y
function frac(s, cx, y, num, den, o = {}) {
  const size = o.size || 36, color = o.color || C.INK, font = o.font || EF, bold = o.bold !== false;
  const lh = size / 72 * 1.25;
  const len = (t) => (typeof t === 'string' ? t.length : norm(t).reduce((a, r) => a + r.text.length, 0));
  const w = o.w || Math.max(len(num), len(den)) * size / 72 * 0.62 + 0.25;
  const base = { fontFace: font, fontSize: size, color, bold, align: 'center', valign: 'middle' };
  T(s, num, Object.assign({}, base, { x: cx - w / 2, y, w, h: lh }));
  line(s, cx - w / 2 + 0.05, y + lh + 0.04, cx + w / 2 - 0.05, y + lh + 0.04, o.barColor || color, Math.max(1.5, size / 18));
  T(s, den, Object.assign({}, base, { x: cx - w / 2, y: y + lh + 0.08, w, h: lh }));
  return { w, h: lh * 2 + 0.08 };
}

// ---------- page furniture ----------
function base(s, meta, n) {
  s.background = { color: C.BG };
  // section label
  if (meta.section) {
    rect(s, M, 0.52, 0.12, 0.12, meta.accent || C.CRIM);
    T(s, meta.section.toUpperCase(), { x: M + 0.24, y: 0.44, w: 7, h: 0.28, fontSize: 12, bold: true, color: C.NAVY, charSpacing: 2.5 });
  }
  // top-right topic tag
  T(s, meta.topic.toUpperCase(), { x: W - M - 5, y: 0.44, w: 5, h: 0.28, fontSize: 11, color: C.SOFT, align: 'right', charSpacing: 2 });
  // footer
  T(s, [en('ELECTRICITY  ', { bold: true, color: C.NAVY, charSpacing: 1.5 }), hi('विद्युत', { color: C.MUTED }), en('     ' + meta.deck, { color: C.SOFT, charSpacing: 0.5 })],
    { x: M, y: 7.0, w: 8, h: 0.3, fontSize: 10.5 });
  T(s, String(n).padStart(2, '0') + ' / ' + String(meta.total).padStart(2, '0'),
    { x: W - M - 2, y: 7.0, w: 2, h: 0.3, fontSize: 10.5, color: C.MUTED, align: 'right', bold: true });
}
function title(s, enT, hiT, o = {}) {
  const y = o.y || 0.9;
  T(s, enT, { x: M, y, w: o.w || 11.5, h: 0.75, fontSize: o.size || 36, bold: true, color: C.INK });
  if (hiT) T(s, hiT, { x: M, y: y + 0.78, w: o.w || 11.5, h: 0.5, fontSize: o.hsize || 20, fontFace: HF, color: C.NAVY });
}
// handwritten teacher note
function note(s, text, x, y, w, h, o = {}) {
  T(s, text, Object.assign({ x, y, w, h, fontFace: NF, fontSize: 26, color: C.CRIM, rotate: o.rotate || -3, bold: true }, o));
}
// yellow highlight "marker" behind a line of text
function marker(s, x, y, w, h, color = C.YELT) {
  rect(s, x, y, w, h, color);
}
// pill label
function pill(s, text, x, y, w, o = {}) {
  const h = o.h || 0.4;
  rrect(s, x, y, w, h, o.fill || C.INK, { rectRadius: h / 2 });
  T(s, text, { x, y, w, h, fontSize: o.size || 12, bold: true, color: o.color || 'FFFFFF', align: 'center', valign: 'middle', charSpacing: o.cs == null ? 2 : o.cs, fontFace: o.font || EF });
}

// ---------- PYQ components ----------
function pyqHeader(s, exam, qno) {
  pill(s, 'PREVIOUS YEAR QUESTION', M, 0.9, 3.35, { fill: C.INK });
  T(s, [en(exam.name, { bold: true, color: C.CRIM }), en('   ·   ' + exam.date, { color: C.NAVY })],
    { x: M + 3.6, y: 0.9, w: 6.5, h: 0.4, fontSize: 15, valign: 'middle' });
  if (qno) T(s, qno, { x: W - M - 2, y: 0.8, w: 2, h: 0.6, fontSize: 28, bold: true, color: C.LINE, align: 'right' });
}
// options grid 2x2. opts = [{en, hi}] ; mark = index of correct (optional)
function options(s, opts, x, y, w, rowH, o = {}) {
  const gap = 0.3, cw = (w - gap) / 2;
  const letters = ['A', 'B', 'C', 'D'];
  opts.forEach((op, i) => {
    const cx = x + (i % 2) * (cw + gap), cy = y + Math.floor(i / 2) * (rowH + 0.22);
    const ok = o.mark === i, dim = o.mark != null && !ok;
    rrect(s, cx, cy, cw, rowH, ok ? C.GREENT : C.CARD, { rectRadius: 0.06, line: { color: ok ? C.GREEN : C.LINE, width: ok ? 2 : 1 } });
    const d = Math.min(0.56, rowH - 0.3);
    oval(s, cx + 0.22, cy + (rowH - d) / 2, d, d, ok ? C.GREEN : (dim ? C.SOFT : C.NAVY));
    T(s, letters[i], { x: cx + 0.22, y: cy + (rowH - d) / 2, w: d, h: d, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    const runs = [en(op.en, { fontSize: o.size || 24, bold: true, color: dim ? C.MUTED : C.INK, breakLine: !!op.hi })];
    if (op.hi) runs.push(hi(op.hi, { fontSize: (o.size || 24) - 5, color: dim ? C.SOFT : C.NAVY }));
    T(s, runs, { x: cx + 0.22 + d + 0.25, y: cy, w: cw - d - 0.75 - (ok ? 1.3 : 0), h: rowH, valign: 'middle', lineSpacingMultiple: 1.05 });
    if (ok) pill(s, 'CORRECT', cx + cw - 1.45, cy + (rowH - 0.36) / 2, 1.25, { h: 0.36, fill: C.GREEN, size: 11 });
  });
}
function answerCard(s, x, y, w, h, letter, value, hiValue) {
  rrect(s, x, y, w, h, C.INK, { rectRadius: 0.1 });
  T(s, [en('FINAL ANSWER  ·  ', { charSpacing: 2 }), hi('उत्तर')], { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.YEL });
  oval(s, x + 0.35, y + 0.8, 0.75, 0.75, C.GREEN);
  T(s, letter, { x: x + 0.35, y: y + 0.8, w: 0.75, h: 0.75, fontSize: 28, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  const vs = Math.min(34, Math.floor((w - 1.5) * 72 / (value.length * 0.6)));
  const runs = [en(value, { fontSize: vs, bold: true, color: 'FFFFFF', breakLine: !!hiValue })];
  if (hiValue) runs.push(hi(hiValue, { fontSize: 20, color: 'C9D1DA' }));
  T(s, runs, { x: x + 1.3, y: y + 0.68, w: w - 1.5, h: 1.0, valign: 'middle' });
}
// numbered step row for solutions
function step(s, n, x, y, w, runs, o = {}) {
  const h = o.h || 0.62;
  oval(s, x, y + (h - 0.4) / 2, 0.4, 0.4, o.last ? C.CRIM : C.NAVYT);
  T(s, String(n), { x, y: y + (h - 0.4) / 2, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: o.last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
  T(s, runs, { x: x + 0.6, y, w: w - 0.6, h, fontSize: o.size || 26, valign: 'middle', color: C.INK });
}
function givenBox(s, x, y, w, h, rows, o = {}) {
  rrect(s, x, y, w, h, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
  T(s, [en('GIVEN  ·  ', { bold: true, color: C.NAVY, charSpacing: 2 }), hi('दिया है', { color: C.MUTED })], { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.35, fontSize: 13 });
  let yy = y + 0.85;
  rows.forEach((r) => {
    T(s, r, { x: x + 0.35, y: yy, w: w - 0.7, h: 0.55, fontSize: 26, bold: true, color: C.INK, valign: 'middle' });
    yy += 0.62;
  });
  if (o.find) {
    line(s, x + 0.35, yy + 0.1, x + w - 0.35, yy + 0.1, C.LINE, 1);
    T(s, [en('FIND  ·  ', { bold: true, color: C.NAVY, charSpacing: 2 }), hi('ज्ञात करें', { color: C.MUTED })], { x: x + 0.35, y: yy + 0.3, w: w - 0.7, h: 0.35, fontSize: 13 });
    T(s, o.find, { x: x + 0.35, y: yy + 0.72, w: w - 0.7, h: 0.55, fontSize: 26, bold: true, color: C.CRIM, valign: 'middle' });
  }
}
// sci notation runs: sci('1.62', '-8') => 1.62 × 10^-8
function sci(m, e, o = {}) {
  const r = [];
  if (m) r.push(en(m + ' × ', o));
  r.push(en('10', o));
  r.push(en(e.replace('-', '−'), Object.assign({}, o, { superscript: true })));
  return r;
}

module.exports = { C, EF, HF, NF, W, H, M, IMG, newDeck, T, en, hi, br, L, rect, rrect, oval, line, arrow, poly, resistorSym, cellSym, wire, frac, base, title, note, marker, pill, pyqHeader, options, answerCard, step, givenBox, sci };

// inline equation: parts = strings or {n, d}; placed left-to-right, vertically centred on midY
function eq(s, x, midY, parts, o = {}) {
  const size = o.size || 28, color = o.color || C.INK;
  const cw = (t) => {
    let w = 0;
    for (const ch of t) w += ch === ' ' ? 0.28 : (/[×=+−÷]/.test(ch) ? 0.66 : (/[.,]/.test(ch) ? 0.3 : 0.62));
    return w * size / 72;
  };
  let cx = x;
  parts.forEach((p) => {
    if (typeof p === 'string' || Array.isArray(p)) {
      const w = (typeof p === 'string' ? cw(p) : p.reduce((a, r) => a + cw(r.text) * (r.options && (r.options.subscript || r.options.superscript) ? 0.62 : 1), 0)) + 0.08;
      T(s, p, { x: cx, y: midY - size / 72 * 0.75, w: w + 0.4, h: size / 72 * 1.5, fontSize: size, bold: true, color, valign: 'middle', wrap: false });
      cx += w;
    } else {
      const lh = size * 0.8 / 72 * 1.25;
      const fw = Math.max(cw(typeof p.n === 'string' ? p.n : p.n.map(r=>r.text).join('')), cw(typeof p.d === 'string' ? p.d : p.d.map(r=>r.text).join(''))) * 0.8 + 0.3;
      frac(s, cx + fw / 2, midY - lh - 0.04, p.n, p.d, { size: size * 0.8, color: p.color || color, w: fw });
      cx += fw + 0.08;
    }
  });
  return cx;
}
module.exports.eq = eq;
