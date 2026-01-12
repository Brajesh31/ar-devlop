import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlassSphere = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#ff6b35"
        />
      </mesh>
    </Float>
  );
};

const GlassTorus = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.3}
          chromaticAberration={0.15}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.05}
          iridescence={0.8}
          iridescenceIOR={1.2}
          iridescenceThicknessRange={[0, 1200]}
          color="#22c55e"
        />
      </mesh>
    </Float>
  );
};

const GlassBox = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.4}
          chromaticAberration={0.1}
          anisotropy={0.25}
          distortion={0.15}
          distortionScale={0.15}
          temporalDistortion={0.08}
          iridescence={0.6}
          iridescenceIOR={1.1}
          iridescenceThicknessRange={[0, 1000]}
          color="#8b5cf6"
        />
      </mesh>
    </Float>
  );
};

interface FloatingShapes3DProps {
  className?: string;
}

export const FloatingShapes3D = ({ className = '' }: FloatingShapes3DProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b35" />
        
        <GlassSphere position={[3, 1.5, 0]} scale={0.8} />
        <GlassTorus position={[-3, -1, 1]} scale={0.6} />
        <GlassBox position={[2.5, -1.5, -1]} scale={0.5} />
        <GlassSphere position={[-2, 2, -2]} scale={0.4} />
      </Canvas>
    </div>
  );
};

export default FloatingShapes3D;
