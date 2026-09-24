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
| `npm run render` | Full-quality render with burned-in subtitles (Hinglish narration). |
| `npm run render:english` | The English-narration cut. |
| `npm run render:clean` | Same, without subtitles or HUD (use with the `.srt` for YouTube CC). |
| `npm run render:draft` | Half-res, fast-encode draft with the editor HUD. |
| `npm run render:scene -- Scene-S05 out/s05.mp4` | Render a single scene. |
| `npm run thumbnail` | `out/thumbnail.png` (1280×720 still). |
| `npm run srt` | `out/subtitles.hinglish.srt` closed captions (`npm run srt -- english` for English). |
| `npm run script:hinglish` | Regenerate `../NARRATION_HINGLISH.md` (the VO recording script). |
| `npm run check` | TypeScript + ESLint (incl. `@remotion/eslint-plugin`) + timeline/audio-sync validation. |
| `npm run qa` | Render 3 stills per scene into `out/qa/` for a visual pass. |
| `npm run assets` | Regenerate `ASSETS.md` (what's missing and where it goes). |

> **Added audio/B-roll while Studio is open?** Run `npm run sync:assets` in a second terminal, then reload the Studio tab. Always render through the `npm run render*` scripts (they sync first); a bare `npx remotion render` would ignore files added since the last sync.
>
> Machines that can't download Remotion's Chrome (locked-down CI, sandboxes) can add `--browser-executable=/path/to/chrome-headless-shell`, or set `REMOTION_BROWSER_EXECUTABLE` for `npm run qa`.

## Compositions

| ID | What |
|---|---|
| `Documentary` | The full film. Props: `language` (`hinglish` default / `english`), `showSubtitles`, `showGuides` (editor HUD); `voDurations` / `mediaDurations` are measured automatically. |
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
│   ├── scenes.ts               ★ single source of truth: English narration, durations, transitions, music, SFX
│   ├── narration.hinglish.ts   ★ Hinglish narration + beat anchors (default language)
│   ├── language.ts             language switch (localizeScenes)
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

## Voiceover (AI TTS)

The narration is generated by a replaceable text-to-speech pipeline:

```
tts/
├── types.ts                 VoiceProvider { generateSpeech(text, voiceSettings) } + VoiceSettings
├── index.ts                 provider registry (TTS_PROVIDER / --provider)
├── providers/
│   ├── elevenlabs.ts        ElevenLabs (recommended for the final premium read)
│   ├── azure.ts             Azure AI Speech (hi-IN-MadhurNeural / en-IN-PrabhatNeural)
│   └── kokoro.ts            Kokoro-82M, local & free (Hindi male voice hm_omega), no key needed
├── pronunciation/hinglish.ts  Roman Hinglish → Devanagari-for-Hindi-words (TTS input only)
├── kokoro/                  local synthesis worker + setup
└── sound-design.py          procedural music beds + SFX (npm run sound-design)
scripts/voiceover.ts         generates public/audio/vo/<language>/<Scene>.mp3 + manifest.json
```

```bash
npm run tts:setup                                   # one-time: local Kokoro model + Python deps
npm run voiceover                                   # all scenes (skips unchanged ones)
npm run voiceover -- --scene S01                    # one scene (comma-separate for several)
npm run voiceover -- --provider elevenlabs --force  # regenerate everything with ElevenLabs
npm run sound-design                                # music beds + SFX (keeps files you've replaced)
```

**Choosing a provider** (`TTS_PROVIDER` or `--provider`):

| Provider | Quality | Needs |
|---|---|---|
| `kokoro` (default) | Good neural voice, runs locally, free | `npm run tts:setup` |
| `elevenlabs` | Most natural, cinematic; keeps prosody continuous across scenes | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` (an Indian male voice from the Voice Library); network access to `api.elevenlabs.io` |
| `azure` | Natural Indian neural voices | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`; network access to `<region>.tts.speech.microsoft.com` |

Keys go in a git-ignored `.env` (copy `.env.example`), or in your hosting/CI environment variables. Never commit them.

**How it syncs:** the Hinglish text is converted for pronunciation only (Hindi words → Devanagari, English trading terms stay English; subtitles keep the Roman script). Each scene's audio is trimmed, loudness-normalised (≈ -19 dBFS) and encoded to MP3 (plays in every browser). Remotion measures every file (`calculateMetadata`) and each scene stretches to fit its recording, and beats, SFX and subtitles re-time to it. Music ducks ≈ 20 dB under the voice.

**Adding a provider:** implement `VoiceProvider` in `tts/providers/`, register it in `tts/index.ts`, and run `npm run voiceover -- --provider <id> --force`.

## Narration languages

The film is narrated in **Hinglish** by default ([`../NARRATION_HINGLISH.md`](../NARRATION_HINGLISH.md)); the English script remains as an alternate cut (`language: "english"`). Only the spoken words differ: visuals, on-screen text, transitions, music and SFX are shared.

Visual beats are written against English phrases (`b.on('1982')`). For Hinglish, `anchors` in `data/narration.hinglish.ts` points each of those to the Hinglish phrase where the same idea is spoken (e.g. `'more than thirty years' → '30 saal se zyada'`), so every beat still lands on the right word. `npm run validate` checks every anchor in both languages.

## How timing works

1. **`data/scenes.ts`** holds each scene's narration (verbatim from storyboard §6), minimum length (from the storyboard timecodes), outgoing transition, music cue and SFX cues.
2. **`timeline/build.ts`** lays scenes end-to-end (transitions overlap). A scene lasts at least its storyboard length and always long enough for its VO: the **measured** recording if present, otherwise an estimate (character-based, calibrated to a ~150 wpm read, plus punctuation pauses; it works for both languages).
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
| Voiceover | `public/audio/vo/hinglish/S01.mp3` … `S34.mp3` | Generated by `npm run voiceover` (see above), or drop in your own recordings. English cut: `public/audio/vo/english/…`. |
| Music | `public/audio/music/m1-pattern.mp3` … `m7-discipline.mp3` | Procedural beds from `npm run sound-design`; replace with licensed tracks of the same name for a premium mix. Looped, faded, ducked under VO. |
| SFX | `public/audio/sfx/sfx-01-sub-boom.mp3` … | Procedural, subtle (`npm run sound-design`); replaceable. |
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
