# THE MATHEMATICIAN'S EDGE
### How Jim Simons Approached Trading — Premium YouTube Documentary / Explainer
**Source:** `jim_simons_trading_approach.pdf` (5 pages, Hinglish educational guide) — the only source used.
**Target runtime:** ~12:40 · **Format:** 16:9, 4K (3840×2160) master, 24 fps · **Narration:** English (Hinglish version can be adapted 1:1 from this script)

---

## 0. Source-Fidelity Rules (read before editing)

1. **Every spoken or on-screen claim comes from the PDF.** The fidelity map in §11 lists each claim with its page.
2. **Keep the hedges.** The PDF says the returns and the Hidden Markov Model usage were *reportedly*, and the ~66% figure is *approximate* and *before fees*. The script keeps all three. Never show "66%" without "~" and "before fees".
3. **No invented data in charts.** There is no Medallion returns curve, no compounding chart, and no AUM figure, because the PDF gives none. Any chart that shows price or performance shapes is a **concept visual** and carries a small `ILLUSTRATIVE · NOT REAL DATA` tag in the corner.
4. **No quotes attributed to Simons.** The PDF has none. The only quoted line in the video is the PDF's own example rule (the 20/50 moving-average crossover).
5. **No biography beyond the PDF.** Use only these facts: mathematician, former signals analyst, founded Renaissance Technologies in 1982.
6. **No brand logos.** Show "Renaissance Technologies" and "Medallion Fund" as typography only. Use archival photos of Jim Simons only if they are properly licensed. Otherwise use the silhouette treatment described in S05.

---

## 1. Video Structure

| # | Chapter | Time | Purpose |
|---|---|---|---|
| — | **Cold Open** | 0:00–0:46 | Hook with the ~66% figure, then flip it: "it came from math, not instinct" + promise of what the viewer can and can't use |
| — | **Title Sequence** | 0:46–0:54 | Brand moment |
| 01 | **Markets as a Math Problem** | 0:54–1:54 | Who Simons was (per PDF), 1982, the core idea: markets contain persistent, predictable patterns |
| 02 | **The Machine Behind the Edge** | 1:54–3:40 | Performance wasn't only about models → 4 pillars |
| 03 | **The Reality Check** | 3:40–4:05 | You can't replicate Medallion. It's a learning framework, not a strategy |
| 04 | **Four Principles You Can Use** | 4:05–5:55 | Systematic rules · Evidence over narrative · Risk management · Diversification |
| 05 | **The Quant Toolkit** | 5:55–7:10 | Stat arb · Momentum/trend · Mean reversion · Factor models |
| 06 | **Your First Testable Rule** | 7:10–7:50 | 20/50 MA crossover example → backtest metrics |
| 07 | **The Hardest Part: Execution** | 7:50–8:45 | 4 ways traders break systems → trade journal → live vs backtest |
| 08 | **When It Stops Working** | 8:45–9:33 | Drawdown diagnosis: 4 questions |
| 09 | **The Traps** | 9:33–11:55 | Overfitting, out-of-sample testing, costs, capacity, signal degradation + 5 common mistakes |
| — | **Closing** | 11:55–12:40 | "You can't copy Medallion. You can copy the discipline." + disclaimer + end card |

**Retention beats:** a pattern interrupt about every 60–90 s (chapter cards, a hard cut to silence at S13, the "rule on screen" moment at S22, the fast checklist montage at S32). There are two open loops. The first is planted at 0:28 ("…and which ones you *can't*") and paid off at S13. The second is planted at S12 ("…or remove") and paid off at S26–S27.

---

## 2. Style Bible

### Palette (dark, minimal. Matches the NOMI TRADES app colors)
| Token | Hex | Use |
|---|---|---|
| `bg-ink` | `#0B0F14` | Base background everywhere |
| `bg-panel` | `#0E141B` | Cards, chart panels |
| `text-hi` | `#DBE3EA` | Primary type |
| `text-lo` | `#7D8B98` | Secondary type, axis labels |
| `grid` | `#5C6A77` @ 15% | Grid lines, hairlines |
| `signal` | `#C8FF4D` | **The "signal" color.** Used only for the thing that matters in each frame |
| `gain` | `#35D19A` | Positive / valid / "keep" |
| `loss` | `#FF5A5F` | Negative / invalid / "remove" (add to palette) |
| `gold` | `#F0C75E` | Key numbers (1982, ~66%, 30+) |
| `cool` | `#7FA8FF` | Secondary data series |

Rule: at most **one** accent color is dominant per frame. The frame is ~90% ink.

### Typography
- **Display / titles:** a high-contrast serif (e.g., *Canela*, *GT Sectra* or free *Fraunces*), light weight, tight tracking (−2%). Documentary gravitas.
- **UI / labels / on-screen text:** a neo-grotesk (e.g., *Inter Tight* / *Söhne*), medium weight, +4% tracking for all-caps labels.
- **Numbers / data / code-like rules:** a mono (*JetBrains Mono* / *IBM Plex Mono*), tabular figures.
- Lower-third labels are all-caps, 28 px at 1080p, `text-lo`, with a 1 px `signal` hairline on the left.

### Grid & Layout
- 12-column grid, 120 px safe margins at 4K. Titles sit on the lower-left third line. Data sits center-right.
- Chapter cards: large chapter number (`01`) in outline serif + chapter name in solid serif, left-aligned.

