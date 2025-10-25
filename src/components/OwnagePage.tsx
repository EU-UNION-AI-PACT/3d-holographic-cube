import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function OwnagePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      hue: number
    }> = []

    const createExplosion = (x: number, y: number) => {
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = 2 + Math.random() * 3
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0,
          maxLife: 100 + Math.random() * 100,
          size: 2 + Math.random() * 3,
          hue: 180 + Math.random() * 60
        })
      }
    }

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time++

      if (time % 60 === 0) {
        createExplosion(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.life++

        const alpha = 1 - p.life / p.maxLife
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4 }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full space-y-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.2
            }}
          >
            <Card className="neon-border bg-card/80 backdrop-blur-xl p-12 text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-bold neon-glow mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Sei mal ehrlich
              </motion.h1>

              <motion.div
                className="text-5xl md:text-7xl font-bold mb-12"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  Wo ownd der?
                </span>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    className="p-6 bg-primary/10 rounded-lg border border-primary/30"
                    whileHover={{ scale: 1.05, borderColor: 'oklch(0.75 0.15 195)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-2">🌟</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Im Geist</h3>
                    <p className="text-sm text-muted-foreground">
                      Wo Gedanken zu Sternen werden
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-accent/10 rounded-lg border border-accent/30"
                    whileHover={{ scale: 1.05, borderColor: 'oklch(0.70 0.25 330)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-2">💎</div>
                    <h3 className="text-xl font-semibold text-accent mb-2">Im Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Wo Algorithmen zu Kunst werden
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-primary/10 rounded-lg border border-primary/30"
                    whileHover={{ scale: 1.05, borderColor: 'oklch(0.75 0.15 195)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-2">✨</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Im Herzen</h3>
                    <p className="text-sm text-muted-foreground">
                      Wo Leidenschaft zu Vision wird
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="p-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-xl border-2 border-accent/40 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                >
                  <p className="text-2xl md:text-3xl font-semibold text-accent italic mb-4">
                    "Überall, wo Innovation auf Menschlichkeit trifft"
                  </p>
                  <p className="text-lg text-muted-foreground">
                    In der Verschmelzung von Technologie, Spiritualität und Vision liegt die wahre Herrschaft
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                >
                  {['Kreativität', 'Innovation', 'Weisheit', 'Harmonie'].map((word, index) => (
                    <motion.div
                      key={word}
                      className="p-4 bg-card/60 rounded-lg border border-border text-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 + index * 0.1 }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'oklch(0.35 0.08 250)',
                        borderColor: 'oklch(0.75 0.15 195)'
                      }}
                    >
                      <span className="text-sm font-semibold">{word}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <Card className="bg-card/60 backdrop-blur-md border-primary/20 p-6">
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span>Daniel Pohl · EU-UNION Expert</span>
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span>EX2025D1218310</span>
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
