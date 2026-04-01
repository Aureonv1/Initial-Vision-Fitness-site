import * as THREE from 'three';
import { useMemo } from 'react';

export function GymModel(props: any) {
  const geos = useMemo(
    () => ({
      upright: new THREE.BoxGeometry(0.14, 1.9, 0.16),
      crossbar: new THREE.BoxGeometry(1.8, 0.12, 0.16),
      foot: new THREE.BoxGeometry(0.4, 0.08, 0.7),
      tray: new THREE.BoxGeometry(1.25, 0.05, 0.34),
      rod: new THREE.CylinderGeometry(0.035, 0.035, 0.42, 28),
      plateOuter: new THREE.CylinderGeometry(0.22, 0.22, 0.11, 48),
      plateInner: new THREE.CylinderGeometry(0.12, 0.12, 0.14, 40),
      benchPad: new THREE.BoxGeometry(1.1, 0.12, 0.42),
      benchBase: new THREE.BoxGeometry(0.8, 0.08, 0.28),
    }),
    []
  );

  return (
    <group {...props}>
      {[-0.82, 0.82].map((x) => (
        <mesh key={`upright-${x}`} geometry={geos.upright} position={[x, 0.95, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#4f5867" metalness={0.96} roughness={0.24} clearcoat={0.3} />
        </mesh>
      ))}

      <mesh geometry={geos.crossbar} position={[0, 1.82, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#5b6472" metalness={0.94} roughness={0.22} clearcoat={0.28} />
      </mesh>

      {[-0.82, 0.82].map((x) => (
        <mesh key={`foot-${x}`} geometry={geos.foot} position={[x, 0.04, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#2a313c" metalness={0.55} roughness={0.55} />
        </mesh>
      ))}

      {[0.48, 0.98, 1.48].map((y) => (
        <mesh key={`tray-${y}`} geometry={geos.tray} position={[0, y, -0.22]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#a7afbc" metalness={0.78} roughness={0.28} />
        </mesh>
      ))}

      {[0.48, 0.98, 1.48].flatMap((y) =>
        [-0.4, 0, 0.4].map((x) => (
          <group key={`${y}-${x}`} position={[x, y + 0.02, -0.08]}>
            <mesh geometry={geos.rod} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#d3d7df" metalness={0.98} roughness={0.18} />
            </mesh>
            <mesh geometry={geos.plateOuter} position={[0, 0, -0.11]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#10141b" metalness={0.08} roughness={0.94} clearcoat={0.08} />
            </mesh>
            <mesh geometry={geos.plateInner} position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#181f28" metalness={0.12} roughness={0.84} />
            </mesh>
          </group>
        ))
      )}

      <group position={[0, 0.44, 0.72]}>
        <mesh geometry={geos.benchPad} castShadow receiveShadow>
          <meshPhysicalMaterial color="#20262f" metalness={0.08} roughness={0.72} clearcoat={0.12} />
        </mesh>
        <mesh geometry={geos.benchBase} position={[0, -0.15, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#4e5563" metalness={0.88} roughness={0.28} />
        </mesh>
      </group>
    </group>
  );
}

