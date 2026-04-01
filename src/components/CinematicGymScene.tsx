import { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { GymModel } from './GymModel';
import { DumbbellModel } from './DumbbellModel';

function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const t = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    const targetX = THREE.MathUtils.lerp(0, 0.8, t);
    const targetY = THREE.MathUtils.lerp(2.0, 1.15, t);
    const targetZ = THREE.MathUtils.lerp(8.0, 6.2, t);
    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.07);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, THREE.MathUtils.degToRad(-7 + t * 5), 0.07);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, THREE.MathUtils.degToRad(7 - t * 10), 0.07);
    camera.position.x += Math.sin(state.clock.elapsedTime * 0.18) * 0.002;
  });

  return null;
}

export function CinematicGymScene({
  enableControls = true,
}: {
  enableControls?: boolean;
}) {
  return (
    <div className="scene-shell relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(145deg,#04070d,#131b2b_54%,#090d14)] shadow-2xl backdrop-blur-xl">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.2, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#0a0f1a']} />

        <CameraRig />

        <ambientLight intensity={0.25} />
        <hemisphereLight intensity={0.45} groundColor="#05070b" color="#d9e4ff" />
        
        {/* Cinematic Lights */}
        <directionalLight
          position={[-5, 9, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          position={[7, 5, 4]}
          angle={0.34}
          penumbra={0.95}
          intensity={1.25}
          color="#ff744f"
        />
        <rectAreaLight position={[-2.6, 2.5, 3.2]} width={4.5} height={4.5} intensity={5} color="#9dc0ff" />
        <pointLight position={[0, 2.4, 0]} intensity={0.45} color="#ff6b6b" />
        
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>
        
        {/* Gym Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Multiple GymModels */}
        <group position={[-2.1, -0.18, -1.55]} rotation={[0, 0.16, 0]}>
          <Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.06}>
            <GymModel scale={1.45} />
          </Float>
        </group>
        
        {/* Dumbbell area */}
        <group position={[1.6, -0.7, -1.15]}>
          <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.05}>
            <group scale={1.68} rotation={[0.12, -0.94, 0.03]}>
              <DumbbellModel />
            </group>
          </Float>
        </group>
        
        {enableControls && (
          <PresentationControls global snap zoom={1} rotation={[-0.13, 0.2, 0]}>
            <Float rotationIntensity={0.4}>
              <group scale={1.5} />
            </Float>
          </PresentationControls>
        )}
        
        <ContactShadows position={[0, -1.45, 0]} opacity={0.52} scale={16} blur={2.2} far={4.5} />
      </Canvas>
    </div>
  );
}

