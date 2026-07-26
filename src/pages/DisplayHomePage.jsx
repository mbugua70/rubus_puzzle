import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DisplayHomePage.module.css'

/**
 * Operator-facing setup screen: opens an existing game session by code.
 * This never creates a game - only the facilitator app does that.
 */
export function DisplayHomePage() {
  const navigate = useNavigate()
  const [gameCode, setGameCode] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const normalizedGameCode = gameCode.trim().toUpperCase()
    if (!normalizedGameCode) return
    navigate(`/play/${normalizedGameCode}`)
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Rubus Puzzle</h1>
      <p className={styles.subtitle}>Enter the game code from the facilitator to open this display.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={gameCode}
          onChange={(event) => setGameCode(event.target.value)}
          placeholder="ABC123"
          aria-label="Game code"
          autoFocus
        />
        <button type="submit" className={styles.submitButton} disabled={!gameCode.trim()}>
          Open display
        </button>
      </form>
    </div>
  )
}
