import { useCallback, useEffect, useReducer, useRef } from 'react'
import { puzzles } from '../data/puzzles.js'
import { GameStatus, PUZZLE_DURATION_SECONDS, POINTS_PER_CORRECT_ANSWER } from '../types/game.js'
import { useGameTimer } from './useGameTimer.js'

const ANSWERED_STATUSES = [GameStatus.CORRECT, GameStatus.WRONG, GameStatus.SKIPPED, GameStatus.TIMEOUT]

const AUTO_ADVANCE_DELAY_MS = {
  [GameStatus.CORRECT]: 1500,
  [GameStatus.WRONG]: 2000,
  [GameStatus.SKIPPED]: 1000,
  [GameStatus.TIMEOUT]: 2000,
}

function createInitialState() {
  return {
    status: GameStatus.LOADING,
    currentPuzzleIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    skippedCount: 0,
    hasAnsweredCurrentPuzzle: false,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ASSETS_READY':
      return state.status === GameStatus.LOADING ? { ...state, status: GameStatus.IDLE } : state

    // Shared by startGame (only reachable from idle) and restartGame (reachable
    // from most other statuses) — one transition, two guarded entry points,
    // so the reset-and-recount logic itself only lives in one place.
    case 'RESET_AND_COUNTDOWN':
      return state.status === GameStatus.LOADING ? state : { ...createInitialState(), status: GameStatus.COUNTDOWN }

    case 'BEGIN_PLAYING':
      return state.status === GameStatus.COUNTDOWN
        ? { ...state, status: GameStatus.PLAYING, hasAnsweredCurrentPuzzle: false }
        : state

    case 'MARK_CORRECT':
      if (state.status !== GameStatus.PLAYING || state.hasAnsweredCurrentPuzzle) return state
      return {
        ...state,
        status: GameStatus.CORRECT,
        score: state.score + POINTS_PER_CORRECT_ANSWER,
        correctCount: state.correctCount + 1,
        hasAnsweredCurrentPuzzle: true,
      }

    case 'MARK_WRONG':
      if (state.status !== GameStatus.PLAYING || state.hasAnsweredCurrentPuzzle) return state
      return {
        ...state,
        status: GameStatus.WRONG,
        wrongCount: state.wrongCount + 1,
        hasAnsweredCurrentPuzzle: true,
      }

    case 'SKIP':
      if (state.status !== GameStatus.PLAYING || state.hasAnsweredCurrentPuzzle) return state
      return {
        ...state,
        status: GameStatus.SKIPPED,
        skippedCount: state.skippedCount + 1,
        hasAnsweredCurrentPuzzle: true,
      }

    case 'TIMEOUT':
      if (state.status !== GameStatus.PLAYING || state.hasAnsweredCurrentPuzzle) return state
      return {
        ...state,
        status: GameStatus.TIMEOUT,
        wrongCount: state.wrongCount + 1,
        hasAnsweredCurrentPuzzle: true,
      }

    case 'PAUSE':
      return state.status === GameStatus.PLAYING ? { ...state, status: GameStatus.PAUSED } : state

    case 'RESUME':
      return state.status === GameStatus.PAUSED ? { ...state, status: GameStatus.PLAYING } : state

    case 'NEXT_PUZZLE': {
      if (!ANSWERED_STATUSES.includes(state.status)) return state
      const isLastPuzzle = state.currentPuzzleIndex + 1 >= action.totalPuzzles
      return isLastPuzzle
        ? { ...state, status: GameStatus.FINISHED }
        : {
            ...state,
            status: GameStatus.PLAYING,
            currentPuzzleIndex: state.currentPuzzleIndex + 1,
            hasAnsweredCurrentPuzzle: false,
          }
    }

    default:
      return state
  }
}

/**
 * Owns the full puzzle game state machine behind eight action functions
 * (startGame, markCorrect, markWrong, skipPuzzle, pauseGame, resumeGame,
 * restartGame, goToNextPuzzle). Keyboard input calls these directly today;
 * a future Socket.IO layer can call the exact same functions from
 * facilitator events, so nothing about the state machine needs to change
 * when that layer is added — only the caller does.
 *
 * @param {ReturnType<typeof import('./useGameSounds.js').useGameSounds>} [sounds]
 */
