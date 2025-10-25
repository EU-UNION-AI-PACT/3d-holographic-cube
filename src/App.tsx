import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import HolographicCube from '@/components/HolographicCube'
import CertificatePage from '@/components/CertificatePage'
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
  Pause,
  Certificate,
  Star,
  Lightbulb
} from '@phosphor-icons/react'

function App() {
  const [activePanel, setActivePanel] = useKV<string | null>('active-panel', null)
  const [autoRotate, setAutoRotate] = useKV<boolean>('auto-rotate', true)
  const [animationSpeed, setAnimationSpeed] = useKV<number>('animation-speed', 5)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCertificate, setShowCertificate] = useKV<boolean>('show-certificate', false)
  const [lampOn, setLampOn] = useKV<boolean>('lamp-on', true)

  const leftOpen = activePanel === 'left' ? 1 : 0
  const rightOpen = activePanel === 'right' ? 1 : 0
  const topOpen = activePanel === 'top' ? 1 : 0
  const bottomOpen = activePanel === 'bottom' ? 1 : 0

  const togglePanel = (panel: 'left' | 'right' | 'top' | 'bottom') => {
    setActivePanel((current) => current === panel ? null : panel)
  }

  const closeAll = () => {
    setActivePanel(null)
  }

  const reset = () => {
    closeAll()
    setAutoRotate(true)
    setAnimationSpeed(5)
  }

  const sequenceAnimation = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setActivePanel(null)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setActivePanel('left')
    await new Promise(resolve => setTimeout(resolve, 800))
    setActivePanel('right')
    await new Promise(resolve => setTimeout(resolve, 800))
    setActivePanel('top')
    await new Promise(resolve => setTimeout(resolve, 800))
    setActivePanel('bottom')
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setActivePanel(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAnimating(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {!showCertificate && (
        <HolographicCube
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          topOpen={topOpen}
          bottomOpen={bottomOpen}
          autoRotate={autoRotate ?? true}
          animationSpeed={animationSpeed ?? 5}
          activePanel={activePanel}
          lampOn={lampOn ?? true}
        />
      )}

      {showCertificate && (
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <CertificatePage />
        </div>
      )}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold neon-glow text-center tracking-tight">
          {showCertificate ? 'EU-UNION CERTIFICATE' : 'HOLOGRAPHIC STAR'}
        </h1>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <Button
          onClick={() => setLampOn(!lampOn)}
          variant="outline"
          size="icon"
          className={`bg-card/80 backdrop-blur-md border-primary/30 ${lampOn ? 'text-pink-500 border-pink-500/50' : ''}`}
        >
          <Lightbulb weight={lampOn ? 'fill' : 'regular'} />
        </Button>
        <Button
          onClick={() => setShowCertificate(!showCertificate)}
          variant="outline"
          size="icon"
          className="bg-card/80 backdrop-blur-md border-primary/30"
        >
          {showCertificate ? <Star weight="bold" /> : <Certificate weight="bold" />}
        </Button>
      </div>

      <Card className="absolute bottom-6 left-6 p-6 neon-border bg-card/80 backdrop-blur-md z-10 w-80">
        <div className="space-y-6">
          {!showCertificate && (
            <>
              <div>
                <h2 className="text-lg font-semibold mb-4 text-primary">Panel Controls</h2>
                <div className="grid grid-cols-3 gap-2">
                  <div />
                  <Button
                    variant={activePanel === 'top' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('top')}
                    className={activePanel === 'top' ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    <CaretUp weight="bold" />
                  </Button>
                  <div />
                  
                  <Button
                    variant={activePanel === 'left' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('left')}
                    className={activePanel === 'left' ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    <CaretLeft weight="bold" />
                  </Button>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <Button
                    variant={activePanel === 'right' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('right')}
                    className={activePanel === 'right' ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    <CaretRight weight="bold" />
                  </Button>
                  
                  <div />
                  <Button
                    variant={activePanel === 'bottom' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('bottom')}
                    className={activePanel === 'bottom' ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    <CaretDown weight="bold" />
                  </Button>
                  <div />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={closeAll} 
                  variant="secondary" 
                  className="w-full"
                  size="sm"
                >
                  Close All
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm mb-2 block">Animation Speed</Label>
                  <Slider
                    value={[animationSpeed ?? 5]}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {animationSpeed ?? 5}
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
            </>
          )}

          {showCertificate && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Certificate weight="bold" className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Viewing EU-UNION Certificate
              </p>
              <Button
                onClick={() => setShowCertificate(false)}
                variant="outline"
                className="w-full"
              >
                <Star weight="bold" className="mr-2" />
                Back to Star
              </Button>
            </div>
          )}
        </div>
      </Card>

      {!showCertificate && (
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
      )}
    </div>
  )
}

export default App