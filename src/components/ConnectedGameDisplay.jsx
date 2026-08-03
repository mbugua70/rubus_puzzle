import { useNavigate } from 'react-router-dom'
import { useDisplaySocket } from '../hooks/useDisplaySocket.js'
import { useGameSounds } from '../hooks/useGameSounds.js'
import { useStatusSounds } from '../hooks/useStatusSounds.js'
import { useFullscreen } from '../hooks/useFullscreen.js'
import { useKeyboardControls } from '../hooks/useKeyboardControls.js'
import { getPuzzleById } from '../data/puzzles.js'
import { GameStatus } from '../types/game.js'
import { WaitingScreen } from '../screens/WaitingScreen.jsx'
import { CountdownScreen } from '../screens/CountdownScreen.jsx'
import { GameScreen } from '../screens/GameScreen.jsx'
import { ResultsScreen } from '../screens/ResultsScreen.jsx'
import { GameLoadErrorScreen } from '../screens/GameLoadErrorScreen.jsx'
import { ConnectionOverlay } from './ConnectionOverlay.jsx'
import { FullscreenButton } from './FullscreenButton.jsx'
import styles from './ConnectedGameDisplay.module.css'

/**
 * Mounted only once an initial REST snapshot exists for this game code.
 * Owns the live socket connection and renders every screen purely from
 * whatever `game:state` (or the initial REST snapshot, until the socket
 * catches up) says - this component itself never mutates gameplay state.
 *
 * Nobody operates this screen directly (it's a TV/kiosk display), so there's
 * no "leave game" control here - switching to a different game code is done
 * remotely, from the facilitator app, via the `display:redirect` broadcast
 * handled in useDisplaySocket.
 */
export function ConnectedGameDisplay({ gameCode, initialState }) {
  const navigate = useNavigate()
  const sounds = useGameSounds()
  const fullscreen = useFullscreen()
  const { gameState, connectionStatus, error, hasSyncedOnce } = useDisplaySocket({
    gameCode,
    initialState,
    onRedirect: (newGameCode) => navigate(`/play/${newGameCode}`),
  })

  const state = gameState ?? initialState
  useStatusSounds(state.status, sounds)

  useKeyboardControls({
    onToggleFullscreen: fullscreen.toggle,
    onToggleMute: sounds.toggleMute,
  })

  // A join rejection before we've ever synced (e.g. the game was deleted
  // between the REST fetch and the socket connecting) means there's no
  // trustworthy state to show at all - anything after a successful sync
  // just gets a small overlay so the last known screen stays visible.
  if (connectionStatus === 'error' && !hasSyncedOnce) {
    return <GameLoadErrorScreen gameCode={gameCode} message={error ?? 'Could not join this game.'} onRetry={() => window.location.reload()} />
  }

  const puzzle = getPuzzleById(state.currentPuzzleId)
  const showOverlay = connectionStatus !== 'connected'
  const overlayLabel = !hasSyncedOnce ? 'Connecting display…' : 'Connection lost. Reconnecting…'

  let screen
  switch (state.status) {
    case GameStatus.WAITING:
      screen = (
        <WaitingScreen
          gameCode={state.gameCode}
          facilitatorConnected={state.facilitatorConnected}
          isFullscreen={fullscreen.isFullscreen}
          onToggleFullscreen={fullscreen.toggle}
          isMuted={sounds.isMuted}
          onToggleMute={sounds.toggleMute}
        />
      )
      break

    case GameStatus.COUNTDOWN:
      screen = <CountdownScreen questionStartedAt={state.questionStartedAt} questionEndsAt={state.questionEndsAt} />
      break

    case GameStatus.FINISHED:
      screen = (
        <ResultsScreen
          score={state.score}
          correctCount={state.correctCount}
          wrongCount={state.wrongCount}
          skippedCount={state.skippedCount}
          timeoutCount={state.timeoutCount}
          revealedCount={state.revealedCount}
          totalPuzzles={state.puzzleIds.length}
        />
      )
      break

    // playing, correct, wrong, timeout, paused all render the same screen shell.
    default:
      screen = (
        <GameScreen
          status={state.status}
          puzzle={puzzle}
          currentPuzzleIndex={state.currentPuzzleIndex}
          totalPuzzles={state.puzzleIds.length}
          score={state.score}
          questionStartedAt={state.questionStartedAt}
          questionEndsAt={state.questionEndsAt}
        />
      )
  }

  return (
    <>
      {screen}
      {state.status !== GameStatus.WAITING && (
        <div className={styles.floatingControls}>
          <FullscreenButton isFullscreen={fullscreen.isFullscreen} onToggle={fullscreen.toggle} />
        </div>
      )}
      {showOverlay && <ConnectionOverlay label={overlayLabel} />}
    </>
  )
}
