# Physics PPT Demo — Electricity (Part 2)

Three bilingual (English + Hindi) 16:9 demo decks built from the *Electricity Part 2* chapter source. All text, shapes, formulas and diagrams are editable.

| Deck | Slides | Focus |
|---|---|---|
| `decks/Demo-01_Electric-Potential.pptx` | 10 | Concept teaching: heat analogy → A→B visual → V = W/Q → 2 PYQs with solutions |
| `decks/Demo-02_Ohms-Law.pptx` | 10 | Formula + PYQs: V = IR, variables, relationship diagram, 2 PYQs + quick round |
| `decks/Demo-03_Resistance-Resistivity.pptx` | 11 | Advanced exam teaching: factors, R = ρL/A derivation, resistivity table, PYQs, revision |

`pdf-preview/` has PDF exports with the fonts embedded. `overview.jpg` shows every slide.

## Fonts (install before opening in PowerPoint)
The decks use **Inter** (English), **Noto Sans Devanagari** (Hindi) and **Caveat** (teacher annotations). All are free Google Fonts under the Open Font License.
Install the full families from fonts.google.com. The TTFs in `fonts/` are a reduced subset, good enough for the characters in these decks.
If the fonts are missing, PowerPoint substitutes its own and the layout will shift.

## Rebuild
```
cd source && npm install pptxgenjs && node build.js      # writes to source/out/
```
`lib.js` holds the design system (colours, formula card, PYQ badge, option grid, solution steps, answer card, footer).
