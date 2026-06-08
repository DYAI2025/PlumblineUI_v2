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
      color: new THREE.Color("#CBD5E1"),
      transparent: true,
      opacity: 0.72,
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
        {/* Suspension loop ring: metallic silver polished chrome */}
        <mesh position={[0, 0.72, 0]}>
          <torusGeometry args={[0.075, 0.015, 8, 24]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            metalness={1.0}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Brushed polished steel collar neck connection */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.16, 16]} />
          <meshPhysicalMaterial
            color="#94A3B8"
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Heavy Rounded Shoulder Block: Polished silver metallic chrome */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 32]} />
          <meshPhysicalMaterial
            color="#F1F5F9"
            emissive="#475569"
            emissiveIntensity={0.08}
            metalness={1.0}
            roughness={0.03}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Dynamic laser calibration track: bright polished mirror-finish chrome */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.266, 0.266, 0.05, 32]} />
          <meshPhysicalMaterial
            color="#E2E8F0"
            emissive="#334155"
            emissiveIntensity={0.15}
            metalness={1.0}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
          />
        </mesh>

        {/* Sharp focus conical weight: Custom metallic silver polished chrome */}
        <mesh position={[0, -0.38, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.26, 0.95, 32]} />
          <meshPhysicalMaterial
            color="#F8FAFC"
            emissive="#475569"
            emissiveIntensity={0.1}
            metalness={1.0}
            roughness={0.03}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Polished indicators & precision tip bounds */}
        <mesh position={[0, -0.855, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>

        <mesh position={[0, -0.855, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.07, 16]} />
          <meshBasicMaterial color="#F1F5F9" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 3. Volumetric glowing spot around Bob tips */}
      <pointLight
        ref={glowLightRef}
        color="#E2E8F0"
        intensity={3.2}
        distance={4.0}
        decay={1.5}
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
