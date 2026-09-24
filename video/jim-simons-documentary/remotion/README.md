# The Mathematician's Edge — Remotion project

Production build of [`../STORYBOARD.md`](../STORYBOARD.md): a ~12½-minute premium financial documentary on Jim Simons' trading approach, sourced **only** from the provided PDF.

- **1920×1080 · 30 fps · H.264**, 35 scenes across 11 chapters
- Narration-synced animation (visual beats follow the voiceover, even after you swap in the real recording)
- Burned-in subtitles + `.srt` export
- Placeholder-driven audio and B-roll: renders today, upgrades automatically as files are dropped in
- No copyrighted assets: fonts are SIL OFL and bundled locally, every chart is drawn in code, and B-roll slots are labelled placeholders

## Quick start

Requires **Node.js 18+** (tested on Node 22). Remotion downloads its own headless Chrome on first render.

```bash
npm install
npm run studio          # preview in Remotion Studio → http://localhost:3000
npm run render          # final: out/the-mathematicians-edge.mp4 (1920×1080, 30 fps, H.264 + AAC)
```

| Command | What it does |
|---|---|
| `npm run studio` | Index `public/`, open Remotion Studio (scrub, preview, change props). |
| `npm run render` | Full-quality render with burned-in subtitles. |
| `npm run render:clean` | Same, without subtitles or HUD (use with the `.srt` for YouTube CC). |
| `npm run render:draft` | Half-res, fast-encode draft with the editor HUD. |
| `npm run render:scene -- Scene-S05 out/s05.mp4` | Render a single scene. |
| `npm run thumbnail` | `out/thumbnail.png` (1280×720 still). |
| `npm run srt` | `out/subtitles.srt` closed captions. |
| `npm run check` | TypeScript + ESLint (incl. `@remotion/eslint-plugin`) + timeline/audio-sync validation. |
| `npm run qa` | Render 3 stills per scene into `out/qa/` for a visual pass. |
| `npm run assets` | Regenerate `ASSETS.md` (what's missing and where it goes). |

> **Added audio/B-roll while Studio is open?** Run `npm run sync:assets` in a second terminal, then reload the Studio tab. Always render through the `npm run render*` scripts (they sync first); a bare `npx remotion render` would ignore files added since the last sync.
>
> Machines that can't download Remotion's Chrome (locked-down CI, sandboxes) can add `--browser-executable=/path/to/chrome-headless-shell`, or set `REMOTION_BROWSER_EXECUTABLE` for `npm run qa`.

## Compositions

| ID | What |
|---|---|
| `Documentary` | The full film. Props: `showSubtitles`, `showGuides` (editor HUD); `voDurations` / `mediaDurations` are measured automatically. |
| `Scenes/Scene-S01` … `Scene-S35` | Each scene alone, with its own VO/SFX/subtitles. Use these to iterate. |
| `Extras/Showcase` | Every reusable component in isolation: a living style guide. |
| `Extras/Thumbnail` | YouTube thumbnail (`<Still>`, storyboard §10). |

Turn on **`showGuides`** in Studio to see the current scene, timecode, title-safe frame and every audio cue at the playhead, with a `ready` / `placeholder` flag.

## Project structure

```
src/
├── Root.tsx                    compositions + calculateMetadata (measures VO + B-roll with Mediabunny)
├── compositions/
│   ├── Documentary.tsx         TransitionSeries of all scenes + audio + subtitles + HUD
│   ├── ScenePreview.tsx        single-scene composition
│   ├── Showcase.tsx            component style guide
│   └── Thumbnail.tsx
├── components/                 ── reusable building blocks ──
│   ├── BigText.tsx             per-word animated headlines (rise / blur / mask, highlight, underline, strike)
│   ├── Subtitle.tsx            broadcast subtitles (2 balanced lines, soft fades)
│   ├── Chart.tsx               SVG line chart: draw-on, areas, markers, bands, rules, playhead
│   ├── NumberCounter.tsx       slot-machine digit roll or smooth count
│   ├── ImageScene.tsx          image/video with Ken Burns + grade, or a labelled placeholder
│   ├── DataVisualization.tsx   bars · cost waterfall · noise→pattern scatter · instrument mosaic
│   ├── SectionTitle.tsx        chapter card
│   ├── Transition.tsx          signal-wipe · data-dissolve · dip-to-black · crossfade
│   ├── Timeline.tsx            discipline loop · linear pipeline · vertical agenda
│   ├── QuoteCard.tsx           serif pull-quote or typed "code" rule card
│   ├── SceneShell.tsx          background + camera wrapper used by every scene
│   ├── Background.tsx          ink canvas, dot grid, glow, vignette, film grain
│   ├── CameraMove.tsx          push-in / drift, impact Shake
│   ├── Primitives.tsx          Kicker, LowerThird, Icon, Checklist, Stamp, Panel, IllustrativeTag
│   └── Guides.tsx              editor HUD
├── scenes/                     S01–S35, one file per chapter
├── data/
│   ├── scenes.ts               ★ single source of truth: narration, durations, transitions, music, SFX
│   ├── chapters.ts
│   ├── broll.ts                B-roll / image slots
│   └── illustrative.ts         synthetic series for concept charts (never real data)
├── timeline/                   timeline builder, narration beats (useBeats), scene context
├── subtitles/buildCues.ts      narration → subtitle cues / SRT
├── audio/                      library (file names), AudioLayer (VO, ducked music, SFX)
├── assets/                     public/ index (auto-generated), duration measuring, media context
├── theme/                      colour tokens, easing, local fonts
└── lib/                        animation helpers, series generators
public/
├── fonts/                      Fraunces · Inter Tight · JetBrains Mono (OFL)
├── audio/{vo,music,sfx}/       ← drop audio here
├── broll/ · images/            ← drop B-roll here
props/                          draft.json · clean.json (input props for render scripts)
scripts/                        sync-assets · validate · qa-stills · export-srt · asset-manifest
```

## How timing works

1. **`data/scenes.ts`** holds each scene's narration (verbatim from storyboard §6), minimum length (from the storyboard timecodes), outgoing transition, music cue and SFX cues.
2. **`timeline/build.ts`** lays scenes end-to-end (transitions overlap). A scene lasts at least its storyboard length and always long enough for its VO: the **measured** recording if present, otherwise an estimate (~150 wpm plus punctuation pauses).
3. **Beats are phrases, not frame numbers.** Inside a scene:
   ```tsx
   const b = useBeats();
   <BigText text="1982" at={b.on('1982')} />       // appears as "1982" is spoken
   <Stamp text="PROPRIETARY" at={b.on('proprietary')} />
   ```
   SFX cues use the same idea (`{id: 'SFX-01', on: 'proprietary'}`). When you drop in the real VO, every beat, SFX hit and subtitle re-times itself. Typos in a phrase throw an error in Studio, and `npm run validate` checks SFX phrases, VO overlaps, SFX placement, subtitle order and music coverage.
4. Subtitles use the same word-position model, so captions and visuals agree. For frame-perfect captions from the final VO, transcribe with [`@remotion/install-whisper-cpp`](https://www.remotion.dev/docs/install-whisper-cpp) and replace `buildCues` output with the word timestamps.

## Adding real assets

See **[`ASSETS.md`](ASSETS.md)** for the full checklist, including the VO recording sheet. In short:

| Asset | Path | Notes |
|---|---|---|
| Voiceover | `public/audio/vo/S01.mp3` … `S34.mp3` | One file per scene (S04/S35 have none). `.mp3/.wav/.m4a/.aac`. |
| Music | `public/audio/music/m1-pattern.mp3` … `m7-discipline.mp3` | Looped per chapter, faded, auto-ducked under VO (`audio/AudioLayer.tsx`). |
| SFX | `public/audio/sfx/sfx-01-sub-boom.mp3` … | 12-sound library from storyboard §4. |
| B-roll | `public/broll/…`, `public/images/…` | Paths in `data/broll.ts`. Placeholders show the expected path. |

`npm run studio` / `render` run `sync:assets` first, which indexes `public/` so only existing files are mounted. Nothing else to wire up. B-roll clips shorter than their slot loop automatically; unreadable files are skipped with a warning (the estimate is used instead).

## Source-fidelity guardrails (from the storyboard)

- `~66%` always appears with **"before fees"** and **"reportedly"**; Hidden Markov Models keep **(reportedly)**.
- No Medallion returns curve, no backtest results for the 20/50 MA rule (metric tiles are `— —`).
- Every conceptual chart carries **`ILLUSTRATIVE · NOT REAL DATA`** (`<IllustrativeTag />`, on by default in `Chart` and `DataVisualization`).
- No invented quotes. `QuoteCard` is only used for the PDF's own example rule.
- No logos; "Renaissance Technologies" and "Medallion Fund" are typography only. The Simons portrait slot (`B04`) requires a licensed image or the silhouette fallback.

## Design system

Colours, easing and fonts live in `src/theme/`. There is one dominant accent per frame: lime `signal` (`#C8FF4D`) for "the thing that matters", gold for key numbers, green/red for keep/remove. The house easing is expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`), and every content layer gets a slow 1.00→1.06 push-in via `SceneShell`.
