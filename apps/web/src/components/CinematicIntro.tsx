import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

interface CinematicIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export function CinematicIntro({ onComplete, forceShow = false }: CinematicIntroProps) {
  const [stage, setStage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw the intro during this session unless forceShow is set
    const hasSeenIntro = sessionStorage.getItem("nexus_intro_viewed");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ((hasSeenIntro && !forceShow) || prefersReducedMotion) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Sequence stages:
    // 0: Dark screen
    // 1: Logo & brand entrance
    // 2: Light sweep & connecting network nodes
    // 3: Dashboard dissolve entrance
    const timer1 = setTimeout(() => setStage(1), 200);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => {
      setStage(3);
      handleFinish();
    }, 2800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [forceShow]);

  const handleFinish = () => {
    sessionStorage.setItem("nexus_intro_viewed", "true");
    setIsVisible(false);
    setTimeout(onComplete, 400); // Allow fade-out transition
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A10] overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Network constellation background nodes */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <motion.line
              x1="20%"
              y1="30%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={stage >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.line
              x1="80%"
              y1="35%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={stage >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            />
            <motion.line
              x1="30%"
              y1="75%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={stage >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            <motion.line
              x1="70%"
              y1="70%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={stage >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />

            {/* Orbiting node dots */}
            {stage >= 2 && (
              <>
                <motion.circle cx="20%" cy="30%" r="3" fill="#3B82F6" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                <motion.circle cx="80%" cy="35%" r="3" fill="#60A5FA" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                <motion.circle cx="30%" cy="75%" r="3" fill="#3B82F6" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                <motion.circle cx="70%" cy="70%" r="3" fill="#60A5FA" initial={{ scale: 0 }} animate={{ scale: 1 }} />
              </>
            )}
          </svg>

          {/* Central Logo & Light Sweep */}
          <div className="relative flex flex-col items-center">
            {/* Geometric Core Shield */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={stage >= 1 ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0E1424] border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.25)]"
            >
              <Shield className="h-10 w-10 text-primary" />

              {/* Light Sweep Animation */}
              {stage >= 2 && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent skew-x-12 pointer-events-none"
                />
              )}
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
                  NEXUS
                </span>
                <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-primary border border-primary/30">
                  OS
                </span>
              </div>
              <p className="mt-2 text-xs font-mono text-muted-foreground/80 tracking-widest uppercase">
                Enterprise Operations Command
              </p>
            </motion.div>

            {/* Connecting status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mt-8 flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-[11px] font-mono text-muted-foreground"
            >
              <Sparkles className="h-3 w-3 text-cyan-400 animate-spin" />
              <span>Synthesizing Operational Matrix...</span>
            </motion.div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleFinish}
            className="absolute bottom-8 right-8 text-xs font-mono text-muted-foreground hover:text-white transition-colors border border-border/40 hover:border-border/80 px-3 py-1.5 rounded-md bg-secondary/20"
          >
            Skip Intro [Esc]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
