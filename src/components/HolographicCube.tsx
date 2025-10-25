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
  activePanel?: string | null
  lampOn?: boolean
}

const GOLDEN_RATIO = 1.618033988749

export default function HolographicCube({
  leftOpen,
  rightOpen,
  topOpen,
  bottomOpen,
  autoRotate,
  animationSpeed,
  activePanel,
  lampOn = true
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
  const edgeLinesRef = useRef<THREE.LineSegments[]>([])
  const animationStateRef = useRef({ leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed })
  const defaultCameraPosition = useRef({ x: 3, y: 3, z: 8 })
  const targetCameraPosition = useRef({ x: 3, y: 3, z: 8 })
  const targetCameraTarget = useRef({ x: 0, y: 0, z: 0 })
  const lampGroupRef = useRef<THREE.Group | null>(null)
  const lampGlowRef = useRef<THREE.PointLight | null>(null)
  const lampTopRef = useRef<THREE.Mesh | null>(null)
  const pinkGlowRef = useRef<THREE.Mesh | null>(null)
  const waterParticlesRef = useRef<THREE.Points[]>([])
  const kabbalahTreeRef = useRef<THREE.Group | null>(null)
  const prismaticRaysRef = useRef<THREE.Mesh[]>([])

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
    camera.position.z = 8
    camera.position.y = 3
    camera.position.x = 3
    cameraRef.current = camera
    
    defaultCameraPosition.current = { x: 3, y: 3, z: 8 }

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

    const ambientLight = new THREE.AmbientLight(0x8899ff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(10, 10, 10)
    scene.add(mainLight)

    const rimLight1 = new THREE.PointLight(0x4488ff, 0.8, 50)
    rimLight1.position.set(-8, 3, -5)
    scene.add(rimLight1)

    const rimLight2 = new THREE.PointLight(0x88aaff, 0.6, 50)
    rimLight2.position.set(8, -3, 5)
    scene.add(rimLight2)

    const createRealisticMaterial = (color: number, opacity: number = 0.35) => {
      return new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        reflectivity: 1,
        envMapIntensity: 1.2
      })
    }

    const createGlowingEdge = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }
          
          void main() {
            vec3 silverBase = vec3(0.85, 0.87, 0.92);
            vec3 silverHighlight = vec3(1.0, 1.0, 1.0);
            
            float sparkle1 = sin(vPosition.x * 50.0 + time * 8.0) * 0.5 + 0.5;
            float sparkle2 = sin(vPosition.y * 60.0 + time * 10.0) * 0.5 + 0.5;
            float sparkle3 = sin(vPosition.z * 55.0 + time * 12.0) * 0.5 + 0.5;
            
            float noise1 = random(vPosition.xy + time * 0.5);
            float noise2 = random(vPosition.yz + time * 0.7);
            float noise3 = random(vPosition.zx + time * 0.3);
            
            float crystalSparkle = (noise1 * noise2 * noise3) > 0.85 ? 1.0 : 0.0;
            float shimmer = sparkle1 * sparkle2 * sparkle3;
            
            float pulse = sin(time * 3.0) * 0.4 + 0.6;
            
            vec3 finalColor = mix(silverBase, silverHighlight, shimmer * pulse);
            finalColor += silverHighlight * crystalSparkle * 0.8;
            
            float glow = pulse * 1.2;
            finalColor *= glow;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        transparent: true,
        linewidth: 4
      })
    }

    const createStarShape = () => {
      const shape = new THREE.Shape()
      const outerRadius = 3
      const innerRadius = outerRadius * 0.4
      const points = 5
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / points - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        if (i === 0) {
          shape.moveTo(x, y)
        } else {
          shape.lineTo(x, y)
        }
      }
      shape.closePath()
      return shape
    }

    const starShape = createStarShape()
    const starSize = 4.5

    const leftGroup = new THREE.Group()
    const leftGeometry = new THREE.ShapeGeometry(starShape)
    const leftMesh = new THREE.Mesh(leftGeometry, createRealisticMaterial(0xaaccff))
    const leftEdges = new THREE.EdgesGeometry(leftGeometry)
    const leftLineMaterial = createGlowingEdge()
    const leftLine = new THREE.LineSegments(leftEdges, leftLineMaterial)
    leftGroup.add(leftMesh)
    leftGroup.add(leftLine)
    leftGroup.position.x = -starSize / 2
    leftGroup.rotation.y = Math.PI / 2
    scene.add(leftGroup)
    panelsRef.current.left = leftGroup
    edgeLinesRef.current.push(leftLine)

    const rightGroup = new THREE.Group()
    const rightGeometry = new THREE.ShapeGeometry(starShape)
    const rightMesh = new THREE.Mesh(rightGeometry, createRealisticMaterial(0xaaccff))
    const rightEdges = new THREE.EdgesGeometry(rightGeometry)
    const rightLineMaterial = createGlowingEdge()
    const rightLine = new THREE.LineSegments(rightEdges, rightLineMaterial)
    rightGroup.add(rightMesh)
    rightGroup.add(rightLine)
    rightGroup.position.x = starSize / 2
    rightGroup.rotation.y = -Math.PI / 2
    scene.add(rightGroup)
    panelsRef.current.right = rightGroup
    edgeLinesRef.current.push(rightLine)

    const topGroup = new THREE.Group()
    const topGeometry = new THREE.ShapeGeometry(starShape)
    const topMesh = new THREE.Mesh(topGeometry, createRealisticMaterial(0xccddff))
    const topEdges = new THREE.EdgesGeometry(topGeometry)
    const topLineMaterial = createGlowingEdge()
    const topLine = new THREE.LineSegments(topEdges, topLineMaterial)
    topGroup.add(topMesh)
    topGroup.add(topLine)
    topGroup.position.y = starSize / 2
    topGroup.rotation.x = -Math.PI / 2
    scene.add(topGroup)
    panelsRef.current.top = topGroup
    edgeLinesRef.current.push(topLine)

    const bottomGroup = new THREE.Group()
    const bottomGeometry = new THREE.ShapeGeometry(starShape)
    const bottomMesh = new THREE.Mesh(bottomGeometry, createRealisticMaterial(0xccddff))
    const bottomEdges = new THREE.EdgesGeometry(bottomGeometry)
    const bottomLineMaterial = createGlowingEdge()
    const bottomLine = new THREE.LineSegments(bottomEdges, bottomLineMaterial)
    bottomGroup.add(bottomMesh)
    bottomGroup.add(bottomLine)
    bottomGroup.position.y = -starSize / 2
    bottomGroup.rotation.x = Math.PI / 2
    scene.add(bottomGroup)
    panelsRef.current.bottom = bottomGroup
    edgeLinesRef.current.push(bottomLine)

    const frontGeometry = new THREE.ShapeGeometry(starShape)
    const frontMesh = new THREE.Mesh(frontGeometry, createRealisticMaterial(0xbbeeff, 0.25))
    const frontEdges = new THREE.EdgesGeometry(frontGeometry)
    const frontLineMaterial = createGlowingEdge()
    const frontLine = new THREE.LineSegments(frontEdges, frontLineMaterial)
    frontMesh.position.z = starSize / 2
    frontLine.position.z = starSize / 2
    scene.add(frontMesh)
    scene.add(frontLine)
    edgeLinesRef.current.push(frontLine)

    const backGeometry = new THREE.ShapeGeometry(starShape)
    const backMesh = new THREE.Mesh(backGeometry, createRealisticMaterial(0xbbeeff, 0.25))
    const backEdges = new THREE.EdgesGeometry(backGeometry)
    const backLineMaterial = createGlowingEdge()
    const backLine = new THREE.LineSegments(backEdges, backLineMaterial)
    backMesh.position.z = -starSize / 2
    backLine.position.z = -starSize / 2
    backMesh.rotation.y = Math.PI
    backLine.rotation.y = Math.PI
    scene.add(backMesh)
    scene.add(backLine)
    edgeLinesRef.current.push(backLine)

    if (lampOn) {
      const lampGroup = new THREE.Group()
      lampGroupRef.current = lampGroup
    
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.3, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xFFD700,
        emissiveIntensity: 0.3
      })
    )
    lampBase.position.y = -0.15
    lampGroup.add(lampBase)
    
    const lampNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.25, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.9,
        roughness: 0.1
      })
    )
    lampNeck.position.y = 0.125
    lampGroup.add(lampNeck)
    
    const lampTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xFF1493,
        emissive: 0xFF1493,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.85,
        metalness: 0.3,
        roughness: 0.2
      })
    )
    lampTop.position.y = 0.275
    lampGroup.add(lampTop)
    lampTopRef.current = lampTop
    
    const lampGlow = new THREE.PointLight(0xFF1493, 3, 6)
    lampGlow.position.y = 0.275
    lampGroup.add(lampGlow)
    lampGlowRef.current = lampGlow
    
    const pinkGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xFFC0CB,
        transparent: true,
        opacity: 0.2
      })
    )
    pinkGlow.position.y = 0.275
    lampGroup.add(pinkGlow)
    pinkGlowRef.current = pinkGlow
    
    const createFlowingWaterLines = () => {
      const waterGroup = new THREE.Group()
      const numStreams = 12
      const radius = 0.8
      const height = 2.5
      
      for (let i = 0; i < numStreams; i++) {
        const angle = (i / numStreams) * Math.PI * 2
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            Math.cos(angle) * radius,
            -height / 2,
            Math.sin(angle) * radius
          ),
          new THREE.Vector3(
            Math.cos(angle + 0.3) * (radius * 0.7),
            -height / 4,
            Math.sin(angle + 0.3) * (radius * 0.7)
          ),
          new THREE.Vector3(
            Math.cos(angle - 0.2) * (radius * 0.5),
            0,
            Math.sin(angle - 0.2) * (radius * 0.5)
          ),
          new THREE.Vector3(
            Math.cos(angle + 0.4) * (radius * 0.6),
            height / 4,
            Math.sin(angle + 0.4) * (radius * 0.6)
          ),
          new THREE.Vector3(
            Math.cos(angle) * radius,
            height / 2,
            Math.sin(angle) * radius
          )
        ])
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.005, 8, false)
        const tubeMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 1.5,
          transparent: true,
          opacity: 0.6,
          metalness: 0.8,
          roughness: 0.2,
          transmission: 0.5
        })
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
        waterGroup.add(tube)
        
        const particleCount = 30
        const particlePositions = new Float32Array(particleCount * 3)
        const particleSizes = new Float32Array(particleCount)
        
        for (let j = 0; j < particleCount; j++) {
          const t = j / particleCount
          const point = curve.getPoint(t)
          particlePositions[j * 3] = point.x
          particlePositions[j * 3 + 1] = point.y
          particlePositions[j * 3 + 2] = point.z
          particleSizes[j] = Math.random() * 0.03 + 0.015
        }
        
        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
        
        const particleMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ffff) }
          },
          vertexShader: `
            attribute float size;
            uniform float time;
            varying float vAlpha;
            
            void main() {
              vAlpha = sin(time * 3.0 + position.y * 5.0) * 0.5 + 0.5;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * 100.0 / -mvPosition.z;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            varying float vAlpha;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float alpha = (1.0 - dist * 2.0) * vAlpha;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
        
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
        waterGroup.add(particleSystem)
        waterParticlesRef.current.push(particleSystem)
      }
      
      return waterGroup
    }
    
    const createKabbalahTreeOfLife = () => {
      const treeGroup = new THREE.Group()
      
      const sephirot = [
        { name: 'Kether', pos: new THREE.Vector3(0, 1.2, 0), color: 0xFFFFFF },
        { name: 'Chokmah', pos: new THREE.Vector3(0.4, 0.9, 0), color: 0xFF1493 },
        { name: 'Binah', pos: new THREE.Vector3(-0.4, 0.9, 0), color: 0xFF1493 },
        { name: 'Chesed', pos: new THREE.Vector3(0.4, 0.4, 0), color: 0x00ffff },
        { name: 'Geburah', pos: new THREE.Vector3(-0.4, 0.4, 0), color: 0xFF69B4 },
        { name: 'Tiphareth', pos: new THREE.Vector3(0, 0.6, 0), color: 0xFFD700 },
        { name: 'Netzach', pos: new THREE.Vector3(0.4, -0.1, 0), color: 0x00ff99 },
        { name: 'Hod', pos: new THREE.Vector3(-0.4, -0.1, 0), color: 0x00ffff },
        { name: 'Yesod', pos: new THREE.Vector3(0, -0.3, 0), color: 0xFFC0CB },
        { name: 'Malkuth', pos: new THREE.Vector3(0, -0.8, 0), color: 0xFF1493 }
      ]
      
      const pathConnections = [
        [0, 1], [0, 2], [1, 2], [1, 3], [2, 4],
        [3, 4], [3, 5], [4, 5], [5, 6], [5, 7],
        [6, 7], [6, 8], [7, 8], [8, 9]
      ]
      
      sephirot.forEach(seph => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 16, 16),
          new THREE.MeshPhysicalMaterial({
            color: seph.color,
            emissive: seph.color,
            emissiveIntensity: 1.2,
            transparent: true,
            opacity: 0.75,
            metalness: 0.5,
            roughness: 0.2
          })
        )
        sphere.position.copy(seph.pos)
        treeGroup.add(sphere)
        
        const light = new THREE.PointLight(seph.color, 0.3, 0.8)
        light.position.copy(seph.pos)
        treeGroup.add(light)
      })
      
      pathConnections.forEach(([start, end]) => {
        const points: THREE.Vector3[] = []
        points.push(sephirot[start].pos)
        points.push(sephirot[end].pos)
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({
          color: 0xFFC0CB,
          transparent: true,
          opacity: 0.4,
          linewidth: 1
        })
        
        const line = new THREE.Line(geometry, material)
        treeGroup.add(line)
      })
      
      return treeGroup
    }
    
    const waterLines = createFlowingWaterLines()
    lampGroup.add(waterLines)
    
    const kabbalahTree = createKabbalahTreeOfLife()
    kabbalahTree.scale.setScalar(0.8)
    lampGroup.add(kabbalahTree)
    kabbalahTreeRef.current = kabbalahTree
    
    const createPrismaticRays = () => {
      const raysGroup = new THREE.Group()
      const numRays = 12
      const rayColors = [
        0xFF0000,
        0xFF7F00,
        0xFFFF00,
        0x00FF00,
        0x0000FF,
        0x4B0082,
        0x9400D3,
        0xFF1493,
        0x00FFFF,
        0xFF69B4,
        0x00FF99,
        0xFFD700
      ]
      
      for (let i = 0; i < numRays; i++) {
        const baseAngle = (i / numRays) * Math.PI * 2
        const rayLength = 3.5
        const spiralTurns = 2.5
        const tubeRadius = 0.04
        
        const points: THREE.Vector3[] = []
        const segments = 80
        
        for (let j = 0; j <= segments; j++) {
          const t = j / segments
          const spiralAngle = baseAngle + t * spiralTurns * Math.PI * 2
          const distance = t * rayLength
          const radius = 0.02 + t * 0.15
          
          const x = Math.cos(spiralAngle) * radius
          const z = Math.sin(spiralAngle) * radius
          const y = distance
          
          points.push(new THREE.Vector3(x, y, z))
        }
        
        const curve = new THREE.CatmullRomCurve3(points)
        const tubeGeometry = new THREE.TubeGeometry(curve, segments, tubeRadius, 8, false)
        
        const rayMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(rayColors[i]) },
            offset: { value: i * 0.5 }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 baseColor;
            uniform float offset;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
              float pulse = sin(time * 2.0 + offset) * 0.3 + 0.7;
              float gradient = 1.0 - vUv.x;
              
              float shimmer = sin(vUv.x * 15.0 + time * 3.0) * 0.3 + 0.7;
              float energyFlow = sin(vUv.x * 8.0 - time * 4.0) * 0.5 + 0.5;
              
              float alpha = gradient * gradient * pulse * 0.7 * energyFlow;
              
              vec3 color = baseColor * shimmer * (1.0 + energyFlow * 0.5);
              
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false
        })
        
        const ray = new THREE.Mesh(tubeGeometry, rayMaterial)
        
        const directionX = Math.cos(baseAngle)
        const directionZ = Math.sin(baseAngle)
        ray.position.y = 0.275
        ray.rotation.z = Math.PI
        ray.position.x = directionX * 0.15
        raysGroup.add(ray)
        prismaticRaysRef.current.push(ray)
      }
      
      return raysGroup
    }
    
      const prismaticRays = createPrismaticRays()
      lampGroup.add(prismaticRays)
      scene.add(lampGroup)
    }

    const createGelatinBall = (position: THREE.Vector3, color: number) => {
      const ballMaterial = new THREE.MeshPhysicalMaterial({
        clearcoat: 1.0,
        color: color,
        transparent: true,
        opacity: 0.9,
        reflectivity: 1
      })
      
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 32, 32),
        ballMaterial
      )
      ball.position.copy(position)
      
      scene.add(ball)
      
      return ball
    }

    const getStarPoints = () => {
      const outerRadius = 3
      const points: THREE.Vector3[] = []
      const starPoints = 5
      
      for (let i = 0; i < starPoints; i++) {
        const angle = (i * 2 * Math.PI) / starPoints - Math.PI / 2
        const x = Math.cos(angle) * outerRadius
        const y = Math.sin(angle) * outerRadius
        points.push(new THREE.Vector3(x, y, 0))
      }
      
      return points
    }

    const createCrossLines = (points: THREE.Vector3[]) => {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xccddff,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
      })
      
      const lineGeometry = new THREE.BufferGeometry()
      const linePositions: number[] = []
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (i !== j && Math.abs(i - j) !== 1 && !(i === 0 && j === points.length - 1)) {
            linePositions.push(points[i].x, points[i].y, points[i].z)
            linePositions.push(points[j].x, points[j].y, points[j].z)
          }
        }
      }
      
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      return new THREE.LineSegments(lineGeometry, lineMaterial)
    }

    const starPointsLocal = getStarPoints()

    const leftStarPoints = starPointsLocal.map(p => {
      const rotated = p.clone()
      rotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
      rotated.x -= starSize / 2
      return rotated
    })
    leftStarPoints.forEach(p => createGelatinBall(p, 0xaaccff))
    scene.add(createCrossLines(leftStarPoints))

    const rightStarPoints = starPointsLocal.map(p => {
      const rotated = p.clone()
      rotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
      rotated.x += starSize / 2
      return rotated
    })
    rightStarPoints.forEach(p => createGelatinBall(p, 0xaaccff))
    scene.add(createCrossLines(rightStarPoints))

    const topStarPoints = starPointsLocal.map(p => {
      const rotated = p.clone()
      rotated.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
      rotated.y += starSize / 2
      return rotated
    })
    topStarPoints.forEach(p => createGelatinBall(p, 0xccddff))
    scene.add(createCrossLines(topStarPoints))

    const bottomStarPoints = starPointsLocal.map(p => {
      const rotated = p.clone()
      rotated.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
      rotated.y -= starSize / 2
      return rotated
    })
    bottomStarPoints.forEach(p => createGelatinBall(p, 0xccddff))
    scene.add(createCrossLines(bottomStarPoints))

    const frontStarPoints = starPointsLocal.map(p => {
      const translated = p.clone()
      translated.z += starSize / 2
      return translated
    })
    frontStarPoints.forEach(p => createGelatinBall(p, 0xbbeeff))
    scene.add(createCrossLines(frontStarPoints))

    const backStarPoints = starPointsLocal.map(p => {
      const translated = p.clone()
      translated.z -= starSize / 2
      return translated
    })
    backStarPoints.forEach(p => createGelatinBall(p, 0xbbeeff))
    scene.add(createCrossLines(backStarPoints))

    const particles = new THREE.Group()
    const particleGeometry = new THREE.SphereGeometry(0.015, 6, 6)
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.3
    })

    for (let i = 0; i < 30; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      particle.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
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

      const time = performance.now() * 0.001
      edgeLinesRef.current.forEach(line => {
        const material = line.material as THREE.ShaderMaterial
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time
        }
      })

      const { leftOpen, rightOpen, topOpen, bottomOpen, animationSpeed } = animationStateRef.current
      const baseSpeed = animationSpeed / 100
      
      const smoothEasing = (t: number) => {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      if (cameraRef.current && controlsRef.current) {
        const lerpSpeed = 0.03
        cameraRef.current.position.x = THREE.MathUtils.lerp(
          cameraRef.current.position.x,
          targetCameraPosition.current.x,
          lerpSpeed
        )
        cameraRef.current.position.y = THREE.MathUtils.lerp(
          cameraRef.current.position.y,
          targetCameraPosition.current.y,
          lerpSpeed
        )
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetCameraPosition.current.z,
          lerpSpeed
        )
        
        controlsRef.current.target.x = THREE.MathUtils.lerp(
          controlsRef.current.target.x,
          targetCameraTarget.current.x,
          lerpSpeed
        )
        controlsRef.current.target.y = THREE.MathUtils.lerp(
          controlsRef.current.target.y,
          targetCameraTarget.current.y,
          lerpSpeed
        )
        controlsRef.current.target.z = THREE.MathUtils.lerp(
          controlsRef.current.target.z,
          targetCameraTarget.current.z,
          lerpSpeed
        )
      }

      if (panelsRef.current.left) {
        const targetRotation = Math.PI / 2 + (leftOpen * Math.PI / 2)
        const currentRotation = panelsRef.current.left.rotation.y
        const delta = targetRotation - currentRotation
        const easedSpeed = baseSpeed * 0.15 * (1 - Math.exp(-Math.abs(delta) * 2))
        panelsRef.current.left.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          Math.min(easedSpeed, 0.08)
        )
      }

      if (panelsRef.current.right) {
        const targetRotation = -Math.PI / 2 - (rightOpen * Math.PI / 2)
        const currentRotation = panelsRef.current.right.rotation.y
        const delta = targetRotation - currentRotation
        const easedSpeed = baseSpeed * 0.15 * (1 - Math.exp(-Math.abs(delta) * 2))
        panelsRef.current.right.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          Math.min(easedSpeed, 0.08)
        )
      }

      if (panelsRef.current.top) {
        const targetRotation = -Math.PI / 2 - (topOpen * Math.PI / 2)
        const currentRotation = panelsRef.current.top.rotation.x
        const delta = targetRotation - currentRotation
        const easedSpeed = baseSpeed * 0.15 * (1 - Math.exp(-Math.abs(delta) * 2))
        panelsRef.current.top.rotation.x = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          Math.min(easedSpeed, 0.08)
        )
      }

      if (panelsRef.current.bottom) {
        const targetRotation = Math.PI / 2 + (bottomOpen * Math.PI / 2)
        const currentRotation = panelsRef.current.bottom.rotation.x
        const delta = targetRotation - currentRotation
        const easedSpeed = baseSpeed * 0.15 * (1 - Math.exp(-Math.abs(delta) * 2))
        panelsRef.current.bottom.rotation.x = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          Math.min(easedSpeed, 0.08)
        )
      }

      particles.rotation.y += 0.001
      if (lampGroupRef.current) lampGroupRef.current.rotation.y += 0.02
      if (pinkGlowRef.current) pinkGlowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      
      prismaticRaysRef.current.forEach((ray) => {
        const material = ray.material as THREE.ShaderMaterial
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time
        }
      })
      
      waterParticlesRef.current.forEach(particleSystem => {
        const material = particleSystem.material as THREE.ShaderMaterial
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time
        }
      })
      
      if (kabbalahTreeRef.current) {
        kabbalahTreeRef.current.rotation.y += 0.005
        const pulseScale = 1 + Math.sin(time * 1.5) * 0.05
        kabbalahTreeRef.current.scale.setScalar(0.8 * pulseScale)
      }

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

  useEffect(() => {
    const distance = 6
    
    switch (activePanel) {
      case 'left':
        targetCameraPosition.current = { x: -distance, y: 0, z: 0 }
        targetCameraTarget.current = { x: -2.25, y: 0, z: 0 }
        if (controlsRef.current) controlsRef.current.autoRotate = false
        break
      case 'right':
        targetCameraPosition.current = { x: distance, y: 0, z: 0 }
        targetCameraTarget.current = { x: 2.25, y: 0, z: 0 }
        if (controlsRef.current) controlsRef.current.autoRotate = false
        break
      case 'top':
        targetCameraPosition.current = { x: 0, y: distance, z: 0 }
        targetCameraTarget.current = { x: 0, y: 2.25, z: 0 }
        if (controlsRef.current) controlsRef.current.autoRotate = false
        break
      case 'bottom':
        targetCameraPosition.current = { x: 0, y: -distance, z: 0 }
        targetCameraTarget.current = { x: 0, y: -2.25, z: 0 }
        if (controlsRef.current) controlsRef.current.autoRotate = false
        break
      default:
        targetCameraPosition.current = defaultCameraPosition.current
        targetCameraTarget.current = { x: 0, y: 0, z: 0 }
        if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
    }
  }, [activePanel, autoRotate])

  useEffect(() => {
    if (lampGlowRef.current && lampTopRef.current) {
      if (lampOn) {
        lampGlowRef.current.intensity = 3
        const material = lampTopRef.current.material as THREE.MeshPhysicalMaterial
        material.emissiveIntensity = 2.5
        
        prismaticRaysRef.current.forEach((ray) => {
          ray.visible = true
        })
      } else {
        lampGlowRef.current.intensity = 0
        const material = lampTopRef.current.material as THREE.MeshPhysicalMaterial
        material.emissiveIntensity = 0.2
        
        prismaticRaysRef.current.forEach((ray) => {
          ray.visible = false
        })
      }
    }
  }, [lampOn])

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