### Motion Language
- **Easing:** everything uses `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Nothing linear except scanning lines.
- **Text:** words rise 12 px + fade, staggered 40 ms per word. Numbers roll up digit by digit (slot-machine counter).
- **Camera:** slow virtual push-ins (100% → 106% over the scene). Never static for >4 s.
- **Texture:** subtle film grain (3–4%), soft vignette, very light chromatic aberration only on transitions.
- **Signature device, "The Signal Line":** a thin `signal`-colored line that runs through the whole video. It draws the charts, underlines key words and becomes the transition wipe between chapters. It is a visual metaphor for "finding the signal in the noise."

### Transitions (house set)
1. **Signal-line wipe:** the lime line sweeps across and reveals the next scene (chapter changes).
2. **Data dissolve:** the frame breaks into a dot-matrix of particles and re-forms (idea → idea).
3. **Match cut on shape:** a chart line becomes a street line, a candle becomes a building, and so on.
4. **Hard cut to black + silence:** used only at the Reality Check (S13) and the closing line (S33).

---

## 3. Background Music Direction (master plan)

**Overall palette:** minimal, dark, cerebral electronic with an orchestral bed. References: *Jóhann Jóhannsson* (restraint), *Trent Reznor & Atticus Ross* (pulse, texture), *Hans Zimmer "Time"-style* slow build (for the close only). Choose royalty-free tracks with stems so you can duck under the voice.

| Cue | Chapters | Mood | Tempo / Texture |
|---|---|---|---|
| **M1 "Pattern"** | Cold Open + Title | Mysterious, precise, a hint of awe | ~80 BPM. Ticking clock-like pulse, sub-bass swell, felt piano single notes. Build to a hit on the title |
| **M2 "Laboratory"** | Ch 01–02 | Curious, intellectual, forward motion | ~95 BPM. Arpeggiated analog synth, soft string pad, data-like glitch percussion |
| **M3 "Ground Truth"** | Ch 03 | Sober | Music **drops out** at S13 start, then only a low drone returns |
| **M4 "Method"** | Ch 04–06 | Confident, constructive, "you can do this" | ~100 BPM. Clean pulse, muted guitar/plucks, light percussion. Brightest section of the film |
| **M5 "Pressure"** | Ch 07–08 | Tension, psychological | ~70 BPM. Heartbeat-like kick, dissonant strings, slow swells, sparse |
| **M6 "Noise"** | Ch 09 | Analytical, slightly uneasy | Granular textures, filtered static, pulsing bass. Rhythm tightens in the S32 checklist montage |
| **M7 "Discipline"** | Closing | Resolved, reflective, premium | Piano + strings resolve, gradual build, final sustained chord under the end card |

**Mix:** voice-over −14 LUFS integrated for the finished video. Music ducks −12 to −16 dB under VO with a 300 ms release. Let music breathe at +3 dB in every no-VO gap (title, chapter cards).

---

## 4. Sound-Effects Library (reused throughout)

| ID | Sound | Used for |
|---|---|---|
| SFX-01 | Low sub-boom "hit" | Key number reveals, title |
| SFX-02 | Digital counter ticks (fast mechanical rolls) | Number roll-ups |
| SFX-03 | Soft whoosh (air, not cartoonish) | Signal-line wipes |
| SFX-04 | Data chirps / soft UI blips | Nodes lighting up, list items appearing |
| SFX-05 | Keyboard typing, sparse | Rule being typed on screen |
| SFX-06 | Paper/pen scratch | Trade journal |
| SFX-07 | Static / white-noise crackle | "Noise" visuals, overfitting |
| SFX-08 | Glass tick / "ting" | Checkmarks, correct items |
| SFX-09 | Low "denied" thud | Red X, removed signals |
| SFX-10 | Heartbeat low kick | Drawdown / pressure scenes |
| SFX-11 | Reverse cymbal riser (1–2 s) | Pre-reveal tension |
| SFX-12 | Room tone / trading-floor murmur, very low | Ambient bed under B-roll |

---

## 5. Scene-by-Scene Storyboard

> Format for each scene: **Narration · Visual · On-screen text · Motion graphics · Chart/graph animation · B-roll · SFX · Music · Transition out**

---

### COLD OPEN

#### S01 — "The Number" · 0:00–0:13
- **Narration:** "Sixty-six percent. That's roughly the average annual return Jim Simons' Medallion Fund reportedly generated before fees — for more than thirty years."
- **Visual:** Pure black. A single gold `~66%` counter rolls up from `00%` in the dead center, huge, serif. Camera pushes in slowly. A faint dot-grid appears behind the number.
- **On-screen text:** `~66%` → subline fades in below: `AVERAGE ANNUAL RETURN · BEFORE FEES · REPORTEDLY` → then `30+ YEARS`
- **Motion graphics:** Slot-machine digit roll. The subline types in word by word. `30+ YEARS` slides in from the right with the lime hairline underline.
- **Chart/graph:** None. No return curve (the PDF has no curve data).
- **B-roll:** None. Hold on typography for impact.
- **SFX:** SFX-02 counter ticks → SFX-01 sub-boom when the number lands.
- **Music:** M1 starts: one sustained low note and a clock-like tick.
- **Transition out:** The number dissolves into thousands of particles (data dissolve).

#### S02 — "Not Instinct" · 0:13–0:28
- **Narration:** "And it didn't come from gut feelings, market stories, or a star trader's instinct. It came from mathematics, data, and scientific discipline."
- **Visual:** The particles form three words that get crossed out one by one: `GUT FEELING`, `MARKET STORIES`, `INSTINCT`. They shatter, and three new words assemble in lime: `MATHEMATICS · DATA · DISCIPLINE`.
- **On-screen text:** ~~GUT FEELING~~ ~~STORIES~~ ~~INSTINCT~~ → **MATHEMATICS · DATA · SCIENTIFIC DISCIPLINE**
- **Motion graphics:** A red strike-through line draws across each word (SFX-09 each time). The new words assemble from particles.
- **Chart/graph:** Background: a faint noisy price line (`ILLUSTRATIVE`) with a clean lime line emerging from it. First appearance of "The Signal Line".
- **B-roll:** Micro-cuts (0.5 s each) under the crossed-out words: a hand gesturing at a screen, a newspaper headline blur (no readable real headline), a trader rubbing their eyes. Desaturated to 20%.
- **SFX:** SFX-09 ×3, SFX-07 static under the noise, SFX-04 as new words form.
- **Music:** M1 pulse enters.
- **Transition out:** Hard cut.

#### S03 — "The Promise" · 0:28–0:46
- **Narration:** "In this video: how Simons approached markets, what actually drove his edge — and, most importantly, which of his principles a retail trader can realistically use. And which ones you can't."
- **Visual:** A vertical three-step "agenda stack" slides up on the left. On the right, a slow push into a dark screen full of scrolling numbers (monitor B-roll).
- **On-screen text:** `01 · THE APPROACH` / `02 · THE EDGE` / `03 · WHAT YOU CAN USE` → a 4th line appears in red after a beat: `…AND WHAT YOU CAN'T`
- **Motion graphics:** Each agenda line lights up lime as it's spoken. The 4th line glitches in (RGB split for 4 frames).
- **Chart/graph:** —
- **B-roll:** Macro shot of scrolling market-data terminal numbers, shallow depth of field, cool tint.
- **SFX:** SFX-04 per line, SFX-07 glitch on the final line, SFX-11 riser into the title.
- **Music:** M1 builds.
- **Transition out:** Riser → cut to title on the hit.

#### S04 — Title Sequence · 0:46–0:54
- **Narration:** *(none)*
- **Visual:** Black. The Signal Line draws horizontally across the frame, then bends into a subtle price-like waveform. The title resolves above it.
- **On-screen text:** **THE MATHEMATICIAN'S EDGE** (serif, large) / `How Jim Simons Approached Trading` (grotesk, small caps)
- **Motion graphics:** Letters reveal through a mask that follows the line. A grain pulse on the hit.
- **Chart/graph:** The waveform is decorative (`ILLUSTRATIVE` tag not needed because there are no axes or values).
- **B-roll:** —
- **SFX:** SFX-01 big sub-boom, SFX-03 whoosh on the line draw.
- **Music:** M1 hits its peak and then decays.
- **Transition out:** Signal-line wipe.

---

### CHAPTER 01 — MARKETS AS A MATH PROBLEM

#### S05 — "1982" · 0:54–1:09
- **Narration:** "In 1982, Jim Simons founded Renaissance Technologies. Simons was a mathematician and a former signals analyst — and he looked at markets differently from traditional traders."
- **Visual:** Chapter card (2 s): `01` outline + `Markets as a Math Problem`. Then a portrait moment. Either a licensed archival photo of Simons with a slow Ken Burns move and a duotone ink/gold grade, **or** (if unlicensed) a backlit silhouette of a figure at a chalkboard. A gold `1982` sits large at right.
- **On-screen text:** `1982` · `RENAISSANCE TECHNOLOGIES` (typography only, no logo) · Lower-third: `JIM SIMONS — MATHEMATICIAN · FORMER SIGNALS ANALYST`
- **Motion graphics:** `1982` counts up from `1970` with fast ticks. The lower-third slides in on the lime hairline.
- **Chart/graph:** —
- **B-roll:** Chalk equations on a blackboard (generic stock, no specific real equations implied), close-up of chalk dust.
- **SFX:** SFX-02 year ticks, chalk scratch foley.
- **Music:** M2 "Laboratory" arpeggio starts.
- **Transition out:** Match cut: chalk line → the Signal Line on a chart.

#### S06 — "The Core Idea" · 1:09–1:29
- **Narration:** "His core idea was easy to state and hard to execute: financial market data may contain persistent, predictable patterns. Combine the right people, the right data, and the right technology — and those patterns could be identified and traded systematically."
- **Visual:** A dense cloud of grey data points (noise). A lime pattern slowly "lights up" within it and connects into a repeating shape. Then a three-circle Venn diagram assembles: `PEOPLE` · `DATA` · `TECHNOLOGY`. The intersection glows lime: `SYSTEMATIC TRADING`.
- **On-screen text:** `PERSISTENT` · `PREDICTABLE` · `PATTERNS` (each word pops as spoken) → Venn labels
- **Motion graphics:** Point cloud with parallax depth. The Venn circles slide in from three directions and overlap with a soft glow bloom at the center.
- **Chart/graph:** Scatter/noise field with a hidden repeating wave highlighted (`ILLUSTRATIVE`).
- **B-roll:** Server racks with blinking LEDs (cool blue grade), a hand on a keyboard.
- **SFX:** SFX-04 as points light up, a low "lock-in" tone at the Venn intersection.
- **Music:** M2 continues.
- **Transition out:** Data dissolve.

#### S07 — "Scientists, Not Storytellers" · 1:29–1:54
- **Narration:** "So Renaissance didn't build its approach on traditional, qualitative market analysis. It built it on statistical pattern recognition. The firm employed mathematicians, physicists, and computer scientists — people who believed markets could be studied like a mathematical system, where scientific discipline could reveal hidden patterns."
- **Visual:** Split screen. Left, labelled `TRADITIONAL · QUALITATIVE`: a desaturated newspaper/opinion vibe, blurred. Right, labelled `QUANTITATIVE · STATISTICAL`: crisp, dark, lime data grid. The left side slides away. Three minimal line icons appear: `MATHEMATICIANS`, `PHYSICISTS`, `COMPUTER SCIENTISTS`.
- **On-screen text:** `QUALITATIVE ANALYSIS` ✕ → `STATISTICAL PATTERN RECOGNITION` ✓ · the three roles · final line: `MARKETS = A MATHEMATICAL SYSTEM`
- **Motion graphics:** The split wipe collapses to the right. The icons draw on with stroke animation. The `=` sign flashes lime.
- **Chart/graph:** —
- **B-roll:** Whiteboards full of notation, lab-like workspace, researchers from behind (no identifiable real people implied to be Renaissance staff).
- **SFX:** SFX-09 on ✕, SFX-08 on ✓, SFX-04 per icon.
- **Music:** M2 adds a string pad.
- **Transition out:** Signal-line wipe to Chapter 02.

---

### CHAPTER 02 — THE MACHINE BEHIND THE EDGE

