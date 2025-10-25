import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface HolographicCubeProps {
  leftOpen: number
  rightOpen: number
  topOpen: number
  bottomOpen: number
  autoRotate: boolean
  animationSpeed: number
}

const GOLDEN_RATIO = 1.618033988749

export default function HolographicCube({
  leftOpen,
  rightOpen,
  topOpen,
  bottomOpen,
  autoRotate,
  animationSpeed
}: HolographicCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const panelsRef = useRef<{
    left: THREE.Group | null
    right: THREE.Group | null
    top: THREE.Group | null
    bottom: THREE.Group | null
  }>({ left: null, right: null, top: null, bottom: null })
  const animationStateRef = useRef({ leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed })

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    )
    camera.position.z = 5
    camera.position.y = 2
    camera.position.x = 2
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(1280, 1280)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    const ambientLight = new THREE.AmbientLight(0x00ffff, 1.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 100)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff00ff, 3, 100)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0x00ff99, 2.5, 100)
    pointLight3.position.set(0, 5, -5)
    scene.add(pointLight3)

    const pointLight4 = new THREE.PointLight(0xffff00, 2.5, 100)
    pointLight4.position.set(0, -5, 5)
    scene.add(pointLight4)

    const createNeonMaterial = (color: number, opacity: number = 0.25) => {
      return new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        metalness: 0.5,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 2.5
      })
    }

    const createGlowingEdge = (color: number = 0x00ffff) => {
      return new THREE.LineBasicMaterial({
        color: color,
        linewidth: 3,
        transparent: true,
        opacity: 1.0
      })
    }

    const cubeSize = 2

    const leftGroup = new THREE.Group()
    const leftGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const leftMesh = new THREE.Mesh(leftGeometry, createNeonMaterial(0x00ffff))
    const leftEdges = new THREE.EdgesGeometry(leftGeometry)
    const leftLine = new THREE.LineSegments(leftEdges, createGlowingEdge(0x00ffff))
    leftGroup.add(leftMesh)
    leftGroup.add(leftLine)
    leftGroup.position.x = -cubeSize / 2
    leftGroup.rotation.y = Math.PI / 2
    scene.add(leftGroup)
    panelsRef.current.left = leftGroup

    const rightGroup = new THREE.Group()
    const rightGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const rightMesh = new THREE.Mesh(rightGeometry, createNeonMaterial(0x00ffff))
    const rightEdges = new THREE.EdgesGeometry(rightGeometry)
    const rightLine = new THREE.LineSegments(rightEdges, createGlowingEdge(0x00ffff))
    rightGroup.add(rightMesh)
    rightGroup.add(rightLine)
    rightGroup.position.x = cubeSize / 2
    rightGroup.rotation.y = -Math.PI / 2
    scene.add(rightGroup)
    panelsRef.current.right = rightGroup

    const topGroup = new THREE.Group()
    const topGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const topMesh = new THREE.Mesh(topGeometry, createNeonMaterial(0xff00ff))
    const topEdges = new THREE.EdgesGeometry(topGeometry)
    const topLine = new THREE.LineSegments(topEdges, createGlowingEdge(0xff00ff))
    topGroup.add(topMesh)
    topGroup.add(topLine)
    topGroup.position.y = cubeSize / 2
    topGroup.rotation.x = -Math.PI / 2
    scene.add(topGroup)
    panelsRef.current.top = topGroup

    const bottomGroup = new THREE.Group()
    const bottomGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const bottomMesh = new THREE.Mesh(bottomGeometry, createNeonMaterial(0xff00ff))
    const bottomEdges = new THREE.EdgesGeometry(bottomGeometry)
    const bottomLine = new THREE.LineSegments(bottomEdges, createGlowingEdge(0xff00ff))
    bottomGroup.add(bottomMesh)
    bottomGroup.add(bottomLine)
    bottomGroup.position.y = -cubeSize / 2
    bottomGroup.rotation.x = Math.PI / 2
    scene.add(bottomGroup)
    panelsRef.current.bottom = bottomGroup

    const frontGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const frontMesh = new THREE.Mesh(frontGeometry, createNeonMaterial(0x00ff99, 0.1))
    const frontEdges = new THREE.EdgesGeometry(frontGeometry)
    const frontLine = new THREE.LineSegments(frontEdges, createGlowingEdge(0x00ff99))
    frontMesh.position.z = cubeSize / 2
    frontLine.position.z = cubeSize / 2
    scene.add(frontMesh)
    scene.add(frontLine)

    const backGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
    const backMesh = new THREE.Mesh(backGeometry, createNeonMaterial(0x00ff99, 0.1))
    const backEdges = new THREE.EdgesGeometry(backGeometry)
    const backLine = new THREE.LineSegments(backEdges, createGlowingEdge(0x00ff99))
    backMesh.position.z = -cubeSize / 2
    backLine.position.z = -cubeSize / 2
    backMesh.rotation.y = Math.PI
    backLine.rotation.y = Math.PI
    scene.add(backMesh)
    scene.add(backLine)

    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.95
      })
    )
    scene.add(centerSphere)

    const sphereGlow = new THREE.PointLight(0xffff00, 4, 10)
    sphereGlow.position.set(0, 0, 0)
    scene.add(sphereGlow)

    const particles = new THREE.Group()
    const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8)
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    })

    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      particle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      particles.add(particle)
    }
    scene.add(particles)

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = 1
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(1280, 1280)
    }

    window.addEventListener('resize', handleResize)

    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      const { leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed } = animationStateRef.current
      const speed = animationSpeed / 100

      if (panelsRef.current.left) {
        const targetRotation = leftOpen * Math.PI / 2
        panelsRef.current.left.rotation.y = THREE.MathUtils.lerp(
          panelsRef.current.left.rotation.y,
          Math.PI / 2 + targetRotation,
          speed
        )
      }

      if (panelsRef.current.right) {
        const targetRotation = rightOpen * Math.PI / 2
        panelsRef.current.right.rotation.y = THREE.MathUtils.lerp(
          panelsRef.current.right.rotation.y,
          -Math.PI / 2 - targetRotation,
          speed
        )
      }

      if (panelsRef.current.top) {
        const targetRotation = topOpen * Math.PI / 2
        panelsRef.current.top.rotation.x = THREE.MathUtils.lerp(
          panelsRef.current.top.rotation.x,
          -Math.PI / 2 - targetRotation,
          speed
        )
      }

      if (panelsRef.current.bottom) {
        const targetRotation = bottomOpen * Math.PI / 2
        panelsRef.current.bottom.rotation.x = THREE.MathUtils.lerp(
          panelsRef.current.bottom.rotation.x,
          Math.PI / 2 + targetRotation,
          speed
        )
      }

      particles.rotation.y += 0.001
      centerSphere.rotation.y += 0.02

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  useEffect(() => {
    animationStateRef.current = { leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed }
  }, [leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed])

  return (
    <div 
      ref={containerRef} 
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ 
        touchAction: 'none',
        width: '1280px',
        height: '1280px'
      }}
    />
  )
}
