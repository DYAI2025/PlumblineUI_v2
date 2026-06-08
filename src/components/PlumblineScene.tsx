import { useRef, MutableRefObject, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface PlumblineSceneProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

function PhysicsBob({ pointerRef }: PlumblineSceneProps) {
  const { size, viewport } = useThree();
  const isReduced = useReducedMotion();

  // Dynamic top-center anchor and lower rest points based on viewport units
  const anchorY = viewport.height * 0.5;
  const restY = -viewport.height * 0.05;
  const cordLength = anchorY - restY;

  // Scene references
  const bobRef = useRef<THREE.Group>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  // Instantiated wire primitive to bypass JSX type issues with standard tags
  const lineMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#148A88"),
      transparent: true,
      opacity: 0.65,
      linewidth: 1,
    });
    return new THREE.Line(geo, mat);
  }, []);

  // theta/omega/acceleration physical variables stored in refs to prevent per-frame garbage collector cycles
  const physicalState = useRef({
    thetaX: 0,
    thetaY: 0,
    omegaX: 0,
    omegaY: 0,
    alphaX: 0,
    alphaY: 0,
    lastWidth: window.innerWidth,
    lastHeight: window.innerHeight,
  });

  useFrame((_, delta) => {
    // Clamp delta representing sudden frame drops to keep physics simulation highly stable
    const dt = Math.min(delta, 0.025);
    const pos = physicalState.current;
    const isMobile = size.width < 768;

    // Smoothly adapt when dimensions change dynamically
    if (size.width !== pos.lastWidth || size.height !== pos.lastHeight) {
      pos.lastWidth = size.width;
      pos.lastHeight = size.height;
    }

    if (isReduced) {
      // Instantly rest if accessibility motion preferences are flagged
      pos.thetaX = 0;
      pos.thetaY = 0;
      pos.omegaX = 0;
      pos.omegaY = 0;
      pos.alphaX = 0;
      pos.alphaY = 0;
    } else {
      // 1. Map pointer screen coordinates to 3D workspace viewport
      const ndcX = (pointerRef.current.x / size.width) * 2 - 1;
      const ndcY = -(pointerRef.current.y / size.height) * 2 + 1;
      const targetX = ndcX * viewport.width * 0.5;
      const targetY = ndcY * viewport.height * 0.5;

      // 2. Compute current 3D position based on theta state
      const xCur = cordLength * Math.sin(pos.thetaX);
      const yCur = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
      const zCur = cordLength * Math.sin(pos.thetaY);

      // 3. Acceleration logic for current frame - Hooke's & Gravity model mapped to polar rotation
      const g = 15.0; // Gravity acceleration factor

      // Initialize with gravity restoring/pendulum angular acceleration
      // alpha = -g/L * sin(theta)
      const gAccelX = -(g / cordLength) * Math.sin(pos.thetaX);
      const gAccelY = -(g / cordLength) * Math.sin(pos.thetaY);

      let externalForceX = 0;
      let externalForceY = 0;
      let externalForceZ = 0;

      // Cursor gravity influence pull coordinates vector
      const cdx = targetX - xCur;
      const cdy = targetY - yCur;
      const cdz = 0 - zCur;
      const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz);

      // Apply heavy attraction cursor gravity forces on larger screens to mimic tension fields
      if (cursorDist < 10.0 && cursorDist > 0.05 && !isMobile) {
        const intensity = Math.pow((10.0 - cursorDist) / 10.0, 1.8);
        const dynamicGravityForce = 38.0 * intensity;
        externalForceX = (cdx / cursorDist) * dynamicGravityForce;
        externalForceY = (cdy / cursorDist) * dynamicGravityForce;
        externalForceZ = (cdz / cursorDist) * dynamicGravityForce;
      }

      // Projection of secondary forces onto angular orthogonal components (tangent lines)
      // alphaX(t) = (Fx * cos(thetaX) + Fy * sin(thetaX) * cos(thetaY)) / L
      // alphaY(t) = (Fy * cos(thetaX) * sin(thetaY) + Fz * cos(thetaY)) / L
      const extAccelX = (externalForceX * Math.cos(pos.thetaX) + externalForceY * Math.sin(pos.thetaX) * Math.cos(pos.thetaY)) / cordLength;
      const extAccelY = (externalForceY * Math.cos(pos.thetaX) * Math.sin(pos.thetaY) + externalForceZ * Math.cos(pos.thetaY)) / cordLength;

      const alphaX_t = gAccelX + extAccelX;
      const alphaY_t = gAccelY + extAccelY;

      // 4. PREDICT path using Velocity Verlet step-1
      const dtSq = dt * dt;
      pos.thetaX += pos.omegaX * dt + 0.5 * pos.alphaX * dtSq;
      pos.thetaY += pos.omegaY * dt + 0.5 * pos.alphaY * dtSq;

      // Lock bounds to prevent unstable full-revolutions spinning
      pos.thetaX = Math.max(-1.42, Math.min(1.42, pos.thetaX));
      pos.thetaY = Math.max(-1.42, Math.min(1.42, pos.thetaY));

      // 5. EVALUATE acceleration at predicted new position (dt+1)
      const xNew = cordLength * Math.sin(pos.thetaX);
      const yNew = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
      const zNew = cordLength * Math.sin(pos.thetaY);

      const ncdx = targetX - xNew;
      const ncdy = targetY - yNew;
      const ncdz = 0 - zNew;
      const nextCursorDist = Math.sqrt(ncdx * ncdx + ncdy * ncdy + ncdz * ncdz);

      let nextExtForceX = 0;
      let nextExtForceY = 0;
      let nextExtForceZ = 0;

      if (nextCursorDist < 10.0 && nextCursorDist > 0.05 && !isMobile) {
        const nextIntensity = Math.pow((10.0 - nextCursorDist) / 10.0, 1.8);
        const nGravityForce = 38.0 * nextIntensity;
        nextExtForceX = (ncdx / nextCursorDist) * nGravityForce;
        nextExtForceY = (ncdy / nextCursorDist) * nGravityForce;
        nextExtForceZ = (ncdz / nextCursorDist) * nGravityForce;
      }

      const nextExtAccelX = (nextExtForceX * Math.cos(pos.thetaX) + nextExtForceY * Math.sin(pos.thetaX) * Math.cos(pos.thetaY)) / cordLength;
      const nextExtAccelY = (nextExtForceY * Math.cos(pos.thetaX) * Math.sin(pos.thetaY) + nextExtForceZ * Math.cos(pos.thetaY)) / cordLength;

      const nextGAccelX = -(g / cordLength) * Math.sin(pos.thetaX);
      const nextGAccelY = -(g / cordLength) * Math.sin(pos.thetaY);

      const alphaX_next = nextGAccelX + nextExtAccelX;
      const alphaY_next = nextGAccelY + nextExtAccelY;

      // 6. CORRECT angular velocity using Velocity Verlet step-2 with natural medium-air decay
      const frameDampingFactor = Math.pow(0.982, dt * 60);
      pos.omegaX = (pos.omegaX + 0.5 * (pos.alphaX + alphaX_next) * dt) * frameDampingFactor;
      pos.omegaY = (pos.omegaY + 0.5 * (pos.alphaY + alphaY_next) * dt) * frameDampingFactor;

      // Save acceleration for the next frame iteration
      pos.alphaX = alphaX_next;
      pos.alphaY = alphaY_next;
    }

    // Solve absolute positions
    const finalX = cordLength * Math.sin(pos.thetaX);
    const finalY = anchorY - cordLength * Math.cos(pos.thetaX) * Math.cos(pos.thetaY);
    const finalZ = cordLength * Math.sin(pos.thetaY);

    // 7. Update the line mesh wire points
    if (lineMesh) {
      const positions = lineMesh.geometry.attributes.position.array as Float32Array;
      positions[0] = 0;
      positions[1] = anchorY;
      positions[2] = 0;
      positions[3] = finalX;
      positions[4] = finalY + 0.65; // Wire connects neatly to loop top
      positions[5] = finalZ;
      lineMesh.geometry.attributes.position.needsUpdate = true;
    }

    // 8. Update physical group position and proportional swing angles
    if (bobRef.current) {
      bobRef.current.position.set(finalX, finalY, finalZ);

      // Rotate bob to align directly with string deflection angle (Euler rotation)
      bobRef.current.rotation.set(
        pos.thetaY * 1.08,
        0,
        -pos.thetaX * 1.08
      );
    }

    // 9. Update points of localized soft floor shadows
    if (glowLightRef.current) {
      glowLightRef.current.position.set(finalX, finalY - 1.2, finalZ);
    }
  });

  // Calculate rendering scales for responsiveness
  const mobileScale = size.width < 768 ? 0.72 : 1.0;

  return (
    <>
      {/* 1. Fine glowing mathematical alignment line */}
      <primitive object={lineMesh} />

      {/* 2. Procedural Solid 3D Conical Bob Object */}
      <group ref={bobRef} scale={[mobileScale, mobileScale, mobileScale]}>
        {/* Suspension loop ring: gold/brass accent */}
        <mesh position={[0, 0.72, 0]}>
          <torusGeometry args={[0.075, 0.015, 8, 24]} />
          <meshPhysicalMaterial
            color="#D5891B"
            metalness={0.98}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Brushed collar neck connection: deep dark stainless steel */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.16, 16]} />
          <meshPhysicalMaterial
            color="#17110D"
            metalness={0.98}
            roughness={0.2}
            clearcoat={0.9}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Heavy Rounded Shoulder Block: Dark copper-steel core */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 32]} />
          <meshPhysicalMaterial
            color="#542409"
            emissive="#17110D"
            emissiveIntensity={0.18}
            metalness={0.96}
            roughness={0.24}
            clearcoat={0.8}
            clearcoatRoughness={0.18}
          />
        </mesh>

        {/* Dynamic laser calibration track: depth bronze detail */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.266, 0.266, 0.05, 32]} />
          <meshPhysicalMaterial
            color="#7F3A0E"
            emissive="#542409"
            emissiveIntensity={0.3}
            metalness={0.97}
            roughness={0.18}
          />
        </mesh>

        {/* Sharp focus conical weight: Custom metallic copper/bronze blend (rotated 180deg) */}
        <mesh position={[0, -0.38, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.26, 0.95, 32]} />
          <meshPhysicalMaterial
            color="#7F3A0E"
            emissive="#542409"
            emissiveIntensity={0.15}
            metalness={0.96}
            roughness={0.18}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Polished indicators & precision tip bounds */}
        <mesh position={[0, -0.855, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#D5891B" />
        </mesh>

        <mesh position={[0, -0.855, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.07, 16]} />
          <meshBasicMaterial color="#D5891B" side={THREE.DoubleSide} transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 3. Volumetric glowing spot around Bob tips */}
      <pointLight
        ref={glowLightRef}
        color="#D5891B"
        intensity={2.8}
        distance={4.0}
        decay={1.7}
      />
    </>
  );
}

export function PlumblineScene({ pointerRef }: PlumblineSceneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[4] overflow-hidden">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 42 }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.12} />
        
        {/* Colorful stage lights targeting brass and steel reflective surfaces */}
        <pointLight position={[3.5, 4.0, 3.5]} intensity={3.5} color="#148A88" />
        <pointLight position={[-3.5, -1.0, 2.5]} intensity={2.5} color="#7F3A0E" />
        <directionalLight position={[0, 4.0, 3.0]} intensity={2.0} color="#ffffff" />

        <PhysicsBob pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