#### S08 — "Not Just Models" · 1:54–2:14
- **Narration:** "But here's what most people miss: Renaissance's performance wasn't only about models. Several factors mattered together — execution quality, scientific discipline, data analysis, continuous research, and the scientists it hired. Let's break down four of them."
- **Visual:** Chapter card `02 · The Machine Behind the Edge`. A single box labelled `MODELS` sits center. The camera pulls back to reveal it is one gear in a larger machine of five interlocking gears.
- **On-screen text:** `MODELS` → `EXECUTION QUALITY` · `SCIENTIFIC DISCIPLINE` · `DATA ANALYSIS` · `CONTINUOUS RESEARCH` · `HIRING SCIENTISTS`
- **Motion graphics:** Pull-back reveal. The gears begin to rotate together once all labels are on.
- **Chart/graph:** —
- **B-roll:** Macro shot of a watch mechanism / precision gears (metaphor), graded dark.
- **SFX:** Mechanical click per gear, SFX-01 soft hit when all rotate.
- **Music:** M2 intensifies slightly.
- **Transition out:** Zoom into gear #1 → next scene.

#### S09 — Pillar 1: "Statistical Pattern Recognition" · 2:14–2:33
- **Narration:** "One: statistical pattern recognition. The team processed price, volume, order flow and other market data. The goal: find signals that were statistically significant, repeated over time — and stayed useful even after trading costs."
- **Visual:** Four data "streams" flow in from the left (`PRICE`, `VOLUME`, `ORDER FLOW`, `OTHER DATA`) into a filter funnel. Only a thin lime signal exits right. Then it passes three gates.
- **On-screen text:** `PILLAR 01 · STATISTICAL PATTERN RECOGNITION` · Gate checklist: `✓ STATISTICALLY SIGNIFICANT` `✓ REPEATS OVER TIME` `✓ USEFUL AFTER TRADING COSTS`
- **Motion graphics:** Streams drawn as flowing particle ribbons. Each gate is a vertical light bar that turns green as the signal passes.
- **Chart/graph:** Mini-sparklines inside each input stream (`ILLUSTRATIVE`).
- **B-roll:** Fiber-optic light streams (abstract).
- **SFX:** A flowing data hum, SFX-08 per gate.
- **Music:** M2.
- **Transition out:** The signal line continues into the next scene.

#### S10 — Pillar 2: "Borrowed from Physics" · 2:33–2:55
- **Narration:** "Two: borrowing from other sciences. Some mathematical techniques were adapted from fields outside finance, like physics and signal processing. Hidden Markov Models were reportedly used in financial pattern recognition. The logic: if a technique works in complex systems elsewhere, test whether it works in markets too."
- **Visual:** Left: an oscilloscope-style waveform (signal processing) and a physics particle-trail motif. They slide toward the center and merge into a market chart. A minimal Hidden Markov Model diagram appears: 2–3 hidden-state circles connected by curved arrows, with observed outputs below.
- **On-screen text:** `PILLAR 02 · MATH & PHYSICS` · `PHYSICS` + `SIGNAL PROCESSING` → `FINANCE` · `HIDDEN MARKOV MODELS (REPORTEDLY)` · `WORKS IN COMPLEX SYSTEMS? → TEST IT IN MARKETS`
- **Motion graphics:** The HMM diagram draws node by node. The arrows animate with small traveling dots. The word `(REPORTEDLY)` sits in `text-lo`, deliberately visible.
- **Chart/graph:** Generic HMM schematic (conceptual, with no state names or probabilities, since the PDF gives none).
- **B-roll:** Oscilloscope screen, particle-physics-style visualization (abstract stock).
- **SFX:** An oscilloscope sine tone that morphs into the data hum, SFX-04 per node.
- **Music:** M2.
- **Transition out:** Data dissolve.

#### S11 — Pillar 3: "Speed, Consistency, Scale" · 2:55–3:17
- **Narration:** "Three: speed, consistency and scale. Finding a profitable signal isn't enough. It has to be executed quickly, consistently, and at scale. And notably, Renaissance intentionally kept the Medallion Fund's capacity limited — so its large orders wouldn't excessively affect market prices."
- **Visual:** Three horizontal speed-lines with the labels `SPEED`, `CONSISTENCY`, `SCALE`. Then a "container" labelled `MEDALLION FUND CAPACITY` is shown with a lid capping it. Beside it, a stylised order book: a large order block pushes the price line, illustrating market impact.
- **On-screen text:** `PILLAR 03 · SPEED · CONSISTENCY · SCALE` · `SIGNAL ≠ PROFIT — EXECUTION MATTERS` · `CAPACITY: INTENTIONALLY LIMITED`
- **Motion graphics:** Speed-line streaks. The container fills, then the lid snaps on (lime lock icon).
- **Chart/graph:** Market-impact concept: a big order bar causes the price line to jump (`ILLUSTRATIVE`).
- **B-roll:** Long-exposure light trails, time-lapse data-center corridor.
- **SFX:** SFX-03 whooshes, a metallic "lock" click on the lid.
- **Music:** M2 rhythmic peak.
- **Transition out:** Hard cut on the lock click.

#### S12 — Pillar 4: "The Discipline Loop" · 3:17–3:40
- **Narration:** "Four: model discipline. A signal was traded only if there was statistically significant evidence behind it. If a signal stopped working, it was removed. And the process never stopped: research, test, trade live, monitor — then improve, or remove."
- **Visual:** A **circular loop diagram**, the hero graphic of the film: `RESEARCH → TEST → LIVE TRADE → MONITOR → IMPROVE / REMOVE` → back to `RESEARCH`. A signal token travels around the loop. On the second lap, one token turns red and is ejected.
- **On-screen text:** `PILLAR 04 · MODEL DISCIPLINE` · `EVIDENCE → TRADE` · `STOPS WORKING → REMOVE` · the 5 loop stages
- **Motion graphics:** The loop draws stage by stage in sync with the VO. The ejected red token fades out with the label `REMOVED`.
- **Chart/graph:** —
- **B-roll:** —
- **SFX:** SFX-04 per stage, SFX-09 on the ejected token.
- **Music:** M2 resolves, then fades toward silence.
- **Transition out:** **Hard cut to black + silence (1 s).**

---

### CHAPTER 03 — THE REALITY CHECK

#### S13 — "You Can't Copy This" · 3:40–4:05
- **Narration:** "Now, a reality check. A retail trader cannot replicate the Medallion Fund's performance. Its models are proprietary and not publicly available. Renaissance had technology, scale, and highly skilled researchers. So treat Simons' principles as a learning framework — not a trading strategy to copy."
- **Visual:** Black. A vault-door / locked-box outline labelled `MEDALLION MODELS` in the center, with a `PROPRIETARY` stamp. Three bars beside it labelled `TECHNOLOGY`, `SCALE`, `SKILLED RESEARCHERS` fill up high. Then the frame reframes: `STRATEGY TO COPY` ✕ / `LEARNING FRAMEWORK` ✓.
- **On-screen text:** Chapter card `03 · The Reality Check` · `PROPRIETARY · NOT PUBLICLY AVAILABLE` · `❌ COPY THE STRATEGY` · `✓ LEARN THE PRINCIPLES`
- **Motion graphics:** The stamp slams down with a subtle shake. The ✕ / ✓ swap is the payoff of the open loop from S03.
- **Chart/graph:** —
- **B-roll:** A closed bank-vault door (stock), a lone desk with a single monitor lit.
- **SFX:** Silence, then SFX-01 low hit on the stamp, SFX-09 on ✕, SFX-08 on ✓.
- **Music:** M3: a low drone only.
- **Transition out:** Signal-line wipe (the line re-appears after the dark = "here's what you *can* do").

---

### CHAPTER 04 — FOUR PRINCIPLES YOU CAN USE

#### S14 — Principle 1: "Rules Over Judgement" · 4:05–4:29
- **Narration:** "So what can you actually apply? Principle one: systematic rules over discretionary judgement. Define your entry, exit, stop loss and position size in advance. Measurable conditions can reduce behavioural mistakes like overconfidence, hesitation and confirmation bias."
- **Visual:** Chapter card `04 · Four Principles You Can Use`. A clean "rulebook card" UI (dark panel) fills in 4 fields: `ENTRY`, `EXIT`, `STOP LOSS`, `POSITION SIZE`, each with a lock icon. On the right, three bias "bubbles" (`OVERCONFIDENCE`, `HESITATION`, `CONFIRMATION BIAS`) shrink as the rules lock.
- **On-screen text:** `PRINCIPLE 01 · SYSTEMATIC RULES > DISCRETIONARY JUDGEMENT` · 4 fields · 3 biases
- **Motion graphics:** The fields fill with a typing cursor. The bias bubbles deflate and fade.
- **Chart/graph:** —
- **B-roll:** A trader's hand hovering over a mouse, hesitating (anxious framing), then a calm hand closing a notebook.
- **SFX:** SFX-05 typing, lock clicks, soft deflate "pff".
- **Music:** M4 "Method" starts, brighter.
- **Transition out:** The card slides left.

