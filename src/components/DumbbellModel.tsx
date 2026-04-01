import { useMemo, type JSX } from 'react';
import * as THREE from 'three';

const discSpecs = [
  { r: 0.46, h: 0.14 },
  { r: 0.4, h: 0.12 },
  { r: 0.34, h: 0.1 },
];

export function DumbbellModel(props: JSX.IntrinsicElements['group']) {
  const barLen = 2.08;
  const barR = 0.068;

  const geos = useMemo(() => {
    const bar = new THREE.CylinderGeometry(barR, barR, barLen, 48);
    const knurl = new THREE.CylinderGeometry(barR * 1.04, barR * 1.04, barLen * 0.44, 32);
    const collar = new THREE.CylinderGeometry(0.112, 0.112, 0.075, 36);
    const plates = discSpecs.map((d) => new THREE.CylinderGeometry(d.r, d.r, d.h, 56));
    const ring = new THREE.TorusGeometry(discSpecs[0].r * 0.9, 0.026, 12, 56);
    const cap = new THREE.CylinderGeometry(0.085, 0.085, 0.018, 36);
    return { bar, knurl, collar, plates, ring, cap };
  }, [barLen, barR]);

  return (
    <group {...props}>
      <mesh geometry={geos.bar} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial
          color="#e4e6eb"
          metalness={0.95}
          roughness={0.14}
          clearcoat={0.92}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh geometry={geos.knurl} castShadow rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial color="#c9ccd4" metalness={0.88} roughness={0.38} clearcoat={0.35} />
      </mesh>
      {[-1, 1].map((sign) => (
        <mesh
          key={sign}
          geometry={geos.collar}
          position={[sign * (barLen / 2 - 0.02), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <meshPhysicalMaterial
            color="#dfe1e8"
            metalness={0.92}
            roughness={0.2}
            clearcoat={0.85}
            clearcoatRoughness={0.22}
          />
        </mesh>
      ))}
      {([-1, 1] as const).map((dir) => {
        const plates: JSX.Element[] = [];
        let contact = dir * (barLen / 2);
        let outerX = contact;
        discSpecs.forEach((d, i) => {
          const cx = contact + dir * (d.h / 2);
          contact += dir * d.h;
          outerX = contact;
          plates.push(
            <mesh
              key={`${dir}-p-${i}`}
              geometry={geos.plates[i]}
              position={[cx, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#14161c"
                roughness={0.94}
                metalness={0.04}
                clearcoat={0.12}
                clearcoatRoughness={0.6}
              />
            </mesh>
          );
        });
        return (
          <group key={dir}>
            {plates}
            <mesh
              geometry={geos.ring}
              position={[outerX + dir * 0.055, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              castShadow
            >
              <meshPhysicalMaterial
                color="#e63946"
                metalness={0.45}
                roughness={0.42}
                emissive="#5c0f18"
                emissiveIntensity={0.18}
                clearcoat={0.55}
              />
            </mesh>
            <mesh
              geometry={geos.cap}
              position={[outerX + dir * 0.11, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#c7ccd3"
                metalness={0.96}
                roughness={0.2}
                clearcoat={0.65}
                clearcoatRoughness={0.18}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
