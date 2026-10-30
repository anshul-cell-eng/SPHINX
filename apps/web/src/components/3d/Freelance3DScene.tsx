import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitRingConfig {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  speed: number;
  color: string;
  particleColor: string;
}

// Brushed titanium, copper, and champagne-metal orbital rings
const RINGS_CONFIG: OrbitRingConfig[] = [
  {
    radius: 1.85, // Equatorial ring — Brushed Titanium with Copper edge
    tube: 0.016,
    rotation: [0.28, 0.04, 0],
    speed: 0.35,
    color: "#B86A43", // Warm Copper
    particleColor: "#E6A15C", // Warm Amber
  },
  {
    radius: 2.12, // Tilted ring — Champagne Metal
    tube: 0.013,
    rotation: [Math.PI / 3.4, 0.45, -0.22],
    speed: -0.26,
    color: "#787B70", // Brushed Titanium
    particleColor: "#F2EFE7", // Warm Ivory
  },
  {
    radius: 2.38, // Counter-tilted ring — Burnt Bronze
    tube: 0.012,
    rotation: [-Math.PI / 3.6, 0.52, 0.32],
    speed: 0.22,
    color: "#8F4E2D", // Deep Bronze / Copper
    particleColor: "#D97745", // Burnt Orange
  },
];

