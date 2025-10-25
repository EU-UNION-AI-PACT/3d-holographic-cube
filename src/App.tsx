import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import HolographicCube from '@/components/HolographicCube'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  CaretLeft, 
  CaretRight, 
  CaretUp, 
  CaretDown,
  ArrowsClockwise,
  Play,
  Pause
} from '@phosphor-icons/react'

function App() {
  const [leftOpen, setLeftOpen] = useKV('panel-left', 0)
  const [rightOpen, setRightOpen] = useKV('panel-right', 0)
  const [topOpen, setTopOpen] = useKV('panel-top', 0)
  const [bottomOpen, setBottomOpen] = useKV('panel-bottom', 0)
  const [autoRotate, setAutoRotate] = useKV('auto-rotate', true)
  const [animationSpeed, setAnimationSpeed] = useKV('animation-speed', 5)
  const [isAnimating, setIsAnimating] = useState(false)

  const togglePanel = (panel: 'left' | 'right' | 'top' | 'bottom') => {
    const setters = {
      left: setLeftOpen,
      right: setRightOpen,
      top: setTopOpen,
      bottom: setBottomOpen
    }
    const values = {
      left: leftOpen,
      right: rightOpen,
      top: topOpen,
      bottom: bottomOpen
    }
    
    setters[panel]((current: number) => current === 0 ? 1 : 0)
  }

  const openAll = () => {
    setLeftOpen(1)
    setRightOpen(1)
    setTopOpen(1)
    setBottomOpen(1)
  }

  const closeAll = () => {
    setLeftOpen(0)
    setRightOpen(0)
    setTopOpen(0)
    setBottomOpen(0)
  }

  const reset = () => {
    closeAll()
    setAutoRotate(true)
    setAnimationSpeed(5)
  }

  const sequenceAnimation = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    closeAll()
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setLeftOpen(1)
    await new Promise(resolve => setTimeout(resolve, 300))
    setRightOpen(1)
    await new Promise(resolve => setTimeout(resolve, 300))
    setTopOpen(1)
    await new Promise(resolve => setTimeout(resolve, 300))
    setBottomOpen(1)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    closeAll()
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAnimating(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <HolographicCube
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        topOpen={topOpen}
        bottomOpen={bottomOpen}
        autoRotate={autoRotate}
        animationSpeed={animationSpeed}
      />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold neon-glow text-center tracking-tight">
          HOLOGRAPHIC CUBE
        </h1>
      </div>

      <Card className="absolute bottom-6 left-6 p-6 neon-border bg-card/80 backdrop-blur-md z-10 w-80">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-primary">Panel Controls</h2>
            <div className="grid grid-cols-3 gap-2">
              <div />
              <Button
                variant={topOpen > 0 ? 'default' : 'outline'}
                size="icon"
                onClick={() => togglePanel('top')}
                className={topOpen > 0 ? 'bg-accent hover:bg-accent/90' : ''}
              >
                <CaretUp weight="bold" />
              </Button>
              <div />
              
              <Button
                variant={leftOpen > 0 ? 'default' : 'outline'}
                size="icon"
                onClick={() => togglePanel('left')}
                className={leftOpen > 0 ? 'bg-accent hover:bg-accent/90' : ''}
              >
                <CaretLeft weight="bold" />
              </Button>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
              <Button
                variant={rightOpen > 0 ? 'default' : 'outline'}
                size="icon"
                onClick={() => togglePanel('right')}
                className={rightOpen > 0 ? 'bg-accent hover:bg-accent/90' : ''}
              >
                <CaretRight weight="bold" />
              </Button>
              
              <div />
              <Button
                variant={bottomOpen > 0 ? 'default' : 'outline'}
                size="icon"
                onClick={() => togglePanel('bottom')}
                className={bottomOpen > 0 ? 'bg-accent hover:bg-accent/90' : ''}
              >
                <CaretDown weight="bold" />
              </Button>
              <div />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={openAll} 
              variant="secondary" 
              className="flex-1"
              size="sm"
            >
              Open All
            </Button>
            <Button 
              onClick={closeAll} 
              variant="secondary" 
              className="flex-1"
              size="sm"
            >
              Close All
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm mb-2 block">Animation Speed</Label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {animationSpeed}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-rotate" className="text-sm">
                Auto Rotate
              </Label>
              <Switch
                id="auto-rotate"
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button
              onClick={sequenceAnimation}
              disabled={isAnimating}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              {isAnimating ? <Pause weight="fill" /> : <Play weight="fill" />}
              <span className="ml-2">Sequence</span>
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="icon"
            >
              <ArrowsClockwise weight="bold" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="absolute bottom-6 right-6 p-4 neon-border bg-card/80 backdrop-blur-md z-10">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Scroll to zoom</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default App