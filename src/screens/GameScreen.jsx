import { useEffect, useState } from 'react'
import { PuzzleDisplay } from '../components/PuzzleDisplay.jsx'
import { TimerBar } from '../components/TimerBar.jsx'
import { ScoreDisplay } from '../components/ScoreDisplay.jsx'
import { GameProgress } from '../components/GameProgress.jsx'
import { FeedbackOverlay } from '../components/FeedbackOverlay.jsx'
import { GameStatus } from '../types/game.js'
import styles from './GameScreen.module.css'

const CURSOR_IDLE_MS = 3000
const ANSWERED_STATUSES = [GameStatus.CORRECT, GameStatus.WRONG, GameStatus.SKIPPED, GameStatus.TIMEOUT]

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

export function GameScreen({ game }) {
  const { status, currentPuzzle, currentPuzzleIndex, totalPuzzles, score, timeRemaining, timerDuration } = game
  const isIdleCursor = useIdleCursor(status === GameStatus.PLAYING)
  const showFeedback = ANSWERED_STATUSES.includes(status)
  const isPaused = status === GameStatus.PAUSED

  return (
    <div className={styles.wrapper} data-hide-cursor={isIdleCursor || undefined}>
      <header className={styles.header}>
        <GameProgress current={currentPuzzleIndex + 1} total={totalPuzzles} />
        <ScoreDisplay score={score} />
      </header>

      <div className={styles.center}>
        <PuzzleDisplay puzzle={currentPuzzle} shake={status === GameStatus.WRONG} />
        {showFeedback && <FeedbackOverlay status={status} answer={currentPuzzle?.answer} />}
        {isPaused && (
          <div className={styles.pauseOverlay} role="status" aria-live="polite">
            <div className={styles.pauseTitle}>GAME PAUSED</div>
            <div className={styles.pauseHint}>Press Space to continue</div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        {status === GameStatus.PLAYING && <div className={styles.prompt}>Say your answer!</div>}
        <TimerBar timeRemaining={timeRemaining} duration={timerDuration} />
      </footer>
    </div>
  )
}
