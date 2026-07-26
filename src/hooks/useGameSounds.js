import { useCallback, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'

const MUTE_STORAGE_KEY = 'rubus-puzzle:muted'

/** Expected files under public/sounds/ — see README. Missing files degrade to silent no-ops. */
const SOUND_FILES = {
  countdown: '/sounds/countdown.mp3',
  go: '/sounds/go.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  timeout: '/sounds/timeout.mp3',
  result: '/sounds/result.mp3',
}
const MUSIC_FILE = '/sounds/music.mp3'
const MUSIC_VOLUME = 0.35
const MUSIC_DUCKED_VOLUME = 0.1

function readStoredMute() {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Thin Howler wrapper for sound effects + background music. Every load
 * failure is caught and logged (dev only) rather than thrown, so a missing
 * public/sounds/ file never breaks the game — playback of that sound
 * just becomes a silent no-op.
 */
export function useGameSounds() {
  const [isMuted, setIsMuted] = useState(readStoredMute)
  const [isReady, setIsReady] = useState(false)
  const howlsRef = useRef({})
  const musicRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const keys = Object.keys(SOUND_FILES)
    let pending = keys.length

    const settle = () => {
      pending -= 1
      if (pending <= 0 && !cancelled) setIsReady(true)
    }

    keys.forEach((key) => {
      const src = SOUND_FILES[key]
      howlsRef.current[key] = new Howl({
        src: [src],
        volume: 0.8,
        onload: settle,
        onloaderror: (_id, err) => {
          if (import.meta.env.DEV) {
            console.warn(`[useGameSounds] Failed to load "${key}" sound (${src}):`, err)
          }
          settle()
        },
      })
    })

    musicRef.current = new Howl({
      src: [MUSIC_FILE],
      loop: true,
      volume: MUSIC_VOLUME,
      onloaderror: (_id, err) => {
        if (import.meta.env.DEV) {
          console.warn(`[useGameSounds] Failed to load background music (${MUSIC_FILE}):`, err)
        }
      },
    })

    return () => {
      cancelled = true
      Object.values(howlsRef.current).forEach((howl) => howl.unload())
      musicRef.current?.unload()
      howlsRef.current = {}
    }
  }, [])

  useEffect(() => {
    Howler.mute(isMuted)
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted))
    } catch {
      // localStorage unavailable (private mode, disabled storage) — mute still
      // applies for this session, it just won't persist across reloads.
    }
  }, [isMuted])

  const play = useCallback((key) => {
    const howl = howlsRef.current[key]
    if (!howl || howl.state() === 'unloaded') return
    try {
      howl.play()
    } catch (err) {
      if (import.meta.env.DEV) console.warn(`[useGameSounds] Could not play "${key}":`, err)
    }
  }, [])

  const startMusic = useCallback(() => {
    const music = musicRef.current
    if (music && !music.playing()) music.play()
  }, [])

  const stopMusic = useCallback(() => {
    musicRef.current?.stop()
  }, [])

  const duckMusic = useCallback(() => {
    musicRef.current?.fade(musicRef.current.volume(), MUSIC_DUCKED_VOLUME, 300)
  }, [])

  const restoreMusicVolume = useCallback(() => {
    musicRef.current?.fade(musicRef.current.volume(), MUSIC_VOLUME, 300)
  }, [])

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), [])

  return {
    isMuted,
    toggleMute,
    isReady,
    play,
    startMusic,
    stopMusic,
    duckMusic,
    restoreMusicVolume,
  }
}
