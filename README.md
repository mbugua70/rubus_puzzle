# Rubus Puzzle — TV Display

A game-show-style "rebus" picture puzzle, built for a widescreen TV or event
display. Two pictures are shown; the player combines the words they
represent to guess the answer (e.g. **Rain** + **Bow** = **Rainbow**) and
says it aloud. A facilitator (today: a keyboard) judges the answer as
correct, wrong, or skipped.

This is the display-only front end. There is no backend, database, or
Socket.IO connection yet — see [Future Socket.IO integration](#future-socketio-integration)
for how this is set up to add that layer without a rewrite.

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server (with hot reload):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

## Puzzle set

Puzzle data lives in `src/data/puzzles.js`. Images are referenced by
root-relative path (e.g. `/puzzleImage/rain.jpg`) and must be placed in:

```
public/puzzleImage/
```

The shipped set is **9 puzzles**, not 10 — the spec's original 10th puzzle
("fire" + "man" = Fireman) has no matching image in `public/puzzleImage/`,
and the other 18 images divide evenly into the remaining 9 puzzles with
nothing left over. Adding a puzzle back is just adding an image and an
entry to the `puzzles` array; nothing else needs to change since puzzle
count is read dynamically everywhere (progress display, result-message
thresholds, etc.) rather than hardcoded.

## Sound effects

Sound files go in:

```
public/sounds/
```

Expected filenames (all optional — see below):

| File | Used for |
|---|---|
| `countdown.wav` | Each number during the 3-2-1 countdown |
| `go.wav` | The "GO!" moment |
| `correct.wav` | Correct answer |
| `wrong.wav` | Wrong answer |
| `timeout.wav` | Timer reaching 0 |
| `result.wav` | Reaching the final results screen |
| `music.wav` | Looping background music |

**The game works fully with none of these present** — every sound load and
playback call is wrapped so failures are caught, logged as a `console.warn`
in dev, and otherwise silently skipped, so a missing or broken sound file
never crashes the game or blocks the loading screen.

The shipped `public/sounds/*.wav` files are simple synthesized placeholder
tones (sine-wave beeps/chimes generated programmatically, not recordings or
downloaded assets) — good enough to hear the game's audio cues working, but
worth swapping for real sound design before a real event.

## Keyboard controls

Keyboard input simulates a facilitator's control panel until Socket.IO is
wired up. Each key only does something in the screen it's meant for; a held
key won't repeat-fire.

| Key | Action | Available when |
|---|---|---|
| `Enter` | Start game | Attract screen |
| `C` | Mark answer correct | Playing |
| `W` | Mark answer wrong | Playing |
| `S` | Skip puzzle | Playing |
| `Space` | Pause / resume | Playing / Paused |
| `R` | Restart | Results screen |
| `F` | Enter / exit fullscreen | Anywhere |
| `M` | Mute / unmute sound | Anywhere |

## Architecture

```
src/
├── components/   Presentational only — no game-control logic
├── screens/      One component per game-flow screen
├── data/         puzzles.js
├── hooks/        useGame, useGameTimer, useGameSounds,
│                 useKeyboardControls, useFullscreen, usePreloadAssets
├── types/        GameStatus enum + JSDoc shapes (plain JS, no TypeScript)
├── utils/        imagePreloader, gameResults
├── styles/       globals.css, animations.css
├── App.jsx       Wires everything together
└── main.jsx
```

The game is a single state machine (`useGame`, in `src/hooks/useGame.js`)
driven by one `status` field — `loading / idle / countdown / playing /
correct / wrong / skipped / timeout / paused / finished` — rather than a
pile of boolean flags. All state transitions happen through eight action
functions:

```js
startGame()
markCorrect()
markWrong()
skipPuzzle()
pauseGame()
resumeGame()
restartGame()
goToNextPuzzle()
```

`useKeyboardControls` calls these directly today. `App.jsx` is the only
place that wires a control source (currently keyboard) to the state
machine — screens and components never call these functions themselves,
and the state machine has no idea keyboard input exists.

### Future Socket.IO integration

Because every game action is one of the eight functions above, and nothing
outside `App.jsx` knows how those functions get triggered, adding
Socket.IO later means:

1. Add a `useSocketControls` hook (mirroring `useKeyboardControls`'s shape)
   that listens for facilitator events over a socket and calls the same
   `game.markCorrect()`, `game.pauseGame()`, etc.
2. Use it alongside (or instead of) `useKeyboardControls` in `App.jsx`.

`useGame`, the reducer, the timer, and every screen and component are
unaffected — none of them know or care where an action call came from.

## Notes on the provided assets

A few files in `public/puzzleImage/` are saved with a `.png` extension but
are actually WebP (`ball.png`) or AVIF (`bow.png`, `moon.png`,
`spider.png`) content. Chromium-based browsers decode them fine regardless
of extension, but this is worth knowing about if targeting a stricter or
older TV browser — re-encoding those four files as real PNG/JPEG would
remove the risk.
