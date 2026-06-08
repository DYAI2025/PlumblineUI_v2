import { useRef, MutableRefObject, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
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
      color: new THREE.Color("#D5891B"), // Elegant golden suspension cable
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
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
        {/* Suspension loop ring: Warm metallic gold */}
        <mesh position={[0, 0.72, 0]}>
          <torusGeometry args={[0.075, 0.015, 8, 24]} />
          <meshPhysicalMaterial
            color="#D5891B"
            metalness={1.0}
            roughness={0.06}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Brushed anodized solid collar: Deep Umber */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.16, 16]} />
          <meshPhysicalMaterial
            color="#542409"
            metalness={0.9}
            roughness={0.25}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Heavy Rounded Shoulder Block: Polished silver metallic chrome with deep shadows */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            emissive="#17110D"
            emissiveIntensity={0.25}
            metalness={1.0}
            roughness={0.04}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
          />
        </mesh>

        {/* Concentric collar ribbon accent: Rich Bronze */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.265, 0.265, 0.12, 32]} />
          <meshPhysicalMaterial
            color="#7F3A0E"
            metalness={1.0}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Dynamic laser calibration track: Bright mirror polished brassy gold */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.266, 0.266, 0.05, 32]} />
          <meshPhysicalMaterial
            color="#D5891B"
            emissive="#542409"
            emissiveIntensity={0.18}
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Sharp focus conical weight: Custom metallic high-fidelity chrome body */}
        <mesh position={[0, -0.38, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.26, 0.95, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            emissive="#17110D"
            emissiveIntensity={0.22}
            metalness={1.0}
            roughness={0.03}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Overlayed Conical Core Nose Cap: Rich Gold */}
        <mesh position={[0, -0.68, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.13, 0.35, 16]} />
          <meshPhysicalMaterial
            color="#D5891B"
            metalness={1.0}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
          />
        </mesh>

        {/* Polished indicators & precision tip bounds: Deepest Umber point */}
        <mesh position={[0, -0.855, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#17110D" />
        </mesh>

        {/* Floating Calibration Focus Ring: Gilded Gold */}
        <mesh position={[0, -0.855, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.09, 24]} />
          <meshBasicMaterial color="#7F3A0E" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* 3. Volumetric glowing spot around Bob tips: Amber Gold aura */}
      <pointLight
        ref={glowLightRef}
        color="#D5891B"
        intensity={3.8}
        distance={4.5}
        decay={1.4}
      />
    </>
  );
}

export function Plumbline3DScene({ pointerRef }: Plumbline3DSceneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[60] overflow-hidden">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 42 }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.24} />
        
        {/* Spotlighting direct illumination directly targeting the plumb bob */}
        <spotLight
          position={[0, 8.0, 6.0]}
          intensity={9.0}
          angle={0.5}
          penumbra={0.4}
          color="#FFFFFF"
          castShadow={false}
        />
        
        {/* Dynamic lights for specular shine highlights on the metal profile */}
        <pointLight position={[5.0, 6.0, 4.0]} intensity={6.0} color="#FFFFFF" />
        <pointLight position={[-5.0, -1.5, 3.5]} intensity={4.5} color="#E2E8F0" />
        <directionalLight position={[0.5, 4.0, 4.0]} intensity={4.0} color="#FFFFFF" />

        {/* Realistic studio reflection mapping for realistic metal/mirror glare */}
        <Environment preset="city" />

        <PhysicsBob pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
