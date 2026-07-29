import styles from './BrandLogo.module.css'

/** The official Safaricom Hackathon 2026 lockup — replaces plain text branding wherever the event identity should lead. */
export function BrandLogo({ className = '' }) {
  return (
    <img
      src="/image/hackathon-title-lockup.png"
      alt="Safaricom Hackathon 2026"
      className={`${styles.logo} ${className}`}
      draggable="false"
    />
  )
}