#### S15 — Principle 2: "Evidence Over Narrative" · 4:29–4:58
- **Narration:** "Principle two: put data and evidence above narrative. Backtest your strategy on historical data. Learn where it performs, where it fails, what its historical drawdown was, its win rate, and its average risk-to-reward. A backtest doesn't guarantee future profit — but it gives you a baseline for understanding how the strategy has behaved."
- **Visual:** A "narrative" speech bubble (`"I feel the market will go up"`, clearly generic) gets pushed aside by a backtest report panel. The panel has 5 rows that appear one by one: `PERFORMS IN…`, `FAILS IN…`, `MAX DRAWDOWN`, `WIN RATE`, `AVG RISK:REWARD`, with values shown as `—` placeholders or blurred bars (no invented numbers).
- **On-screen text:** `PRINCIPLE 02 · DATA & EVIDENCE > NARRATIVE` · report rows · footer in amber: `BACKTEST ≠ GUARANTEE · IT'S A BASELINE`
- **Motion graphics:** The bubble is shoved off-frame by the panel. The rows reveal with a scan-line.
- **Chart/graph:** A small equity-curve sparkline with an underwater drawdown area beneath (`ILLUSTRATIVE · NOT REAL DATA`). The drawdown region is highlighted red to teach the concept visually.
- **B-roll:** Laptop screen with a charting platform (generic, logos blurred).
- **SFX:** SFX-04 per row, SFX-07 short static on the bubble exit.
- **Music:** M4.
- **Transition out:** Data dissolve.

#### S16 — Principle 3: "Risk Is Non-Negotiable" · 4:58–5:25
- **Narration:** "Principle three: risk management is non-negotiable. Keep position sizing consistent. Define a maximum loss per trade. Define a daily and weekly maximum loss. And don't increase risk just because you're on a winning streak. The goal: no single trade — or sequence of trades — should seriously damage your account."
- **Visual:** A shield icon built from 4 segments. Each segment locks in as its rule is spoken. Then an "account" block survives a string of red candles hitting the shield.
- **On-screen text:** `PRINCIPLE 03 · RISK MANAGEMENT IS NON-NEGOTIABLE` · `CONSISTENT POSITION SIZING` · `MAX LOSS / TRADE` · `MAX LOSS / DAY · WEEK` · `NO EXTRA RISK AFTER A WINNING STREAK` · Goal line: `NO SINGLE TRADE — OR STREAK — BREAKS THE ACCOUNT`
- **Motion graphics:** Shield segments snap together. The red candles bounce off with a small impact flash.
- **Chart/graph:** Conceptual only (candles with no axis values).
- **B-roll:** Climbing rope / carabiner lock close-up (safety metaphor).
- **SFX:** Metallic clicks for segments, SFX-09 muffled for deflected candles.
- **Music:** M4.
- **Transition out:** The shield splits into four tiles → the next scene's grid.

#### S17 — Principle 4: "Diversify" · 5:25–5:55
- **Narration:** "Principle four: diversify across markets and signals. Medallion reportedly traded hundreds of instruments — equities, bonds, currencies, commodities and derivatives. At retail level, the broad lesson is: don't depend completely on one instrument or one strategy. Diversifying across less-correlated markets can reduce your dependence on any single edge."
- **Visual:** A dense mosaic grid of hundreds of small tiles (no tickers, just dots) organized into 5 colored clusters labelled with the asset classes. Then everything collapses to a single tile labelled `ONE INSTRUMENT` that cracks, and the camera widens to show several unrelated tiles holding steady.
- **On-screen text:** `PRINCIPLE 04 · DIVERSIFICATION` · `HUNDREDS OF INSTRUMENTS (REPORTEDLY)` · `EQUITIES · BONDS · CURRENCIES · COMMODITIES · DERIVATIVES` · `LESS-CORRELATED → LESS DEPENDENCE ON ONE EDGE`
- **Motion graphics:** Tiles populate in a ripple from the center. Cluster labels fade in. Crack + widen move.
- **Chart/graph:** Concept: two or three lines moving independently vs one line (`ILLUSTRATIVE`). No correlation values.
- **B-roll:** Aerial of a global city at night / a world-map light network (abstract).
- **SFX:** A rippling chime cascade for the tiles, a glass crack on the single tile.
- **Music:** M4 peak.
- **Transition out:** Signal-line wipe to Chapter 05.

---

### CHAPTER 05 — THE QUANT TOOLKIT

*(Visual system: four "strategy cards" in a 2×2 grid. Each scene zooms into one card, which then becomes a full-screen animated chart.)*

#### S18 — Statistical Arbitrage · 5:55–6:17
- **Narration:** "Quantitative strategies come in a few broad types. Statistical arbitrage studies the price relationship between historically related assets. If that relationship temporarily widens to an unusual level, the strategy tests whether the spread will revert toward its normal range."
- **Visual:** Chapter card `05 · The Quant Toolkit` → the 2×2 grid appears → zoom into card 1.
- **On-screen text:** `STATISTICAL ARBITRAGE` · `RELATED ASSETS` · `SPREAD WIDENS → REVERTS TO NORMAL RANGE?`
- **Motion graphics:** Two lines (`ASSET A` lime, `ASSET B` blue) move together. They diverge, and the gap fills with a shaded band. The band then narrows back. A dashed "normal range" corridor is shown.
- **Chart/graph:** **Pair-spread animation** with a lower panel showing the spread line oscillating inside a normal band, spiking out, then returning. Tag: `ILLUSTRATIVE`. The "?" stays on screen: the strategy *tests* reversion and doesn't assume it.
- **B-roll:** —
- **SFX:** A rubber-band stretch tension sound as the spread widens, a soft snap as it narrows.
- **Music:** M4 continues, lighter percussion.
- **Transition out:** Zoom out to the grid → into card 2.

#### S19 — Momentum & Trend Following · 6:17–6:33
- **Narration:** "Momentum and trend following try to systematically capture the possibility that recent strength continues — using rules like going long in an uptrend and short in a downtrend."
- **Visual:** Card 2 full-screen.
- **On-screen text:** `MOMENTUM & TREND FOLLOWING` · `UPTREND → LONG` · `DOWNTREND → SHORT`
- **Motion graphics:** Arrow markers ride the line: a green ▲ LONG during the up-leg, a red ▼ SHORT during the down-leg.
- **Chart/graph:** A price line with a clear up-leg then down-leg, and trend channels drawn on as it moves (`ILLUSTRATIVE`).
- **B-roll:** A surfer riding a wave (metaphor, 1.5 s insert).
- **SFX:** A rising tone on the uptrend, a falling tone on the downtrend.
- **Music:** M4.
- **Transition out:** Grid → card 3.

#### S20 — Mean Reversion · 6:33–6:53
- **Narration:** "Mean reversion tests the idea that price may return to its average, or equilibrium, level. It can be relevant in short-term trading — but the challenge is telling a temporary overextension apart from the beginning of a new trend."
- **Visual:** Card 3 full-screen.
- **On-screen text:** `MEAN REVERSION` · `PRICE ↔ AVERAGE` · The challenge, as two labels on a fork: `TEMPORARY OVEREXTENSION?` vs `NEW TREND?`
- **Motion graphics:** Price oscillates around a horizontal mean line with an elastic pull-back effect. At the end the chart **forks** into two ghosted futures: one reverts, one breaks away into a new trend. Both are shown with equal weight and a `?`.
- **Chart/graph:** Mean-line oscillation + fork (`ILLUSTRATIVE`).
- **B-roll:** A pendulum swinging (metaphor).
- **SFX:** A pendulum tick-tock, a question "ping" on the fork.
- **Music:** M4.
- **Transition out:** Grid → card 4.

#### S21 — Factor-Based Models · 6:53–7:10
- **Narration:** "And factor-based models analyse characteristics like value, momentum, quality and low volatility. Instead of predicting one stock's direction, the portfolio is tilted toward specific factor exposures."
- **Visual:** Card 4 full-screen.
- **On-screen text:** `FACTOR-BASED MODELS` · `VALUE · MOMENTUM · QUALITY · LOW VOLATILITY` · `PREDICT ONE STOCK ✕ → TILT THE PORTFOLIO ✓`
- **Motion graphics:** A portfolio shown as a platform/balance with four factor weights. Sliders nudge and the platform tilts. A single-stock crystal-ball icon gets ✕'d.
- **Chart/graph:** Four horizontal factor-exposure bars adjusting in length, with no numeric labels (`ILLUSTRATIVE`).
- **B-roll:** —
- **SFX:** Slider clicks, SFX-09 on the crystal ball, SFX-08 on the tilt.
- **Music:** M4.
- **Transition out:** All four cards fly back into the grid and collapse into a single cursor → next chapter.

