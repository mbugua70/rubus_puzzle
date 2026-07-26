import { useParams } from 'react-router-dom'
import { useGameSession } from '../hooks/useGameSession.js'
import { ConnectedGameDisplay } from '../components/ConnectedGameDisplay.jsx'
import { LoadingScreen } from '../screens/LoadingScreen.jsx'
import { GameLoadErrorScreen } from '../screens/GameLoadErrorScreen.jsx'
import { NotFoundPage } from './NotFoundPage.jsx'

/**
 * Entry point for `/play/:gameCode`. Loads the session once over REST as an
 * initial snapshot, then hands off to `ConnectedGameDisplay` for the live
 * socket connection. This page owns none of the gameplay state itself.
 */
export function GameDisplayPage() {
  const { gameCode } = useParams()
  const normalizedGameCode = gameCode?.trim().toUpperCase()

  const { data: initialState, loading, error, retry } = useGameSession(normalizedGameCode)

  if (!normalizedGameCode) {
    return <NotFoundPage />
  }

  if (loading) {
    return <LoadingScreen message={`Loading game ${normalizedGameCode}…`} />
  }

  if (error || !initialState) {
    return (
      <GameLoadErrorScreen
        gameCode={normalizedGameCode}
        message={error ?? 'The game could not be loaded.'}
        onRetry={retry}
      />
    )
  }

  return <ConnectedGameDisplay key={normalizedGameCode} gameCode={normalizedGameCode} initialState={initialState} />
}
