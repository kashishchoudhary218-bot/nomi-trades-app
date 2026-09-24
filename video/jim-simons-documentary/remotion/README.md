# The Mathematician's Edge — Remotion project

Production build of [`../STORYBOARD.md`](../STORYBOARD.md): a ~12½-minute premium financial documentary on Jim Simons' trading approach, sourced **only** from the provided PDF.

- **1920×1080 · 30 fps · H.264**, 35 scenes across 11 chapters
- Narration-synced animation (visual beats follow the voiceover, even after you swap in the real recording)
- Burned-in subtitles + `.srt` export
- Placeholder-driven audio and B-roll: renders today, upgrades automatically as files are dropped in
- No copyrighted assets: fonts are SIL OFL and bundled locally, every chart is drawn in code, and B-roll slots are labelled placeholders

## Quick start

```bash
npm install
npm run studio          # open Remotion Studio (preview, scrub, tweak props)
npm run render          # → out/the-mathematicians-edge.mp4 (full quality)
npm run render:draft    # half-res draft with the editor HUD
npm run srt             # → out/subtitles.srt (upload to YouTube as closed captions)
npm run thumbnail       # → out/thumbnail.png (1280×720)
npm run check           # typecheck + scene-data validation
npm run qa              # render 3 stills per scene into out/qa/ (visual pass)
npm run assets          # regenerate ASSETS.md (what's missing, where it goes)
```

> Sandboxed / CI machines without Remotion's bundled Chrome can pass `--browser-executable=/path/to/chrome-headless-shell` (or set `REMOTION_BROWSER_EXECUTABLE` for `npm run qa`).

## Compositions

| ID | What |
|---|---|
| `Documentary` | The full film. Props: `showSubtitles`, `showGuides` (editor HUD), `voDurations` (auto-filled). |
| `Scenes/Scene-S01` … `Scene-S35` | Each scene alone, with its own VO/SFX/subtitles. Use these to iterate. |
| `Extras/Showcase` | Every reusable component in isolation: a living style guide. |
| `Extras/Thumbnail` | YouTube thumbnail still (storyboard §10). |

Turn on **`showGuides`** in Studio to see the current scene, timecode, title-safe frame and every audio cue at the playhead, with a `ready` / `placeholder` flag.

## Project structure

```
src/
├── Root.tsx                    compositions + calculateMetadata (measures recorded VO)
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
├── assets/                     public/ file index (auto-generated) + helpers
├── theme/                      colour tokens, easing, local fonts
└── lib/                        animation helpers, series generators
public/
├── fonts/                      Fraunces · Inter Tight · JetBrains Mono (OFL)
├── audio/{vo,music,sfx}/       ← drop audio here
├── broll/ · images/            ← drop B-roll here
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
   SFX cues use the same idea (`{id: 'SFX-01', on: 'proprietary'}`). When you drop in the real VO, every beat, SFX hit and subtitle re-times itself. Typos in a phrase throw an error in Studio, and `npm run validate` checks SFX phrases.
4. Subtitles use the same word-position model, so captions and visuals agree. For frame-perfect captions from the final VO, transcribe with [`@remotion/install-whisper-cpp`](https://www.remotion.dev/docs/install-whisper-cpp) and replace `buildCues` output with the word timestamps.

## Adding real assets

See **[`ASSETS.md`](ASSETS.md)** for the full checklist, including the VO recording sheet. In short:

| Asset | Path | Notes |
|---|---|---|
| Voiceover | `public/audio/vo/S01.mp3` … `S34.mp3` | One file per scene (S04/S35 have none). `.mp3/.wav/.m4a/.aac`. |
| Music | `public/audio/music/m1-pattern.mp3` … `m7-discipline.mp3` | Looped per chapter, faded, auto-ducked under VO (`audio/AudioLayer.tsx`). |
| SFX | `public/audio/sfx/sfx-01-sub-boom.mp3` … | 12-sound library from storyboard §4. |
| B-roll | `public/broll/…`, `public/images/…` | Paths in `data/broll.ts`. Placeholders show the expected path. |

`npm run studio` / `render` run `sync:assets` first, which indexes `public/` so only existing files are mounted. Nothing else to wire up.

## Source-fidelity guardrails (from the storyboard)

- `~66%` always appears with **"before fees"** and **"reportedly"**; Hidden Markov Models keep **(reportedly)**.
- No Medallion returns curve, no backtest results for the 20/50 MA rule (metric tiles are `— —`).
- Every conceptual chart carries **`ILLUSTRATIVE · NOT REAL DATA`** (`<IllustrativeTag />`, on by default in `Chart` and `DataVisualization`).
- No invented quotes. `QuoteCard` is only used for the PDF's own example rule.
- No logos; "Renaissance Technologies" and "Medallion Fund" are typography only. The Simons portrait slot (`B04`) requires a licensed image or the silhouette fallback.

## Design system

Colours, easing and fonts live in `src/theme/`. There is one dominant accent per frame: lime `signal` (`#C8FF4D`) for "the thing that matters", gold for key numbers, green/red for keep/remove. The house easing is expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`), and every content layer gets a slow 1.00→1.06 push-in via `SceneShell`.
