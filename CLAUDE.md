# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

There is no test runner configured in this project.

## Project state

This repo is currently the stock Vite `react` template (`src/App.jsx`, `src/App.css`, `src/index.css` are all unmodified boilerplate — counter button, Vite/React docs links). No puzzle game logic has been implemented yet.

However, `public/puzzleImage/` already contains a set of image assets (ball, basket, book, bow, brush, butter, face, fish, fly, honey, king, lion, man, moon, rain, spider, star, tooth) — these are picture clues intended for a rebus-style puzzle ("rubus_puzzle"), staged for a feature that hasn't been built yet. When implementing the puzzle, these are the asset set to build against.

## Architecture notes

- Standard Vite + React entry point: `index.html` → `src/main.jsx` → `src/App.jsx`.
- **React Compiler is enabled** via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.js` (`reactCompilerPreset()`). This means manual memoization (`useMemo`/`useCallback`/`React.memo`) is generally unnecessary — the compiler auto-memoizes. Avoid patterns that violate the Rules of Hooks, since the compiler relies on them.
- Static/public assets referenced by absolute path (e.g. `/icons.svg`, `/favicon.svg`, `/puzzleImage/*.png`) belong in `public/`; assets imported directly in JS (e.g. `import heroImg from './assets/hero.png'`) belong in `src/assets/`.
- Linting is via `oxlint` (not ESLint), configured in `.oxlintrc.json` with the `react` and `oxc` plugin rule sets. `react/rules-of-hooks` is an error — relevant given React Compiler's reliance on correct hook usage.
- No TypeScript, no test framework, no router, and no state management library are set up.
