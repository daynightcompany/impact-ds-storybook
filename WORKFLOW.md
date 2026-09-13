# Component workflow: Figma → Storybook

The repeatable process for adding each new Impact DS component.

## 1. Pick the component + find its node
Find the component's frame in the Figma metadata (or just ask Claude —
it already has the node IDs for everything under Controls).

## 2. Select it live in Figma
Open the Figma design file tab and click directly on that component's
frame to select it. Required every time — the Figma MCP bridge reads
whatever is currently selected, not just a node ID on its own.

## 3. Claude pulls the real design + tokens
Claude calls Figma's design-to-code tool against the selected node,
and checks the result against the real exported token file
(`tokens.css`) — not the tool's own guessed variable names.

## 4. Claude writes the component
Three files per component: `Component.tsx`, `Component.module.css`,
`Component.stories.tsx`. Checked against the mistake list below every
time.

## 5. You save the files
Paste the one-shot terminal command Claude provides
(`mkdir -p ... && cat > ... << 'EOF' ... EOF` for each file) —
more reliable than dragging into Finder, especially for anything
inside a hidden dotfolder (`.storybook`, `.github`, `.gitignore`).

## 6. Rebuild and eyeball it
```
npm run storybook
```
Compare against the Figma screenshot: spacing, color, font, real
interaction (click, tab to it, hover). Check **all three themes**
(Light/Dark/SMAL via the toolbar) and **both Canvas and Docs views** —
they don't always behave identically (see gotchas below).

**Config files need a full restart, not hot-reload.** `.storybook/main.ts`
and `.storybook/preview.tsx` only take effect after Ctrl+C + `npm run
storybook` again. Plain files under `src/` (including `tokens.css`)
hot-reload live — no restart needed.

## 7. Fix-it loop (if needed)
Screenshot anything wrong → Claude fixes → rebuild → recheck.

## 8. Commit in GitHub Desktop
Check the Changes tab for `node_modules/...` or `.DS_Store` junk
before committing (shouldn't reappear now that `.gitignore` is fixed,
but double check).

## 9. Push
Triggers the GitHub Action automatically — no manual `npx chromatic`
needed.

## 10. Verify it's live
Actions tab → green checkmark, then check the permanent link:
**https://main--6aa129bb6842c110d4d7d0d3.chromatic.com**

---

## Running mistake checklist
- **Icons**: inline SVG with `stroke`/`fill="currentColor"` — never
  `<img>`, never a CSS mask
- **Borders**: `outline` with negative offset, never `border` — a real
  border adds to the element's outer size even with `box-sizing:
  border-box`, unless width/height are explicitly set
- **Typography**: `font-interactive-label-text-*` tokens for any
  interactive control label — not the generic `font-text-size-*` scale
- **Sizing**: explicit `line-height` per size, `box-sizing: border-box`,
  padding/gap verified against Figma's actual Hug dimensions — never
  assumed from a token's name alone
- **Fonts**: confirm the referenced font is actually imported in
  `tokens.css` — a missing font fails silently into a wrong-looking
  fallback, it doesn't error
- **Accessibility**: real form controls (Checkbox, Radiobutton, etc.)
  build on the actual native element (`<input>`), visually hidden but
  still focusable
- **Color tokens are not stable by name.** Numbered-suffix tokens
  (`primary-2`, `primary-3`) look like a shade ramp but really mean
  "whatever a specific layer happened to reference" — they can get
  renamed or restructured wholesale when the token collection is
  reorganized upstream. Always re-verify against a fresh Figma pull,
  never assume a name survives.
- **Contrast-paired tokens, not "a light/dark color."** For any icon
  or text sitting on top of `--color-interactive-idle-primary` (a
  colored fill), use the token specifically paired to contrast against
  it — `--color-typography-and-icons-interactive-label-idle-primary` —
  not a generically "light" or "dark" token. This matters most for
  themes with unusual fill colors (e.g. SMAL's pastel purple), where a
  plain white/black guess can have poor contrast even though it looks
  fine in Light/Dark.
- **Semantic token family matters, not just the value.** Plain text
  beside a control (a checkbox's label) uses `paragraph-body-*`
  tokens; text sitting on a colored fill (a button's label, a pill's
  text) uses `interactive-label-idle-*` tokens. Same color value in
  Light mode can hide this being wrong — it only shows up once another
  mode changes the two families differently.
- **Unverified icon assets**: this file reuses one generic
  circle-outline placeholder in most icon slots. Flag it as an
  assumption per component rather than guessing a "real" glyph from a
  low-res preview.

## Storybook Docs vs. Canvas gotchas
- A custom decorator that wraps `<Story/>` in a styled `<div>` can
  render correctly in Canvas but fail to update in the combined Docs
  page — Docs-embedded stories don't always remount reliably on a
  global change. Prefer the official `@storybook/addon-themes`
  (`withThemeByDataAttribute`) over a custom decorator for anything
  theme-related.
- `@storybook/addon-themes` only supports **one** active theme
  switcher — stacking two `withThemeByDataAttribute` calls silently
  overwrites the first instead of adding a second toolbar item. This
  is a confirmed limitation of the addon itself, not a config mistake.
  A second independent axis (e.g. device/breakpoint) needs a more
  involved custom decorator to coexist properly.
- Canvas view's story root is `#storybook-root`; Docs view's embedded
  preview boxes use a different class, `.sbdocs-preview` — a global
  background/color rule needs to target both (with `!important` on
  `.sbdocs-preview`, since Storybook's own docs stylesheet also sets a
  background there).
