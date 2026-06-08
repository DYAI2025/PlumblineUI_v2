import { useEffect, useRef, useState, MutableRefObject } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface PlumblineSceneProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

export function PlumblineScene({ pointerRef }: PlumblineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const bobRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Anchor origin defaults (top center)
    let originX = window.innerWidth / 2;
    const originY = 0;

    // Bob default rest location
    let restY = Math.min(window.innerHeight * 0.45, 380);
    let restX = originX;

    // Physical state variables
    let currX = restX;
    let currY = restY - 140; // Initial elevation for the drop movement
    let velX = 0;
    let velY = 0;

    // Force variables
    const gravity = 0.55; 
    const springK = 0.12; // stiffness
    const damping = 0.88; // damp weight for settling

    let animId: number;

    const handleResize = () => {
      originX = window.innerWidth / 2;
      restY = Math.min(window.innerHeight * 0.45, 380);
      restX = originX;
    };

    window.addEventListener("resize", handleResize);

    const tick = () => {
      // 1. Calculate gravity cursor pull
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;

      let targetX = restX;
      let targetY = restY;

      if (!isReduced && window.innerWidth > 768) {
        const dx = px - restX;
        const dy = py - restY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Within 600px attraction radius, the heavy steel bob bends towards cursor
        if (distance < 600 && distance > 0) {
          const intensity = Math.pow((600 - distance) / 600, 1.8);
          const maxDisplacement = 65; // ~12 degrees tilt max
          
          targetX = restX + (dx / distance) * maxDisplacement * intensity;
          // Damp vertical displacement (bob bound by string length)
          targetY = restY + (dy / distance) * 15 * intensity;
        }
      }

      // 2. Physics solver (Hooke's Spring Law with Damping)
      const forceX = (targetX - currX) * springK;
      const forceY = (targetY - currY) * springK + gravity * 0.15;

      velX = (velX + forceX) * damping;
      velY = (velY + forceY) * damping;

      currX += velX;
      currY += velY;

      // 3. Direct DOM insertion for 60fps performance without React scheduler overhead
      if (cordRef.current) {
        // Tension cord pathway
        cordRef.current.setAttribute("d", `M ${originX} ${originY} L ${currX} ${currY - 26}`);
      }

      if (bobRef.current) {
        // Metal conical Bob translations and slight tilt angle calculations
        const rx = currX - restX;
        const angle = rx * 0.14; // Lean proportional to X displacement deflection
        bobRef.current.setAttribute("transform", `translate(${currX}, ${currY}) rotate(${angle})`);
      }

      if (glowRef.current) {
        // Set point of vertical convergence glow position
        glowRef.current.setAttribute("cx", currX.toString());
        glowRef.current.setAttribute("cy", (currY + 54).toString());
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [pointerRef, isReduced]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none select-none z-[4] overflow-hidden"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Precise metal brushed steel gradient definitions based on custom guidelines */}
          <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#17110D" />
            <stop offset="25%" stopColor="#542409" />
            <stop offset="50%" stopColor="#7F3A0E" />
            <stop offset="70%" stopColor="#D5891B" />
            <stop offset="85%" stopColor="#148A88" />
            <stop offset="100%" stopColor="#17110D" />
          </linearGradient>

          {/* Gold active tip reflection */}
          <radialGradient id="tipGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D5891B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#17110D" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="shadowMask" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B282A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#17110D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Subtle floor contact shadow field */}
        <circle
          ref={glowRef}
          r="48"
          fill="url(#shadowMask)"
          className="transition-opacity duration-300"
        />

        {/* 2. Thin suspension cord */}
        <path
          ref={cordRef}
          stroke="#148A88"
          strokeWidth="0.8"
          strokeOpacity="0.55"
          fill="none"
        />

        {/* 3. The Solid Heavy Plumb Bob conic metal structure */}
        <g ref={bobRef}>
          {/* Symmetrical Top mounting suspension loop */}
          <circle cx="0" cy="-30" r="4.5" fill="none" stroke="url(#metalBody)" strokeWidth="1.5" />
          
          {/* Metallic cylindrical connection neck cap */}
          <rect x="-4" y="-26" width="8" height="6" fill="url(#metalBody)" rx="1" />
          
          {/* Rounded structural main heavy shoulder ring */}
          <path
            d="M -16 -20 C -16 -24, 16 -24, 16 -20 L 16 -12 C 16 -2, -16 -2, -16 -12 Z"
            fill="url(#metalBody)"
          />
          
          {/* Sharp focused conoid body leading down to tip */}
          <path
            d="M -16 -12 L 16 -12 L 0 52 Z"
            fill="url(#metalBody)"
          />
          
          {/* Brilliant luminous exact convergence tip glow point */}
          <circle cx="0" cy="52" r="1.5" fill="#D5891B" />
          <circle cx="0" cy="52" r="5" fill="url(#tipGlow)" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
}
