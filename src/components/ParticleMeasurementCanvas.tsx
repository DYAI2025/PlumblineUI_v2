import { useEffect, useRef, MutableRefObject } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ParticleMeasurementCanvasProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

export function ParticleMeasurementCanvas({ pointerRef }: ParticleMeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic thresholds based on device screens
    let maxParticles = 80;
    if (width < 768) {
      maxParticles = 20; // Mobile
    } else if (width < 1024) {
      maxParticles = 45; // Tablet
    }

    // Colors mapping from exact color guidelines
    const colorDustUmber = "rgba(84, 36, 9, 0.45)";
    const colorDustBronze = "rgba(127, 58, 14, 0.4)";
    const colorDustTeal = "rgba(20, 138, 136, 0.25)";
    const colorFocusGold = "rgba(213, 137, 27, 0.75)";

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const randType = Math.random();
      let color = colorDustBronze;
      let size = Math.random() * 1.5 + 0.8;

      if (randType > 0.85) {
        color = colorFocusGold;
        size = Math.random() * 2 + 1; // highlighted gold particles
      } else if (randType > 0.6) {
        color = colorDustTeal;
      } else if (randType > 0.3) {
        color = colorDustUmber;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size,
        color,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Static horizontal and vertical grid-line coordinates
    const linesCount = 12;
    const horizontalLineLines: number[] = [];
    for (let i = 1; i <= linesCount; i++) {
      horizontalLineLines.push((height / (linesCount + 1)) * i);
    }

    const verticalLineLines: number[] = [];
    const vLinesCount = 14;
    for (let i = 1; i <= vLinesCount; i++) {
      verticalLineLines.push((width / (vLinesCount + 1)) * i);
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();
    const fpsInterval = 1000 / 30; // 30fps target interval (~33.33ms)

    // Frame update loop
    const tick = (timestamp?: number) => {
      animId = requestAnimationFrame(tick);

      const now = timestamp || performance.now();
      const elapsed = now - lastTime;

      // Only draw and update physics on 30fps interval
      if (elapsed >= fpsInterval) {
        lastTime = now - (elapsed % fpsInterval);

        ctx.clearRect(0, 0, width, height);

        // Draw faint inactive static forensic backing grid
        ctx.strokeStyle = "rgba(84, 36, 9, 0.08)";
        ctx.lineWidth = 1;
        
        // Draw elastic line measurements bending toward pointer
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;

        if (!isReduced && width > 768) {
          // Render 10 horizontal alignment lines bowing subtly near pointer
          horizontalLineLines.forEach((ly) => {
            ctx.beginPath();
            ctx.strokeStyle = Math.abs(py - ly) < 140 ? "rgba(20, 138, 136, 0.2)" : "rgba(84, 36, 9, 0.04)";
            ctx.moveTo(0, ly);
            
            const bendFactor = 250;
            const distY = Math.abs(py - ly);
            
            if (distY < bendFactor) {
              const pull = (1 - distY / bendFactor) * 20;
              ctx.quadraticCurveTo(px, ly + (py > ly ? pull : -pull), width, ly);
            } else {
              ctx.lineTo(width, ly);
            }
            ctx.stroke();
          });

          // Render vertical lines bowing subtly near pointer
          verticalLineLines.forEach((lx) => {
            ctx.beginPath();
            ctx.strokeStyle = Math.abs(px - lx) < 140 ? "rgba(20, 138, 136, 0.2)" : "rgba(84, 36, 9, 0.04)";
            ctx.moveTo(lx, 0);

            const bendFactor = 250;
            const distX = Math.abs(px - lx);

            if (distX < bendFactor) {
              const pull = (1 - distX / bendFactor) * 20;
              ctx.quadraticCurveTo(lx + (px > lx ? pull : -pull), py, lx, height);
            } else {
              ctx.lineTo(lx, height);
            }
            ctx.stroke();
          });
        }

        // Render flowing or static particles
        particles.forEach((p) => {
          if (!isReduced) {
            // Physics updates - float particles
            p.x += p.vx;
            p.y += p.vy;

            // Wrap boundaries
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Gravitational pull toward mouse pointer
            const dx = px - p.x;
            const dy = py - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Standard space bend (black-hole orbit radius)
            if (distance < 280) {
              const pullForce = (280 - distance) * 0.00008;
              const orbitForce = (280 - distance) * 0.00012;

              // Direct inward pull
              p.vx += dx * pullForce;
              p.vy += dy * pullForce;

              // Tangential pull resulting in orbital curves (perpendicular vector)
              p.vx += -dy * orbitForce;
              p.vy += dx * orbitForce;
            }

            // Subtle gravity well effect pulling particles toward the central plumbline (x = width / 2) and center bob (height * 0.35)
            const cx = width / 2;
            const cy = height * 0.35;
            const dcx = cx - p.x;
            const dcy = cy - p.y;
            const distCenter = Math.sqrt(dcx * dcx + dcy * dcy);

            if (distCenter > 10) {
              // Gentle pulling toward center plumb-bob point
              const centerPull = 0.000012;
              p.vx += dcx * centerPull;
              p.vy += dcy * centerPull;
            }

            // Also horizontal pull towards the vertical line chord
            const dxLine = cx - p.x;
            const linePull = 0.000008;
            p.vx += dxLine * linePull;

            // Apply friction/drag to prevent static buildup and keep movement smooth
            p.vx *= 0.985;
            p.vy *= 0.985;

            // Cap velocity to maintain elegant aesthetic
            const maxSpeed = 1.4;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > maxSpeed) {
              p.vx = (p.vx / speed) * maxSpeed;
              p.vy = (p.vy / speed) * maxSpeed;
            }
          }

          // Draw particle representation
          ctx.fillStyle = p.color;
          ctx.shadowBlur = p.color === colorFocusGold ? 4 : 0;
          ctx.shadowColor = p.color === colorFocusGold ? "rgba(213, 137, 27, 0.5)" : "transparent";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [pointerRef, isReduced]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-[3]"
      style={{ opacity: 0.85 }}
    />
  );
}
