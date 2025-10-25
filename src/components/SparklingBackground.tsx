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

    const stars: { x: number; y: number; size: number; brightness: number; twinkle: number }[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random(),
        twinkle: Math.random() * Math.PI * 2
      })
    }

    const drawGradientBackground = (time: number) => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      )
      gradient.addColorStop(0, 'oklch(0.08 0.05 260)')
      gradient.addColorStop(0.5, 'oklch(0.05 0.08 265)')
      gradient.addColorStop(1, 'oklch(0.02 0.03 270)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        const twinkle = (Math.sin(time * 2 + star.twinkle) + 1) / 2
        const brightness = star.brightness * twinkle
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        if (star.size > 1) {
          ctx.fillStyle = `rgba(200, 220, 255, ${brightness * 0.4})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      })
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
    let startTime = performance.now()

    const animate = () => {
      const currentTime = (performance.now() - startTime) * 0.001
      drawGradientBackground(currentTime)

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
