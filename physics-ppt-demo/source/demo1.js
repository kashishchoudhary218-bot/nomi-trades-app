const L_ = require('./lib');
const { C, HF, NF, W, H, M, IMG, T, en, hi, rect, rrect, oval, line, arrow, frac, base, title, note, marker, pill, pyqHeader, options, answerCard, step, givenBox, eq } = L_;

module.exports = function build(out) {
  const p = L_.newDeck('Electric Potential & Potential Difference');
  const meta = { topic: 'Electric Potential', deck: 'Demo 01 · Concept Teaching', total: 10 };
  let n = 0;
  const S = (section) => { const s = p.addSlide(); n++; if (section !== null) base(s, Object.assign({ section }, meta), n); return s; };

  // ---------- 1. COVER ----------
  {
    const s = S(null);
    s.background = { color: C.INK };
    s.addImage({ path: IMG('bulb.jpg'), x: 0, y: 0, w: W, h: H });
    s.addImage({ path: IMG('fade_left.png'), x: 0, y: 0, w: W, h: H });
    rect(s, M, 0.62, 0.14, 0.14, C.YEL);
    T(s, [en('PHYSICS  ·  ', { bold: true, color: 'FFFFFF', charSpacing: 2 }), hi('भौतिक विज्ञान', { color: 'C9D1DA' })], { x: M + 0.28, y: 0.52, w: 6, h: 0.35, fontSize: 14 });
    T(s, 'DEMO 01  ·  CONCEPT-FOCUSED TEACHING', { x: M, y: 2.05, w: 7, h: 0.35, fontSize: 13, bold: true, color: C.YEL, charSpacing: 3 });
    T(s, 'Electric Potential &\nPotential Difference', { x: M, y: 2.5, w: 7.6, h: 1.95, fontSize: 52, bold: true, color: 'FFFFFF', lineSpacingMultiple: 0.95 });
    T(s, 'विद्युत विभव और विभवांतर', { x: M, y: 4.55, w: 7, h: 0.7, fontSize: 30, fontFace: HF, color: C.YEL });
    T(s, [en('Electricity · Part 2   |   ', { color: 'C9D1DA' }), hi('विद्युत · भाग 2', { color: 'C9D1DA' })], { x: M, y: 5.35, w: 7, h: 0.4, fontSize: 17 });
    T(s, 'Idea   →   Analogy   →   Visual   →   Formula   →   PYQ   →   Solution', { x: M, y: 6.6, w: 9, h: 0.35, fontSize: 13, color: '8D97A3', charSpacing: 1 });
    s.addNotes('Cover. Demo 01 of 03 — concept-focused teaching on electric potential and potential difference.');
  }

  // ---------- 2. HEAT ANALOGY ----------
  {
    const s = S('01 · Start with what you know');
    title(s, 'Why does heat flow in a solid?', 'किसी ठोस में ऊष्मा क्यों प्रवाहित होती है?');
    // rod 1 — hot to cold
    const rx = 1.2, rw = 5.4, rh = 0.62;
    const hot = [0xD2, 0x45, 0x3B], cold = [0x3F, 0x6F, 0xA0];
    const seg = 30;
    const mix = (t) => hot.map((h, i) => Math.round(h + (cold[i] - h) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
    let y1 = 3.25;
    for (let i = 0; i < seg; i++) rect(s, rx + i * rw / seg, y1, rw / seg + 0.01, rh, mix(i / (seg - 1)));
    T(s, '80 °C', { x: rx - 0.1, y: 2.6, w: 1.6, h: 0.5, fontSize: 28, bold: true, color: 'C0392B' });
    T(s, '30 °C', { x: rx + rw - 1.5, y: 2.6, w: 1.6, h: 0.5, fontSize: 28, bold: true, color: '3F6FA0', align: 'right' });
    arrow(s, rx + 0.3, y1 + rh + 0.35, rx + rw - 0.3, y1 + rh + 0.35, C.INK, 2.5);
    T(s, [en('HEAT FLOWS  ·  ', { bold: true, charSpacing: 1 }), hi('ऊष्मा प्रवाहित होती है')], { x: rx, y: y1 + rh + 0.5, w: rw, h: 0.4, fontSize: 15, color: C.INK, align: 'center' });
    // rod 2 — equal temperature
    const y2 = 5.45;
    rect(s, rx, y2, rw, rh, '3F6FA0');
    T(s, '30 °C', { x: rx - 0.1, y: y2 - 0.6, w: 1.6, h: 0.5, fontSize: 22, bold: true, color: '3F6FA0' });
    T(s, '30 °C', { x: rx + rw - 1.5, y: y2 - 0.6, w: 1.6, h: 0.5, fontSize: 22, bold: true, color: '3F6FA0', align: 'right' });
    T(s, [en('NO FLOW  ·  ', { bold: true, charSpacing: 1 }), hi('कोई प्रवाह नहीं')], { x: rx, y: y2 + rh + 0.12, w: rw, h: 0.4, fontSize: 15, color: C.MUTED, align: 'center' });
    // explanation
    const tx = 7.55, tw = 5.1;
    T(s, 'There must be a difference in temperature between two points in a solid for the heat to flow in it.', { x: tx, y: 2.65, w: tw, h: 1.5, fontSize: 23, color: C.INK, lineSpacingMultiple: 1.1 });
    T(s, 'किसी ठोस में ऊष्मा के प्रवाहित होने के लिए उसके दो बिंदुओं के तापमान में अंतर होना चाहिए।', { x: tx, y: 4.2, w: tw, h: 1.3, fontSize: 19, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.15 });
    marker(s, tx - 0.12, 5.7, tw + 0.1, 0.95, C.YELT);
    T(s, [en('No difference  →  No flow', { bold: true, fontSize: 22, breakLine: true }), hi('अंतर नहीं  →  प्रवाह नहीं', { fontSize: 17, color: C.NAVY })], { x: tx + 0.1, y: 5.72, w: tw - 0.2, h: 0.92, valign: 'middle' });
    s.addNotes('Begin with something students already know: heat flows only when there is a temperature difference (80 °C → 30 °C). With equal temperatures there is no flow. Electric charge behaves the same way.');
  }

  // ---------- 3. ANALOGY MAP ----------
  {
    const s = S('02 · The analogy');
    title(s, 'Charge also needs a difference to flow', 'आवेश के प्रवाह के लिए भी अंतर चाहिए');
    const cy = 2.55, ch = 3.35, cw = 5.55;
    const cards = [
      { x: M, head: 'HEAT', hhi: 'ऊष्मा', what: 'Temperature difference', whathi: 'तापमान में अंतर', unit: '°C', kind: 'heat' },
      { x: W - M - cw, head: 'ELECTRIC CHARGE', hhi: 'विद्युत आवेश', what: 'Potential difference', whathi: 'विभवांतर', unit: 'volt (V)', kind: 'charge' },
    ];
    cards.forEach((c) => {
      rrect(s, c.x, cy, cw, ch, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(c.head + '  ', { bold: true, color: C.INK, charSpacing: 2 }), hi(c.hhi, { color: C.MUTED })], { x: c.x + 0.4, y: cy + 0.3, w: cw - 0.8, h: 0.4, fontSize: 16 });
      // mini diagram
      const dy = cy + 0.95, dx = c.x + 0.4, dw = cw - 0.8;
      if (c.kind === 'heat') {
        const seg = 20, hot = [0xD2, 0x45, 0x3B], cold = [0x3F, 0x6F, 0xA0];
        for (let i = 0; i < seg; i++) rect(s, dx + i * dw / seg, dy + 0.1, dw / seg + 0.01, 0.34, hot.map((h, k) => Math.round(h + (cold[k] - h) * i / (seg - 1)).toString(16).padStart(2, '0')).join('').toUpperCase());
        arrow(s, dx + 0.5, dy + 0.72, dx + dw - 0.5, dy + 0.72, C.INK, 2);
      } else {
        line(s, dx + 0.2, dy + 0.27, dx + dw - 0.2, dy + 0.27, C.NAVY, 2.5);
        oval(s, dx + 0.05, dy + 0.12, 0.3, 0.3, C.INK);
        oval(s, dx + dw - 0.35, dy + 0.12, 0.3, 0.3, C.INK);
        T(s, 'A', { x: dx - 0.05, y: dy + 0.5, w: 0.5, h: 0.3, fontSize: 14, bold: true, align: 'center' });
        T(s, 'B', { x: dx + dw - 0.45, y: dy + 0.5, w: 0.5, h: 0.3, fontSize: 14, bold: true, align: 'center' });
        oval(s, dx + 1.3, dy + 0.05, 0.44, 0.44, C.CRIM);
        T(s, 'Q', { x: dx + 1.3, y: dy + 0.05, w: 0.44, h: 0.44, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        arrow(s, dx + 1.9, dy + 0.72, dx + dw - 0.9, dy + 0.72, C.CRIM, 2);
      }
      line(s, c.x + 0.4, cy + 1.95, c.x + cw - 0.4, cy + 1.95, C.LINE, 1);
      T(s, 'FLOWS ONLY WHEN THERE IS A', { x: c.x + 0.4, y: cy + 2.1, w: cw - 0.8, h: 0.3, fontSize: 11, bold: true, color: C.MUTED, charSpacing: 2 });
      T(s, [en(c.what, { bold: true, fontSize: 26, color: c.kind === 'heat' ? 'C0392B' : C.NAVY, breakLine: true }), hi(c.whathi, { fontSize: 19, color: C.INK })], { x: c.x + 0.4, y: cy + 2.4, w: cw - 0.8, h: 0.85 });
    });
    // centre connector
    oval(s, W / 2 - 0.35, cy + ch / 2 - 0.35, 0.7, 0.7, C.INK);
    T(s, '=', { x: W / 2 - 0.35, y: cy + ch / 2 - 0.37, w: 0.7, h: 0.7, fontSize: 30, bold: true, color: C.YEL, align: 'center', valign: 'middle' });
    // voltage band
    marker(s, M, 6.1, W - 2 * M, 0.62, C.YELT);
    T(s, [en('Potential difference is also called ', {}), en('VOLTAGE', { bold: true }), en('   ·   ', { color: C.MUTED }), hi('विभवांतर = वोल्टेज', { bold: true }), en('   ·   measured in volt (V)', { color: C.NAVY })],
      { x: M + 0.3, y: 6.1, w: W - 2 * M - 0.6, h: 0.62, fontSize: 19, valign: 'middle' });
    s.addNotes('Map the analogy: heat needs a temperature difference; charge needs a potential difference. Potential difference is what we commonly call voltage (वोल्टेज).');
  }

  // ---------- 4. VISUAL A -> B ----------
  {
    const s = S('03 · Visualise it');
    title(s, 'Moving a charge from A to B', 'आवेश को बिंदु A से बिंदु B तक ले जाना');
    const yA = 3.35, xA = 1.9, xB = W - 1.9;
    rrect(s, M, 2.45, W - 2 * M, 1.95, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
    line(s, xA, yA, xB, yA, C.SOFT, 2, { dashType: 'dash' });
    oval(s, xA - 0.22, yA - 0.22, 0.44, 0.44, C.INK);
    oval(s, xB - 0.22, yA - 0.22, 0.44, 0.44, C.INK);
    T(s, [en('Point A  ', { bold: true }), hi('बिंदु A', { color: C.MUTED })], { x: xA - 1.1, y: yA + 0.35, w: 2.2, h: 0.4, fontSize: 16, align: 'center' });
    T(s, [en('Point B  ', { bold: true }), hi('बिंदु B', { color: C.MUTED })], { x: xB - 1.1, y: yA + 0.35, w: 2.2, h: 0.4, fontSize: 16, align: 'center' });
    oval(s, 3.2, yA - 0.36, 0.72, 0.72, C.CRIM);
    T(s, 'Q', { x: 3.2, y: yA - 0.36, w: 0.72, h: 0.72, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    arrow(s, 4.15, yA, xB - 0.5, yA, C.CRIM, 3);
    rrect(s, W / 2 - 1.9, yA - 0.82, 3.8, 0.5, C.YELT, { rectRadius: 0.25 });
    T(s, [en('Work done  =  ', { bold: true }), en('W', { bold: true, color: C.CRIM })], { x: W / 2 - 1.9, y: yA - 0.82, w: 3.8, h: 0.5, fontSize: 18, align: 'center', valign: 'middle' });
    // two steps
    const cols = [
      { n: '1', e: 'Suppose you move a charge Q from point A to another point B.', h: 'मान लीजिए, आपने एक आवेश Q को एक बिंदु A से दूसरे बिंदु B पर स्थानांतरित कर दिया है।' },
      { n: '2', e: 'Let W be the work done to move the charge from A to B.', h: 'आवेश को A से B तक ले जाने में किया गया कार्य W है।' },
    ];
    cols.forEach((c, i) => {
      const x = M + i * 6.2;
      T(s, c.n, { x, y: 4.75, w: 0.6, h: 0.8, fontSize: 44, bold: true, color: C.CRIM });
      T(s, c.e, { x: x + 0.7, y: 4.8, w: 5.1, h: 0.95, fontSize: 21, color: C.INK, lineSpacingMultiple: 1.05 });
      T(s, c.h, { x: x + 0.7, y: 5.8, w: 5.1, h: 0.95, fontSize: 18, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.1 });
    });
    s.addNotes('Draw attention to the motion: a charge Q is moved from A to B. Some work W must be done to move it. Keep both quantities in mind — they build the formula on the next slide.');
  }

  // ---------- 5. DEFINITION + FORMULA ----------
  {
    const s = S('04 · Definition & formula');
    title(s, 'Potential Difference', 'विभवांतर');
    T(s, [en('The potential difference between points A and B is given by:', { breakLine: true }), hi('बिंदु A और B के बीच विभवांतर इस व्यंजक द्वारा दिया जाता है:', { fontSize: 17, color: C.NAVY })],
      { x: M, y: 2.35, w: 11.5, h: 0.95, fontSize: 21, lineSpacingMultiple: 1.1 });
    // formula card
    const fx = M, fy = 3.5, fw = 6.2, fh = 3.15;
    rrect(s, fx, fy, fw, fh, C.INK, { rectRadius: 0.1 });
    T(s, [en('Potential difference  =  ', {}), en('Work done', { bold: true }), en('  ÷  ', {}), en('Charge', { bold: true })], { x: fx + 0.4, y: fy + 0.3, w: fw - 0.8, h: 0.4, fontSize: 16, color: 'C9D1DA' });
    T(s, 'V', { x: fx + 1.0, y: fy + 1.0, w: 1.1, h: 1.6, fontSize: 88, bold: true, color: C.YEL, align: 'center', valign: 'middle' });
    T(s, '=', { x: fx + 2.1, y: fy + 1.0, w: 0.9, h: 1.6, fontSize: 70, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    frac(s, fx + 3.95, fy + 0.72, 'W', 'Q', { size: 64, color: 'FFFFFF', w: 1.5, barColor: C.YEL });
    // legend
    const lx = 7.55, rows = [
      ['V', 'Potential difference', 'विभवांतर', 'volt (V)'],
      ['W', 'Work done', 'किया गया कार्य', 'joule (J)'],
      ['Q', 'Charge', 'आवेश', 'coulomb (C)'],
    ];
    rows.forEach((r, i) => {
      const y = fy + i * 1.08;
      rrect(s, lx, y, 0.9, 0.9, C.NAVYT, { rectRadius: 0.08 });
      T(s, r[0], { x: lx, y, w: 0.9, h: 0.9, fontSize: 34, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
      T(s, [en(r[1], { bold: true, fontSize: 22, breakLine: true }), hi(r[2], { fontSize: 17, color: C.NAVY }), en('   ·   unit: ' + r[3], { fontSize: 15, color: C.MUTED })],
        { x: lx + 1.15, y, w: 4.4, h: 0.9, valign: 'middle' });
    });
    s.addNotes('Definition: potential difference between A and B = work done ÷ charge. V = W / Q. Units: V in volt, W in joule, Q in coulomb.');
  }

  // ---------- 6. FORMULA TOOLKIT ----------
  {
    const s = S('05 · Formula toolkit');
    title(s, 'One formula, three types of questions', 'एक सूत्र — तीन तरह के प्रश्न');
    // triangle
    const tx = 1.0, ty = 2.6, tw = 4.4, th = 3.5;
    s.addShape('triangle', { x: tx, y: ty, w: tw, h: th, fill: { color: C.CARD }, line: { color: C.NAVY, width: 2.5 } });
    line(s, tx + tw * 0.25, ty + th * 0.5, tx + tw * 0.75, ty + th * 0.5, C.NAVY, 2.5);
    line(s, tx + tw / 2, ty + th * 0.5, tx + tw / 2, ty + th, C.NAVY, 2.5);
    T(s, 'W', { x: tx + tw / 2 - 0.6, y: ty + th * 0.2, w: 1.2, h: 0.9, fontSize: 48, bold: true, color: C.CRIM, align: 'center', valign: 'middle' });
    T(s, 'V', { x: tx + tw * 0.27, y: ty + th * 0.58, w: 0.95, h: 0.9, fontSize: 44, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
    T(s, 'Q', { x: tx + tw * 0.515, y: ty + th * 0.58, w: 0.95, h: 0.9, fontSize: 44, bold: true, color: C.NAVY, align: 'center', valign: 'middle' });
    note(s, 'cover the one you need!', tx + 0.1, ty + th + 0.12, 4.4, 0.5, { fontSize: 24, align: 'center' });
    // three rows
    const rx = 6.25, rw = W - M - rx;
    const rows = [
      { need: 'To find V', nhi: 'V ज्ञात करने के लिए', parts: ['V = ', { n: 'W', d: 'Q' }] },
      { need: 'To find W', nhi: 'W ज्ञात करने के लिए', parts: ['W = V × Q'] },
      { need: 'To find Q', nhi: 'Q ज्ञात करने के लिए', parts: ['Q = ', { n: 'W', d: 'V' }] },
    ];
    rows.forEach((r, i) => {
      const y = 2.6 + i * 1.28;
      rrect(s, rx, y, rw, 1.1, C.CARD, { rectRadius: 0.08, line: { color: C.LINE, width: 1 } });
      T(s, [en(r.need, { bold: true, fontSize: 21, breakLine: true }), hi(r.nhi, { fontSize: 16, color: C.MUTED })], { x: rx + 0.35, y, w: 3.0, h: 1.1, valign: 'middle' });
      eq(s, rx + 3.55, y + 0.55, r.parts, { size: 34, color: C.NAVY });
    });
    s.addNotes('Rearranging V = W/Q gives W = V × Q and Q = W / V. Use the triangle: cover the quantity you want — W on top means multiply V × Q; V or Q at the bottom means divide W.');
  }

  // ---------- 7. PYQ 1 ----------
  {
    const s = S(null); base(s, Object.assign({ section: null }, meta), n);
    pyqHeader(s, { name: 'ALP', date: '26 Nov 2024 · 2nd Shift' }, 'Q.01');
    T(s, 'The work done in moving 10 coulomb charges across the potential difference of 5 volts is _______.', { x: M, y: 1.75, w: 11.9, h: 1.05, fontSize: 27, color: C.INK, lineSpacingMultiple: 1.05 });
    T(s, '10 कूलॉम आवेश को 5 वोल्ट के विभवांतर के पार ले जाने में किया गया कार्य _______ होता है।', { x: M, y: 2.85, w: 11.9, h: 0.95, fontSize: 21, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.1 });
    options(s, [{ en: '20 joules' }, { en: '2 joules' }, { en: '50 joules' }, { en: '5 joules' }], M, 4.05, W - 2 * M, 1.0);
    s.addNotes('Pause here and let viewers attempt. Hint: which quantity is unknown — V, W or Q?');
  }

  // ---------- 8. SOLUTION 1 ----------
  {
    const s = S('Solution · Q.01');
    title(s, 'Find the work done', 'किया गया कार्य ज्ञात करें');
    givenBox(s, M, 2.45, 3.4, 3.95, ['Q = 10 C', 'V = 5 V'], { find: 'W = ?' });
    const sx = 4.55, sw = 4.6;
    const rows = [
      ['V = ', { n: 'W', d: 'Q' }],
      ['W = V × Q'],
      ['W = 5 × 10'],
      ['W = 50 J'],
    ];
    T(s, 'STEPS', { x: sx, y: 2.45, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    rows.forEach((r, i) => {
      const y = 2.9 + i * 0.9, last = i === rows.length - 1;
      oval(s, sx, y + 0.18, 0.4, 0.4, last ? C.CRIM : C.NAVYT);
      T(s, String(i + 1), { x: sx, y: y + 0.18, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
      eq(s, sx + 0.65, y + 0.38, r, { size: 30, color: last ? C.CRIM : C.INK });
    });
    answerCard(s, 9.1, 2.45, W - M - 9.1, 2.0, 'C', '50 joules');
    note(s, 'Work = Voltage × Charge', 9.15, 4.85, 3.6, 0.55, { fontSize: 26 });
    T(s, [en('Unknown is ', {}), en('W', { bold: true }), en(', so multiply the two given values.', { breakLine: true }), hi('अज्ञात W है, इसलिए दी गई दोनों राशियों को गुणा करें।', { fontSize: 15, color: C.NAVY })],
      { x: 9.15, y: 5.45, w: W - M - 9.15, h: 1.1, fontSize: 16, color: C.INK });
    s.addNotes('Given Q = 10 C and V = 5 V. Unknown is W, so W = V × Q = 5 × 10 = 50 J. Answer: option C, 50 joules.');
  }

  // ---------- 9. PYQ 2 ----------
  {
    const s = S(null); base(s, Object.assign({ section: null }, meta), n);
    pyqHeader(s, { name: 'RRB ALP CBT-2', date: '23/01/2019' }, 'Q.02');
    T(s, 'If 90 J of work is done in moving a charge of 2,000 coulombs across V volts, find V.', { x: M, y: 1.75, w: 11.9, h: 1.05, fontSize: 27, color: C.INK, lineSpacingMultiple: 1.05 });
    T(s, 'यदि V वोल्ट पर 2,000 कूलॉम के आवेश को स्थानांतरित करने में 90 J कार्य किया जाता है, तो V ज्ञात कीजिए।', { x: M, y: 2.85, w: 11.9, h: 0.95, fontSize: 21, fontFace: HF, color: C.NAVY, lineSpacingMultiple: 1.1 });
    options(s, [{ en: '0.045' }, { en: '180' }, { en: '2,250' }, { en: '0.2' }], M, 4.05, W - 2 * M, 1.0);
    s.addNotes('Second PYQ. This time the unknown is V.');
  }

  // ---------- 10. SOLUTION 2 + TAKEAWAY ----------
  {
    const s = S('Solution · Q.02');
    title(s, 'Find the potential difference', 'विभवांतर ज्ञात करें');
    givenBox(s, M, 2.45, 3.4, 3.95, ['W = 90 J', 'Q = 2,000 C'], { find: 'V = ?' });
    const sx = 4.55;
    const rows = [
      ['V = ', { n: 'W', d: 'Q' }],
      ['V = ', { n: '90', d: '2,000' }],
      ['V = ', { n: '9', d: '200' }],
      ['V = 0.045 V'],
    ];
    T(s, 'STEPS', { x: sx, y: 2.45, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.MUTED, charSpacing: 3 });
    rows.forEach((r, i) => {
      const y = 2.85 + i * 0.93, last = i === rows.length - 1;
      oval(s, sx, y + 0.2, 0.4, 0.4, last ? C.CRIM : C.NAVYT);
      T(s, String(i + 1), { x: sx, y: y + 0.2, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: last ? 'FFFFFF' : C.NAVY, align: 'center', valign: 'middle' });
      eq(s, sx + 0.65, y + 0.4, r, { size: 30, color: last ? C.CRIM : C.INK });
    });
    answerCard(s, 9.1, 2.45, W - M - 9.1, 2.0, 'A', '0.045');
    // takeaway
    const kx = 9.1, ky = 4.7, kw = W - M - 9.1, kh = 1.95;
    rrect(s, kx, ky, kw, kh, C.YELT, { rectRadius: 0.08 });
    T(s, 'EXAM TAKEAWAY', { x: kx + 0.3, y: ky + 0.22, w: kw - 0.6, h: 0.3, fontSize: 12, bold: true, color: C.CRIM, charSpacing: 2 });
    T(s, [en('Spot W, V and Q first — then pick the right form of V = W/Q.', { breakLine: true }), hi('पहले W, V और Q पहचानें — फिर सूत्र का सही रूप चुनें।', { fontSize: 15, color: C.NAVY })],
      { x: kx + 0.3, y: ky + 0.55, w: kw - 0.6, h: 1.3, fontSize: 16, bold: false, color: C.INK, lineSpacingMultiple: 1.05 });
    s.addNotes('Given W = 90 J, Q = 2,000 C. V = W/Q = 90/2000 = 9/200 = 0.045 V. Answer: option A. Takeaway: identify W, V and Q first, then choose the right form of the formula.');
  }

  return p.writeFile({ fileName: out });
};
