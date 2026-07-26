import { useEffect } from 'react'
import { useGame } from './hooks/useGame.js'
import { useGameSounds } from './hooks/useGameSounds.js'
import { useFullscreen } from './hooks/useFullscreen.js'
import { useKeyboardControls } from './hooks/useKeyboardControls.js'
import { usePreloadAssets } from './hooks/usePreloadAssets.js'
import { GameStatus } from './types/game.js'
import { LoadingScreen } from './screens/LoadingScreen.jsx'
import { AttractScreen } from './screens/AttractScreen.jsx'
import { CountdownScreen } from './screens/CountdownScreen.jsx'
import { GameScreen } from './screens/GameScreen.jsx'
import { ResultsScreen } from './screens/ResultsScreen.jsx'

function App() {
  const sounds = useGameSounds()
  const preload = usePreloadAssets({ soundsReady: sounds.isReady })
  const game = useGame(sounds)
  const fullscreen = useFullscreen()

  const { status, completeLoading } = game
  useEffect(() => {
    if (preload.isReady && status === GameStatus.LOADING) {
      completeLoading()
    }
  }, [preload.isReady, status, completeLoading])

  useKeyboardControls({
    status: game.status,
    onStart: game.startGame,
    onCorrect: game.markCorrect,
    onWrong: game.markWrong,
    onSkip: game.skipPuzzle,
    onTogglePause: () => {
      if (game.status === GameStatus.PLAYING) game.pauseGame()
      else if (game.status === GameStatus.PAUSED) game.resumeGame()
    },
    onRestart: game.restartGame,
    onToggleFullscreen: fullscreen.toggle,
    onToggleMute: sounds.toggleMute,
  })

  switch (game.status) {
    case GameStatus.LOADING:
      return <LoadingScreen progress={preload.progress} />

    case GameStatus.IDLE:
      return (
        <AttractScreen
          onStart={game.startGame}
          isFullscreen={fullscreen.isFullscreen}
          onToggleFullscreen={fullscreen.toggle}
          isMuted={sounds.isMuted}
          onToggleMute={sounds.toggleMute}
        />
      )

    case GameStatus.COUNTDOWN:
      return <CountdownScreen onComplete={game.handleCountdownComplete} playSound={sounds.play} />

    case GameStatus.FINISHED:
      return (
        <ResultsScreen
          score={game.score}
          correctCount={game.correctCount}
          wrongCount={game.wrongCount}
          skippedCount={game.skippedCount}
          totalPuzzles={game.totalPuzzles}
          onRestart={game.restartGame}
        />
      )

    // playing, correct, wrong, skipped, timeout, paused all render the same screen shell.
    default:
      return <GameScreen game={game} />
  }
}

export default App