// High-resolution canvas texture for the brushed metallic F monogram + brand text
function createIndustrialMonogramTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = 1024;
  const cy = 820;

  // 1. Subtle warm amber internal illumination aura
  const auraGrad = ctx.createRadialGradient(cx, cy, 60, cx, cy, 700);
  auraGrad.addColorStop(0, "rgba(230, 161, 92, 0.18)"); // Warm amber
  auraGrad.addColorStop(0.5, "rgba(184, 106, 67, 0.08)"); // Copper
  auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 700, 0, Math.PI * 2);
  ctx.fill();

  // 2. Brushed metallic linear gradient: Warm Ivory -> Champagne -> Copper -> Deep Bronze
  const metalGrad = ctx.createLinearGradient(cx - 260, cy - 380, cx + 260, cy + 380);
  metalGrad.addColorStop(0.0, "#F2EFE7"); // Warm Ivory highlight
  metalGrad.addColorStop(0.25, "#E8E4DA"); // Soft cream
  metalGrad.addColorStop(0.65, "#B86A43"); // Copper
  metalGrad.addColorStop(1.0, "#8F4E2D"); // Burnt Bronze

  const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };

  // Subtle warm contact drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = metalGrad;

  // Stem (left vertical bar)
  drawRoundRect(cx - 270, cy - 380, 160, 750, 24);
  ctx.fill();

  // Top horizontal bar
  drawRoundRect(cx - 270, cy - 380, 600, 160, 24);
  ctx.fill();

  // Middle horizontal bar
  drawRoundRect(cx - 270, cy - 70, 420, 140, 22);
  ctx.fill();
  ctx.restore();

  // Crisp metallic pass
  ctx.save();
  ctx.fillStyle = metalGrad;
  drawRoundRect(cx - 270, cy - 380, 160, 750, 24);
  ctx.fill();
  drawRoundRect(cx - 270, cy - 380, 600, 160, 24);
  ctx.fill();
  drawRoundRect(cx - 270, cy - 70, 420, 140, 22);
  ctx.fill();

  // Brushed aluminum / champagne-metal top specular bevel
  ctx.fillStyle = "rgba(242, 239, 231, 0.55)";
  drawRoundRect(cx - 260, cy - 372, 575, 18, 9);
  ctx.fill();
  drawRoundRect(cx - 260, cy - 64, 395, 16, 8);
  ctx.fill();
  ctx.restore();

  // 3. FREELANCEOS Editorial Brand Typography
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 98px -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  ctx.letterSpacing = "16px";

  // Clean Warm Ivory Text Pass
  ctx.fillStyle = "#F2EFE7";
  ctx.fillText("FREELANCEOS", cx, cy + 540);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function Freelance3DScene() {
  const { pointer, camera } = useThree();

  const sphereGroupRef = useRef<THREE.Group>(null);
  const emblemMeshRef = useRef<THREE.Mesh>(null);
  const internalParticlesRef = useRef<THREE.Points>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const cometsGroupRef = useRef<THREE.Group>(null);
  const floatingOrbsRef = useRef<THREE.Group>(null);
  const pedestalRef = useRef<THREE.Group>(null);

  // High-resolution brand monogram texture
  const emblemTexture = useMemo(() => createIndustrialMonogramTexture(), []);

  // Internal warm amber stardust particles
  const internalParticlePositions = useMemo(() => {
    const count = 25;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.7;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Smoked Transparent Glass Shader with Warm Amber & Champagne Specular
  const smokedGlassShader = useMemo(() => {
    return {
      uniforms: {
        uRimColorTop: { value: new THREE.Color("#F2EFE7") }, // Warm Ivory
        uRimColorBottom: { value: new THREE.Color("#B86A43") }, // Copper
        uAmberGlow: { value: new THREE.Color("#E6A15C") }, // Warm Amber
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uRimColorTop;
        uniform vec3 uRimColorBottom;
        uniform vec3 uAmberGlow;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Fresnel factor (grazing angle)
          float rim = 1.0 - max(dot(normal, viewDir), 0.0);
          float fresnel = pow(rim, 2.5);

          // Vertical gradient between bottom copper and top warm ivory
          float yGrad = smoothstep(-0.5, 0.6, normal.y);
          vec3 rimColor = mix(uRimColorBottom, uRimColorTop, yGrad);

          // Studio key light specular (soft champagne reflection on top-right rim)
          vec3 keyDir = normalize(vec3(1.4, 2.0, 1.2));
          float rimSheen = pow(fresnel, 2.0) * max(dot(normal, keyDir), 0.0) * 2.8;

          // Subtle left fill specular
          vec3 fillDir = normalize(vec3(-2.0, 0.8, 0.6));
          float leftRim = pow(fresnel, 2.6) * max(dot(normal, fillDir), 0.0) * 1.4;

          // Upward warm amber reflection from the pedestal
          float bottomGlow = pow(max(-normal.y, 0.0), 2.2) * 1.5;

          // Smoked glass body tone (deep charcoal/amber)
          vec3 smokedBody = vec3(0.08, 0.075, 0.07);

          vec3 finalColor = smokedBody
                          + rimColor * (fresnel * 1.1)
                          + vec3(0.95, 0.94, 0.91) * rimSheen
                          + vec3(0.72, 0.42, 0.26) * leftRim
                          + uAmberGlow * bottomGlow;

          // Smoked optical glass: clean center visibility with controlled perimeter opacity
          float alpha = clamp(fresnel * 0.78 + rimSheen * 0.85 + bottomGlow * 0.65 + 0.04, 0.0, 0.94);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    };
  }, []);

  // Animation frame loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Central Smoked Glass Sphere Smooth Motion
    if (sphereGroupRef.current) {
      sphereGroupRef.current.position.y = 0.22 + Math.sin(time * 0.9) * 0.025;
      sphereGroupRef.current.rotation.y = time * 0.08;
    }

    // 2. Monogram Subtle Breathing
    if (emblemMeshRef.current) {
      emblemMeshRef.current.rotation.y = Math.sin(time * 0.5) * 0.04;
      const pulse = 1 + Math.sin(time * 1.6) * 0.01;
      emblemMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    // 3. Stardust particles swirl
    if (internalParticlesRef.current) {
      internalParticlesRef.current.rotation.y = time * 0.15;
    }

    // 4. Orbital Comets along rings
    if (cometsGroupRef.current) {
      RINGS_CONFIG.forEach((ring, idx) => {
        const comet = cometsGroupRef.current?.children[idx] as THREE.Mesh | undefined;
        if (comet) {
          const angle = time * ring.speed + idx * 2.1;
          const rawVec = new THREE.Vector3(
            Math.cos(angle) * ring.radius,
            Math.sin(angle) * ring.radius,
            0
          );
          const euler = new THREE.Euler(ring.rotation[0], ring.rotation[1], ring.rotation[2]);
          rawVec.applyEuler(euler);
          comet.position.copy(rawVec);
        }
      });
    }

    // 5. Precession of titanium rings
    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.y = time * 0.015;
    }

    // 6. Floating Crystal Orbs motion
    if (floatingOrbsRef.current) {
      floatingOrbsRef.current.children.forEach((orb, i) => {
        orb.position.y += Math.sin(time * 1.2 + i * 1.3) * 0.0008;
      });
    }

    // 7. Controlled Parallax Camera movement
    const targetCameraX = pointer.x * 0.35;
    const targetCameraY = pointer.y * 0.18 + 0.15;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* ============================================================== */}
      {/* PROFESSIONAL INDUSTRIAL BLACK STUDIO LIGHTING                 */}
      {/* ============================================================== */}
      <ambientLight color="#191A17" intensity={0.8} />

      {/* Top Studio Key Light (Champagne Softbox) */}
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#F2EFE7" />

      {/* Warm Copper Rim Light (Left/Rear) */}
      <pointLight position={[-4, 1.5, -2.5]} intensity={3.0} color="#B86A43" distance={10} />

      {/* Warm Amber Accent Light (Right/Front) */}
      <pointLight position={[3.5, 0.2, 3]} intensity={2.5} color="#E6A15C" distance={9} />

      {/* Pedestal Upward Warm Light */}
      <pointLight position={[0, -0.85, 0]} intensity={4.5} color="#E6A15C" distance={5} />

      {/* Floor Grazing Light */}
      <pointLight position={[0, -1.8, 2]} intensity={1.5} color="#B86A43" distance={6} />

      {/* ============================================================== */}
      {/* CENTRAL SMOKED GLASS SPHERE CENTERPIECE                       */}
      {/* ============================================================== */}
      <group ref={sphereGroupRef} position={[0, 0.22, 0]}>
        {/* Smoked Optical Glass Shell */}
        <mesh>
          <sphereGeometry args={[1.05, 64, 64]} />
          <shaderMaterial
            args={[smokedGlassShader]}
            transparent={true}
            depthWrite={false}
          />
        </mesh>

        {/* Floating Brushed Metallic Monogram F + FREELANCEOS Typography */}
        <mesh ref={emblemMeshRef} position={[0, 0.06, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={emblemTexture}
            transparent={true}
            opacity={1.0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Subtle Internal Warm Amber Stardust */}
        <points ref={internalParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={internalParticlePositions.length / 3}
              array={internalParticlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#E6A15C"
            transparent={true}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* ============================================================== */}
      {/* 3 BRUSHED TITANIUM & COPPER ORBITAL RINGS                      */}
      {/* ============================================================== */}
      <group ref={ringsGroupRef} position={[0, 0.22, 0]}>
        {RINGS_CONFIG.map((ring, idx) => (
          <group key={`ring-${idx}`} rotation={ring.rotation}>
            {/* Core Metal Tube */}
            <mesh>
              <torusGeometry args={[ring.radius, ring.tube, 16, 120]} />
              <meshStandardMaterial
                color={ring.color}
                metalness={0.92}
                roughness={0.25}
              />
            </mesh>

            {/* Subtle Metallic Edge Highlight */}
            <mesh>
              <torusGeometry args={[ring.radius, ring.tube * 1.5, 8, 90]} />
              <meshBasicMaterial
                color={ring.particleColor}
                transparent={true}
                opacity={0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Orbital Champagne Light Comets */}
      <group ref={cometsGroupRef} position={[0, 0.22, 0]}>
        {RINGS_CONFIG.map((ring, idx) => (
          <mesh key={`comet-${idx}`}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial
              color="#F2EFE7"
              emissive={ring.particleColor}
              emissiveIntensity={3.2}
            />
            <pointLight color={ring.particleColor} intensity={1.5} distance={1.8} />
          </mesh>
        ))}
      </group>

      {/* ============================================================== */}
      {/* FLOATING SMOKED AMBER ORBS                                    */}
      {/* ============================================================== */}
      <group ref={floatingOrbsRef}>
        {/* Orb 1: Upper Left */}
        <mesh position={[-1.65, 1.35, 0.25]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshPhysicalMaterial
            transmission={0.85}
            roughness={0.1}
            ior={1.48}
            color="#E6A15C"
            transparent={true}
            opacity={0.9}
          />
        </mesh>

        {/* Orb 2: Lower Left near pedestal */}
        <mesh position={[-1.75, -0.65, 0.6]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial
            transmission={0.85}
            roughness={0.1}
            ior={1.48}
            color="#B86A43"
            transparent={true}
            opacity={0.9}
          />
        </mesh>

        {/* Orb 3: Upper Right */}
        <mesh position={[1.85, 1.15, -0.25]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshPhysicalMaterial
            transmission={0.85}
            roughness={0.1}
            ior={1.48}
            color="#F2EFE7"
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* BLACK POLISHED METAL & BRUSHED ALUMINUM PEDESTAL              */}
      {/* ============================================================== */}
      <group ref={pedestalRef} position={[0, -0.92, 0]}>
        {/* Tier 1: Top Polished Metal Cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.45, 1.6, 0.22, 64]} />
          <meshStandardMaterial
            color="#141512"
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Brushed Copper Accent Ring on Tier 1 Top */}
        <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.34, 1.42, 64]} />
          <meshBasicMaterial
            color="#B86A43"
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        {/* Warm Amber Inner Accent Ring */}
        <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.12, 64]} />
          <meshBasicMaterial
            color="#E6A15C"
            transparent={true}
            opacity={0.7}
          />
        </mesh>

        {/* Champagne Metal Ring */}
        <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.82, 64]} />
          <meshBasicMaterial
            color="#F2EFE7"
            transparent={true}
            opacity={0.5}
          />
        </mesh>

        {/* Central Warm Energy Plate */}
        <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.72, 48]} />
          <meshBasicMaterial
            color="#E6A15C"
            transparent={true}
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Tier 2: Stepped Lower Cylinder */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[1.85, 2.0, 0.2, 64]} />
          <meshStandardMaterial
            color="#10110E"
            metalness={0.94}
            roughness={0.24}
          />
        </mesh>

        {/* Tier 2 Copper Rim Accent */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.82, 1.88, 64]} />
          <meshBasicMaterial
            color="#B86A43"
            transparent={true}
            opacity={0.6}
          />
        </mesh>

        {/* Tier 3: Widest Base Disc */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[2.25, 2.4, 0.18, 64]} />
          <meshStandardMaterial
            color="#0C0D0B"
            metalness={0.96}
            roughness={0.28}
          />
        </mesh>

        {/* Floor Concentric Reflection Wave Ring 1 */}
        <mesh position={[0, -0.465, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.55, 2.65, 64]} />
          <meshBasicMaterial
            color="#B86A43"
            transparent={true}
            opacity={0.4}
          />
        </mesh>

        {/* Floor Concentric Reflection Wave Ring 2 */}
        <mesh position={[0, -0.465, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.85, 2.92, 64]} />
          <meshBasicMaterial
            color="#787B70"
            transparent={true}
            opacity={0.2}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* DARK INDUSTRIAL MONOLITHS FRAMING BASE CORNERS                */}
      {/* ============================================================== */}
      <group position={[-3.6, -1.35, 0.5]}>
        <mesh rotation={[0.4, 0.8, -0.2]}>
          <dodecahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial
            color="#141512"
            metalness={0.8}
            roughness={0.4}
            flatShading={true}
          />
        </mesh>
      </group>

      <group position={[3.8, -1.3, 0.4]}>
        <mesh rotation={[-0.3, 0.6, 0.4]}>
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color="#141512"
            metalness={0.8}
            roughness={0.4}
            flatShading={true}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* OBSIDIAN STUDIO REFLECTIVE FLOOR                              */}
      {/* ============================================================== */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 20]} />
        <meshStandardMaterial
          color="#111210"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}
