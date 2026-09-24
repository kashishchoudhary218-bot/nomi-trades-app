// Builds the Hinglish explainer deck for "The Mathematician's Edge".
// Slide visuals are stills from the Remotion video (images/Sxx.jpg — render with
// ../remotion/scripts/deck-stills.ts). Speaker notes carry the Hinglish narration
// (single source of truth: ../remotion/src/data/narration.hinglish.ts) with video timecodes.
//
// Run: npm run build   → The-Mathematicians-Edge-Hinglish.pptx
import path from 'node:path';
import pptxgen from 'pptxgenjs';
import {localizeScenes} from '../remotion/src/data/language';
import {buildTimeline, formatTimecode} from '../remotion/src/timeline/build';
import {manifestDurations} from '../remotion/scripts/lib/vo-manifest';

process.chdir(path.resolve(__dirname, '../remotion')); // manifest paths are relative to the Remotion project
const timeline = buildTimeline(localizeScenes('hinglish'), manifestDurations('hinglish'), 'hinglish');
process.chdir(__dirname);

const C = {
	bg: '0B0F14',
	panel: '141C26',
	panelLine: '2A3542',
	text: 'DBE3EA',
	muted: '8A97A4',
	lime: 'C8FF4D',
	gold: 'F0C75E',
	red: 'FF5A5F',
	green: '35D19A',
};
// DECK_WIDE_FONTS=1 builds a QA copy with wider fallback fonts (what a PC without
// Cambria/Calibri would show) — the layout must stay overlap-free in both.
const WIDE = process.env.DECK_WIDE_FONTS === '1';
const HEAD = WIDE ? 'DejaVu Serif' : 'Cambria';
const BODY = WIDE ? 'DejaVu Sans' : 'Calibri';
const W = 10;
const H = 5.625;

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = "The Mathematician's Edge — Jim Simons ka Trading Approach (Hinglish)";
pres.author = 'NOMI TRADES';

const img = (id: string) => path.join(__dirname, 'images', `${id}.jpg`);
const tc = (id: string) => formatTimecode(timeline.scenes.find((s) => s.def.id === id)!.from).slice(0, 5);
const narration = (id: string) => timeline.scenes.find((s) => s.def.id === id)!.def.narration;

/** Speaker notes: the Hinglish script for the scenes this slide covers, with video timecodes. */
const notes = (slide: pptxgen.Slide, ids: string[], intro?: string) => {
	const parts = ids.map((id) => `[Video ${tc(id)} · Scene ${id}]\n${narration(id)}`);
	slide.addNotes([intro, ...parts].filter(Boolean).join('\n\n'));
};

let slideNo = 0;
const base = (opts: {kicker?: string; title?: string} = {}) => {
	const s = pres.addSlide();
	slideNo++;
	s.background = {color: C.bg};
	if (opts.kicker) {
		s.addText(opts.kicker.toUpperCase(), {x: 0.5, y: 0.3, w: 9, h: 0.3, fontFace: BODY, fontSize: 10, bold: true, color: C.lime, charSpacing: 3, margin: 0, isTextBox: true});
	}
	if (opts.title) {
		s.addText(opts.title, {x: 0.5, y: 0.62, w: 9, h: 0.6, fontFace: HEAD, fontSize: 24, color: C.text, margin: 0, valign: 'top', isTextBox: true});
	}
	if (slideNo > 1) {
		s.addText(String(slideNo), {x: 9.1, y: 5.2, w: 0.4, h: 0.25, fontFace: BODY, fontSize: 9, color: C.muted, align: 'right', margin: 0, isTextBox: true});
	}
	return s;
};

const shadow = () => ({type: 'outer' as const, color: '000000', blur: 12, offset: 3, angle: 90, opacity: 0.45});

