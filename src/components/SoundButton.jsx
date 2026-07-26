import styles from './IconButton.module.css'

export function SoundButton({ isMuted, onToggle }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={isMuted}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M3 10v4h4l5 5V5L7 10H3z" />
        {isMuted ? (
          <path
            fill="currentColor"
            d="m19 6.41-1.41-1.41L15 7.59 12.41 5 11 6.41 13.59 9 11 11.59 12.41 13 15 10.41 17.59 13 19 11.59 16.41 9z"
          />
        ) : (
          <path fill="currentColor" d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
        )}
      </svg>
    </button>
  )
}
