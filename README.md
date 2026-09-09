# Impact DS Storybook

React + TypeScript implementation of the **SMAL Impact Design System**, converted directly from Figma to match its variants, states, spacing, and color tokens.

- **Live Storybook:** published via [Chromatic](https://www.chromatic.com/) — see the pinned build link on this repo
- **Figma source:** [SMAL Impact Design System](https://www.figma.com/design/IrtEOKkxyRBp8KnaDWRrSr/)
- **Figma Community file:** [Impact DS](https://www.figma.com/community/file/1422520357791531239)

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build tool)
- [Storybook 10](https://storybook.js.org/) (component docs/preview)
- [Chromatic](https://www.chromatic.com/) (hosting + publishing)
- Plain CSS Modules — no CSS framework, no Tailwind

## Getting started

```bash
npm install
npm run storybook       # local dev, http://localhost:6006
npm run build-storybook # static build
npm run chromatic       # publish to Chromatic
```

## Design tokens

`src/components/Button/tokens.css` currently holds a **hand-mapped subset** of tokens (just what the Button component needs) — it is not the full token set from the Figma file.

To generate the complete, accurate token set directly from Figma — every variable, every mode, every text/effect style — use the companion plugin **[Variables to Tokens](https://www.figma.com/community/plugin/1660654514999027141)**. It reads Figma's full Plugin API (not just what's bound to a single node) and outputs:

- `variables.generated.css` — ready-to-use CSS custom properties (default mode in `:root`, other modes as `[data-<collection>='<mode>']` blocks)
- `tokens.dtcg.json` — W3C Design Tokens format, one file per mode, for a Style Dictionary–style pipeline
- raw JSON — full structured data

Naming is literal (kebab-cased Figma path, no semantic renaming), and naming collisions are flagged rather than silently merged. Runs fully locally — no network access, nothing leaves Figma.

## Status

| Component | Status |
|---|---|
| Button | ✅ Implemented — all hierarchies (Primary/Secondary/Tertiary) × sizes (M/L) × icon layouts × states |
| Everything else | 🚧 Not yet started |

Components are added incrementally, converted node-by-node from the Figma file using Figma's design-to-code tooling, then hand-verified against exact Figma dimensions (padding, gap, line-height) rather than assumed.

## Folder structure

```
src/
  components/
    Button/
      Button.tsx
      Button.module.css
      Button.stories.tsx
      tokens.css
    Icon.tsx
```