const picture = (s: pptxgen.Slide, id: string, x: number, y: number, w: number) => {
	const h = (w * 9) / 16;
	s.addShape(pres.ShapeType.rect, {x: x - 0.02, y: y - 0.02, w: w + 0.04, h: h + 0.04, fill: {color: C.panelLine}, line: {color: C.panelLine}, shadow: shadow()});
	s.addImage({path: img(id), x, y, w, h, altText: `Video frame, scene ${id}`});
	return h;
};

/** Caption under a picture whose bottom edge is at `bottom` — always a clear gap from the image. */
const caption = (s: pptxgen.Slide, text: string, x: number, bottom: number, w: number) =>
	s.addText(text, {x, y: bottom + 0.3, w, h: 0.3, fontFace: BODY, fontSize: 10, color: C.muted, valign: 'top', margin: 0, isTextBox: true});

/**
 * Heading + body in ONE text box: if the heading wraps (e.g. with a wider fallback font),
 * the body flows down instead of colliding with it.
 */
const pair = (
	s: pptxgen.Slide,
	head: string,
	body: string,
	box: {x: number; y: number; w: number; h: number},
	o: {headSize?: number; bodySize?: number; headColor?: string; bodyColor?: string} = {},
) =>
	s.addText(
		[
			{text: head, options: {bold: true, fontSize: o.headSize ?? 13, color: o.headColor ?? C.lime, breakLine: true, paraSpaceAfter: 3}},
			{text: body, options: {fontSize: o.bodySize ?? 12, color: o.bodyColor ?? C.text}},
		],
		{...box, fontFace: BODY, valign: 'top', margin: 0, isTextBox: true},
	);

type Bullet = string | {b: string; t: string};
/** One paragraph per point: a lime lead ("→" for plain points, or a bold label) + the text. */
const bullets = (s: pptxgen.Slide, items: Bullet[], x: number, y: number, w: number, h: number, size = 14) => {
	s.addText(
		items.flatMap((it, i) => {
			const last = i === items.length - 1;
			const {b, t} = typeof it === 'string' ? {b: '→', t: it} : it;
			return [
				{text: `${b} `, options: {bold: true, color: C.lime}},
				{text: t, options: {breakLine: !last}},
			];
		}) as pptxgen.TextProps[],
		{x, y, w, h, fontFace: BODY, fontSize: size, color: C.text, valign: 'top', paraSpaceAfter: 9, margin: 0, isTextBox: true},
	);
};

