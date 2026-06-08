import { useRef, MutableRefObject, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePendulumPhysics } from "./usePendulumPhysics";

interface Plumbline3DSceneProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

function PhysicsBob({ pointerRef }: Plumbline3DSceneProps) {
  const { size } = useThree();

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

  // Hook handles calculations, integration, boundaries, velocities, mouse drag state, and cursor style updates
  usePendulumPhysics({
    pointerRef,
    bobRef,
    lineMesh,
    glowLightRef,
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

export function Plumbline3DScene({ pointerRef }: Plumbline3DSceneProps) {
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
