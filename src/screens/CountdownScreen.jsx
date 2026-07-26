import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import styles from './CountdownScreen.module.css'

const STEPS = ['3', '2', '1', 'GO!']
const STEP_DURATION_MS = 750 // 4 steps × 750ms ≈ the spec's "approximately three seconds"

export function CountdownScreen({ onComplete, playSound }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const isLastStep = stepIndex === STEPS.length - 1
    playSound?.(isLastStep ? 'go' : 'countdown')

    const timeoutId = setTimeout(() => {
      if (isLastStep) onComplete()
      else setStepIndex((prev) => prev + 1)
    }, STEP_DURATION_MS)

    return () => clearTimeout(timeoutId)
  }, [stepIndex, onComplete, playSound])

  const value = STEPS[stepIndex]
  const isGo = value === 'GO!'

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          className={styles.value}
          data-go={isGo || undefined}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: isGo ? 1.15 : 1, opacity: 1 }}
          exit={{ scale: isGo ? 1.3 : 1.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
