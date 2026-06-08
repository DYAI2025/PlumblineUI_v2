import { ReactNode } from "react";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ParticleMeasurementCanvas } from "./ParticleMeasurementCanvas";
import { PlumblineScene } from "./PlumblineScene";
import { GravityCursor } from "./GravityCursor";

interface GravityInteractionLayerProps {
  children: ReactNode;
}

export function GravityInteractionLayer({ children }: GravityInteractionLayerProps) {
  // Shared performant coordinates ref
  const pointerRef = usePointer();
  const isReduced = useReducedMotion();

  return (
    <div className="site-shell relative min-h-screen w-full bg-void text-teal overflow-hidden">
      {/* 1. Fine grid technical texture */}
      <div className="fine-grid" />
      
      {/* 2. Dark volumetric vignette shadow */}
      <div className="vignette" />

      {/* 3. Texture grain overlay from Bento Rules */}
      <div className="grain pointer-events-none" />

      {/* 4. Ambient physical dust particles */}
      <div className="dust-particle" style={{ top: "20%", left: "10%" }} />
      <div className="dust-particle" style={{ top: "40%", left: "80%" }} />
      <div className="dust-particle" style={{ top: "70%", left: "30%", opacity: 0.05 }} />
      <div className="dust-particle" style={{ top: "15%", left: "65%", opacity: 0.3 }} />
      <div className="dust-particle" style={{ top: "85%", left: "90%" }} />

      {/* 5. Global particles canvas coordinates */}
      {!isReduced && <ParticleMeasurementCanvas pointerRef={pointerRef} />}

      {/* 4. Heavy steel central plumbline simulation */}
      <PlumblineScene pointerRef={pointerRef} />

      {/* 5. Custom cursor event-focus lens */}
      <GravityCursor pointerRef={pointerRef} />

      {/* 6. High-intensity content layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
