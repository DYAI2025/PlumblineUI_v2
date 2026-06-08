import { useEffect, useRef, useState, MutableRefObject } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface GravityCursorProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

export function GravityCursor({ pointerRef }: GravityCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  const [hoverType, setHoverType] = useState<"normal" | "interactive" | "evidence" | "hidden">("normal");

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(max-width: 768px)").matches || isReduced) {
      setHoverType("hidden");
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let animId: number;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest(".cursor-pointer") || target.closest("button") || target.closest("a")) {
        setHoverType("interactive");
      } else if (target.closest("[onmouseenter]") || target.closest(".evidence-tag") || target.closest(".inline-block")) {
        // Check if closer to evidence item
        setHoverType("evidence");
      } else {
        setHoverType("normal");
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Custom lag interpolation logic
    const update = () => {
      const tx = pointerRef.current.x;
      const ty = pointerRef.current.y;

      const friction = 0.15; // smooth lag factor
      currentX += (tx - currentX) * friction;
      currentY += (ty - currentY) * friction;

      if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [pointerRef, isReduced]);

  if (hoverType === "hidden" || isReduced) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed left-0 top-0 w-0 h-0 pointer-events-none select-none z-[9999] mix-blend-difference hidden md:block"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      {/* 1. Center pointer dot */}
      <div className="absolute w-1 h-1 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* 2. Micro-crosshair compass ticks */}
      <div className="absolute w-6 h-[1px] bg-teal/55 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[1px] h-6 bg-teal/55 -translate-x-1/2 -translate-y-1/2" />

      {/* 3. Circular dark translucent lens & event horizon boundary */}
      <div
        className={`absolute rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          hoverType === "interactive"
            ? "w-11 h-11 border-gold bg-gold/5 scale-110 shadow-[0_0_12px_rgba(213,137,27,0.25)]"
            : hoverType === "evidence"
            ? "w-[56px] h-[56px] border-teal border-dashed bg-depth-teal/20"
            : "w-7 h-7 border-bronze/60 bg-[#0B282A]/15 opacity-80"
        }`}
      />

      {/* 4. Tiny micro scale metric reading box next to cursor */}
      <div className="absolute left-6 top-3 text-[7px] font-mono text-bronze/70 leading-none py-0.5 px-1 bg-void border border-umber/40 select-none">
        <span>G: 9.81m/s²</span>
      </div>
    </div>
  );
}
