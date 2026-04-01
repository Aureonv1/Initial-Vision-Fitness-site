import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Float, PresentationControls } from '@react-three/drei';
import { DumbbellModel } from './DumbbellModel';

import { useParallax } from '../hooks/useParallax'; // will create later

interface DumbbellSceneProps {
  scale?: number;
  position?: [number, number, number];
  enableControls?: boolean;
}

export function DumbbellScene({ 
  enableControls = true 
}: DumbbellSceneProps) {
  const { style } = useParallax(0.4);

  return (
    <div 
      className="relative h-full min-h-[320px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_40%),linear-gradient(145deg,#090d14,#151d2c_52%,#0a0f18)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)] perspective-3d tilt-3d card-3d sm:min-h-[380px]" 
      style={style}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,116,79,0.2), transparent 42%),
            radial-gradient(circle at 80% 70%, rgba(99,145,255,0.16), transparent 40%)`,
        }}
      />
      <Canvas
        className="!h-full !w-full"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.25, 5.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.24} />
        <hemisphereLight intensity={0.42} groundColor="#05070b" color="#d7e4ff" />
        <spotLight
          castShadow
          position={[5.4, 7.4, 4]}
          angle={0.42}
          penumbra={0.9}
          intensity={1.15}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-6, 4, 4]} intensity={0.5} color="#eef2ff" />
        <pointLight position={[-2, 1.5, 3]} intensity={0.3} color="#ff6b5f" />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.38, 0]} receiveShadow>
          <circleGeometry args={[3.4, 48]} />
          <meshStandardMaterial color="#0a1018" roughness={0.82} metalness={0.12} />
        </mesh>
        {enableControls && (
          <PresentationControls
            global
            config={{ mass: 2, tension: 220 }}
            snap
            speed={1.35}
            zoom={0.85}
            polar={[-0.4, 0.6]}
            azimuth={[-0.75, 0.75]}
          >
            <Float speed={2.1} rotationIntensity={0.18} floatIntensity={0.18}>
              <group scale={2.48} position={[0, -0.08, 0]}>
                <DumbbellModel rotation={[0.28, -0.68, 0.08]} />
              </group>
            </Float>
          </PresentationControls>
        )}
        {!enableControls && (
          <Float speed={2.1} rotationIntensity={0.18} floatIntensity={0.18}>
            <group scale={2.48} position={[0, -0.08, 0]}>
              <DumbbellModel rotation={[0.28, -0.68, 0.08]} />
            </group>
          </Float>
        )}
        <ContactShadows
          position={[0, -1.34, 0]}
          opacity={0.52}
          scale={10}
          blur={2}
          far={4}
          color="#0f1114"
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 sm:text-[11px]">
        <span>{enableControls ? 'Drag to rotate' : ''}</span>
        <span>Vision Fitness</span>
      </div>
    </div>
  );
}
