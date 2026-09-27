const L_ = require('./lib');
const { C, HF, NF, W, H, M, IMG, T, en, hi, rect, rrect, oval, line, arrow, frac, base, title, note, marker, pill, pyqHeader, options, answerCard, givenBox, eq, resistorSym, cellSym } = L_;
const prop = (o = {}) => ({ text: '∝', options: Object.assign({ fontFace: 'Cambria Math' }, o) });

module.exports = function build(out) {
  const p = L_.newDeck("Ohm's Law");
  const meta = { topic: "Ohm's Law", deck: 'Demo 02 · Formula + PYQ Teaching', total: 10 };
  let n = 0;
  const S = (section) => { const s = p.addSlide(); n++; base(s, Object.assign({ section }, meta), n); return s; };

  // ---------- 1. COVER ----------
  {
    const s = p.addSlide(); n++;
    s.background = { color: C.INK };
    const px = 7.45;
    s.addImage({ path: IMG('lab.jpg'), x: px, y: 0, w: W - px, h: H, sizing: { type: 'cover', w: W - px, h: H } });
    s.addImage({ path: IMG('fade_left.png'), x: px, y: 0, w: 2.4, h: H });
    rect(s, M, 0.62, 0.14, 0.14, C.YEL);
    T(s, [en('PHYSICS  ·  ', { bold: true, color: 'FFFFFF', charSpacing: 2 }), hi('भौतिक विज्ञान', { color: 'C9D1DA' })], { x: M + 0.28, y: 0.52, w: 6, h: 0.35, fontSize: 14 });
    T(s, 'DEMO 02  ·  FORMULA + PYQ TEACHING', { x: M, y: 1.95, w: 7, h: 0.35, fontSize: 13, bold: true, color: C.YEL, charSpacing: 3 });
    T(s, "Ohm's Law", { x: M, y: 2.35, w: 6.6, h: 1.3, fontSize: 72, bold: true, color: 'FFFFFF' });
    T(s, 'ओम का नियम', { x: M, y: 3.7, w: 6.5, h: 0.75, fontSize: 34, fontFace: HF, color: C.YEL });
    rrect(s, M, 4.75, 2.9, 0.95, C.INK, { rectRadius: 0.1, line: { color: '3A4756', width: 1.25 } });
    T(s, [en('V = I', { color: 'FFFFFF' }), en('R', { color: C.YEL })], { x: M, y: 4.75, w: 2.9, h: 0.95, fontSize: 40, bold: true, align: 'center', valign: 'middle' });
    T(s, [en('Electricity · Part 2   |   ', { color: 'C9D1DA' }), hi('विद्युत · भाग 2', { color: 'C9D1DA' })], { x: M + 3.2, y: 4.75, w: 3.6, h: 0.95, fontSize: 15, valign: 'middle' });
    T(s, 'Concept   →   Formula   →   Relationship   →   PYQ   →   Solution', { x: M, y: 6.6, w: 7, h: 0.35, fontSize: 13, color: '8D97A3', charSpacing: 1 });
    s.addNotes("Cover. Demo 02 of 03 — formula-driven teaching with PYQ practice on Ohm's Law.");
  }

  // ---------- 2. ORIGIN ----------
  {
    const s = S('01 · Where it comes from');
    title(s, "Who gave us Ohm's Law?", 'ओम का नियम किसने दिया?');
    const d = 2.55;
    s.addImage({ path: IMG('ohm.jpg'), x: M + 0.25, y: 2.45, w: d, h: d, rounding: true });
    s.addShape('ellipse', { x: M + 0.25, y: 2.45, w: d, h: d, fill: { type: 'none' }, line: { color: C.CARD, width: 4 } });
    T(s, [en('Georg Simon Ohm', { bold: true, fontSize: 19, breakLine: true }), hi('जॉर्ज साइमन ओम', { fontSize: 16, color: C.NAVY, breakLine: true }), en('German physicist', { fontSize: 14, color: C.MUTED })],
      { x: M, y: 5.15, w: 3.1, h: 1.2, align: 'center' });
    const tx = 4.55, tw = W - M - tx;
    T(s, "A German physicist, Georg Simon Ohm, established the relation between the potential difference and current, which is known as Ohm's Law.",
      { x: tx, y: 2.45, w: tw, h: 1.5, fontSize: 22, color: C.INK, lineSpacingMultiple: 1.08 });
    T(s, 'एक जर्मन भौतिक विज्ञानी, जॉर्ज साइमन ओम ने विभवांतर और धारा के बीच संबंध स्थापित किया, जिसे ओम के नियम के रूप में जाना जाता है।',
      { x: tx, y: 4.05, w: tw, h: 1.05, fontSize: 18, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.12 });
    // relation chips
    const cy = 5.35, cw = 3.1, ch = 1.0;
    const chips = [[tx, 'Potential difference', 'विभवांतर  ·  V'], [tx + tw - cw, 'Current', 'धारा  ·  I']];
    chips.forEach(([x, e, h]) => {
      rrect(s, x, cy, cw, ch, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(e, { bold: true, fontSize: 19, breakLine: true }), hi(h, { fontSize: 16, color: C.NAVY })], { x: x + 0.3, y: cy, w: cw - 0.4, h: ch, valign: 'middle' });
    });
    line(s, tx + cw + 0.15, cy + ch / 2, tx + tw - cw - 0.15, cy + ch / 2, C.CRIM, 2.25, { beginArrowType: 'triangle', endArrowType: 'triangle' });
    T(s, "OHM'S LAW", { x: tx + cw, y: cy + 0.05, w: tw - 2 * cw, h: 0.3, fontSize: 11, bold: true, color: C.CRIM, align: 'center', charSpacing: 2 });
    s.addNotes("Georg Simon Ohm, a German physicist, established how potential difference and current are related. That relation is Ohm's Law.");
  }

  // ---------- 3. THE LAW ----------
  {
    const s = S('02 · The law');
    title(s, "Ohm's Law in one line", 'एक पंक्ति में ओम का नियम');
    // left: proportionality
    const lx = M, ly = 2.5, lw = 4.6, lh = 3.3;
    rrect(s, lx, ly, lw, lh, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    T(s, 'STEP 1', { x: lx + 0.35, y: ly + 0.3, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    T(s, [en('V ', {}), prop(), en(' I', {})], { x: lx, y: ly + 0.7, w: lw, h: 1.3, fontSize: 72, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
    T(s, [en('Potential difference is directly proportional to current', { breakLine: true }), hi('विभवांतर, धारा के समानुपाती होता है', { fontSize: 15, color: C.NAVY })],
      { x: lx + 0.35, y: ly + 2.15, w: lw - 0.7, h: 0.95, fontSize: 16, color: C.INK, align: 'center' });
    // arrow
    s.addShape('rightArrow', { x: lx + lw + 0.25, y: ly + lh / 2 - 0.3, w: 0.8, h: 0.6, fill: { color: C.CRIM }, line: { type: 'none' } });
    // right: equation
    const rx = lx + lw + 1.3, rw = W - M - rx;
    rrect(s, rx, ly, rw, lh, C.INK, { rectRadius: 0.1 });
    T(s, 'STEP 2  ·  ADD THE CONSTANT', { x: rx + 0.4, y: ly + 0.3, w: 5, h: 0.3, fontSize: 12, bold: true, color: '8D97A3', charSpacing: 3 });
    T(s, [en('V = I × ', { color: 'FFFFFF' }), en('R', { color: C.YEL })], { x: rx, y: ly + 0.75, w: rw, h: 1.7, fontSize: 88, bold: true, align: 'center', valign: 'middle' });
    T(s, [en('R', { bold: true, color: C.YEL }), en('  =  Resistance  ·  ', { color: 'FFFFFF' }), hi('प्रतिरोध', { color: 'C9D1DA' })], { x: rx, y: ly + 2.5, w: rw, h: 0.5, fontSize: 20, align: 'center', valign: 'middle' });
    note(s, 'the constant of proportionality is R', rx + 0.6, ly + lh + 0.2, rw - 0.8, 0.5, { fontSize: 25, align: 'right', rotate: -2 });
    s.addNotes('Start with V ∝ I. Putting in the constant gives V = I × R, where R is the resistance (प्रतिरोध) of the conductor.');
  }

  // ---------- 4. READ THE FORMULA ----------
  {
    const s = S('03 · Read the formula');
    title(s, 'What each letter means', 'हर अक्षर का अर्थ');
    // big formula with letter anchors
    const fx = M, fy = 2.5, fw = 4.9, fh = 2.5;
    rrect(s, fx, fy, fw, fh, C.YELT, { rectRadius: 0.1 });
    T(s, 'V = I R', { x: fx, y: fy, w: fw, h: fh, fontSize: 96, bold: true, color: C.INK, align: 'center', valign: 'middle' });
    const rows = [
      ['V', 'Potential difference', 'विभवांतर', 'volt (V)'],
      ['I', 'Current', 'धारा', 'ampere (A)'],
      ['R', 'Resistance', 'प्रतिरोध', 'ohm (Ω)'],
    ];
    const rx = 6.35;
    rows.forEach((r, i) => {
      const y = 2.5 + i * 0.86;
      T(s, r[0], { x: rx, y, w: 0.7, h: 0.72, fontSize: 36, bold: true, color: C.CRIM, align: 'center', valign: 'middle' });
      arrow(s, rx + 0.8, y + 0.36, rx + 1.4, y + 0.36, C.SOFT, 1.75);
      T(s, [en(r[1] + '  ', { bold: true, fontSize: 23 }), hi(r[2], { fontSize: 19, color: C.NAVY })], { x: rx + 1.6, y, w: 3.5, h: 0.72, valign: 'middle' });
      T(s, r[3], { x: W - M - 1.75, y, w: 1.75, h: 0.72, fontSize: 17, color: C.MUTED, align: 'right', valign: 'middle' });
      if (i < 2) line(s, rx, y + 0.8, W - M, y + 0.8, C.LINE, 1);
    });
    // rearranged forms
    T(s, 'THE SAME LAW, REARRANGED', { x: M, y: 5.35, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    const forms = [
      { lab: 'Find current', lh: 'धारा', parts: ['I = ', { n: 'V', d: 'R' }] },
      { lab: 'Find resistance', lh: 'प्रतिरोध', parts: ['R = ', { n: 'V', d: 'I' }] },
      { lab: 'Find voltage', lh: 'विभवांतर', parts: ['V = I × R'] },
    ];
    const bw = (W - 2 * M - 0.6) / 3;
    forms.forEach((f, i) => {
      const x = M + i * (bw + 0.3);
      rrect(s, x, 5.72, bw, 1.0, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(f.lab, { bold: true, fontSize: 16, breakLine: true }), hi(f.lh, { fontSize: 14, color: C.MUTED })], { x: x + 0.3, y: 5.72, w: 1.9, h: 1.0, valign: 'middle' });
      eq(s, x + 2.2, 6.22, f.parts, { size: 26, color: C.NAVY });
    });
    s.addNotes('V is potential difference in volt, I is current in ampere, R is resistance in ohm (Ω). The same law can be rearranged as I = V/R or R = V/I.');
  }

  // ---------- 5. SEE THE RELATIONSHIP ----------
  {
    const s = S('04 · See the relationship');
    title(s, 'Same voltage, different current', 'समान वोल्टेज, अलग-अलग धारा');
    const rows = [
      { lab: 'WIRE 1', amps: '5 A', r: '20 Ω', thick: 0.06, ar: 0.22 },
      { lab: 'WIRE 2', amps: '20 A', r: '5 Ω', thick: 0.22, ar: 0.62 },
    ];
    rows.forEach((w_, i) => {
      const y = 2.55 + i * 1.95, x0 = M;
      rrect(s, x0, y, 8.3, 1.7, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, w_.lab, { x: x0 + 0.3, y: y + 0.2, w: 1.5, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
      // battery + circuit line
      cellSym(s, x0 + 0.7, y + 1.0, C.INK);
      T(s, '100 V', { x: x0 + 0.25, y: y + 1.33, w: 1.0, h: 0.3, fontSize: 14, bold: true, color: C.INK, align: 'center' });
      line(s, x0 + 0.95, y + 1.0, x0 + 2.0, y + 1.0, C.INK, 2);
      resistorSym(s, x0 + 2.0, y + 1.0, 1.6, C.INK, 0.17, 6, 2.25);
      line(s, x0 + 3.6, y + 1.0, x0 + 4.2, y + 1.0, C.INK, 2);
      // current arrow — width shows size of current
      s.addShape('rightArrow', { x: x0 + 4.3, y: y + 1.0 - w_.ar / 2, w: 1.7, h: w_.ar, fill: { color: C.CRIM }, line: { type: 'none' } });
      T(s, [en('I = ', { color: C.MUTED }), en(w_.amps, { bold: true, color: C.CRIM })], { x: x0 + 4.3, y: y + 0.25, w: 1.8, h: 0.4, fontSize: 20, align: 'center' });
      // result
      line(s, x0 + 6.35, y + 0.3, x0 + 6.35, y + 1.4, C.LINE, 1);
      T(s, [en('R = ', { color: C.MUTED }), en(w_.r, { bold: true, color: C.INK })], { x: x0 + 6.5, y: y + 0.45, w: 1.7, h: 0.8, fontSize: 28, align: 'center', valign: 'middle' });
    });
    // insight panel
    const ix = 9.35, iw = W - M - ix;
    rrect(s, ix, 2.55, iw, 3.65, C.INK, { rectRadius: 0.1 });
    T(s, 'WHY?', { x: ix + 0.35, y: 2.8, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.YEL, charSpacing: 3 });
    eq(s, ix + 0.35, 3.65, ['I = ', { n: 'V', d: 'R' }], { size: 36, color: 'FFFFFF' });
    T(s, [en('More resistance → less current', { bold: true, breakLine: true }), hi('प्रतिरोध अधिक → धारा कम', { fontSize: 16, color: 'C9D1DA' })],
      { x: ix + 0.35, y: 4.55, w: iw - 0.6, h: 1.4, fontSize: 18, color: 'FFFFFF', lineSpacingMultiple: 1.1 });
    note(s, 'R = V ÷ I   →   100 ÷ 5 = 20 Ω,   100 ÷ 20 = 5 Ω', M, 6.35, 8.4, 0.5, { fontSize: 23, rotate: -1 });
    s.addNotes('Both wires have 100 V across them. Wire 1 carries 5 A, wire 2 carries 20 A. Using R = V/I: wire 1 has 20 Ω, wire 2 has 5 Ω. Same voltage — more resistance means less current.');
  }

  // ---------- 6. PYQ 1 ----------
  {
    const s = S(null);
    pyqHeader(s, { name: 'ALP', date: '29 Nov 2024 · 4th Shift' }, 'Q.01');
    T(s, 'If the resistance of a conductor is increased to three times, then the current will be: (Voltage V remains constant)', { x: M, y: 1.75, w: 11.9, h: 1.05, fontSize: 27, color: C.INK, lineSpacingMultiple: 1.05 });
    T(s, 'यदि किसी चालक का प्रतिरोध तीन गुना बढ़ा दिया जाए, तो धारा होगी? (वोल्टेज V स्थिर है)', { x: M, y: 2.85, w: 11.9, h: 0.6, fontSize: 21, fontFace: HF, color: C.NAVY });
    options(s, [{ en: 'one ninth', hi: 'एक नौवां' }, { en: 'three times', hi: 'तीन गुना' }, { en: 'one third', hi: 'एक तिहाई' }, { en: 'nine times', hi: 'नौ गुना' }], M, 3.85, W - 2 * M, 1.15);
    s.addNotes('Pause for viewers. Key phrase: voltage remains constant.');
  }

  // ---------- 7. SOLUTION 1 ----------
  {
    const s = S('Solution · Q.01');
    title(s, 'Resistance ×3 — what happens to current?', 'प्रतिरोध तीन गुना — धारा का क्या होगा?');
    givenBox(s, M, 2.45, 3.4, 3.95, ['V = constant', 'R  →  3R'], { find: 'New current' });
    const sx = 4.55;
    T(s, 'STEPS', { x: sx, y: 2.45, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    const stepRow = (i, parts, last) => {
      const y = 2.85 + i * 1.18;
      oval(s, sx, y + 0.35, 0.4, 0.4, last ? C.CRIM : C.NAVYT);
      T(s, String(i + 1), { x: sx, y: y + 0.35, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
      eq(s, sx + 0.65, y + 0.55, parts, { size: 30, color: last ? C.CRIM : C.INK });
    };
    stepRow(0, ['I = ', { n: 'V', d: 'R' }]);
    stepRow(1, [[en('I'), en('new', { subscript: true }), en(' = ')], { n: 'V', d: '3R' }]);
    stepRow(2, [[en('I'), en('new', { subscript: true }), en(' = ')], { n: 'I', d: '3' }], true);
    answerCard(s, 9.1, 2.45, W - M - 9.1, 2.0, 'C', 'one third', 'एक तिहाई');
    // see-saw visual
    const vx = 9.1, vy = 4.75, vw = W - M - 9.1;
    rrect(s, vx, vy, vw, 1.65, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    T(s, [en('R ', { bold: true }), en('× 3', { bold: true, color: C.CRIM }), en('    →    ', { color: C.SOFT }), en('I ', { bold: true }), en('÷ 3', { bold: true, color: C.CRIM })], { x: vx + 0.2, y: vy + 0.2, w: vw - 0.4, h: 0.6, fontSize: 28, align: 'center', valign: 'middle' });
    T(s, [en('V constant  ⇒  I ', {}), prop(), en(' 1/R', {})], { x: vx + 0.2, y: vy + 0.95, w: vw - 0.4, h: 0.5, fontSize: 17, color: C.NAVY, align: 'center', valign: 'middle', bold: true });
    s.addNotes('Since V is constant, I = V/R. If R becomes 3R, the new current is V/3R = I/3. Answer: option C, one third.');
  }

  // ---------- 8. PYQ 2 ----------
  {
    const s = S(null);
    pyqHeader(s, { name: 'RRB ALP CBT-2', date: '23/01/2019' }, 'Q.02');
    T(s, 'Find the resistance of the wire (in kΩ) through which a 5 mA current flows when 500 V of potential difference is applied across it.', { x: M, y: 1.7, w: 11.9, h: 1.3, fontSize: 26, color: C.INK, lineSpacingMultiple: 1.05 });
    T(s, [hi('उस तार का प्रतिरोध ('), en('kΩ'), hi(' में) ज्ञात कीजिए जिससे 500 V का विभवांतर लगाने पर 5 mA की धारा प्रवाहित होती है।')], { x: M, y: 3.1, w: 11.9, h: 0.95, fontSize: 21, color: C.NAVY, lineSpacingMultiple: 1.1 });
    options(s, [{ en: '1,00,000' }, { en: '100' }, { en: '2.5' }, { en: '2,500' }], M, 4.25, W - 2 * M, 1.0);
    s.addNotes('Pause for viewers. Watch the units: current is in mA and the answer is asked in kΩ.');
  }

  // ---------- 9. SOLUTION 2 ----------
  {
    const s = S('Solution · Q.02');
    title(s, 'Find the resistance in kΩ', [hi('प्रतिरोध '), en('kΩ'), hi(' में ज्ञात करें')]);
    givenBox(s, M, 2.45, 3.4, 3.95, ['V = 500 V', 'I = 5 mA'], { find: 'R (in kΩ)' });
    const sx = 4.55;
    T(s, 'STEPS', { x: sx, y: 2.45, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    const rows = [
      ['R = ', { n: 'V', d: 'I' }],
      ['R = ', { n: '500', d: [en('5 × 10'), en('−3', { superscript: true })] }],
      [[en('R = 1,00,000 Ω = 10'), en('5', { superscript: true }), en(' Ω')]],
      ['R = 100 kΩ'],
    ];
    rows.forEach((r, i) => {
      const y = 2.85 + i * 0.93, last = i === rows.length - 1;
      oval(s, sx, y + 0.2, 0.4, 0.4, last ? C.CRIM : C.NAVYT);
      T(s, String(i + 1), { x: sx, y: y + 0.2, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
      eq(s, sx + 0.65, y + 0.4, r, { size: i === 2 ? 24 : 30, color: last ? C.CRIM : C.INK });
    });
    answerCard(s, 9.1, 2.45, W - M - 9.1, 2.0, 'B', '100 kΩ');
    const kx = 9.1, ky = 4.7, kw = W - M - 9.1;
    rrect(s, kx, ky, kw, 1.95, C.CRIMT, { rectRadius: 0.08 });
    T(s, 'EXAM TRAP', { x: kx + 0.3, y: ky + 0.22, w: kw - 0.6, h: 0.3, fontSize: 12, bold: true, color: C.CRIM, charSpacing: 2 });
    T(s, [en('Option A (1,00,000) is the value in Ω. The question asks kΩ.', { breakLine: true }), hi('विकल्प A ओम में है — प्रश्न kΩ में पूछ रहा है।', { fontSize: 15, color: C.NAVY })],
      { x: kx + 0.3, y: ky + 0.55, w: kw - 0.6, h: 1.3, fontSize: 16, color: C.INK });
    s.addNotes('Convert first: 5 mA = 5 × 10⁻³ A. R = V/I = 500 / (5 × 10⁻³) = 1,00,000 Ω = 100 kΩ. Answer: option B. Trap: option A is the same value in ohm.');
  }

  // ---------- 10. QUICK ROUND + TAKEAWAY ----------
  {
    const s = S('05 · Quick PYQ round');
    title(s, 'Two more PYQs, same law', 'दो और PYQ — वही नियम');
    const qs = [
      { exam: 'RRB Technicians Grade III', date: '26/12/2024 · Shift 1', q: 'A resistor has current flowing through it. If its resistance is halved while the voltage across it is kept constant, what will be the change in current?', ans: 'C', val: 'It will be doubled.', vhi: 'इसे दोगुना कर दिया जाएगा।', why: ['I = ', { n: 'V', d: 'R/2' }, ' = 2I'] },
      { exam: 'RRB Technicians Grade III', date: '26/12/2024 · Shift 3', q: 'A current of 2 A flows through a wire when the two ends of the wire are maintained at a potential difference of 4 V. The resistance of the wire will be:', ans: 'D', val: '2 Ω', vhi: '', why: ['R = ', { n: '4', d: '2' }, ' = 2 Ω'] },
    ];
    const cw = (W - 2 * M - 0.4) / 2;
    qs.forEach((q, i) => {
      const x = M + i * (cw + 0.4), y = 2.4, h = 3.5;
      rrect(s, x, y, cw, h, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(q.exam, { bold: true, color: C.CRIM }), en('  ·  ' + q.date, { color: C.NAVY })], { x: x + 0.35, y: y + 0.25, w: cw - 0.7, h: 0.3, fontSize: 13 });
      T(s, q.q, { x: x + 0.35, y: y + 0.62, w: cw - 0.7, h: 1.25, fontSize: 17, color: C.INK, lineSpacingMultiple: 1.05 });
      line(s, x + 0.35, y + 1.95, x + cw - 0.35, y + 1.95, C.LINE, 1);
      oval(s, x + 0.35, y + 2.15, 0.55, 0.55, C.GREEN);
      T(s, q.ans, { x: x + 0.35, y: y + 2.15, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      const vr = [en(q.val, { bold: true, fontSize: 21, breakLine: !!q.vhi })];
      if (q.vhi) vr.push(hi(q.vhi, { fontSize: 15, color: C.NAVY }));
      T(s, vr, { x: x + 1.1, y: y + 2.05, w: cw - 1.4, h: 0.75, valign: 'middle' });
      T(s, 'WHY', { x: x + 0.35, y: y + 2.95, w: 0.7, h: 0.3, fontSize: 11, bold: true, color: C.MUTED, charSpacing: 2 });
      eq(s, x + 1.1, y + 3.08, q.why, { size: 21, color: C.NAVY });
    });
    // takeaway
    marker(s, M, 6.1, W - 2 * M, 0.66, C.YELT);
    T(s, [en('EXAM TAKEAWAY     ', { bold: true, color: C.CRIM, fontSize: 13, charSpacing: 2 }), en('V constant  ⇒  I ', { bold: true }), prop({ bold: true }), en(' 1/R', { bold: true }), en('     ', {}), hi('V स्थिर हो, तो धारा प्रतिरोध के व्युत्क्रमानुपाती होती है।', { color: C.NAVY, fontSize: 17 })],
      { x: M + 0.3, y: 6.1, w: W - 2 * M - 0.6, h: 0.66, fontSize: 20, valign: 'middle' });
    s.addNotes('Rapid round. Q1: R halved with V constant → current doubles (option C). Q2: R = V/I = 4/2 = 2 Ω (option D). Takeaway: with V constant, I ∝ 1/R.');
  }

  return p.writeFile({ fileName: out });
};