const numberCircle = (s: pptxgen.Slide, n: string, x: number, y: number, color = C.lime) => {
	s.addShape(pres.ShapeType.ellipse, {x, y, w: 0.42, h: 0.42, fill: {color: C.panel}, line: {color, width: 1.5}});
	s.addText(n, {x, y, w: 0.42, h: 0.42, fontFace: BODY, fontSize: 12, bold: true, color, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
};

// ─────────────────────────────── slides ───────────────────────────────

// 1 · Title
{
	const s = base();
	s.addImage({path: img('S06'), x: 5.7, y: 1.2, w: 4.2, h: 2.3625, transparency: 35, altText: 'Video frame: People, Data, Technology'});
	s.addText('HINGLISH EXPLAINER', {x: 0.6, y: 1.35, w: 5, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: C.lime, charSpacing: 4, margin: 0, isTextBox: true});
	s.addText([
		{text: "The Mathematician's", options: {breakLine: true}},
		{text: 'Edge', options: {}},
	], {x: 0.6, y: 1.75, w: 4.9, h: 1.5, fontFace: HEAD, fontSize: 32, color: C.text, lineSpacingMultiple: 1.15, margin: 0, valign: 'top', isTextBox: true});
	s.addText('Jim Simons ka Trading Approach — math, data aur discipline se trading ko samjhein', {x: 0.6, y: 3.45, w: 4.8, h: 0.9, fontFace: BODY, fontSize: 15, color: C.muted, margin: 0, valign: 'top', isTextBox: true});
	s.addText('Sirf educational content · Historical performance future results ki guarantee nahi hai', {x: 0.6, y: 4.85, w: 6, h: 0.3, fontFace: BODY, fontSize: 9, color: C.muted, margin: 0, isTextBox: true});
	s.addNotes('Intro: Namaste! Aaj hum samjhenge Jim Simons ka trading approach — ek mathematician ne markets ko math aur data se kaise dekha. Is presentation ke har slide ke notes mein video ki Hinglish script hai, video timecode ke saath.');
}

// 2 · The hook — ~66%
{
	const s = base({kicker: 'Cold open', title: 'Ek number jo sab kuch shuru karta hai'});
	s.addText('~66%', {x: 0.5, y: 1.45, w: 4.3, h: 1.4, fontFace: HEAD, fontSize: 80, color: C.gold, margin: 0, valign: 'top', isTextBox: true});
	pair(s, 'Average annual return · fees se pehle · reportedly', 'Medallion Fund — 30+ saal tak', {x: 0.5, y: 2.85, w: 4.1, h: 0.9}, {headColor: C.text, bodyColor: C.muted, bodySize: 13});
	s.addText('Gut feeling ya market stories se nahi — mathematics, data aur scientific discipline se.', {x: 0.5, y: 3.95, w: 4.1, h: 0.9, fontFace: BODY, fontSize: 14, italic: true, color: C.lime, margin: 0, valign: 'top', isTextBox: true});
	const ph = picture(s, 'S02', 4.95, 1.55, 4.55);
	caption(s, 'Video frame · Scene S02', 4.95, 1.55 + ph, 4.55);
	notes(s, ['S01', 'S02']);
}

// 3 · What this video covers
{
	const s = base({kicker: 'Is video mein', title: 'Hum kya samjhenge — aur kya nahi'});
	const items: [string, string, string][] = [
		['01', 'The approach', 'Simons ne markets ko kaise approach kiya'],
		['02', 'The edge', 'Unki edge ke peeche asli wajah kya thi'],
		['03', 'Aap kya use kar sakte ho', 'Kaunse principles ek retail trader realistically use kar sakta hai'],
		['04', '…aur kya nahi', 'Kya copy karna possible hi nahi hai'],
	];
	items.forEach(([n, head, body], i) => {
		const y = 1.55 + i * 0.85;
		const color = i === 3 ? C.red : C.lime;
		numberCircle(s, n, 0.55, y, color);
		pair(s, head, body, {x: 1.15, y: y - 0.04, w: 8.3, h: 0.78}, {headSize: 16, bodySize: 13, headColor: C.text, bodyColor: C.muted});
	});
	notes(s, ['S03']);
}

// 4 · Jim Simons & Renaissance (photo slot)
{
	const s = base({kicker: 'Chapter 01 · Markets as a math problem', title: '1982: Renaissance Technologies'});
	s.addText('1982', {x: 0.5, y: 1.45, w: 4, h: 1.0, fontFace: HEAD, fontSize: 60, color: C.gold, margin: 0, valign: 'top', isTextBox: true});
	bullets(s, [
		{b: 'Founder:', t: 'Jim Simons ne Renaissance Technologies ki foundation rakhi'},
		{b: 'Background:', t: 'Mathematician aur former signals analyst'},
		{b: 'Nazariya:', t: 'Market ko dekhne ka tareeka traditional traders se bilkul alag'},
	], 0.5, 2.6, 5.0, 2.5);
	// Portrait of Jim Simons (supplied by the channel owner).
	const px = 5.95;
	const py = 1.4;
	const ps = 3.0;
	s.addShape(pres.ShapeType.rect, {x: px - 0.03, y: py - 0.03, w: ps + 0.06, h: ps + 0.06, fill: {color: C.panelLine}, line: {color: C.panelLine}, shadow: shadow()});
	s.addImage({path: img('jim-simons'), x: px, y: py, w: ps, h: ps, altText: 'Portrait of Jim Simons'});
	pair(s, 'Jim Simons', 'Photo: [source / credit]', {x: px, y: py + ps + 0.3, w: ps, h: 0.55}, {headSize: 14, bodySize: 8, headColor: C.text, bodyColor: C.muted});
	notes(s, ['S05'], 'Photo credit line (slide par "Photo: [source / credit]") mein photo ka source likh dein.');
}

// 5 · The core idea
{
	const s = base({kicker: 'Core idea', title: 'Data mein persistent, predictable patterns'});
	bullets(s, [
		'Financial market data mein persistent aur predictable patterns ho sakte hain',
		{b: 'Formula:', t: 'Right people + right data + right technology'},
		'In patterns ko identify karke systematically trade kiya ja sakta hai',
		{b: 'Kehna simple,', t: 'execute karna mushkil'},
	], 0.5, 1.5, 4.2, 3.4);
	const ph = picture(s, 'S06', 4.95, 1.5, 4.55);
	caption(s, 'People · Data · Technology → Systematic trading', 4.95, 1.5 + ph, 4.55);
	notes(s, ['S06']);
}

// 6 · Scientists, not storytellers
{
	const s = base({kicker: 'Approach', title: 'Stories nahi — statistical pattern recognition'});
	picture(s, 'S07', 0.5, 1.5, 4.55);
	bullets(s, [
		{b: 'Nahi:', t: 'traditional, qualitative market analysis'},
		{b: 'Balki:', t: 'statistical pattern recognition'},
		'Team: mathematicians, physicists aur computer scientists',
		'Belief: markets ko ek mathematical system ki tarah study kiya ja sakta hai',
	], 5.35, 1.5, 4.15, 3.4);
	notes(s, ['S07']);
}

// 7 · Not just models
{
	const s = base({kicker: 'Chapter 02 · The machine behind the edge', title: 'Performance sirf models ki wajah se nahi thi'});
	picture(s, 'S08', 0.5, 1.5, 4.55);
	const factors = ['Execution quality', 'Scientific discipline', 'Data analysis', 'Continuous research', 'Scientists ki hiring'];
	factors.forEach((f, i) => {
		const y = 1.5 + i * 0.6;
		numberCircle(s, String(i + 1), 5.35, y);
		s.addText(f, {x: 5.95, y, w: 3.5, h: 0.42, fontFace: BODY, fontSize: 15, color: C.text, valign: 'middle', margin: 0, isTextBox: true});
	});
	notes(s, ['S08']);
}

// 8 · The four pillars (2×2)
{
	const s = base({kicker: 'Chapter 02', title: 'Edge ke 4 pillars'});
	const cells: [string, string, string][] = [
		['S09', '1 · Statistical pattern recognition', 'Significant, repeat hone wale, costs ke baad bhi useful signals'],
		['S10', '2 · Doosri sciences se seekhna', 'Physics, signal processing; Hidden Markov Models (reportedly)'],
		['S11', '3 · Speed, consistency, scale', 'Medallion ki capacity intentionally limited rakhi gayi'],
		['S12', '4 · Model discipline', 'Evidence ho to trade; kaam band kare to remove'],
	];
	cells.forEach(([id, head, body], i) => {
		const x = 0.5 + (i % 2) * 4.6;
		const y = 1.4 + Math.floor(i / 2) * 2.0;
		s.addImage({path: img(id), x, y, w: 2.2, h: 1.2375, altText: `Video frame, scene ${id}`});
		pair(s, head, body, {x: x + 2.35, y, w: 2.15, h: 1.75}, {headSize: 12, bodySize: 11});
	});
	notes(s, ['S09', 'S10', 'S11']);
}

// 9 · The discipline loop
{
	const s = base({kicker: 'Pillar 4 · Model discipline', title: 'Process kabhi rukta nahi tha'});
	picture(s, 'S12', 4.95, 1.5, 4.55);
	const steps = ['Research', 'Test', 'Live trade', 'Monitor', 'Improve ya remove'];
	steps.forEach((st, i) => {
		const y = 1.5 + i * 0.62;
		numberCircle(s, String(i + 1), 0.55, y, i === 4 ? C.red : C.lime);
		s.addText(st, {x: 1.15, y, w: 3.4, h: 0.42, fontFace: BODY, fontSize: 16, color: C.text, valign: 'middle', margin: 0, isTextBox: true});
	});
	notes(s, ['S12']);
}

// 10 · Reality check
{
	const s = base({kicker: 'Chapter 03 · Reality check', title: 'Medallion ko copy nahi kiya ja sakta'});
	bullets(s, [
		'Retail trader Medallion ki performance replicate nahi kar sakta',
		'Models proprietary hain — publicly available nahi',
		'Renaissance ke paas technology, scale aur highly skilled researchers the',
		{b: 'Takeaway:', t: 'principles ko learning framework ki tarah dekho, copy karne wali strategy ki tarah nahi'},
	], 0.5, 1.5, 4.2, 3.6);
	picture(s, 'S13', 4.95, 1.5, 4.55);
	notes(s, ['S13']);
}

// 11 · Principles 1 & 2
{
	const s = base({kicker: 'Chapter 04 · Principles you can use', title: 'Rules aur evidence'});
	const ph = picture(s, 'S14', 0.5, 1.35, 4.35);
	picture(s, 'S15', 5.15, 1.35, 4.35);
	pair(s, '1 · Rules > judgement', 'Entry, exit, stop loss, position size pehle se define karo', {x: 0.5, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	pair(s, '2 · Data & evidence > narrative', 'Backtest karo — lekin backtest guarantee nahi, baseline hai', {x: 5.15, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	notes(s, ['S14', 'S15']);
}

// 12 · Principles 3 & 4
{
	const s = base({kicker: 'Chapter 04 · Principles you can use', title: 'Risk aur diversification'});
	const ph = picture(s, 'S16', 0.5, 1.35, 4.35);
	picture(s, 'S17', 5.15, 1.35, 4.35);
	pair(s, '3 · Risk management non-negotiable', 'Har trade + daily/weekly max loss; winning streak mein risk mat badhao', {x: 0.5, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	pair(s, '4 · Diversify karo', 'Ek instrument ya ek strategy par poori tarah dependent mat raho', {x: 5.15, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	notes(s, ['S16', 'S17']);
}

// 13 · Quant toolkit (2×2)
{
	const s = base({kicker: 'Chapter 05 · The quant toolkit', title: 'Quantitative strategies ke 4 types'});
	const cells: [string, string, string][] = [
		['S18', 'Statistical arbitrage', 'Related assets ka spread normal range ki taraf revert karega?'],
		['S19', 'Momentum & trend', 'Uptrend mein long, downtrend mein short'],
		['S20', 'Mean reversion', 'Temporary overextension hai ya new trend?'],
		['S21', 'Factor-based models', 'Stock predict nahi — portfolio ko tilt karo'],
	];
	cells.forEach(([id, head, body], i) => {
		const x = 0.5 + (i % 2) * 4.6;
		const y = 1.4 + Math.floor(i / 2) * 2.0;
		s.addImage({path: img(id), x, y, w: 2.2, h: 1.2375, altText: `Video frame, scene ${id}`});
		pair(s, head, body, {x: x + 2.35, y, w: 2.15, h: 1.75}, {headSize: 13, bodySize: 11});
	});
	notes(s, ['S18', 'S19', 'S20', 'S21']);
}

// 14 · First testable rule
{
	const s = base({kicker: 'Chapter 06 · Your first testable rule', title: 'Ek precise, testable rule se shuru karo'});
	picture(s, 'S22', 0.5, 1.45, 4.9);
	s.addShape(pres.ShapeType.roundRect, {x: 5.7, y: 1.45, w: 3.8, h: 1.55, rectRadius: 0.08, fill: {color: C.panel}, line: {color: C.panelLine}});
	s.addText([
		{text: 'BUY: ', options: {bold: true, color: C.green}},
		{text: '20-day MA, 50-day MA ke upar cross kare', options: {breakLine: true}},
		{text: 'EXIT: ', options: {bold: true, color: C.muted}},
		{text: '20-day MA wapas 50-day ke neeche cross kare', options: {}},
	], {x: 5.9, y: 1.6, w: 3.45, h: 1.3, fontFace: BODY, fontSize: 13, color: C.text, valign: 'middle', paraSpaceAfter: 6, margin: 0, isTextBox: true});
	s.addText('Phir backtest mein check karo:', {x: 5.7, y: 3.2, w: 3.8, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: C.lime, margin: 0, isTextBox: true});
	bullets(s, ['Win rate', 'Drawdown', 'Average risk-to-reward', 'Alag-alag market conditions'], 5.7, 3.55, 3.8, 1.5, 12);
	notes(s, ['S22', 'S23'], 'Note: yeh example rule source guide ka hai — koi result claim nahi kiya gaya.');
}

// 15 · Execution
{
	const s = base({kicker: 'Chapter 07 · The hardest part', title: 'Execute karna sabse mushkil hai'});
	picture(s, 'S24', 0.5, 1.5, 4.55);
	const errs = ['Kuch signals lena, kuch skip karna', 'Stop loss ko move karna', 'Losing trade ko recover hone ki ummeed mein hold karna', 'Drawdown ke baad strategy abandon karna'];
	errs.forEach((e, i) => {
		const y = 1.5 + i * 0.72;
		numberCircle(s, String(i + 1), 5.35, y, C.red);
		s.addText(e, {x: 5.95, y: y - 0.05, w: 3.55, h: 0.55, fontFace: BODY, fontSize: 13, color: C.text, valign: 'middle', margin: 0, isTextBox: true});
	});
	notes(s, ['S24']);
}

// 16 · Trade journal
{
	const s = base({kicker: 'The fix', title: 'Trade journal maintain karo'});
	bullets(s, [
		{b: 'Log karo:', t: 'entry condition, entry price, exit price, stop loss, take profit, market condition, result'},
		{b: 'Compare karo:', t: 'kya live performance backtest jaisi hai?'},
		{b: 'Agar kaafi worse hai:', t: 'overfitting, market conditions ka badalna, execution problems, ya edge ka degrade hona'},
	], 0.5, 1.5, 4.2, 3.6);
	picture(s, 'S25', 4.95, 1.5, 4.55);
	notes(s, ['S25']);
}

// 17 · Drawdown questions
{
	const s = base({kicker: 'Chapter 08 · When it stops working', title: 'Normal drawdown — ya edge badal gayi?'});
	picture(s, 'S26', 0.5, 1.5, 4.55);
	const qs = ['Market regime change hua?', 'Similar strategies bhi underperform kar rahi hain?', 'Signal conditions abhi bhi generate ho rahi hain?', 'Current market history se kitna different hai?'];
	qs.forEach((q, i) => {
		const y = 1.5 + i * 0.66;
		numberCircle(s, '?', 5.35, y);
		s.addText(q, {x: 5.95, y: y - 0.04, w: 3.55, h: 0.5, fontFace: BODY, fontSize: 13, color: C.text, valign: 'middle', margin: 0, isTextBox: true});
	});
	s.addText('Properly backtested strategy ho to evidence se evaluate karo — feeling se nahi.', {x: 5.35, y: 4.25, w: 4.15, h: 0.55, fontFace: BODY, fontSize: 11, italic: true, color: C.lime, valign: 'top', margin: 0, isTextBox: true});
	notes(s, ['S26', 'S27']);
}

// 18 · Overfitting
{
	const s = base({kicker: 'Chapter 09 · The traps', title: 'Sabse bada trap: overfitting'});
	picture(s, 'S28', 0.5, 1.5, 4.9);
	bullets(s, [
		'Strategy ko historical data ke hisaab se itna optimize karna ki backtest strong dikhe',
		'Lekin live market mein fail ho jaye — strategy noise seekh rahi thi',
		{b: 'Defence:', t: 'out-of-sample testing — alag data par test karo jo develop karne mein use nahi hua'},
	], 5.7, 1.5, 3.8, 3.6, 13);
	notes(s, ['S28', 'S29']);
}

// 19 · Costs, capacity, decay
{
	const s = base({kicker: 'Chapter 09 · The traps', title: 'Hidden costs aur fading edge'});
	const ph = picture(s, 'S30', 0.5, 1.35, 4.35);
	picture(s, 'S31', 5.15, 1.35, 4.35);
	pair(s, 'Transaction costs', 'Spread, commission, slippage, overnight financing — high-turnover mein zyada asar', {x: 0.5, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	pair(s, 'Capacity & signal degradation', 'Zyada capital market move karta hai; zyada traders use karein to pattern kam effective', {x: 5.15, y: 1.35 + ph + 0.3, w: 4.35, h: 1.2});
	notes(s, ['S30', 'S31']);
}

// 20 · Five common mistakes
{
	const s = base({kicker: 'Systematic trading', title: 'Paanch common mistakes'});
	const ms = ['Model ko over-complicate karna', 'Bina clear rationale ke signals', 'Bahut kam data par testing', 'Market regime change ignore karna', 'Live conditions monitor na karna'];
	ms.forEach((m, i) => {
		const y = 1.45 + i * 0.66;
		numberCircle(s, String(i + 1).padStart(2, '0'), 0.55, y);
		s.addText(m, {x: 1.15, y, w: 3.6, h: 0.42, fontFace: BODY, fontSize: 14, color: C.text, valign: 'middle', margin: 0, isTextBox: true});
	});
	picture(s, 'S32', 4.95, 1.5, 4.55);
	notes(s, ['S32']);
}

// 21 · Closing
{
	const s = base();
	s.addText('CLOSING', {x: 0.8, y: 1.3, w: 8.4, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: C.lime, charSpacing: 4, align: 'center', margin: 0, isTextBox: true});
	s.addText('Aap Medallion ko copy nahi kar sakte.', {x: 0.5, y: 1.75, w: 9, h: 0.6, fontFace: HEAD, fontSize: 24, color: C.muted, align: 'center', margin: 0, isTextBox: true});
	s.addText('Lekin uska discipline zaroor copy kar sakte hain.', {x: 0.5, y: 2.4, w: 9, h: 0.6, fontFace: HEAD, fontSize: 24, color: C.text, align: 'center', margin: 0, isTextBox: true});
	s.addText('Evidence dhoondho → test karo → discipline se trade karo → monitor karo → jo kaam na kare, remove karo', {x: 0.8, y: 3.3, w: 8.4, h: 0.6, fontFace: BODY, fontSize: 13, color: C.lime, align: 'center', margin: 0, isTextBox: true});
	notes(s, ['S33']);
}

// 22 · Disclaimer
{
	const s = base({kicker: 'Disclaimer', title: 'Sirf educational purpose ke liye'});
	bullets(s, [
		'Yeh presentation aur video sirf education ke liye hain — investment advice nahi',
		'Historical performance future results ki guarantee nahi hoti',
		"Medallion ke proprietary models ko replicate karne ka koi claim nahi",
		'Medallion ke returns "reportedly", "approximately" aur "fees se pehle" hain — jaise source guide mein',
		'Charts illustrative hain — real market ya fund data nahi',
	], 0.5, 1.5, 9, 3.5, 15);
	notes(s, ['S34']);
}

pres.writeFile({fileName: path.join(__dirname, WIDE ? 'qa/wide-fonts.pptx' : 'The-Mathematicians-Edge-Hinglish.pptx')}).then((f) => console.log(`Wrote ${f} (${slideNo} slides)`));
