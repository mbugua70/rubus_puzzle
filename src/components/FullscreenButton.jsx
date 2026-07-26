import styles from './IconButton.module.css'

export function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-pressed={isFullscreen}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
        {isFullscreen ? (
          <path
            fill="currentColor"
            d="M9 3H5a2 2 0 0 0-2 2v4h2V5h4V3zm10 0h-4v2h4v4h2V5a2 2 0 0 0-2-2zM5 15H3v4a2 2 0 0 0 2 2h4v-2H5v-4zm14 4h-4v2h4a2 2 0 0 0 2-2v-4h-2v4z"
          />
        ) : (
          <path
            fill="currentColor"
            d="M3 9V5a2 2 0 0 1 2-2h4v2H5v4H3zm18 0V5a2 2 0 0 0-2-2h-4v2h4v4h2zM3 15v4a2 2 0 0 0 2 2h4v-2H5v-4H3zm18 0v4a2 2 0 0 1-2 2h-4v-2h4v-4h2z"
          />
        )}
      </svg>
    </button>
  )
}
