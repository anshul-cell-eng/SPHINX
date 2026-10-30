import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitNodeData {
  name: string;
  radius: number;
  speed: number;
  offset: number;
  yOffset: number;
  color: string;
}

const NODES_DATA: OrbitNodeData[] = [
  { name: "Infra", radius: 2.8, speed: 0.35, offset: 0, yOffset: 0.4, color: "#3B82F6" },
  { name: "SecOps", radius: 3.4, speed: -0.28, offset: 1.5, yOffset: -0.5, color: "#06B6D4" },
  { name: "Eng", radius: 2.4, speed: 0.45, offset: 3.1, yOffset: 0.8, color: "#60A5FA" },
  { name: "DevOps", radius: 3.8, speed: -0.22, offset: 4.2, yOffset: -0.3, color: "#10B981" },
  { name: "Support", radius: 3.1, speed: 0.38, offset: 5.3, yOffset: 0.2, color: "#818CF8" },
];

export function CommandCoreScene() {
  const outerCageRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const linesGroupRef = useRef<THREE.Group>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { pointer, camera } = useThree();

  // Create subtle floating background particles
  const particlePositions = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  // Frame update: slow rotation, orbits, line connections, and camera parallax
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Central Core counter-rotations
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y += delta * 0.25;
      innerCoreRef.current.rotation.x += delta * 0.15;
      // Subtle heartbeat pulse
      const scale = 1 + Math.sin(time * 2) * 0.03;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }

    if (outerCageRef.current) {
      outerCageRef.current.rotation.y -= delta * 0.18;
      outerCageRef.current.rotation.z += delta * 0.12;
    }

    // 2. Slow particle drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.03;
    }

    // 3. Update Orbiting Nodes & Dynamic Connecting Lines
    if (nodesGroupRef.current && linesGroupRef.current) {
      NODES_DATA.forEach((node, index) => {
        const mesh = nodesGroupRef.current?.children[index] as THREE.Mesh | undefined;
        const line = linesGroupRef.current?.children[index] as THREE.Line | undefined;

        if (mesh) {
          const currentAngle = time * node.speed + node.offset;
          const x = Math.cos(currentAngle) * node.radius;
          const z = Math.sin(currentAngle) * node.radius;
          const y = node.yOffset + Math.sin(time * 1.5 + node.offset) * 0.25;

          mesh.position.set(x, y, z);

          // Update connecting line geometry from (0,0,0) to node position
          if (line && line.geometry) {
            const positions = line.geometry.attributes.position as THREE.BufferAttribute;
            positions.setXYZ(0, 0, 0, 0);
            positions.setXYZ(1, x, y, z);
            positions.needsUpdate = true;
          }
        }
      });
    }

    // 4. Mouse-responsive Camera Parallax with smooth lerp
    const targetCameraX = pointer.x * 1.2;
    const targetCameraY = pointer.y * 0.8 + 0.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1.8} color="#38BDF8" distance={8} />
      <directionalLight position={[6, 8, 5]} intensity={1.2} color="#FFFFFF" />
      <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#1E3A8A" />

      {/* Central Metallic / Glass Core */}
      <group>
        {/* Inner Solid Metallic Icosahedron */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#1E3A8A"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Wireframe Cage */}
        <mesh ref={outerCageRef}>
          <dodecahedronGeometry args={[1.35, 0]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.7}
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      {/* Orbiting Departmental Nodes */}
      <group ref={nodesGroupRef}>
        {NODES_DATA.map((node, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.8}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Connecting Network Lines */}
      <group ref={linesGroupRef}>
        {NODES_DATA.map((node, i) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 1, 1]), 3)
          );
          return (
            // @ts-ignore
            <line key={i} geometry={geometry}>
              <lineBasicMaterial
                color={node.color}
                transparent
                opacity={0.25}
                linewidth={1}
              />
            </line>
          );
        })}
      </group>

      {/* Constellation Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#38BDF8"
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </>
  );
}
