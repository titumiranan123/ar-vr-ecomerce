import { TeleportTarget } from "@react-three/xr";
import type { Vector3 } from "three";

export function ShowroomRoom({ onTeleport }: { onTeleport: (point: Vector3) => void }) {
  return (
    <group>
      <TeleportTarget onTeleport={onTeleport}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#bdb5a9" roughness={0.75} />
        </mesh>
      </TeleportTarget>
      <mesh position={[0, 3, -6]} receiveShadow>
        <boxGeometry args={[18, 6, 0.25]} />
        <meshStandardMaterial color="#24262c" roughness={0.85} />
      </mesh>
      <mesh position={[-7, 3, 0]} receiveShadow>
        <boxGeometry args={[0.25, 6, 12]} />
        <meshStandardMaterial color="#303238" roughness={0.9} />
      </mesh>
      <mesh position={[7, 3, 0]} receiveShadow>
        <boxGeometry args={[0.25, 6, 12]} />
        <meshStandardMaterial color="#202229" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.015, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial color="#68615a" roughness={1} />
      </mesh>
      <mesh position={[0, 2.8, -5.82]}>
        <boxGeometry args={[5.3, 2.3, 0.08]} />
        <meshStandardMaterial color="#101115" emissive="#172944" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 2.8, -5.72]}>
        <planeGeometry args={[4.8, 1.8]} />
        <meshBasicMaterial color="#77b5d5" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}
