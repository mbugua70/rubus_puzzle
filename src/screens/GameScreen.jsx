import { useEffect, useState } from 'react'
import { BrandLogo } from '../components/BrandLogo.jsx'
import { PuzzleDisplay } from '../components/PuzzleDisplay.jsx'
import { TimerBar } from '../components/TimerBar.jsx'
import { ScoreDisplay } from '../components/ScoreDisplay.jsx'
import { GameProgress } from '../components/GameProgress.jsx'
import { FeedbackOverlay } from '../components/FeedbackOverlay.jsx'
import { useGameTimer } from '../hooks/useGameTimer.js'
import { GameStatus } from '../types/game.js'
import styles from './GameScreen.module.css'

const CURSOR_IDLE_MS = 3000
const ANSWERED_STATUSES = [GameStatus.CORRECT, GameStatus.WRONG, GameStatus.TIMEOUT, GameStatus.REVEALED]

/** Hides the cursor after a period of no mouse movement, only while actively playing. */
function useIdleCursor(isActive) {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setIsIdle(false)
      return
    }

    let timeoutId = setTimeout(() => setIsIdle(true), CURSOR_IDLE_MS)
    function handleActivity() {
      setIsIdle(false)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsIdle(true), CURSOR_IDLE_MS)
    }

    window.addEventListener('mousemove', handleActivity)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('mousemove', handleActivity)
    }
  }, [isActive])

  return isIdle
}

/**
 * Shell for every status where a puzzle is on screen: playing, correct,
 * wrong, timeout, and paused. All fields here come straight from the
 * backend's `game:state` payload - nothing is derived or mutated locally
 * except the purely visual countdown (useGameTimer) and cursor idling.
 */
export function GameScreen({ status, puzzle, currentPuzzleIndex, totalPuzzles, score, questionStartedAt, questionEndsAt }) {
  const isPaused = status === GameStatus.PAUSED
  const { timeRemaining, duration } = useGameTimer({ questionStartedAt, questionEndsAt, isPaused })
  const isIdleCursor = useIdleCursor(status === GameStatus.PLAYING)
  const showFeedback = ANSWERED_STATUSES.includes(status)

  return (
    <div className={styles.wrapper} data-hide-cursor={isIdleCursor || undefined}>
      <header className={styles.header}>
        <GameProgress current={currentPuzzleIndex + 1} total={totalPuzzles} />
        <BrandLogo className={styles.headerLogo} />
        <ScoreDisplay score={score} />
      </header>

      <div className={`${styles.center} crt-scanlines`}>
        <PuzzleDisplay puzzle={puzzle} shake={status === GameStatus.WRONG} />
        {showFeedback && <FeedbackOverlay status={status} answer={puzzle?.answer} />}
        {isPaused && (
          <div className={styles.pauseOverlay} role="status" aria-live="polite">
            <div className={styles.pauseTitle}>GAME PAUSED</div>
            <div className={styles.pauseHint}>Waiting for the facilitator to resume</div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        {status === GameStatus.PLAYING && <div className={styles.prompt}>Say your answer!</div>}
        <TimerBar timeRemaining={timeRemaining} duration={duration} />
      </footer>
    </div>
  )
}
