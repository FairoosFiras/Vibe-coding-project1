import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [phase, setPhase] = useState('inhale') // 'inhale', 'hold', 'exhale'
  const [isStarted, setIsStarted] = useState(false)
  const [countdown, setCountdown] = useState(4)

  const phases = {
    inhale: { duration: 4, text: 'Breathe In', nextPhase: 'hold' },
    hold: { duration: 7, text: 'Hold', nextPhase: 'exhale' },
    exhale: { duration: 8, text: 'Breathe Out', nextPhase: 'inhale' }
  }

  useEffect(() => {
    if (!isStarted) return

    setCountdown(phases[phase].duration)

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhase(phases[phase].nextPhase)
          return phases[phases[phase].nextPhase].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, isStarted])

  const circleVariants = {
    inhale: {
      scale: 1.8,
      boxShadow: '0 0 120px 60px rgba(6, 182, 212, 0.6), 0 0 200px 100px rgba(6, 182, 212, 0.3)',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(8, 145, 178, 0.6) 50%, rgba(6, 78, 102, 0.4) 100%)',
      transition: { duration: 4, ease: 'easeInOut' }
    },
    hold: {
      scale: 1.8,
      boxShadow: '0 0 150px 80px rgba(255, 255, 255, 0.5), 0 0 250px 120px rgba(255, 255, 255, 0.25)',
      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 200, 255, 0.7) 50%, rgba(150, 150, 255, 0.5) 100%)',
      transition: { duration: 0.8, ease: 'easeInOut' }
    },
    exhale: {
      scale: 0.8,
      boxShadow: '0 0 100px 50px rgba(168, 85, 247, 0.6), 0 0 180px 90px rgba(168, 85, 247, 0.3)',
      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(126, 58, 242, 0.6) 50%, rgba(88, 28, 135, 0.4) 100%)',
      transition: { duration: 8, ease: 'easeInOut' }
    }
  }

  const pulseVariants = {
    hold: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const handleStart = () => {
    setIsStarted(true)
    setPhase('inhale')
  }

  const handleStop = () => {
    setIsStarted(false)
    setPhase('inhale')
    setCountdown(4)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Title */}
        <motion.h1
          className="text-9xl font-extralight mb-3 tracking-wide text-white"
          style={{
            textShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Zen Breath
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl mb-20 font-light tracking-widest"
          style={{
            color: 'rgba(203, 213, 225, 0.9)',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.15em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          4 · 7 · 8 BREATHING
        </motion.p>

        {/* Breathing circle */}
        <div className="relative mb-16 flex items-center justify-center" style={{ width: '400px', height: '400px' }}>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
            }}
            variants={circleVariants}
            animate={isStarted ? phase : 'exhale'}
          >
            {phase === 'hold' && isStarted && (
              <motion.div
                className="w-full h-full rounded-full"
                variants={pulseVariants}
                animate="hold"
                style={{
                  boxShadow: '0 0 100px 40px rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
          </motion.div>

          {/* Countdown and instruction text */}
          <div className="absolute flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                className="text-white text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {isStarted && (
                  <>
                    <div className="text-7xl font-light mb-4">{countdown}</div>
                    <div className="text-2xl font-light tracking-wide">{phases[phase].text}</div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Control buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {!isStarted ? (
            <motion.button
              onClick={handleStart}
              className="relative px-24 py-8 text-2xl font-light text-white rounded-full overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                minWidth: '280px',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 tracking-[0.2em] font-normal">BEGIN JOURNEY</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStop}
              className="relative px-24 py-8 text-2xl font-light text-white rounded-full overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                minWidth: '280px',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 tracking-[0.2em] font-normal">PAUSE</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="mt-20 text-center max-w-3xl px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-base uppercase tracking-[0.25em] mb-8 font-light" style={{ color: 'rgba(203, 213, 225, 0.6)' }}>
            The Breathing Pattern
          </p>
          <div className="flex items-center justify-center gap-8">
            <motion.div
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 8px 24px rgba(6, 182, 212, 0.15)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 32px rgba(6, 182, 212, 0.25)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-5xl font-bold text-cyan-300 mb-1">4</div>
              <span className="text-cyan-200 text-lg font-light tracking-wider uppercase">Inhale</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-slate-400 text-3xl font-light"
            >
              →
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 32px rgba(255, 255, 255, 0.25)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-5xl font-bold text-white mb-1">7</div>
              <span className="text-slate-100 text-lg font-light tracking-wider uppercase">Hold</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="text-slate-400 text-3xl font-light"
            >
              →
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.15)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 32px rgba(168, 85, 247, 0.25)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-5xl font-bold text-purple-300 mb-1">8</div>
              <span className="text-purple-200 text-lg font-light tracking-wider uppercase">Exhale</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CSS for blob animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default App