---

### CHAPTER 06 — YOUR FIRST TESTABLE RULE

#### S22 — "One Precise Rule" · 7:10–7:36
- **Narration:** "The good news: a quantitative approach doesn't need Renaissance-level mathematics. It starts with one precise, testable rule. For example: 'I'll buy when the 20-day moving average crosses above the 50-day moving average. And I'll exit when the 20-day crosses back below the 50-day.'"
- **Visual:** Chapter card `06 · Your First Testable Rule`. A code-editor-style dark panel. The rule types out in mono font, line by line:
  ```
  IF  MA(20) crosses ABOVE MA(50)  →  BUY
  IF  MA(20) crosses BELOW MA(50)  →  EXIT
  ```
- **On-screen text:** `NO RENAISSANCE-LEVEL MATH REQUIRED` · `STEP 1: A PRECISE, TESTABLE RULE` · the two-line rule
- **Motion graphics:** Typing animation synced to VO. `MA(20)` is highlighted lime and `MA(50)` blue, matching the chart colors in the next scene.
- **Chart/graph:** A price chart (`ILLUSTRATIVE`) behind the editor, with the two MAs drawing in. At each crossover a marker pops: ● `BUY` (green) on the upward cross, ● `EXIT` (grey) on the downward cross.
- **B-roll:** —
- **SFX:** SFX-05 typing, SFX-08 on each crossover marker.
- **Music:** M4, minimal.
- **Transition out:** The editor slides away and the chart goes full-screen.

#### S23 — "Now Test It" · 7:36–7:50
- **Narration:** "Now that rule can be backtested on historical data — checking the win rate, drawdown, average risk-to-reward, and how it behaves across different market conditions."
- **Visual:** The full-screen chart runs a "backtest scan": a vertical playhead sweeps left to right, dropping trade markers. A metrics dashboard slides up underneath with 4 tiles.
- **On-screen text:** Tiles: `WIN RATE` · `DRAWDOWN` · `AVG R:R` · `MARKET CONDITIONS`. Values stay as animated `— — %` placeholders (the PDF gives no results for this rule, so show none). Corner tag: `ILLUSTRATIVE`.
- **Motion graphics:** Playhead scan with a glow trail. The tiles flip in sequence.
- **Chart/graph:** Backtest playhead + regime shading (bands labelled `TRENDING` / `RANGE-BOUND` behind the price).
- **B-roll:** —
- **SFX:** A scanning hum, SFX-04 per tile.
- **Music:** M4 resolves → transitions to M5 (tension creeps in).
- **Transition out:** The dashboard glitches and flickers red → next chapter.

---

### CHAPTER 07 — THE HARDEST PART: EXECUTION

#### S24 — "How Traders Break Their Own Systems" · 7:50–8:15
- **Narration:** "Building a strategy is one challenge. Executing it consistently is an even bigger one. Here's where traders break their own systems: taking some signals and skipping others. Moving the stop loss. Holding a losing trade, hoping it recovers. And abandoning the strategy after a drawdown."
- **Visual:** Chapter card `07 · The Hardest Part: Execution`. A clean system diagram (the rule from S22) cracks in 4 places. Each crack is one behaviour, shown as a quick mini-vignette:
  1. Signal markers where some get a "skip" ✕ (cherry-picking)
  2. A stop-loss line dragged down by a cursor
  3. A red position held while a clock spins
  4. A "delete strategy" button being clicked after a drawdown dip
- **On-screen text:** `STRATEGY = HARD` · `EXECUTION = HARDER` · the 4 behaviours numbered `01–04`
- **Motion graphics:** Crack propagation lines in red. Each vignette is 3–4 s in a small inset panel.
- **Chart/graph:** Inset mini-charts (`ILLUSTRATIVE`).
- **B-roll:** A close-up of a trader's face lit by a red screen, fingers drumming, a clock ticking.
- **SFX:** SFX-10 heartbeat, glass crack per behaviour, SFX-09 on "delete".
- **Music:** M5 "Pressure".
- **Transition out:** The cracked diagram fades → a notebook opens.

#### S25 — "The Trade Journal" · 8:15–8:45
- **Narration:** "The fix is a trade journal. Log the entry condition, entry price, exit price, stop loss, take profit, market condition and the result. Then compare: is your live performance similar to the backtest's behaviour? If it's significantly worse, possible reasons include overfitting, changed market conditions, execution problems — or an edge that's degrading."
- **Visual:** A premium dark "journal" table UI. The column headers write in one by one: `ENTRY CONDITION · ENTRY PRICE · EXIT PRICE · STOP LOSS · TAKE PROFIT · MARKET CONDITION · RESULT`. Then two curves overlay: `BACKTEST` (blue dashed) and `LIVE` (lime) diverging. A 4-item diagnostic list appears.
- **On-screen text:** Headers · `LIVE vs BACKTEST` · `IF LIVE ≪ BACKTEST, CHECK:` `OVERFITTING` · `MARKET CONDITIONS CHANGED` · `EXECUTION PROBLEMS` · `EDGE DEGRADING`
- **Motion graphics:** Handwriting-style reveals for the headers (a nod to the journal), then snapping to clean UI. The divergence gap is shaded amber.
- **Chart/graph:** Backtest vs live curve comparison (`ILLUSTRATIVE`).
- **B-roll:** A hand writing in a leather notebook beside a laptop.
- **SFX:** SFX-06 pen scratch, SFX-04 per diagnostic item.
- **Music:** M5, with the heartbeat easing.
- **Transition out:** The live curve dips → becomes the drawdown in the next scene (match cut on shape).

---

### CHAPTER 08 — WHEN IT STOPS WORKING

#### S26 — "Normal Drawdown, or Broken Edge?" · 8:45–9:17
- **Narration:** "Even systematic strategies go through drawdown periods. The important question isn't just 'did I lose?' — it's whether this is a normal historical drawdown, or whether the strategy's edge has genuinely changed. Ask: Has the market regime changed? Are similar strategies also underperforming? Are the signal conditions still being generated? How different is the current market from historical conditions?"
- **Visual:** Chapter card `08 · When It Stops Working`. An underwater (drawdown) chart. The camera sinks with it. A diagnostic "checklist HUD" overlays with 4 questions, each getting a blinking cursor while it is asked.
- **On-screen text:** `NORMAL DRAWDOWN?` ⟷ `EDGE CHANGED?` · 4 questions: `REGIME CHANGED?` · `SIMILAR STRATEGIES UNDERPERFORMING?` · `SIGNALS STILL GENERATING?` · `HOW DIFFERENT IS TODAY vs HISTORY?`
- **Motion graphics:** A two-sided scale graphic balances between the two hypotheses. Each question pops in as a HUD card.
- **Chart/graph:** Drawdown curve with a dashed "historical drawdown range" band. The current dip sits *near* the band edge, leaving the answer ambiguous by design (`ILLUSTRATIVE`).
- **B-roll:** Underwater slow-motion shot (bubbles rising) as a metaphor, graded teal-dark.
- **SFX:** An underwater muffle on VO start (brief), SFX-04 per HUD card.
- **Music:** M5 at its most tense.
- **Transition out:** Surface-break "whoosh" → next scene.

#### S27 — "Don't Abandon on Emotion" · 9:17–9:33
- **Narration:** "After recent losses, it can feel like a strategy has failed permanently. But if it was properly backtested and validated, historical evidence gives you a better, more objective basis for evaluating the drawdown."
- **Visual:** Two layers. `FEELING` shows a big red "FAILED" stamp in a shaky handheld frame. `EVIDENCE` shows a calm, stable panel with the historical range band. The camera stabilises as the frame shifts from feeling to evidence.
- **On-screen text:** `FEELING: "IT'S BROKEN"` → `EVIDENCE: OBJECTIVE EVALUATION` · small footnote: `(IF PROPERLY BACKTESTED & VALIDATED)`
- **Motion graphics:** Camera-shake that decays to zero. The stamp dissolves.
- **Chart/graph:** The historical range band from S26, now calm (`ILLUSTRATIVE`).
- **B-roll:** —
- **SFX:** The heartbeat slows and stops, a soft exhale tone.
- **Music:** M5 → breath → M6 enters with texture.
- **Transition out:** Static burst → Chapter 09.

---

### CHAPTER 09 — THE TRAPS

