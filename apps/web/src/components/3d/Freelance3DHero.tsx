import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Freelance3DScene } from "./Freelance3DScene";
import {
  Briefcase,
  FileText,
  Clock,
  FileSignature,
  Users,
  Check,
} from "lucide-react";

export function Freelance3DHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Subtle disciplined floating phase
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let animId: number;
    const start = Date.now();
    const animate = () => {
      setPhase((Date.now() - start) / 1000);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const calcTransform = (
    parallaxX: number,
    parallaxY: number,
    phaseOffset: number,
    speed = 0.9
  ) => {
    const floatY = Math.sin(phase * speed + phaseOffset) * 3.5;
    const rotate = Math.cos(phase * speed * 0.7 + phaseOffset) * 0.5;
    const mx = mouseOffset.x * parallaxX * 8;
    const my = mouseOffset.y * parallaxY * 8;
    return `translate3d(${mx}px, ${my + floatY}px, 0) rotate(${rotate}deg)`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[480px] sm:h-[530px] lg:h-[560px] select-none flex items-center justify-center overflow-hidden rounded-lg"
    >
      {/* Subtle Studio Vignette Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-[#B86A43]/8 via-transparent to-[#E6A15C]/5 blur-[100px]" />
      </div>

      {/* 3D Canvas Scene */}
      <div className="absolute inset-0 z-10">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-xs font-mono text-[#A5A397]">
              <span>LOADING STUDIO CORE</span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0.15, 7.2], fov: 38 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          >
            <Freelance3DScene />
          </Canvas>
        </Suspense>
      </div>

      {/* ============================================================== */}
      {/* SIX REFINED FLOATING CARDS (LINEAR/STRIPE INDUSTRIAL QUALITY)  */}
      {/* ============================================================== */}

      {/* 1. TOP-LEFT: Projects — 12 Active */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out left-2 sm:left-4 top-3 sm:top-5"
        style={{ transform: calcTransform(0.7, 0.7, 0.2) }}
      >
        <div className="group relative w-[150px] sm:w-[168px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#A5A397] tracking-tight">Active Projects</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#F2EFE7] font-mono">12 Active</span>
                <span className="text-[10px] text-[#4E8752] font-mono">ON TRACK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP-RIGHT: Invoices — ₹2,50,000 */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out right-2 sm:right-4 top-3 sm:top-5"
        style={{ transform: calcTransform(-0.75, 0.7, 0.8) }}
      >
        <div className="group relative w-[160px] sm:w-[180px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#A5A397]">Invoiced (Oct)</p>
                <p className="text-sm font-bold text-[#F2EFE7] font-mono tracking-tight">₹2,50,000</p>
                <p className="text-[10px] font-mono text-[#4E8752]">+12.4% MoM</p>
              </div>
            </div>
            {/* Disciplined copper micro-bars */}
            <div className="flex items-end gap-1 h-7 pt-1">
              <div className="w-1 h-2 rounded-sm bg-[#2E302B]" />
              <div className="w-1 h-3.5 rounded-sm bg-[#8F4E2D]" />
              <div className="w-1 h-5 rounded-sm bg-[#B86A43]" />
              <div className="w-1 h-6 rounded-sm bg-[#E6A15C]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE-LEFT: Time Tracking — 5h 24m */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out left-1 sm:left-2 top-[38%]"
        style={{ transform: calcTransform(0.8, -0.6, 1.4) }}
      >
        <div className="group relative w-[150px] sm:w-[168px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#E6A15C]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#A5A397]">Time Logged</p>
                <p className="text-sm font-bold text-[#F2EFE7] font-mono">5h 24m</p>
              </div>
            </div>
            {/* Disciplined amber bars */}
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 h-2 rounded-sm bg-[#2E302B]" />
              <div className="w-1 h-3 rounded-sm bg-[#787B70]" />
              <div className="w-1 h-4.5 rounded-sm bg-[#B86A43]" />
              <div className="w-1 h-5.5 rounded-sm bg-[#E6A15C]" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MIDDLE-RIGHT: Payment Received — ₹25,000 */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out right-1 sm:right-2 top-[38%]"
        style={{ transform: calcTransform(-0.85, -0.6, 1.8) }}
      >
        <div className="group relative w-[155px] sm:w-[175px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#4E8752]">
              <Check className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#A5A397]">Settled Payment</p>
              <p className="text-sm font-bold text-[#F2EFE7] font-mono tracking-tight">₹25,000</p>
              <p className="text-[9px] font-mono text-[#A5A397]">UPI / RAZORPAY</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM-LEFT: Contracts — 2 Signed */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out left-2 sm:left-4 bottom-5 sm:bottom-7"
        style={{ transform: calcTransform(0.7, 0.65, 2.3) }}
      >
        <div className="group relative w-[145px] sm:w-[165px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
              <FileSignature className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#A5A397]">Legal Scope</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#F2EFE7] font-mono">2 Signed</span>
                <span className="text-[10px] text-[#4E8752] font-mono">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM-RIGHT: Clients — 24 Total */}
      <div
        className="absolute z-20 pointer-events-auto transition-transform duration-300 ease-out right-2 sm:right-4 bottom-5 sm:bottom-7"
        style={{ transform: calcTransform(-0.7, 0.65, 2.7) }}
      >
        <div className="group relative w-[150px] sm:w-[170px] rounded-md p-3 border border-[#2E302B] bg-[#191A17]/95 backdrop-blur-md shadow-card hover:border-[#3D3F38] transition-all">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22231F] border border-[#2E302B] text-[#A3A68A]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#A5A397]">Client Roster</p>
                <p className="text-sm font-bold text-[#F2EFE7] font-mono">24 Total</p>
              </div>
            </div>
            {/* Overlapping customer avatars */}
            <div className="flex -space-x-1.5 overflow-hidden items-center">
              <img
                className="inline-block h-5 w-5 rounded-full ring-1 ring-[#191A17] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Client 1"
              />
              <img
                className="inline-block h-5 w-5 rounded-full ring-1 ring-[#191A17] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                alt="Client 2"
              />
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E302B] ring-1 ring-[#191A17] text-[8px] font-mono font-medium text-[#F2EFE7]">
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
