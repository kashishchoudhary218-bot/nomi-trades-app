const L_ = require('./lib');
const { C, HF, NF, W, H, M, IMG, T, en, hi, rect, rrect, oval, line, arrow, frac, base, title, note, marker, pill, pyqHeader, options, answerCard, givenBox, eq, wire, sci } = L_;
const prop = (o = {}) => ({ text: '∝', options: Object.assign({ fontFace: 'Cambria Math' }, o) });
const CU = 'C98A4B', CU_D = '8A5A2B', NI = 'A7ADB5';

module.exports = function build(out) {
  const p = L_.newDeck('Electrical Resistance & Resistivity');
  const meta = { topic: 'Resistance & Resistivity', deck: 'Demo 03 · Competitive-Exam Teaching', total: 11 };
  let n = 0;
  const S = (section) => { const s = p.addSlide(); n++; base(s, Object.assign({ section }, meta), n); return s; };

  // ---------- 1. COVER ----------
  {
    const s = p.addSlide(); n++;
    s.background = { color: C.INK };
    T(s, 'Ω', { x: 6.9, y: -0.6, w: 6.4, h: 8.2, fontSize: 480, bold: true, color: '16212C', align: 'center', valign: 'middle' });
    s.addImage({ path: IMG('resistor.png'), x: 7.75, y: 3.4, w: 5.4, h: 5.4 * 266 / 608 });
    rect(s, M, 0.62, 0.14, 0.14, C.YEL);
    T(s, [en('PHYSICS  ·  ', { bold: true, color: 'FFFFFF', charSpacing: 2 }), hi('भौतिक विज्ञान', { color: 'C9D1DA' })], { x: M + 0.28, y: 0.52, w: 6, h: 0.35, fontSize: 14 });
    T(s, 'DEMO 03  ·  ADVANCED EXAM TEACHING', { x: M, y: 2.05, w: 7, h: 0.35, fontSize: 13, bold: true, color: C.YEL, charSpacing: 3 });
    T(s, 'Electrical Resistance\n& Resistivity', { x: M, y: 2.5, w: 7.2, h: 1.95, fontSize: 50, bold: true, color: 'FFFFFF', lineSpacingMultiple: 0.95 });
    T(s, 'विद्युत प्रतिरोध और प्रतिरोधकता', { x: M, y: 4.55, w: 7, h: 0.7, fontSize: 30, fontFace: HF, color: C.YEL });
    T(s, [en('R = ρ ', { color: 'FFFFFF', bold: true }), en('L / A', { color: 'FFFFFF', bold: true }), en('      Electricity · Part 2  |  ', { color: 'C9D1DA' }), hi('विद्युत · भाग 2', { color: 'C9D1DA' })], { x: M, y: 5.35, w: 7.5, h: 0.4, fontSize: 17 });
    T(s, 'Concept   →   Diagram   →   Derivation   →   PYQ   →   Revision', { x: M, y: 6.6, w: 9, h: 0.35, fontSize: 13, color: '8D97A3', charSpacing: 1 });
    s.addNotes('Cover. Demo 03 of 03 — advanced competitive-exam teaching on resistance and resistivity.');
  }

  // ---------- 2. WHAT IS RESISTANCE ----------
  {
    const s = S('01 · The concept');
    title(s, 'What is resistance?', 'प्रतिरोध क्या है?');
    // flow visual
    const by = 2.4, bh = 1.95;
    rrect(s, M, by, W - 2 * M, bh, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    const midY = by + 0.95;
    s.addShape('rightArrow', { x: 1.05, y: midY - 0.32, w: 2.9, h: 0.64, fill: { color: C.CRIM }, line: { type: 'none' } });
    T(s, [en('Current in  ', { bold: true }), hi('धारा', { color: C.MUTED })], { x: 1.05, y: by + 1.45, w: 2.9, h: 0.35, fontSize: 15, align: 'center' });
    const rw = 3.7, rh = rw * 266 / 608;
    s.addImage({ path: IMG('resistor.png'), x: W / 2 - rw / 2, y: midY - rh / 2 - 0.05, w: rw, h: rh });
    T(s, [en('RESISTANCE  ', { bold: true, color: C.INK, charSpacing: 2 }), hi('प्रतिरोध', { color: C.CRIM, bold: true })], { x: W / 2 - 2, y: by + 1.45, w: 4, h: 0.35, fontSize: 15, align: 'center' });
    s.addShape('rightArrow', { x: 9.4, y: midY - 0.13, w: 2.9, h: 0.26, fill: { color: 'D98A8F' }, line: { type: 'none' } });
    T(s, [en('Reduced flow  ', { bold: true }), hi('कम प्रवाह', { color: C.MUTED })], { x: 9.4, y: by + 1.45, w: 2.9, h: 0.35, fontSize: 15, align: 'center' });
    // definition
    T(s, 'Resistance of a material is its property to oppose the flow of charges and hence the passage of current through it. It is different for different materials.',
      { x: M, y: 4.65, w: 7.5, h: 1.2, fontSize: 20, color: C.INK, lineSpacingMultiple: 1.07 });
    T(s, 'किसी पदार्थ का प्रतिरोध, आवेशों के प्रवाह का (और इसलिए उसमें से धारा के प्रवाह का) विरोध करने का गुण है। यह अलग-अलग पदार्थों के लिए अलग होता है।',
      { x: M, y: 5.85, w: 7.5, h: 0.95, fontSize: 16.5, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.1 });
    // unit card
    const ux = 8.75, uw = W - M - ux;
    rrect(s, ux, 4.65, uw, 2.1, C.INK, { rectRadius: 0.1 });
    T(s, [en('SI UNIT  ·  ', { charSpacing: 2 }), hi('SI इकाई')], { x: ux + 0.35, y: 4.87, w: uw - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.YEL });
    T(s, 'Ω', { x: ux + 0.2, y: 5.2, w: 1.4, h: 1.35, fontSize: 72, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, [en('ohm', { bold: true, fontSize: 30, color: 'FFFFFF', breakLine: true }), hi('ओम', { fontSize: 18, color: 'C9D1DA' })], { x: ux + 1.7, y: 5.25, w: uw - 1.9, h: 1.25, valign: 'middle' });
    s.addNotes('Resistance is the property of a material that opposes the flow of charges, and hence the flow of current. It differs from material to material. SI unit: ohm, symbol Ω.');
  }

  // ---------- 3. FACTORS ----------
  {
    const s = S('02 · What decides resistance');
    title(s, 'Resistance depends on four factors', 'प्रतिरोध चार कारकों पर निर्भर करता है');
    const gap = 0.25, cw = (W - 2 * M - 3 * gap) / 4, cy = 2.4, ch = 3.85;
    const cards = [
      { t: 'Material', h: 'पदार्थ', c1: 'Change the material →', c2: 'R changes', ch: 'अलग पदार्थ → अलग प्रतिरोध' },
      { t: 'Length', h: 'लंबाई', c1: 'Longer wire →', c2: 'more R', ch: 'लंबा तार → अधिक प्रतिरोध' },
      { t: 'Area of cross-section', h: 'अनुप्रस्थ काट का क्षेत्रफल', c1: 'Thicker wire →', c2: 'less R', ch: 'मोटा तार → कम प्रतिरोध' },
      { t: 'Temperature', h: 'तापमान', c1: 'Change temperature →', c2: 'R changes', ch: 'तापमान पर भी निर्भर' },
    ];
    cards.forEach((k, i) => {
      const x = M + i * (cw + gap);
      rrect(s, x, cy, cw, ch, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, String(i + 1).padStart(2, '0'), { x: x + 0.3, y: cy + 0.25, w: 1, h: 0.35, fontSize: 14, bold: true, color: C.CRIM });
      // diagram zone
      const dx = x + 0.35, dw = cw - 0.7, dy = cy + 0.75;
      rect(s, dx, dy, dw, 1.2, 'F3F1EC');
      if (i === 0) {
        wire(s, dx + 0.25, dy + 0.22, dw - 0.5, 0.26, CU);
        wire(s, dx + 0.25, dy + 0.7, dw - 0.5, 0.26, NI, { line: { color: '6F757C', width: 0.75 } });
      } else if (i === 1) {
        wire(s, dx + 0.25, dy + 0.22, (dw - 0.5) * 0.45, 0.24, CU);
        wire(s, dx + 0.25, dy + 0.72, dw - 0.5, 0.24, CU);
      } else if (i === 2) {
        oval(s, dx + dw * 0.28 - 0.14, dy + 0.46, 0.28, 0.28, CU, { line: { color: CU_D, width: 1 } });
        oval(s, dx + dw * 0.68 - 0.42, dy + 0.18, 0.84, 0.84, CU, { line: { color: CU_D, width: 1 } });
        T(s, 'thin', { x: dx + dw * 0.28 - 0.5, y: dy + 0.86, w: 1, h: 0.3, fontSize: 11, color: C.MUTED, align: 'center' });
      } else {
        const tx = dx + dw / 2;
        rrect(s, tx - 0.11, dy + 0.12, 0.22, 0.8, C.CARD, { rectRadius: 0.11, line: { color: C.NAVY, width: 1.5 } });
        rect(s, tx - 0.05, dy + 0.45, 0.1, 0.5, C.CRIM);
        oval(s, tx - 0.18, dy + 0.82, 0.36, 0.36, C.CRIM, { line: { color: C.NAVY, width: 1.5 } });
      }
      T(s, [en(k.t, { bold: true, fontSize: 19, breakLine: true }), hi(k.h, { fontSize: 15, color: C.NAVY })], { x: x + 0.3, y: cy + 2.08, w: cw - 0.6, h: 1.0 });
      T(s, [en(k.c1 + ' ' + k.c2, { breakLine: true, fontSize: 14, bold: true, color: C.INK }), hi(k.ch, { fontSize: 14, color: C.MUTED })], { x: x + 0.3, y: cy + 3.05, w: cw - 0.6, h: 0.65 });
    });
    note(s, 'PYQs say "at constant temperature" — this is why!', M, 6.33, 9, 0.5, { fontSize: 24, rotate: -1 });
    s.addNotes('Four factors decide resistance: the material, the length, the area of cross-section and the temperature. PYQs often fix temperature so that only the other factors matter.');
  }

  // ---------- 4. L AND A ----------
  {
    const s = S('03 · Visual relationship');
    title(s, 'How length and area change resistance', 'लंबाई और क्षेत्रफल प्रतिरोध को कैसे बदलते हैं');
    const pw = (W - 2 * M - 0.35) / 2, py = 2.4, ph = 3.35;
    // panel L
    const panels = [
      { x: M, head: 'LENGTH  (L)', hh: 'लंबाई', res: [en('R ', {}), prop(), en(' L', {})], cap: 'L ↑  ⇒  R ↑', caph: 'लंबाई बढ़े → प्रतिरोध बढ़े' },
      { x: M + pw + 0.35, head: 'AREA  (A)', hh: 'अनुप्रस्थ काट का क्षेत्रफल', res: [en('R ', {}), prop(), en(' 1/A', {})], cap: 'A ↑  ⇒  R ↓', caph: 'क्षेत्रफल बढ़े → प्रतिरोध घटे' },
    ];
    panels.forEach((pn, i) => {
      rrect(s, pn.x, py, pw, ph, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(pn.head + '   ', { bold: true, charSpacing: 2 }), hi(pn.hh, { color: C.MUTED })], { x: pn.x + 0.35, y: py + 0.25, w: pw - 0.7, h: 0.35, fontSize: 13, color: C.INK });
      const dx = pn.x + 0.45, dw = pw - 2.6;
      if (i === 0) {
        wire(s, dx, py + 0.95, dw * 0.45, 0.28, CU);
        T(s, 'short', { x: dx + dw * 0.45 + 0.15, y: py + 0.92, w: 1, h: 0.34, fontSize: 13, color: C.MUTED });
        wire(s, dx, py + 1.65, dw, 0.28, CU);
        T(s, 'long', { x: dx, y: py + 2.0, w: 1, h: 0.3, fontSize: 13, color: C.MUTED });
      } else {
        wire(s, dx, py + 0.98, dw, 0.14, CU);
        T(s, 'thin', { x: dx, y: py + 1.15, w: 1, h: 0.3, fontSize: 13, color: C.MUTED });
        wire(s, dx, py + 1.55, dw, 0.5, CU);
        T(s, 'thick', { x: dx, y: py + 2.1, w: 1, h: 0.3, fontSize: 13, color: C.MUTED });
      }
      // result box
      rrect(s, pn.x + pw - 1.95, py + 0.85, 1.6, 1.45, C.NAVYT, { rectRadius: 0.08 });
      T(s, pn.res, { x: pn.x + pw - 1.95, y: py + 0.85, w: 1.6, h: 1.45, fontSize: 28, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
      line(s, pn.x + 0.35, py + 2.55, pn.x + pw - 0.35, py + 2.55, C.LINE, 1);
      T(s, [en(pn.cap + '     ', { bold: true, fontSize: 20, color: C.CRIM }), hi(pn.caph, { fontSize: 16, color: C.NAVY })], { x: pn.x + 0.35, y: py + 2.62, w: pw - 0.7, h: 0.6, valign: 'middle' });
    });
    // combine band
    marker(s, M, 6.0, W - 2 * M, 0.72, C.YELT);
    T(s, [en('COMBINE BOTH     ', { bold: true, color: C.CRIM, fontSize: 13, charSpacing: 2 }), en('R ', { bold: true }), prop({ bold: true }), en(' L / A', { bold: true }), en('      directly ∝ length, inversely ∝ area', { color: C.NAVY, fontSize: 17 })],
      { x: M + 0.3, y: 6.0, w: W - 2 * M - 0.6, h: 0.72, fontSize: 24, valign: 'middle' });
    s.addNotes('Longer wire → more resistance: R ∝ L. Thicker wire (larger area) → less resistance: R ∝ 1/A. Together: R ∝ L/A.');
  }

  // ---------- 5. DERIVATION ----------
  {
    const s = S('04 · Derive the formula');
    title(s, 'From proportion to formula', 'समानुपात से सूत्र तक');
    T(s, [en("The resistance of any conductor 'R' is directly proportional to its length 'L' and inversely proportional to its area of cross-section 'A'.", { breakLine: true }),
      hi("किसी भी चालक का प्रतिरोध 'R' चालक की लंबाई 'L' के समानुपाती और इसके अनुप्रस्थ काट के क्षेत्रफल 'A' के व्युत्क्रमानुपाती होता है।", { fontSize: 16, color: C.NAVY })],
      { x: M, y: 2.3, w: W - 2 * M, h: 1.15, fontSize: 19, color: C.INK, lineSpacingMultiple: 1.08 });
    // chain
    const cx = M, cw = 5.1;
    const r1y = 3.65;
    rrect(s, cx, r1y, cw, 0.72, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    T(s, [en('R ', {}), prop(), en(' L', {}), en('      and      ', { color: C.MUTED, bold: false, fontSize: 16 }), en('R ', {}), prop(), en(' 1/A', {})], { x: cx, y: r1y, w: cw, h: 0.72, fontSize: 26, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
    s.addShape('downArrow', { x: cx + cw / 2 - 0.18, y: r1y + 0.76, w: 0.36, h: 0.22, fill: { color: C.SOFT }, line: { type: 'none' } });
    const r2y = r1y + 1.02;
    rrect(s, cx, r2y, cw, 0.72, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    T(s, [en('R ', {}), prop(), en(' L / A', {})], { x: cx, y: r2y, w: cw, h: 0.72, fontSize: 26, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
    s.addShape('downArrow', { x: cx + cw / 2 - 0.18, y: r2y + 0.76, w: 0.36, h: 0.22, fill: { color: C.SOFT }, line: { type: 'none' } });
    const r3y = r2y + 1.02;
    rrect(s, cx, r3y, cw, 1.08, C.INK, { rectRadius: 0.1 });
    T(s, 'R = ρ', { x: cx + 0.9, y: r3y, w: 2.1, h: 1.08, fontSize: 40, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle' });
    frac(s, cx + 3.5, r3y + 0.05, 'L', 'A', { size: 27, color: 'FFFFFF', w: 0.8, barColor: C.YEL });
    // cylinder diagram
    const gx = 6.35, gw = W - M - gx, gy = 3.65, gh = 3.0;
    rrect(s, gx, gy, gw, gh, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    const wx = gx + 0.85, wl = gw - 1.7, wy = gy + 1.05, wt = 0.95;
    wire(s, wx, wy, wl, wt, 'D7A06A');
    // L dimension
    line(s, wx, gy + 0.55, wx + wl, gy + 0.55, C.INK, 1.5, { beginArrowType: 'triangle', endArrowType: 'triangle' });
    line(s, wx, gy + 0.4, wx, gy + 0.95, C.SOFT, 1);
    line(s, wx + wl, gy + 0.4, wx + wl, gy + 0.95, C.SOFT, 1);
    T(s, [en('L', { bold: true, fontSize: 20 }), en('  length', { color: C.MUTED, fontSize: 14 })], { x: wx + wl / 2 - 1, y: gy + 0.2, w: 2, h: 0.32, align: 'center', color: C.INK });
    T(s, [en('ρ', { bold: true, fontSize: 22, color: C.INK }), en('  resistivity', { fontSize: 15, color: C.INK })], { x: wx + wl / 2 - 1.3, y: wy, w: 2.6, h: wt, align: 'center', valign: 'middle' });
    arrow(s, wx - 0.5, wy + wt + 0.55, wx + 0.02, wy + wt / 2 + 0.1, C.CRIM, 1.75);
    T(s, [en('A', { bold: true, fontSize: 20, color: C.CRIM }), en('  area of cross-section', { color: C.MUTED, fontSize: 14 })], { x: wx - 0.6, y: wy + wt + 0.55, w: 4, h: 0.35 });
    T(s, [en('ρ (rho) = resistivity  ·  ', { color: C.NAVY }), hi('प्रतिरोधकता', { color: C.NAVY })], { x: gx + 0.35, y: gy + gh - 0.5, w: gw - 0.7, h: 0.35, fontSize: 14, align: 'right' });
    s.addNotes('R ∝ L and R ∝ 1/A, so R ∝ L/A. Replacing the proportional sign with a constant ρ (rho) gives R = ρ L / A. ρ is the resistivity of the material.');
  }

  // ---------- 6. RESISTIVITY ----------
  {
    const s = S('05 · Resistivity');
    title(s, 'What is resistivity (ρ)?', 'प्रतिरोधकता (ρ) क्या है?');
    T(s, [en('ρ (rho) is a constant, called ', {}), en('electrical resistivity', { bold: true }), en(' or ', {}), en('specific resistance', { bold: true }), en(' of the material of the conductor.', { breakLine: true }),
      hi('ρ (rho) एक स्थिरांक है, जिसे चालक के पदार्थ की विद्युत प्रतिरोधकता या विशिष्ट प्रतिरोध कहा जाता है।', { fontSize: 16.5, color: C.NAVY })],
      { x: M, y: 2.35, w: 6.2, h: 1.85, fontSize: 20, color: C.INK, lineSpacingMultiple: 1.08 });
    // formula card
    const fx = 7.2, fw = W - M - fx, fy = 2.35, fh = 2.2;
    rrect(s, fx, fy, fw, fh, C.INK, { rectRadius: 0.1 });
    T(s, 'ρ =', { x: fx + 0.5, y: fy + 0.15, w: 1.6, h: 1.3, fontSize: 48, bold: true, color: C.YEL, align: 'right', valign: 'middle' });
    frac(s, fx + 2.95, fy + 0.12, 'RA', 'L', { size: 34, color: 'FFFFFF', w: 1.4, barColor: C.YEL });
    T(s, [en('Unit: ', { color: '8D97A3' }), en('ohm metre (Ω m)', { bold: true, color: 'FFFFFF' }), en('  ·  ', { color: '8D97A3' }), hi('ओम मीटर', { color: 'C9D1DA' })], { x: fx + 0.4, y: fy + 1.65, w: fw - 0.6, h: 0.35, fontSize: 15, align: 'left' });
    T(s, [en('from R = ρL/A', {})], { x: fx + fw - 2.1, y: fy + 0.25, w: 1.85, h: 0.3, fontSize: 12, color: '8D97A3', align: 'right' });
    // unit block diagram
    const by = 4.75, bh = 1.97;
    rrect(s, M, by, 5.55, bh, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    const wx = M + 0.5, wl = 2.8, wt = 0.75, wy = by + 0.65;
    wire(s, wx, wy, wl, wt, 'D7A06A');
    line(s, wx, by + 0.4, wx + wl, by + 0.4, C.INK, 1.25, { beginArrowType: 'triangle', endArrowType: 'triangle' });
    T(s, 'L = 1 m', { x: wx + wl / 2 - 0.8, y: by + 0.08, w: 1.6, h: 0.3, fontSize: 14, bold: true, align: 'center' });
    T(s, [en('A = 1 m'), en('2', { superscript: true })], { x: wx - 0.2, y: wy + wt + 0.12, w: 1.8, h: 0.3, fontSize: 14, bold: true, color: C.CRIM });
    s.addShape('rightArrow', { x: wx + wl + 0.35, y: wy + wt / 2 - 0.18, w: 0.55, h: 0.36, fill: { color: C.SOFT }, line: { type: 'none' } });
    T(s, 'ρ = R', { x: wx + wl + 1.0, y: wy - 0.2, w: 1.5, h: 1.2, fontSize: 34, bold: true, color: C.CRIM, valign: 'middle' });
    // definition
    const dx = M + 5.85, dw = W - M - dx;
    rrect(s, dx, by, dw, bh, C.YELT, { rectRadius: 0.08 });
    T(s, 'HENCE, DEFINITION', { x: dx + 0.35, y: by + 0.22, w: dw - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.CRIM, charSpacing: 2 });
    T(s, [en('Resistivity of a material is the resistance of a conductor of unit length and unit area of cross-section.', { breakLine: true }),
      hi('किसी पदार्थ की प्रतिरोधकता, इकाई लंबाई और इकाई अनुप्रस्थ काट क्षेत्रफल वाले चालक का प्रतिरोध है।', { fontSize: 15, color: C.NAVY })],
      { x: dx + 0.35, y: by + 0.5, w: dw - 0.5, h: 1.4, fontSize: 16, color: C.INK, lineSpacingMultiple: 1.03 });
    s.addNotes('ρ is the resistivity or specific resistance of the material. Rearranging, ρ = RA/L. If L = 1 m and A = 1 m², then ρ = R — so resistivity is the resistance of a conductor of unit length and unit cross-sectional area. Unit: ohm metre (Ω m).');
  }

  // ---------- 7. TABLE ----------
  {
    const s = S('06 · Real values');
    title(s, 'Resistivity of common materials', 'सामान्य पदार्थों की प्रतिरोधकता  ·  (Ω m)');
    const cols = [
      { t: 'Conductors', h: 'चालक', tag: '~ 10⁻⁸ Ω m', fill: C.CARD, rows: [
        ['Silver', sci('1.60', '-8')], ['Copper', sci('1.62', '-8')], ['Aluminium', sci('2.63', '-8')], ['Tungsten', sci('5.20', '-8')], ['Nickel', sci('6.84', '-8')],
        ['Iron', sci('10.0', '-8')], ['Chromium', sci('12.9', '-8')], ['Mercury', sci('94.0', '-8')], ['Manganese', sci('1.84', '-6')]] },
      { t: 'Alloys', h: 'मिश्रधातु', tag: '~ 10⁻⁶ Ω m', fill: C.CARD, rows: [
        ['Constantan', sci('49', '-6'), 'alloy of Cu and Ni'], ['Manganin', sci('44', '-6'), 'alloy of Cu, Mn and Ni'], ['Nichrome', sci('100', '-6'), 'alloy of Ni, Cr, Mn and Fe']] },
      { t: 'Insulators', h: 'कुचालक', tag: 'up to 10¹⁷ Ω m', fill: C.CARD, rows: [
        ['Glass', [...sci('', '10'), en(' – '), ...sci('', '14')]], ['Hard rubber', [...sci('', '13'), en(' – '), ...sci('', '16')]], ['Ebonite', [...sci('', '15'), en(' – '), ...sci('', '17')]],
        ['Diamond', [...sci('', '12'), en(' – '), ...sci('', '13')]], ['Paper (dry)', sci('', '12')]] },
    ];
    const gap = 0.3, cw = (W - 2 * M - 2 * gap) / 3, cy = 2.35, ch = 4.45;
    cols.forEach((c, i) => {
      const x = M + i * (cw + gap);
      rrect(s, x, cy, cw, ch, c.fill, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(c.t + '  ', { bold: true, fontSize: 20 }), hi(c.h, { fontSize: 16, color: C.NAVY })], { x: x + 0.3, y: cy + 0.18, w: cw - 0.6, h: 0.5, valign: 'middle' });
      pill(s, c.tag, x + 0.3, cy + 0.72, 1.45, { h: 0.34, fill: i === 0 ? C.NAVY : (i === 1 ? C.YEL : C.CRIM), color: i === 1 ? C.INK : 'FFFFFF', size: 10.5, cs: 0 });
      line(s, x + 0.3, cy + 1.2, x + cw - 0.3, cy + 1.2, C.LINE, 1);
      const rh = i === 1 ? 0.95 : 0.335, y0 = cy + 1.3;
      c.rows.forEach((r, j) => {
        const y = y0 + j * rh;
        const hl = i === 0 && j < 2;
        if (hl) rect(s, x + 0.15, y - 0.01, cw - 0.3, rh - 0.02, C.YELT);
        if (r[2]) {
          T(s, [en(r[0], { bold: true, breakLine: true }), en(r[2], { fontSize: 12.5, color: C.MUTED })], { x: x + 0.3, y, w: cw * 0.55, h: rh - 0.1, fontSize: 16, color: C.INK, valign: 'middle' });
        } else {
          T(s, r[0], { x: x + 0.3, y, w: cw * 0.5, h: rh, fontSize: 15, color: C.INK, valign: 'middle', bold: hl });
        }
        T(s, r[1], { x: x + cw * 0.45, y, w: cw * 0.55 - 0.3, h: r[2] ? rh - 0.1 : rh, fontSize: 15, color: C.INK, align: 'right', valign: 'middle', bold: hl });
      });
    });
    s.addNotes('Conductors have resistivity around 10⁻⁸ Ω m (silver and copper are the lowest). Alloys are around 10⁻⁶ Ω m. Insulators range from 10¹⁰ up to 10¹⁷ Ω m.');
  }

  // ---------- 8. PYQ ----------
  {
    const s = S(null);
    pyqHeader(s, { name: 'ALP', date: '25 Nov 2024 · 2nd Shift' }, 'Q.01');
    T(s, 'The resistance of a 10 m long copper wire is R ohm. What will be the resistance of a 5 m long copper wire?', { x: M, y: 1.75, w: 11.9, h: 1.05, fontSize: 27, color: C.INK, lineSpacingMultiple: 1.05 });
    T(s, '10 मीटर लंबे तांबे के तार का प्रतिरोध R ओम है। 5 मीटर लंबे तांबे के तार का प्रतिरोध कितना होगा?', { x: M, y: 2.85, w: 11.9, h: 0.95, fontSize: 21, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.1 });
    options(s, [{ en: '0.5R ohm' }, { en: 'R ohm' }, { en: '5R ohm' }, { en: '2R ohm' }], M, 4.05, W - 2 * M, 1.0);
    s.addNotes('Pause for viewers. Both wires are copper — what stays the same, and what changes?');
  }

  // ---------- 9. SOLUTION ----------
  {
    const s = S('Solution · Q.01');
    title(s, 'Half the length, half the resistance', 'लंबाई आधी → प्रतिरोध आधा');
    givenBox(s, M, 2.45, 3.4, 3.95, ['L₁ = 10 m → R', 'L₂ = 5 m'], { find: 'R₂ = ?' });
    const sx = 4.55;
    T(s, 'STEPS', { x: sx, y: 2.45, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    const rows = [
      ['R = ρ', { n: 'L', d: 'A' }],
      [[en('R '), prop(), en(' L')]],
      [[en('R₂ = R × ')], { n: '5', d: '10' }],
      ['R₂ = 0.5R'],
    ];
    rows.forEach((r, i) => {
      const y = 2.85 + i * 0.93, last = i === rows.length - 1;
      oval(s, sx, y + 0.2, 0.4, 0.4, last ? C.CRIM : C.NAVYT);
      T(s, String(i + 1), { x: sx, y: y + 0.2, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
      eq(s, sx + 0.65, y + 0.4, r, { size: 30, color: last ? C.CRIM : C.INK });
    });
    note(s, 'same copper → same ρ, same A', M + 0.15, 5.7, 3.2, 0.45, { fontSize: 19, rotate: -3 });
    answerCard(s, 9.1, 2.45, W - M - 9.1, 2.0, 'A', '0.5R ohm');
    // same logic card
    const kx = 9.1, ky = 4.7, kw = W - M - 9.1;
    rrect(s, kx, ky, kw, 1.95, C.YELT, { rectRadius: 0.08 });
    T(s, [en('SAME LOGIC', { bold: true, color: C.CRIM, charSpacing: 1.5, breakLine: true }), en('ALP 28 Nov 2024 · 1st Shift', { color: C.NAVY })], { x: kx + 0.3, y: ky + 0.18, w: kw - 0.5, h: 0.5, fontSize: 11 });
    T(s, [en('Length ×3  →  R ×3', { bold: true, fontSize: 20, breakLine: true }), en('Answer: (B) Tripled  ·  ', { color: C.GREEN, bold: true }), hi('तीन गुना', { color: C.GREEN })],
      { x: kx + 0.3, y: ky + 0.78, w: kw - 0.5, h: 1.0, fontSize: 15, color: C.INK });
    s.addNotes('Both wires are copper, so ρ is the same; A is the same too. So R ∝ L. Length halves from 10 m to 5 m, so R becomes 0.5R. Answer: option A. Same logic: if length is tripled, resistance is tripled (ALP 28 Nov 2024, 1st shift — option B).');
  }

  // ---------- 10. PYQ WITH REVEAL ----------
  {
    const s = S(null);
    pyqHeader(s, { name: 'RRB Technicians Grade III', date: '26/12/2024 · Shift 3' }, 'Q.02');
    T(s, 'Which of the following factors do NOT affect the resistance of a conductor (at constant temperature)?', { x: M, y: 1.65, w: 11.9, h: 0.95, fontSize: 25, color: C.INK, lineSpacingMultiple: 1.03 });
    T(s, 'निम्नलिखित में से कौन से कारक किसी चालक के प्रतिरोध (स्थिर तापमान पर) को प्रभावित नहीं करते हैं?', { x: M, y: 2.62, w: 11.9, h: 0.5, fontSize: 19, fontFace: HF, color: C.NAVY });
    const st = [
      ['i', 'Area of cross-section of the conductor', 'चालक के अनुप्रस्थ काट का क्षेत्रफल', true],
      ['ii', 'Current flowing through the conductor', 'चालक से प्रवाहित धारा', false],
      ['iii', 'Length of the conductor', 'चालक की लंबाई', true],
    ];
    st.forEach((r, i) => {
      const y = 3.3 + i * 0.62;
      if (!r[3]) rect(s, M - 0.1, y - 0.04, W - 2 * M + 0.2, 0.58, C.CRIMT);
      T(s, '(' + r[0] + ')', { x: M, y, w: 0.6, h: 0.5, fontSize: 18, bold: true, color: C.NAVY, valign: 'middle' });
      T(s, [en(r[1] + '   ', { fontSize: 19, color: C.INK }), hi(r[2], { fontSize: 16, color: C.MUTED })], { x: M + 0.65, y, w: 8.4, h: 0.5, valign: 'middle' });
      pill(s, r[3] ? 'AFFECTS R' : 'DOES NOT AFFECT R', W - M - 2.5, y + 0.07, 2.5, { h: 0.36, fill: r[3] ? C.NAVYT : C.CRIM, color: r[3] ? C.NAVY : 'FFFFFF', size: 11, cs: 1 });
    });
    // options in one row
    const ops = [['A', 'Only (iii)', 'केवल (iii)'], ['B', 'Both (i) and (iii)', 'दोनों (i) और (iii)'], ['C', 'Both (i) and (ii)', 'दोनों (i) और (ii)'], ['D', 'Only (ii)', 'केवल (ii)']];
    const ow = (W - 2 * M - 0.6) / 4, oy = 5.25, oh = 0.9;
    ops.forEach((o, i) => {
      const x = M + i * (ow + 0.2), ok = o[0] === 'D';
      rrect(s, x, oy, ow, oh, ok ? C.GREENT : C.CARD, { rectRadius: 0.06, line: { color: ok ? C.GREEN : C.LINE, width: ok ? 2 : 1 } });
      oval(s, x + 0.18, oy + 0.2, 0.5, 0.5, ok ? C.GREEN : C.SOFT);
      T(s, o[0], { x: x + 0.18, y: oy + 0.2, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      T(s, [en(o[1], { bold: true, fontSize: 17, color: ok ? C.INK : C.MUTED, breakLine: true }), hi(o[2], { fontSize: 13.5, color: ok ? C.NAVY : C.SOFT })], { x: x + 0.82, y: oy, w: ow - 0.9, h: oh, valign: 'middle' });
    });
    T(s, [en('Why: ', { bold: true, color: C.CRIM }), en('R = ρL/A has no current (I) in it.   ', {}), hi('धारा प्रतिरोध को प्रभावित नहीं करती।', { color: C.NAVY })],
      { x: M, y: 6.3, w: W - 2 * M, h: 0.45, fontSize: 18, color: C.INK, valign: 'middle' });
    s.addNotes('Reveal-style: area and length both appear in R = ρL/A, so they affect resistance. Current does not appear — it does not affect resistance. Answer: option D, only (ii).');
  }

  // ---------- 11. QUICK REVISION ----------
  {
    const s = S('Quick revision');
    title(s, 'Revise in 30 seconds', '30 सेकंड में दोहराएँ');
    const tiles = [
      { k: 'Resistance', f: [en('Opposes charge flow')], hi: 'आवेश के प्रवाह का विरोध  ·  ओम (Ω)', size: 22 },
      { k: 'Length & area', f: [en('R '), prop(), en(' L,   R '), prop(), en(' 1/A')], hi: 'L के समानुपाती, A के व्युत्क्रमानुपाती' },
      { k: 'The formula', f: [en('R = ρ L / A')], hi: 'ρ = प्रतिरोधकता (resistivity)', dark: true },
      { k: 'Resistivity', f: [en('ρ = R A / L')], hi: 'unit: ohm metre (Ω m)  ·  ओम मीटर' },
      { k: 'Unit conductor', f: [en('L = 1 m, A = 1 m'), en('2', { superscript: true }), en('  ⇒  ρ = R')], hi: 'इकाई लंबाई व इकाई क्षेत्रफल', size: 19 },
      { k: 'Exam trap', f: [en('Current does NOT change R')], hi: 'धारा प्रतिरोध को प्रभावित नहीं करती', trap: true, size: 21 },
    ];
    const gx = 0.3, gy = 0.3, tw = (W - 2 * M - 2 * gx) / 3, th = 1.95;
    tiles.forEach((t, i) => {
      const x = M + (i % 3) * (tw + gx), y = 2.4 + Math.floor(i / 3) * (th + gy);
      const fill = t.dark ? C.INK : (t.trap ? C.CRIMT : C.CARD);
      rrect(s, x, y, tw, th, fill, { rectRadius: 0.08, line: t.dark || t.trap ? { type: 'none' } : { color: C.LINE, width: 1 } });
      T(s, String(i + 1).padStart(2, '0') + '   ' + t.k.toUpperCase(), { x: x + 0.3, y: y + 0.22, w: tw - 0.6, h: 0.3, fontSize: 12, bold: true, color: t.dark ? C.YEL : (t.trap ? C.CRIM : C.MUTED), charSpacing: 2 });
      T(s, t.f, { x: x + 0.3, y: y + 0.6, w: tw - 0.6, h: 0.75, fontSize: t.size || 25, bold: true, color: t.dark ? 'FFFFFF' : C.INK, valign: 'middle' });
      T(s, t.hi, { x: x + 0.3, y: y + 1.35, w: tw - 0.6, h: 0.45, fontSize: 14.5, fontFace: HF, color: t.dark ? 'C9D1DA' : C.NAVY, valign: 'middle' });
    });
    s.addNotes('Quick revision: definition and unit, R ∝ L and R ∝ 1/A, R = ρL/A, ρ = RA/L in ohm metre, ρ = R for a unit conductor, and the classic trap — current does not affect resistance.');
  }

  return p.writeFile({ fileName: out });
};
