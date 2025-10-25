import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  fadeDirection: number
  type: 'star' | 'crystal' | 'pearl'
  rotation: number
  rotationSpeed: number
}

export default function SparklingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: Particle[] = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
        type: ['star', 'crystal', 'pearl'][Math.floor(Math.random() * 3)] as 'star' | 'crystal' | 'pearl',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      })
    }

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const radius = i % 2 === 0 ? size : size / 2
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.closePath()
      ctx.fill()
      
      ctx.restore()
    }

    const drawCrystal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(size * 0.6, 0)
      ctx.lineTo(0, size)
      ctx.lineTo(-size * 0.6, 0)
      ctx.closePath()
      ctx.fill()
      
      ctx.restore()
    }

    const drawPearl = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const gradient = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      gradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.6)')
      gradient.addColorStop(1, 'rgba(180, 200, 255, 0.3)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        particle.opacity += particle.fadeDirection * 0.01
        if (particle.opacity >= 1) {
          particle.fadeDirection = -1
        } else if (particle.opacity <= 0.2) {
          particle.fadeDirection = 1
        }

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        if (particle.type === 'star') {
          ctx.fillStyle = `rgba(100, 200, 255, ${particle.opacity})`
          ctx.shadowBlur = 10
          ctx.shadowColor = `rgba(100, 200, 255, ${particle.opacity})`
          drawStar(ctx, particle.x, particle.y, particle.size, particle.rotation)
          ctx.shadowBlur = 0
        } else if (particle.type === 'crystal') {
          ctx.fillStyle = `rgba(200, 150, 255, ${particle.opacity})`
          ctx.shadowBlur = 8
          ctx.shadowColor = `rgba(200, 150, 255, ${particle.opacity})`
          drawCrystal(ctx, particle.x, particle.y, particle.size, particle.rotation)
          ctx.shadowBlur = 0
        } else {
          drawPearl(ctx, particle.x, particle.y, particle.size)
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