#### S28 — "Overfitting" · 9:33–9:57
- **Narration:** "Now, the advanced traps. The biggest one: overfitting — optimizing a strategy so tightly to historical data that the backtest looks strong, but it fails in live markets. The strategy may be learning historical noise instead of a real market pattern."
- **Visual:** Chapter card `09 · The Traps`. A noisy scatter of historical points. A lime curve wiggles to hit *every* point (a perfect-looking fit). A vertical divider labelled `LIVE MARKET` then sweeps in, and to its right the wiggly curve goes wildly wrong against new points.
- **On-screen text:** `OVERFITTING` · `BACKTEST: LOOKS STRONG ✓` · `LIVE: FAILS ✕` · `LEARNED NOISE ≠ PATTERN`
- **Motion graphics:** The curve "snakes" through the points with an over-eager animation. The failure is a red flash across the right side.
- **Chart/graph:** **Overfit-curve animation** (`ILLUSTRATIVE`). This is the most important teaching visual in Ch 09.
- **B-roll:** —
- **SFX:** SFX-07 static under the noisy points, SFX-09 on live failure.
- **Music:** M6 "Noise".
- **Transition out:** The divider line stays → it becomes the in-sample/out-of-sample split.

#### S29 — "Out-of-Sample Testing" · 9:57–10:07
- **Narration:** "One defence: out-of-sample testing — testing the strategy on separate data that wasn't used to develop it."
- **Visual:** A data timeline split into two blocks: `IN-SAMPLE (BUILD)` in blue and `OUT-OF-SAMPLE (TEST)` in lime, the latter "sealed" until the build finishes.
- **On-screen text:** `OUT-OF-SAMPLE TESTING` · `DATA NOT USED IN DEVELOPMENT → REDUCES OVERFITTING RISK`
- **Motion graphics:** A seal/lock opens on the OOS block after the build block completes.
- **Chart/graph:** Timeline split bar (conceptual).
- **B-roll:** —
- **SFX:** A lock click / unseal.
- **Music:** M6.
- **Transition out:** Data dissolve.

#### S30 — "The Hidden Tax: Transaction Costs" · 10:07–10:27
- **Narration:** "Then there are transaction costs. Your real cost isn't just the entry and exit price. Spread, commission, slippage or market impact, and overnight financing can all reduce an edge. High-turnover strategies are especially sensitive."
- **Visual:** A tall lime bar labelled `GROSS EDGE`. Four red "bites" come out of it in sequence (a waterfall chart), leaving a shorter bar labelled `NET EDGE`. Then a speed-dial labelled `TURNOVER` spins up and the bites multiply.
- **On-screen text:** `TRANSACTION COSTS` · `SPREAD` · `COMMISSION` · `SLIPPAGE / MARKET IMPACT` · `OVERNIGHT FINANCING` · `HIGH TURNOVER = HIGH SENSITIVITY`
- **Motion graphics:** Waterfall segments drop away with physics.
- **Chart/graph:** **Cost waterfall** with no numeric values (`ILLUSTRATIVE`).
- **B-roll:** Coins dropping through a slot / a receipt printing (brief insert).
- **SFX:** A cash-register "chk" softened, per bite.
- **Music:** M6.
- **Transition out:** The net-edge bar shrinks into a dot → next.

#### S31 — "Capacity & Signal Decay" · 10:27–10:55
- **Narration:** "Capacity limits: if too much capital follows the same strategy, large orders can move the market and reduce returns — though for small retail accounts, this is usually less relevant. And signal degradation: an intraday pattern that once worked can become less effective over time — especially if many traders discover and start using it."
- **Visual:** Part A (capacity): a big order block hits a thin order book, and the price line jumps. A small `RETAIL ACCOUNT` block barely nudges it, with the label `USUALLY LESS RELEVANT`. Part B (degradation): a single bright lime pattern on a chart. Crowd icons multiply around it, and the pattern fades to grey.
- **On-screen text:** `CAPACITY LIMITS` · `TOO MUCH CAPITAL → MARKET IMPACT → LOWER RETURNS` · `SMALL RETAIL: USUALLY LESS RELEVANT` · `SIGNAL DEGRADATION` · `MORE TRADERS USING IT → LESS EFFECTIVE`
- **Motion graphics:** A split-scene with a clean center divider. The crowd icons ripple outward as the glow dims.
- **Chart/graph:** Market-impact concept + a signal-strength bar decaying over time (`ILLUSTRATIVE`, no values).
- **B-roll:** A crowded street time-lapse (the "crowd" metaphor), footprints on a once-empty path.
- **SFX:** A heavy thud for the big order, a light tap for retail, the crowd murmur rising as the signal fades.
- **Music:** M6 thickens.
- **Transition out:** A quick glitch → the fast checklist montage.

#### S32 — "Five Common Mistakes" (Checklist Montage) · 10:55–11:55
- **Narration:** "Finally, five common mistakes in systematic trading. One: over-complicating the model — more complexity doesn't automatically mean a better strategy; simple, robust models can be less vulnerable to overfitting. Two: using signals without a clear rationale — finding a statistical pattern isn't enough; it helps to understand why it might exist. Three: testing on too little data — a short backtest can mislead; test across high and low volatility, trending and range-bound markets, and different macro environments. Four: ignoring market regime change — policy, volatility, liquidity and trader behaviour all shift, and all can affect performance. And five: not monitoring live conditions — check whether today's market resembles the conditions where your strategy historically performed best."
- **Visual:** A full-screen numbered list `01–05`, one per ~12 s beat. Each beat gets a mini-visual:
  1. A tangled spaghetti diagram simplifying into a single clean line
  2. A pattern with a big `WHY?` over it
  3. A short timeline stretching into a long one, with 4 regime bands: `HIGH VOL` / `LOW VOL` / `TRENDING` / `RANGE-BOUND` + `MACRO ENVIRONMENTS`
  4. 4 dials labelled `POLICY` / `VOLATILITY` / `LIQUIDITY` / `TRADER BEHAVIOUR`, all turning
  5. A live-radar HUD comparing `NOW` vs `BEST HISTORICAL CONDITIONS`
