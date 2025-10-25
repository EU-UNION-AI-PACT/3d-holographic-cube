import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Star, 
  Hand, 
  Lightning, 
  Certificate,
  Lightbulb,
  X
} from '@phosphor-icons/react'

interface OnboardingOverlayProps {
  onComplete: () => void
}

const steps = [
  {
    icon: Star,
    title: 'Welcome to Holographic Star',
    description: 'Experience an interactive 3D holographic cube with opening panels and stunning visual effects.',
    highlight: null
  },
  {
    icon: Hand,
    title: 'Control the Panels',
    description: 'Use the directional buttons to open and close each side of the star. Watch them unfold with golden ratio precision.',
    highlight: 'controls'
  },
  {
    icon: Lightning,
    title: 'Customize the Experience',
    description: 'Adjust animation speed, enable auto-rotation, or play the sequence animation to see all panels in action.',
    highlight: 'settings'
  },
  {
    icon: Lightbulb,
    title: 'Toggle the Lamp',
    description: 'Turn the magical lamp on or off to see prismatic light rays emanating from the center.',
    highlight: 'lamp'
  },
  {
    icon: Certificate,
    title: 'View the Certificate',
    description: 'Switch to certificate view to see the EU-UNION holographic certificate with sacred geometry.',
    highlight: 'certificate'
  }
]

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              initial={{
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                opacity: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <Button
          onClick={handleSkip}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
        >
          <X weight="bold" />
        </Button>

        <div className="relative max-w-lg w-full mx-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="neon-border bg-card/90 backdrop-blur-xl p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.1 
                    }}
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center neon-border"
                  >
                    <Icon weight="bold" className="w-10 h-10 text-primary" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold neon-glow">
                      {currentStepData.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentStepData.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentStep 
                            ? 'w-8 bg-primary' 
                            : index < currentStep 
                            ? 'w-4 bg-primary/50' 
                            : 'w-4 bg-muted'
                        }`}
                        layoutId={`step-${index}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3 w-full pt-2">
                    {currentStep > 0 && (
                      <Button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
                    </Button>
                  </div>

                  <button
                    onClick={handleSkip}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip tutorial
                  </button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {currentStepData.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              left: currentStepData.highlight === 'controls' ? '1.5rem' : 
                    currentStepData.highlight === 'lamp' ? 'auto' : 
                    currentStepData.highlight === 'certificate' ? 'auto' : '1.5rem',
              right: currentStepData.highlight === 'lamp' || currentStepData.highlight === 'certificate' ? '1.5rem' : 'auto',
              top: currentStepData.highlight === 'lamp' || currentStepData.highlight === 'certificate' ? '1.5rem' : 'auto',
              bottom: currentStepData.highlight === 'controls' || currentStepData.highlight === 'settings' ? '1.5rem' : 'auto'
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(var(--primary-rgb), 0.5)',
                  '0 0 0 10px rgba(var(--primary-rgb), 0)',
                  '0 0 0 0 rgba(var(--primary-rgb), 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="rounded-lg border-2 border-primary/50"
              style={{
                width: currentStepData.highlight === 'lamp' || currentStepData.highlight === 'certificate' ? '120px' : '320px',
                height: currentStepData.highlight === 'lamp' || currentStepData.highlight === 'certificate' ? '60px' : '400px'
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
