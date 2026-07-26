import { useEffect, useRef } from 'react'
import { GameStatus } from '../types/game.js'

const SOUND_BY_STATUS = {
  [GameStatus.COUNTDOWN]: 'countdown',
  [GameStatus.CORRECT]: 'correct',
  [GameStatus.WRONG]: 'wrong',
  [GameStatus.TIMEOUT]: 'timeout',
  [GameStatus.FINISHED]: 'result',
}

const DUCK_ON_STATUSES = [GameStatus.CORRECT, GameStatus.WRONG, GameStatus.TIMEOUT]

/**
 * Plays sound effects and drives background music purely from backend status
 * *transitions* (previous status -> new status), never from local timers or
 * input. Howler.js loading failures are already caught inside useGameSounds,
 * so a missing sound file can't crash this.
 *
 * @param {import('../types/game.js').GameStatus} status
 * @param {ReturnType<typeof import('./useGameSounds.js').useGameSounds>} sounds
 */
export function useStatusSounds(status, { play, startMusic, stopMusic, duckMusic, restoreMusicVolume }) {
  const prevStatusRef = useRef(status)

  useEffect(() => {
    const prevStatus = prevStatusRef.current
    prevStatusRef.current = status
    if (status === prevStatus) return

    if (prevStatus === GameStatus.WAITING && status === GameStatus.PLAYING) {
      startMusic()
    }

    const soundKey = SOUND_BY_STATUS[status]
    if (soundKey) play(soundKey)

    if (DUCK_ON_STATUSES.includes(status)) {
      duckMusic()
    } else if (status === GameStatus.PLAYING) {
      restoreMusicVolume()
    } else if (status === GameStatus.FINISHED) {
      stopMusic()
    }
  }, [status, play, startMusic, stopMusic, duckMusic, restoreMusicVolume])
}