export function useGame(sounds) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  // Action functions below read guards from this ref (not `state` directly) so
  // they can stay referentially stable across renders (empty/near-empty dep
  // arrays) while still always seeing the latest status — a stale closure
  // here would let e.g. two rapid key presses both slip past a status guard.
  const stateRef = useRef(state)
  stateRef.current = state

  const advanceTimeoutRef = useRef(null)
  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }, [])

  // goToNextPuzzle (defined below, after the timer) needs the timer's
  // start/stop; the timer needs an onExpire handler that wants to schedule a
  // call to goToNextPuzzle. This ref breaks that circularity: anything
  // created before goToNextPuzzle exists can schedule a call to it by name,
  // and the ref is repointed at the real function once it's created below.
  const goToNextPuzzleRef = useRef(() => {})
  const scheduleAutoAdvance = useCallback(
    (status) => {
      clearAdvanceTimeout()
      advanceTimeoutRef.current = setTimeout(() => goToNextPuzzleRef.current(), AUTO_ADVANCE_DELAY_MS[status])
    },
    [clearAdvanceTimeout],
  )

  const playSound = sounds?.play
  const duckMusic = sounds?.duckMusic
  const restoreMusicVolume = sounds?.restoreMusicVolume
  const startMusic = sounds?.startMusic
  const stopMusic = sounds?.stopMusic

  const handleExpire = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PLAYING || stateRef.current.hasAnsweredCurrentPuzzle) return
    dispatch({ type: 'TIMEOUT' })
    playSound?.('timeout')
    duckMusic?.()
    scheduleAutoAdvance(GameStatus.TIMEOUT)
  }, [playSound, duckMusic, scheduleAutoAdvance])

  const timer = useGameTimer({ onExpire: handleExpire })
  const { start: startTimer, pause: pauseTimer, resume: resumeTimer, stop: stopTimer } = timer

  const goToNextPuzzle = useCallback(() => {
    clearAdvanceTimeout()
    if (!ANSWERED_STATUSES.includes(stateRef.current.status)) return
    // currentPuzzleIndex here is still the pre-dispatch value (React state
    // updates aren't applied until the next render), which is exactly the
    // value needed to mirror the reducer's own "is this the last puzzle" check.
    const isLastPuzzle = stateRef.current.currentPuzzleIndex + 1 >= puzzles.length
    dispatch({ type: 'NEXT_PUZZLE', totalPuzzles: puzzles.length })
    if (isLastPuzzle) {
      stopTimer()
      stopMusic?.()
      playSound?.('result')
    } else {
      restoreMusicVolume?.()
      startTimer(PUZZLE_DURATION_SECONDS)
    }
  }, [clearAdvanceTimeout, stopTimer, stopMusic, playSound, restoreMusicVolume, startTimer])
  goToNextPuzzleRef.current = goToNextPuzzle

  const markCorrect = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PLAYING || stateRef.current.hasAnsweredCurrentPuzzle) return
    stopTimer()
    dispatch({ type: 'MARK_CORRECT' })
    playSound?.('correct')
    duckMusic?.()
    scheduleAutoAdvance(GameStatus.CORRECT)
  }, [stopTimer, playSound, duckMusic, scheduleAutoAdvance])

  const markWrong = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PLAYING || stateRef.current.hasAnsweredCurrentPuzzle) return
    stopTimer()
    dispatch({ type: 'MARK_WRONG' })
    playSound?.('wrong')
    duckMusic?.()
    scheduleAutoAdvance(GameStatus.WRONG)
  }, [stopTimer, playSound, duckMusic, scheduleAutoAdvance])

  const skipPuzzle = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PLAYING || stateRef.current.hasAnsweredCurrentPuzzle) return
    stopTimer()
    dispatch({ type: 'SKIP' })
    scheduleAutoAdvance(GameStatus.SKIPPED)
  }, [stopTimer, scheduleAutoAdvance])

  const pauseGame = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PLAYING) return
    pauseTimer()
    dispatch({ type: 'PAUSE' })
  }, [pauseTimer])

  const resumeGame = useCallback(() => {
    if (stateRef.current.status !== GameStatus.PAUSED) return
    resumeTimer()
    dispatch({ type: 'RESUME' })
  }, [resumeTimer])

  const startGame = useCallback(() => {
    if (stateRef.current.status !== GameStatus.IDLE) return
    clearAdvanceTimeout()
    stopTimer()
    dispatch({ type: 'RESET_AND_COUNTDOWN' })
    startMusic?.() // first user gesture (Enter / Start click) — safe to start audio here
  }, [clearAdvanceTimeout, stopTimer, startMusic])

  const restartGame = useCallback(() => {
    if (stateRef.current.status === GameStatus.LOADING) return
    clearAdvanceTimeout()
    stopTimer()
    dispatch({ type: 'RESET_AND_COUNTDOWN' })
    startMusic?.()
  }, [clearAdvanceTimeout, stopTimer, startMusic])

  const handleCountdownComplete = useCallback(() => {
    if (stateRef.current.status !== GameStatus.COUNTDOWN) return
    dispatch({ type: 'BEGIN_PLAYING' })
    startTimer(PUZZLE_DURATION_SECONDS)
  }, [startTimer])

  const completeLoading = useCallback(() => {
    dispatch({ type: 'ASSETS_READY' })
  }, [])

  // Cancel any pending auto-advance on unmount so it can't fire (and dispatch
  // into an unmounted hook) after the game screen goes away.
  useEffect(() => clearAdvanceTimeout, [clearAdvanceTimeout])

  return {
    ...state,
    timeRemaining: timer.timeRemaining,
    timerDuration: timer.duration,
    isTimerRunning: timer.isRunning,
    currentPuzzle: puzzles[state.currentPuzzleIndex] ?? null,
    totalPuzzles: puzzles.length,

    completeLoading,
    startGame,
    handleCountdownComplete,
    markCorrect,
    markWrong,
    skipPuzzle,
    pauseGame,
    resumeGame,
    restartGame,
    goToNextPuzzle,
  }
}
