import { useRef, useEffect, MutableRefObject, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursorRaycast } from "./useCursorRaycast";

interface UsePendulumPhysicsProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  bobRef: MutableRefObject<THREE.Group | null>;
  lineMesh: THREE.Line | null;
  glowLightRef: MutableRefObject<THREE.PointLight | null>;
}

export function usePendulumPhysics({
  pointerRef,
  bobRef,
  lineMesh,
  glowLightRef,
}: UsePendulumPhysicsProps) {
  const { size, viewport } = useThree();
  const isReduced = useReducedMotion();
  const { get3DWorldPosition, getCursorForce, checkIntersection } = useCursorRaycast();

  // Create persistent vector references to maintain performance and avoid GC allocations
  const currentBobPos = useMemo(() => new THREE.Vector3(), []);

  // Dynamic top-center anchor and lower rest points based on viewport units
  const anchorY = viewport.height * 0.5;
  const restY = -viewport.height * 0.05;
  const cordLength = anchorY - restY;

  // Track the mouse interaction state
  const isMouseDown = useRef(false);
  const isDragging = useRef(false);
  const hasSetCursor = useRef<"grab" | "grabbing" | null>(null);

  // Core physics parameters stored in a stable ref to prevent per-frame garbage collector run
  const physicalState = useRef({
    thetaX: 0,
    thetaY: 0,
    omegaX: 0,
    omegaY: 0,
    alphaX: 0,
    alphaY: 0,
    lastThetaX: 0,
    lastThetaY: 0,
    lastWidth: window.innerWidth,
    lastHeight: window.innerHeight,
  });

  // Track pointer up/down globally to support seamless dragging even outside the canvas boundaries
  useEffect(() => {
    const handleDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        if (
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest(".cursor-pointer") ||
          target.closest('[role="button"]')
        ) {
          return;
        }
      }
      isMouseDown.current = true;
    };

    const handleUp = () => {
      isMouseDown.current = false;
      isDragging.current = false;
    };

    const preventSelect = (e: Event) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    window.addEventListener("touchstart", handleDown, { passive: true });
    window.addEventListener("touchend", handleUp, { passive: true });
    window.addEventListener("selectstart", preventSelect);

    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchstart", handleDown);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("selectstart", preventSelect);

      // Restore body cursor if it was manipulated
      if (hasSetCursor.current) {
        document.body.style.cursor = "";
      }
    };
  }, []);

  useFrame((_, delta) => {
    // Clamp delta representing sudden frame drops to keep physics code highly stable
    const dt = Math.min(delta, 0.025);
    const pos = physicalState.current;
    const isMobile = size.width < 768;

    // Smoothly adapt when dimension size changes dynamically
    if (size.width !== pos.lastWidth || size.height !== pos.lastHeight) {
      pos.lastWidth = size.width;
      pos.lastHeight = size.height;
    }

    // 1. Map pointers to normalized 3D viewport canvas workspace coordinates on plane z=0
    const targetWorld = get3DWorldPosition(pointerRef.current.x, pointerRef.current.y, 0);
    const targetX = targetWorld.x;
    const targetY = targetWorld.y;

    // 2. Fetch the current position of the Bob before physics step
    const xCur = cordLength * Math.sin(pos.thetaX);
    const yCur = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);

    // 3. Distance check in projection space (XY coordinates)
    const dx = targetX - xCur;
    const dy = targetY - yCur;
    const distance2D = Math.sqrt(dx * dx + dy * dy);

    // Grab threshold: how close user's pointer must be to grab the bob
    const grabThreshold = isMobile ? 1.6 : 1.2;

    // Use recursive 3D raycast to check if cursor points right at the 3D model
    const isIntersected = bobRef.current 
      ? checkIntersection(pointerRef.current.x, pointerRef.current.y, bobRef.current) 
      : false;

    // High fidelity interaction: can grab if either intersecting the 3D model or within the proximity field
    const canInteract = isIntersected || distance2D < grabThreshold;

    // Handle Grab/Hover Cursor Updates beautifully
    if (isDragging.current) {
      if (hasSetCursor.current !== "grabbing") {
        document.body.style.cursor = "grabbing";
        hasSetCursor.current = "grabbing";
      }
    } else if (canInteract) {
      if (hasSetCursor.current !== "grab") {
        document.body.style.cursor = "grab";
        hasSetCursor.current = "grab";
      }
    } else {
      if (hasSetCursor.current) {
        document.body.style.cursor = "";
        hasSetCursor.current = null;
      }
    }

    // Actively transition state based on dragging / physics rules
    if (isReduced) {
      // Instantly rest if accessibility motion preferences are active
      pos.thetaX = 0;
      pos.thetaY = 0;
      pos.omegaX = 0;
      pos.omegaY = 0;
      pos.alphaX = 0;
      pos.alphaY = 0;
      isDragging.current = false;
    } else {
      // Catch click/grab moment trigger
      if (isMouseDown.current && !isDragging.current && canInteract) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        // Drag logic: compute angular target orientation so bob aligns directly with mouse coords
        // Clamp dragging angle bounds (+/- 75 degrees) to prevent complete loop-the-loop flips
        const targetThetaX = Math.max(-1.3, Math.min(1.3, Math.atan2(targetX, anchorY - targetY)));
        // Touch or slide-drag maps cleanly on X, flat projection in plane Z=0
        const targetThetaY = 0;

        // Solve angular velocity based on dragging displacement rate dt
        if (dt > 0) {
          pos.omegaX = (targetThetaX - pos.thetaX) / dt;
          pos.omegaY = (targetThetaY - pos.thetaY) / dt;
        }

        pos.thetaX = targetThetaX;
        pos.thetaY = targetThetaY;

        // Reset current acceleration since velocity is fully slave to client drag displacement
        pos.alphaX = 0;
        pos.alphaY = 0;
      } else {
        // PHYSICS LOOP: Verlet Stable Integration

        // Current bob 3D coordinates
        const xCur = cordLength * Math.sin(pos.thetaX);
        const yCur = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
        const zCur = cordLength * Math.sin(pos.thetaY);
        currentBobPos.set(xCur, yCur, zCur);

        // Calculate active cursor attraction force at current position
        const cursorForce = getCursorForce(pointerRef.current.x, pointerRef.current.y, currentBobPos, isMobile);

        // Restore gravity pendulum pull
        const g = 14.5; // Constant standard gravity
        const gAccelX = -(g / cordLength) * Math.sin(pos.thetaX);
        const gAccelY = -(g / cordLength) * Math.sin(pos.thetaY);

        // Project cursor forces onto angular tangent components (energy transfer)
        const extAccelX = (cursorForce.x * Math.cos(pos.thetaX) + cursorForce.y * Math.sin(pos.thetaX) * Math.cos(pos.thetaY)) / cordLength;
        const extAccelY = (cursorForce.y * Math.cos(pos.thetaX) * Math.sin(pos.thetaY) + cursorForce.z * Math.cos(pos.thetaY)) / cordLength;

        // Combined initial accelerations
        const alphaX_t = gAccelX + extAccelX;
        const alphaY_t = gAccelY + extAccelY;

        // Path prediction step
        const dtSq = dt * dt;
        pos.thetaX += pos.omegaX * dt + 0.5 * pos.alphaX * dtSq;
        pos.thetaY += pos.omegaY * dt + 0.5 * pos.alphaY * dtSq;

        // Lock boundaries strictly to ensure stability
        pos.thetaX = Math.max(-1.42, Math.min(1.42, pos.thetaX));
        pos.thetaY = Math.max(-1.42, Math.min(1.42, pos.thetaY));

        // Evaluate model accelerations of the new predicted state
        const xNew = cordLength * Math.sin(pos.thetaX);
        const yNew = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
        const zNew = cordLength * Math.sin(pos.thetaY);
        currentBobPos.set(xNew, yNew, zNew);

        // Calculate active cursor attraction force at predicated next position
        const nextCursorForce = getCursorForce(pointerRef.current.x, pointerRef.current.y, currentBobPos, isMobile);

        const nextGAccelX = -(g / cordLength) * Math.sin(pos.thetaX);
        const nextGAccelY = -(g / cordLength) * Math.sin(pos.thetaY);

        const nextExtAccelX = (nextCursorForce.x * Math.cos(pos.thetaX) + nextCursorForce.y * Math.sin(pos.thetaX) * Math.cos(pos.thetaY)) / cordLength;
        const nextExtAccelY = (nextCursorForce.y * Math.cos(pos.thetaX) * Math.sin(pos.thetaY) + nextCursorForce.z * Math.cos(pos.thetaY)) / cordLength;

        const alphaX_next = nextGAccelX + nextExtAccelX;
        const alphaY_next = nextGAccelY + nextExtAccelY;

        // Compute natural physical medium damping (higher damping makes swing die to rest beautifully)
        const frameDampingFactor = Math.pow(0.985, dt * 60);

        // Correct velocity using predicted average forces
        pos.omegaX = (pos.omegaX + 0.5 * (pos.alphaX + alphaX_next) * dt) * frameDampingFactor;
        pos.omegaY = (pos.omegaY + 0.5 * (pos.alphaY + alphaY_next) * dt) * frameDampingFactor;

        // Carry forward acceleration models
        pos.alphaX = alphaX_next;
        pos.alphaY = alphaY_next;
      }
    }

    // 4. Trace modern three coordinates
    const finalX = cordLength * Math.sin(pos.thetaX);
    const finalY = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
    const finalZ = cordLength * Math.sin(pos.thetaY);

    const mobileScale = size.width < 768 ? 0.72 : 1.0;

    // 5. Update Group Translation and swing rotation vectors first to have the latest values for the line mapping
    if (bobRef.current) {
      bobRef.current.position.set(finalX, finalY, finalZ);

      // Rotate bob to align directly with string deflection angle (Euler rotation)
      bobRef.current.rotation.set(
        pos.thetaY * 1.08,
        0,
        -pos.thetaX * 1.08
      );
    }

    // 6. Connect and adjust the Line mesh wire points precisely to the rotated suspension point
    if (lineMesh && bobRef.current) {
      const positions = lineMesh.geometry.attributes.position.array as Float32Array;
      positions[0] = 0;
      positions[1] = anchorY;
      positions[2] = 0;

      // The loop ring is located at local position y = 0.72 in the scaled bob group coordinate system.
      // By applying the current Euler rotation of the group, we map it into accurate 3D world space.
      const suspensionOffset = new THREE.Vector3(0, 0.72 * mobileScale, 0);
      suspensionOffset.applyEuler(bobRef.current.rotation);

      positions[3] = finalX + suspensionOffset.x;
      positions[4] = finalY + suspensionOffset.y;
      positions[5] = finalZ + suspensionOffset.z;
      lineMesh.geometry.attributes.position.needsUpdate = true;
    }

    // 7. Dynamic PointLight localized floor shadows
    if (glowLightRef.current) {
      glowLightRef.current.position.set(finalX, finalY - 1.2, finalZ);
    }
  });
}
