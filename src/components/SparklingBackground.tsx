import { useEffect, useRef } from 'react'

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  color: 'gold' | 'silver'
  trail: { x: number; y: number; opacity: number }[]
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

    const shootingStars: ShootingStar[] = []
    const maxStars = 50

    const createShootingStar = () => {
      const isGold = Math.random() > 0.5
      return {
        x: Math.random() * canvas.width,
        y: -20,
        length: Math.random() * 30 + 20,
        speed: Math.random() * 3 + 4,
        opacity: Math.random() * 0.5 + 0.5,
        color: isGold ? 'gold' : 'silver',
        trail: []
      } as ShootingStar
    }

    for (let i = 0; i < maxStars; i++) {
      const star = createShootingStar()
      star.y = Math.random() * canvas.height
      shootingStars.push(star)
    }

    const drawGradientBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'oklch(0.25 0.15 280)')
      gradient.addColorStop(0.5, 'oklch(0.20 0.18 270)')
      gradient.addColorStop(1, 'oklch(0.15 0.12 260)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawShootingStar = (star: ShootingStar) => {
      const goldColors = {
        main: `rgba(255, 215, 0, ${star.opacity})`,
        glow: `rgba(255, 223, 100, ${star.opacity * 0.6})`,
        trail: `rgba(255, 200, 50, ${star.opacity * 0.3})`
      }
      
      const silverColors = {
        main: `rgba(220, 220, 255, ${star.opacity})`,
        glow: `rgba(200, 200, 255, ${star.opacity * 0.6})`,
        trail: `rgba(180, 180, 240, ${star.opacity * 0.3})`
      }
      
      const colors = star.color === 'gold' ? goldColors : silverColors

      ctx.save()
      
      ctx.shadowBlur = 20
      ctx.shadowColor = colors.glow
      
      const gradient = ctx.createLinearGradient(
        star.x, 
        star.y, 
        star.x, 
        star.y - star.length
      )
      gradient.addColorStop(0, colors.main)
      gradient.addColorStop(0.3, colors.glow)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      
      ctx.beginPath()
      ctx.moveTo(star.x, star.y)
      ctx.lineTo(star.x, star.y - star.length)
      ctx.stroke()

      ctx.shadowBlur = 15
      ctx.fillStyle = colors.main
      ctx.beginPath()
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
      ctx.fill()

      star.trail.forEach((point, index) => {
        const trailOpacity = point.opacity * (1 - index / star.trail.length)
        ctx.fillStyle = star.color === 'gold' 
          ? `rgba(255, 215, 0, ${trailOpacity * 0.3})`
          : `rgba(220, 220, 255, ${trailOpacity * 0.3})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.restore()
    }

    let animationId: number

    const animate = () => {
      drawGradientBackground()

      shootingStars.forEach((star, index) => {
        star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity })
        if (star.trail.length > 15) {
          star.trail.pop()
        }

        star.y += star.speed
        star.x += Math.sin(star.y * 0.01) * 0.5

        if (star.y > canvas.height + 20) {
          shootingStars[index] = createShootingStar()
        }

        drawShootingStar(star)
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
