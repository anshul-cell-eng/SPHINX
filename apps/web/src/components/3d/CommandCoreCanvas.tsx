import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { CommandCoreScene } from "./CommandCoreScene";
import { Shield, Sparkles } from "lucide-react";

function WebGLFallback() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0E1424] border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <Shield className="h-12 w-12 text-primary animate-pulse" />
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-ping opacity-40" />
      </div>
      <p className="mt-4 text-xs font-mono font-medium text-foreground">
        NEXUS Operational Core
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">
        Connecting 5 Operational Units
      </p>
    </div>
  );
}

export function CommandCoreCanvas() {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // 2. Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* 3D Canvas */}
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.5, 6.2], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        >
          <CommandCoreScene />
        </Canvas>
      </Suspense>

      {/* Floating subtle overlay tag */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 rounded-full border border-border/40 bg-background/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Interactive Core Matrix • Mouse Parallax</span>
      </div>
    </div>
  );
}