- **On-screen text:** `01 OVER-COMPLICATING THE MODEL` · `02 NO CLEAR RATIONALE` · `03 TOO LITTLE DATA` · `04 IGNORING REGIME CHANGE` · `05 NOT MONITORING LIVE CONDITIONS`
- **Motion graphics:** The list stays on the left rail. The active item is lime and the completed ones turn to `text-lo` with a ✓. The mini-visual plays on the right.
- **Chart/graph:** #3 regime-band timeline, #5 radar/overlay comparison (both `ILLUSTRATIVE`).
- **B-roll:** Optional 1 s inserts: a knot being untied (#1), a magnifying glass (#2), a calendar flipping (#3), weather changing over a city (#4), a radar screen (#5).
- **SFX:** SFX-04 on each number, SFX-08 on each completion, rhythm locked to M6.
- **Music:** M6 at its tightest rhythm, then it drops out on the final ✓.
- **Transition out:** **Hard cut to black + silence (1.5 s).**

---

### CLOSING

#### S33 — "Copy the Discipline" · 11:55–12:17
- **Narration:** "Renaissance's performance wasn't the product of models alone. It came from a process: find evidence, test it, trade it with discipline, monitor it — and remove what stops working. You can't copy Medallion. But you can copy the discipline."
- **Visual:** The S12 discipline loop returns, this time drawn by the Signal Line alone, slow and elegant. On the final line the loop collapses into a single lime dot. Black. Then the text appears.
- **On-screen text:** `EVIDENCE → TEST → DISCIPLINE → MONITOR → REMOVE` · final card (serif, large, two lines): **You can't copy Medallion.** / **You can copy the discipline.**
- **Motion graphics:** The two lines reveal separately. The second one gets the lime underline.
- **Chart/graph:** —
- **B-roll:** Optional: the chalkboard from S05 in soft focus (bookend).
- **SFX:** SFX-01 soft low hit on the final line.
- **Music:** M7 "Discipline": piano + strings resolve.
- **Transition out:** Slow fade.

#### S34 — Disclaimer · 12:17–12:29
- **Narration:** "This video is for education. Historical performance doesn't guarantee future results — and nothing here claims to replicate Medallion's proprietary models."
- **Visual:** A minimal text card, `text-lo` on ink, with a centered small caps block.
- **On-screen text:** `EDUCATIONAL CONTENT ONLY` · `HISTORICAL PERFORMANCE IS NOT A GUARANTEE OF FUTURE RESULTS` · `NO CLAIM IS MADE TO REPLICATE MEDALLION'S PROPRIETARY MODELS`
- **Motion graphics:** A gentle fade. No flourishes.
- **Chart/graph:** —
- **B-roll:** —
- **SFX:** —
- **Music:** M7 sustains.
- **Transition out:** Crossfade to the end card.

#### S35 — End Card · 12:29–12:40 (+ 20 s YouTube end-screen)
- **Narration:** *(none, or a channel CTA in your own voice)*
- **Visual:** The Signal Line draws a final horizontal line across the bottom third. Two end-screen video slots and a subscribe element sit above it.
- **On-screen text:** Channel name / `WATCH NEXT`
- **Motion graphics:** The end-screen slot frames draw with the line.
- **SFX:** SFX-03 soft whoosh.
- **Music:** M7 final chord ring-out.

---

## 6. Complete Narration Script (clean read for the VO artist)

> **Hinglish version (default narration for the film):** [`NARRATION_HINGLISH.md`](NARRATION_HINGLISH.md). Same meaning and scene structure; visuals unchanged.

> Target read: ~140–150 wpm, calm, authoritative, documentary register. Pauses are marked `/` (short) and `//` (long, ≥1 s).

**[COLD OPEN]**
Sixty-six percent. / That's roughly the average annual return Jim Simons' Medallion Fund reportedly generated before fees — / for more than thirty years. //
And it didn't come from gut feelings, market stories, or a star trader's instinct. / It came from mathematics, / data, / and scientific discipline. //
In this video: how Simons approached markets, / what actually drove his edge — / and, most importantly, which of his principles a retail trader can realistically use. / And which ones you can't. //

**[01 — MARKETS AS A MATH PROBLEM]**
In 1982, Jim Simons founded Renaissance Technologies. / Simons was a mathematician and a former signals analyst — / and he looked at markets differently from traditional traders. //
His core idea was easy to state and hard to execute: / financial market data may contain persistent, predictable patterns. / Combine the right people, the right data, and the right technology — / and those patterns could be identified and traded systematically. //
So Renaissance didn't build its approach on traditional, qualitative market analysis. / It built it on statistical pattern recognition. / The firm employed mathematicians, physicists, and computer scientists — / people who believed markets could be studied like a mathematical system, / where scientific discipline could reveal hidden patterns. //

**[02 — THE MACHINE BEHIND THE EDGE]**
But here's what most people miss: / Renaissance's performance wasn't only about models. / Several factors mattered together — / execution quality, scientific discipline, data analysis, continuous research, / and the scientists it hired. / Let's break down four of them. //
One: statistical pattern recognition. / The team processed price, volume, order flow and other market data. / The goal: find signals that were statistically significant, / repeated over time — / and stayed useful even after trading costs. //
Two: borrowing from other sciences. / Some mathematical techniques were adapted from fields outside finance, like physics and signal processing. / Hidden Markov Models were reportedly used in financial pattern recognition. / The logic: if a technique works in complex systems elsewhere, / test whether it works in markets too. //
Three: speed, consistency and scale. / Finding a profitable signal isn't enough. / It has to be executed quickly, consistently, and at scale. / And notably, Renaissance intentionally kept the Medallion Fund's capacity limited — / so its large orders wouldn't excessively affect market prices. //
Four: model discipline. / A signal was traded only if there was statistically significant evidence behind it. / If a signal stopped working, / it was removed. / And the process never stopped: / research, / test, / trade live, / monitor — / then improve, / or remove. //

**[03 — THE REALITY CHECK]**
Now, a reality check. // A retail trader cannot replicate the Medallion Fund's performance. / Its models are proprietary and not publicly available. / Renaissance had technology, scale, and highly skilled researchers. / So treat Simons' principles as a learning framework — / not a trading strategy to copy. //

**[04 — FOUR PRINCIPLES YOU CAN USE]**
So what can you actually apply? //
Principle one: systematic rules over discretionary judgement. / Define your entry, exit, stop loss and position size in advance. / Measurable conditions can reduce behavioural mistakes like overconfidence, hesitation and confirmation bias. //
Principle two: put data and evidence above narrative. / Backtest your strategy on historical data. / Learn where it performs, where it fails, what its historical drawdown was, its win rate, and its average risk-to-reward. / A backtest doesn't guarantee future profit — / but it gives you a baseline for understanding how the strategy has behaved. //
Principle three: risk management is non-negotiable. / Keep position sizing consistent. / Define a maximum loss per trade. / Define a daily and weekly maximum loss. / And don't increase risk just because you're on a winning streak. / The goal: no single trade — or sequence of trades — should seriously damage your account. //
Principle four: diversify across markets and signals. / Medallion reportedly traded hundreds of instruments — / equities, bonds, currencies, commodities and derivatives. / At retail level, the broad lesson is: don't depend completely on one instrument or one strategy. / Diversifying across less-correlated markets can reduce your dependence on any single edge. //

**[05 — THE QUANT TOOLKIT]**
Quantitative strategies come in a few broad types. //
Statistical arbitrage studies the price relationship between historically related assets. / If that relationship temporarily widens to an unusual level, / the strategy tests whether the spread will revert toward its normal range. //
Momentum and trend following try to systematically capture the possibility that recent strength continues — / using rules like going long in an uptrend, and short in a downtrend. //
Mean reversion tests the idea that price may return to its average, or equilibrium, level. / It can be relevant in short-term trading — / but the challenge is telling a temporary overextension apart from the beginning of a new trend. //
And factor-based models analyse characteristics like value, momentum, quality and low volatility. / Instead of predicting one stock's direction, / the portfolio is tilted toward specific factor exposures. //

**[06 — YOUR FIRST TESTABLE RULE]**
The good news: / a quantitative approach doesn't need Renaissance-level mathematics. / It starts with one precise, testable rule. / For example: // "I'll buy when the 20-day moving average crosses above the 50-day moving average. / And I'll exit when the 20-day crosses back below the 50-day." //
Now that rule can be backtested on historical data — / checking the win rate, drawdown, average risk-to-reward, / and how it behaves across different market conditions. //

**[07 — THE HARDEST PART: EXECUTION]**
Building a strategy is one challenge. / Executing it consistently is an even bigger one. / Here's where traders break their own systems: / taking some signals and skipping others. / Moving the stop loss. / Holding a losing trade, hoping it recovers. / And abandoning the strategy after a drawdown. //
The fix is a trade journal. / Log the entry condition, entry price, exit price, stop loss, take profit, market condition, and the result. / Then compare: is your live performance similar to the backtest's behaviour? / If it's significantly worse, possible reasons include overfitting, / changed market conditions, / execution problems — / or an edge that's degrading. //

**[08 — WHEN IT STOPS WORKING]**
Even systematic strategies go through drawdown periods. / The important question isn't just "did I lose?" — / it's whether this is a normal historical drawdown, / or whether the strategy's edge has genuinely changed. / Ask: / Has the market regime changed? / Are similar strategies also underperforming? / Are the signal conditions still being generated? / How different is the current market from historical conditions? //
After recent losses, it can feel like a strategy has failed permanently. / But if it was properly backtested and validated, / historical evidence gives you a better, more objective basis for evaluating the drawdown. //

**[09 — THE TRAPS]**
Now, the advanced traps. / The biggest one: overfitting — / optimizing a strategy so tightly to historical data that the backtest looks strong, / but it fails in live markets. / The strategy may be learning historical noise instead of a real market pattern. //
One defence: out-of-sample testing — / testing the strategy on separate data that wasn't used to develop it. //
Then there are transaction costs. / Your real cost isn't just the entry and exit price. / Spread, commission, slippage or market impact, and overnight financing can all reduce an edge. / High-turnover strategies are especially sensitive. //
Capacity limits: / if too much capital follows the same strategy, large orders can move the market and reduce returns — / though for small retail accounts, this is usually less relevant. / And signal degradation: / an intraday pattern that once worked can become less effective over time — / especially if many traders discover and start using it. //
Finally, five common mistakes in systematic trading. //
One: over-complicating the model. / More complexity doesn't automatically mean a better strategy; / simple, robust models can be less vulnerable to overfitting. /
Two: using signals without a clear rationale. / Finding a statistical pattern isn't enough; / it helps to understand why it might exist. /
Three: testing on too little data. / A short backtest can mislead. / Test across high and low volatility, trending and range-bound markets, and different macro environments. /
Four: ignoring market regime change. / Policy, volatility, liquidity and trader behaviour all shift — / and all can affect performance. /
And five: not monitoring live conditions. / Check whether today's market resembles the conditions where your strategy historically performed best. //

**[CLOSING]**
Renaissance's performance wasn't the product of models alone. / It came from a process: / find evidence, / test it, / trade it with discipline, / monitor it — / and remove what stops working. //
You can't copy Medallion. // But you can copy the discipline. //
This video is for education. / Historical performance doesn't guarantee future results — / and nothing here claims to replicate Medallion's proprietary models.

*(≈1,650 words → ~11:30 of VO + ~70 s of music-only beats = ~12:40)*

---

## 7. Motion-Graphics Asset List (build once, reuse)

| Asset | Scenes | Notes |
|---|---|---|
| Slot-machine number counter | S01, S05 | Gold serif digits, per-digit stagger |
| Signal Line (master path) | Global | Lime 2 px stroke with glow; drives wipes and chart draws |
| Chapter card template | S05, S08, S13, S14, S18, S22, S24, S26, S28 | Outline number + serif title, 2 s hold |
| Lower-third | S05 | Hairline + caps label |
| Particle field / data dissolve | S01, S02, S06, S10, S15, S29 | Dot-matrix, 20–40k particles |
| Venn (People/Data/Technology) | S06 | |
| Gear machine (5 gears) | S08 | |
| Stream → filter → gates | S09 | |
| HMM schematic | S10 | Generic states only |
| Capacity container + lock | S11 | |
| **Discipline loop** | S12, S33 | Hero graphic, reused as bookend |
| Vault + PROPRIETARY stamp | S13 | |
| Rulebook card UI | S14 | |
| Backtest report panel | S15, S23 | Placeholder values only |
| Risk shield (4 segments) | S16 | |
| Instrument mosaic | S17 | Hundreds of dots, 5 clusters |
| 2×2 strategy card grid | S18–S21 | |
| Code-editor rule panel | S22 | Mono font, typing |
| Crack/vignette system | S24 | |
| Journal table UI | S25 | 7 columns from the PDF |
| Checklist HUD | S26, S32 | |
| Cost waterfall | S30 | |
| `ILLUSTRATIVE · NOT REAL DATA` corner tag | Every conceptual chart | 18 px caps, `text-lo`, bottom-right |

---

## 8. Chart & Graph Animation Specs

All charts use `bg-panel` backgrounds, `grid` hairlines, no chart borders, and data lines of 2–3 px. Draw-on uses the Signal Line reveal (stroke-dashoffset style) at 0.8–1.2 s with expo-out easing. **No real numeric values are displayed except the PDF's own facts (1982, ~66% before fees, 30+ years, 20-day / 50-day).**

| # | Chart | Scene | Animation |
|---|---|---|---|
| C1 | ~66% counter (typographic, not a chart) | S01 | Digits roll `00 → 66`, `~` and "before fees" appear with it, never after |
| C2 | Noise → pattern scatter | S06 | Grey cloud; hidden periodic wave highlights lime over 2 s |
| C3 | Input-stream sparklines | S09 | Four small flowing lines feeding a funnel |
| C4 | Market-impact jump | S11, S31 | Order block collides with price line; line jumps with a spring |
| C5 | Equity curve + underwater drawdown | S15 | Curve draws; drawdown area fills red beneath the zero line |
| C6 | Diversification lines | S17 | 3 independent lines vs 1 line; the single line's drop cracks the tile |
| C7 | **Pair spread** (two lines + spread panel) | S18 | Lines diverge → band shades → spread exits normal corridor → returns (with "?") |
| C8 | Trend legs with ▲/▼ markers | S19 | Channel lines draw alongside the price |
| C9 | Mean-line oscillation + fork | S20 | Elastic oscillation, then two ghosted futures |
| C10 | Factor-exposure bars / tilt | S21 | 4 bars resize with a spring; platform tilts |
| C11 | **MA(20)/MA(50) crossover** | S22–S23 | Price draws first, then MA(20) lime, MA(50) blue; BUY/EXIT markers at crosses; backtest playhead sweep; regime bands |
| C12 | Backtest vs Live divergence | S25 | Two curves, amber gap fill |
| C13 | Drawdown with historical-range band | S26–S27 | Current dip near the band edge; camera shake → calm |
| C14 | **Overfit curve** | S28 | Wiggly curve through every in-sample point → fails past the `LIVE MARKET` divider |
| C15 | In-sample / out-of-sample split bar | S29 | Seal opens after build completes |
| C16 | Cost waterfall | S30 | Gross → 4 red bites → Net |
| C17 | Signal-strength decay | S31 | Bar/glow fades as crowd icons multiply |
| C18 | Regime-band timeline & live-vs-best radar | S32 | Bands tile in; radar sweep overlay |

---

## 9. B-Roll Shot List (consolidated)

All B-roll gets a unified grade: crushed blacks, desaturated (−40%), cool shadows with a teal/ink cast, and a slight lime tint in highlights only when an accent is needed. No identifiable real traders presented as Renaissance staff. No readable real tickers, headlines or brand logos (blur them).

| # | Shot | Scenes | Source suggestion |
|---|---|---|---|
| B1 | Macro: scrolling numbers on a terminal | S03 | Stock (Artgrid / Storyblocks / Pexels) |
| B2 | Hands at screens, trader rubbing eyes, newspaper blur | S02 | Stock |
| B3 | Chalkboard equations + chalk dust macro | S05, S33 | Stock or shoot practically |
| B4 | Jim Simons archival photo | S05 | **License required** (Getty, AP). Otherwise use a silhouette |
| B5 | Server racks / data-center corridor time-lapse | S06, S11 | Stock |
| B6 | Whiteboards, researchers from behind | S07 | Stock |
| B7 | Watch/gear mechanism macro | S08 | Stock |
| B8 | Fiber-optic light streams | S09 | Stock |
| B9 | Oscilloscope, abstract physics visualization | S10 | Stock |
| B10 | Long-exposure light trails | S11 | Stock |
| B11 | Bank vault door closing | S13 | Stock |
| B12 | Hesitating hand over mouse / closing a notebook | S14 | Stock / shoot |
| B13 | Laptop with generic charting UI (logos blurred) | S15 | Shoot / screen-record your own |
| B14 | Carabiner / climbing-rope lock | S16 | Stock |
| B15 | City at night aerial / global light network | S17 | Stock |
| B16 | Surfer on a wave | S19 | Stock |
| B17 | Pendulum | S20 | Stock |
| B18 | Trader face lit by red screen, clock ticking | S24 | Stock |
| B19 | Hand writing in a notebook beside a laptop | S25 | Shoot |
| B20 | Underwater slow-mo, bubbles rising | S26 | Stock |
| B21 | Coins dropping / receipt printing | S30 | Stock |
| B22 | Crowd time-lapse / footprints on a path | S31 | Stock |
| B23 | Knot untying, magnifier, calendar flip, weather over city, radar screen | S32 | Stock, 1 s inserts |

**Ratio target:** ~70% motion graphics, ~30% B-roll. This is a design-led explainer, and B-roll is used as texture and metaphor.

---

## 10. Packaging Suggestions (hooks for title/thumbnail, drawn only from the PDF)

**Title options**
1. *How Jim Simons Beat the Market with Math (And What You Can Actually Use)*
2. *~66% a Year, Reportedly: Inside Jim Simons' Trading Approach*
3. *The Mathematician's Edge: Jim Simons' Rules for Systematic Trading*

**Thumbnail concept:** ink background. A huge gold `~66%` with a small `BEFORE FEES*` beneath. A lime signal line cuts through grey noise. The right third is a silhouette at a chalkboard. At most 3 words of text: `MATH > INSTINCT`.

**Pinned comment / description disclaimer:** "Educational content based on a written guide. Medallion's figures are as reported; historical performance does not guarantee future results. Medallion's models are proprietary and not replicated here."

---

## 11. Source-Fidelity Map (every factual claim → PDF page)

| Claim in video | PDF page |
|---|---|
| Founded Renaissance Technologies in 1982 | p.1 |
| Mathematician and former signals analyst | p.1 |
| Medallion: reportedly ~66% average annual returns before fees, 30+ years | p.1 |
| Built on statistical pattern recognition, not traditional qualitative analysis | p.1 |
| Core idea: persistent, predictable patterns; right people + data + technology | p.1 |
| Employed mathematicians, physicists, computer scientists | p.1 |
| Performance not only models: execution quality, scientific discipline, data analysis, continuous research, hiring scientists | p.1 |
| Price, volume, order flow and other data; significant, repeating, useful after costs | p.2 |
| Techniques from physics & signal processing; HMMs reportedly used | p.2 |
| Speed, consistency, scale; Medallion capacity intentionally limited | p.2 |
| Trade only with significant evidence; remove when not working; Research → Test → Live Trade → Monitor → Improve/Remove | p.2 |
| Retail can't replicate; proprietary; technology, scale, skilled researchers; learning framework | p.1 |
| Principles 1–3 (rules; backtest metrics; risk bullets and goal) | p.2 |
| Principle 4: hundreds of instruments across equities, bonds, currencies, commodities, derivatives; less-correlated diversification | p.1–3 |
| Stat arb, momentum/trend, mean reversion, factor models | p.3 |
| No Renaissance-level math needed; 20/50 MA crossover example; backtest metrics | p.3 |
| Four execution failures; trade-journal fields | p.3–4 |
| Live vs backtest; four possible reasons | p.4 |
| Drawdown: four diagnostic questions; risk of abandoning | p.4 |
| Overfitting, out-of-sample, transaction costs, capacity, signal degradation | p.4–5 |
| Five common mistakes | p.5 |
| Educational disclaimer; no claim to replicate Medallion models | p.1, p.5 |

**Intentionally excluded (not in the PDF):** Simons' academic career, other biography, fund AUM, fee levels, the year-by-year return series, named Renaissance employees, quotes, the firm's specific models or signals, and any results for the 20/50 MA example.
