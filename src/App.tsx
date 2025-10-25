import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import HolographicCube from '@/components/HolographicCube'
import CertificatePage from '@/components/CertificatePage'
import OwnagePage from '@/components/OwnagePage'
import SparklingBackground from '@/components/SparklingBackground'
import OnboardingOverlay from '@/components/OnboardingOverlay'
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
  Lightbulb,
  Crown
} from '@phosphor-icons/react'

function App() {
  const [activePanel, setActivePanel] = useKV<string | null>('active-panel', null)
  const [autoRotate, setAutoRotate] = useKV<boolean>('auto-rotate', true)
  const [animationSpeed, setAnimationSpeed] = useKV<number>('animation-speed', 5)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCertificate, setShowCertificate] = useKV<boolean>('show-certificate', false)
  const [showOwnage, setShowOwnage] = useKV<boolean>('show-ownage', false)
  const [lampOn, setLampOn] = useKV<boolean>('lamp-on', true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useKV<boolean>('has-seen-onboarding', false)

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

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {!hasSeenOnboarding && (
        <OnboardingOverlay onComplete={handleOnboardingComplete} />
      )}
      
      <SparklingBackground />
      
      <AnimatePresence mode="wait">
        {!showCertificate && !showOwnage && (
          <motion.div
            key="cube"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}

        {showCertificate && !showOwnage && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 overflow-y-auto"
          >
            <CertificatePage />
          </motion.div>
        )}

        {showOwnage && (
          <motion.div
            key="ownage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 overflow-y-auto"
          >
            <OwnagePage />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-bold neon-glow text-center tracking-tight px-4 transition-all duration-500">
          {showOwnage ? 'WO OWND DER?' : showCertificate ? 'EU-UNION CERTIFICATE' : 'COSMIC STAR'}
        </h1>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2 flex-wrap justify-end max-w-[calc(100vw-3rem)]">
        <Button
          onClick={() => setLampOn(!lampOn)}
          variant="outline"
          size="icon"
          className={`bg-card/80 backdrop-blur-md border-primary/30 transition-all duration-300 hover:scale-105 ${lampOn ? 'text-pink-500 border-pink-500/50 shadow-lg shadow-pink-500/20' : 'hover:border-primary/50'}`}
        >
          <Lightbulb weight={lampOn ? 'fill' : 'regular'} className="transition-transform duration-300" />
        </Button>
        <Button
          onClick={() => {
            setShowOwnage(!showOwnage)
            if (!showOwnage) setShowCertificate(false)
          }}
          variant="outline"
          size="icon"
          className={`bg-card/80 backdrop-blur-md border-primary/30 transition-all duration-300 hover:scale-105 ${showOwnage ? 'text-accent border-accent/50 shadow-lg shadow-accent/20' : 'hover:border-primary/50'}`}
        >
          <Crown weight={showOwnage ? 'fill' : 'bold'} className="transition-transform duration-300" />
        </Button>
        <Button
          onClick={() => {
            setShowCertificate(!showCertificate)
            if (!showCertificate) setShowOwnage(false)
          }}
          variant="outline"
          size="icon"
          className={`bg-card/80 backdrop-blur-md border-primary/30 transition-all duration-300 hover:scale-105 ${showCertificate ? 'text-primary border-primary/50 shadow-lg shadow-primary/20' : 'hover:border-primary/50'}`}
        >
          {showCertificate ? <Star weight="bold" className="transition-transform duration-300" /> : <Certificate weight="bold" className="transition-transform duration-300" />}
        </Button>
      </div>

      <Card className="absolute bottom-6 left-6 p-6 neon-border bg-card/80 backdrop-blur-md z-10 w-80 max-w-[calc(100vw-3rem)] shadow-2xl transition-all duration-300 hover:shadow-primary/20">
        <div className="space-y-6">
          {!showCertificate && !showOwnage && (
            <>
              <div>
                <h2 className="text-lg font-semibold mb-4 text-primary">Panel Controls</h2>
                <div className="grid grid-cols-3 gap-2">
                  <div />
                  <Button
                    variant={activePanel === 'top' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('top')}
                    className={`transition-all duration-200 hover:scale-105 ${activePanel === 'top' ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30' : 'hover:border-accent/50'}`}
                  >
                    <CaretUp weight="bold" />
                  </Button>
                  <div />
                  
                  <Button
                    variant={activePanel === 'left' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('left')}
                    className={`transition-all duration-200 hover:scale-105 ${activePanel === 'left' ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30' : 'hover:border-accent/50'}`}
                  >
                    <CaretLeft weight="bold" />
                  </Button>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                  </div>
                  <Button
                    variant={activePanel === 'right' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('right')}
                    className={`transition-all duration-200 hover:scale-105 ${activePanel === 'right' ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30' : 'hover:border-accent/50'}`}
                  >
                    <CaretRight weight="bold" />
                  </Button>
                  
                  <div />
                  <Button
                    variant={activePanel === 'bottom' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => togglePanel('bottom')}
                    className={`transition-all duration-200 hover:scale-105 ${activePanel === 'bottom' ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30' : 'hover:border-accent/50'}`}
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
                  className="w-full transition-all duration-200 hover:scale-105"
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
                  <div className="text-xs text-muted-foreground mt-1 text-right font-mono">
                    {animationSpeed ?? 5}x
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                  <Label htmlFor="auto-rotate" className="text-sm cursor-pointer">
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
                  className="flex-1 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  size="sm"
                >
                  {isAnimating ? <Pause weight="fill" className="animate-pulse" /> : <Play weight="fill" />}
                  <span className="ml-2">Sequence</span>
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="icon"
                  className="transition-all duration-200 hover:scale-105 hover:border-primary/50"
                >
                  <ArrowsClockwise weight="bold" />
                </Button>
              </div>
            </>
          )}

          {showCertificate && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110">
                <Certificate weight="bold" className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Viewing EU-UNION Certificate
              </p>
              <Button
                onClick={() => setShowCertificate(false)}
                variant="outline"
                className="w-full transition-all duration-200 hover:scale-105"
              >
                <Star weight="bold" className="mr-2" />
                Back to Star
              </Button>
            </div>
          )}

          {showOwnage && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center shadow-lg shadow-accent/30 transition-all duration-300 hover:scale-110">
                <Crown weight="bold" className="w-8 h-8 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                Wo ownd der?
              </p>
              <Button
                onClick={() => setShowOwnage(false)}
                variant="outline"
                className="w-full transition-all duration-200 hover:scale-105"
              >
                <Star weight="bold" className="mr-2" />
                Back to Star
              </Button>
            </div>
          )}
        </div>
      </Card>

      {!showCertificate && !showOwnage && (
        <Card className="absolute bottom-6 right-6 p-4 neon-border bg-card/80 backdrop-blur-md z-10 shadow-lg transition-all duration-300 hover:shadow-primary/20">
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 transition-colors duration-200 hover:text-foreground">
              <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center gap-2 transition-colors duration-200 hover:text-foreground">
              <div className="w-2 h-2 rounded-full bg-accent shadow-sm shadow-accent/50" />
              <span>Scroll to zoom</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default App