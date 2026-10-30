import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMockStore, TopologyNode } from "@/lib/mock-store";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  X,
  Server,
  Building2,
  MapPin,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function TopologyNodeMesh({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  node: TopologyNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle floating motion
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    if (node.type !== "organization") {
      meshRef.current.position.y =
        node.position[1] + Math.sin(time * 1.5 + node.position[0]) * 0.08;
    }
  });

  const color = useMemo(() => {
    if (node.type === "organization") return "#38BDF8";
    if (node.status === "critical") return "#EF4444";
    if (node.status === "warning") return "#F59E0B";
    return "#10B981";
  }, [node]);

  const radius = node.type === "organization" ? 0.38 : node.type === "department" ? 0.24 : 0.18;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          onHover(false);
        }}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 0.9 : 0.5}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* Pulsing Selection Ring */}
      {(isSelected || isHovered || node.status === "critical") && (
        <mesh>
          <ringGeometry args={[radius + 0.08, radius + 0.14, 32]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={node.status === "critical" ? 0.8 : 0.6}
          />
        </mesh>
      )}
    </group>
  );
}

function TopologyLines({ nodes }: { nodes: TopologyNode[] }) {
  const coreNode = nodes.find((n) => n.type === "organization");

  const lines = useMemo(() => {
    if (!coreNode) return [];
    const elements: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];

    nodes.forEach((node) => {
      if (node.id === coreNode.id) return;

      // Connect departments to core
      if (node.type === "department") {
        elements.push({
          start: coreNode.position,
          end: node.position,
          color: node.status === "critical" ? "#EF4444" : "#38BDF8",
        });
      }

      // Connect locations to nearest department
      if (node.type === "location") {
        elements.push({
          start: coreNode.position,
          end: node.position,
          color: "#0284C7",
        });
      }
    });

    return elements;
  }, [nodes, coreNode]);

  return (
    <group>
      {lines.map((l, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...l.start),
          new THREE.Vector3(...l.end),
        ]);
        return (
          // @ts-ignore
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color={l.color} transparent opacity={0.25} />
          </line>
        );
      })}
    </group>
  );
}

export function TopologyVisualizer() {
  const { topologyNodes } = useMockStore();
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(topologyNodes[1]); // Default to first dept
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const controlsRef = useRef<any>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative h-[480px] w-full rounded-xl border border-border/70 bg-[#070A10] overflow-hidden">
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/80 px-3 py-1.5 backdrop-blur-md">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-foreground">
            3D Topology Engine
          </span>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
            Live Spatial Graph
          </Badge>
        </div>
      </div>

      {/* Camera Controls Panel */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/80 p-1 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(0.85)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(1.15)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetCamera}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Reset View"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 4, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#38BDF8" distance={10} />

        <TopologyLines nodes={topologyNodes} />

        {topologyNodes.map((node) => (
          <TopologyNodeMesh
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={() => setSelectedNode(node)}
            onHover={(hovered) => setHoveredNodeId(hovered ? node.id : null)}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3.5}
          maxDistance={14}
        />
      </Canvas>

      {/* Selected Node Details Floating Glass Card */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 w-80 rounded-xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {selectedNode.type === "organization" && (
                <Server className="h-4 w-4 text-cyan-400" />
              )}
              {selectedNode.type === "department" && (
                <Building2 className="h-4 w-4 text-primary" />
              )}
              {selectedNode.type === "location" && (
                <MapPin className="h-4 w-4 text-emerald-400" />
              )}
              <h4 className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                {selectedNode.name}
              </h4>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <Badge
              variant={
                selectedNode.status === "critical"
                  ? "destructive"
                  : selectedNode.status === "warning"
                  ? "warning"
                  : "success"
              }
              className="text-[10px] font-mono uppercase"
            >
              Status: {selectedNode.status}
            </Badge>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {selectedNode.type}
            </span>
          </div>

          {/* Details Metadata */}
          <div className="mt-3 space-y-1.5 rounded-lg border border-border/60 bg-background/50 p-2.5 text-xs font-mono text-muted-foreground">
            {selectedNode.details.lead && (
              <div className="flex justify-between">
                <span>Unit Lead:</span>
                <span className="text-foreground">{selectedNode.details.lead}</span>
              </div>
            )}
            {selectedNode.details.metrics && (
              <div className="flex justify-between">
                <span>Telemetry:</span>
                <span className="text-foreground">{selectedNode.details.metrics}</span>
              </div>
            )}
            {selectedNode.details.incidents !== undefined && (
              <div className="flex justify-between">
                <span>Active Outages:</span>
                <span
                  className={
                    selectedNode.details.incidents > 0
                      ? "text-rose-400 font-semibold"
                      : "text-emerald-400"
                  }
                >
                  {selectedNode.details.incidents} Incidents
                </span>
              </div>
            )}
            {selectedNode.details.latency && (
              <div className="flex justify-between">
                <span>Network Latency:</span>
                <span className="text-foreground">{selectedNode.details.latency}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend & Instructions */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-3 rounded-md border border-border/40 bg-background/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Healthy
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Warning
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Critical
        </span>
        <span>• Click node to inspect • Drag to rotate</span>
      </div>
    </div>
  );
}
