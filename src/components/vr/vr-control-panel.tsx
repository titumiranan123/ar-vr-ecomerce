import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { ShowroomProduct } from "./showroom-data";

type Props = {
  selected: ShowroomProduct | null;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onResetSelected: () => void;
  onResetAll: () => void;
  onExitVr: () => void;
};

function VrButton({
  label,
  position,
  width = 0.42,
  color = "#6547ff",
  onClick,
}: {
  label: string;
  position: [number, number, number];
  width?: number;
  color?: string;
  onClick: () => void;
}) {
  return (
    <group
      position={position}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <mesh>
        <boxGeometry args={[width, 0.2, 0.035]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.5} />
      </mesh>
      <Text position={[0, 0, 0.025]} fontSize={0.065} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

export function VrControlPanel({
  selected,
  onRotateLeft,
  onRotateRight,
  onResetSelected,
  onResetAll,
  onExitVr,
}: Props) {
  return (
    <group position={[0, 1.55, -1.65]}>
      <mesh>
        <boxGeometry args={[1.62, 0.88, 0.055]} />
        <meshStandardMaterial color="#10131b" transparent opacity={0.96} roughness={0.65} />
      </mesh>
      <Text position={[-0.7, 0.32, 0.035]} fontSize={0.07} color="#69e8f1" anchorX="left">
        VISTARA VR
      </Text>
      <Text position={[-0.7, 0.16, 0.035]} fontSize={0.105} maxWidth={1.35} color="white" anchorX="left">
        {selected?.name ?? "Select a furniture piece"}
      </Text>
      <Text position={[-0.7, 0.02, 0.035]} fontSize={0.055} maxWidth={1.35} color="#aab0bf" anchorX="left">
        {selected ? `${selected.price}  •  Trigger and drag to move` : "Point and trigger to select • Left stick move • Aim at floor to teleport"}
      </Text>
      {selected && (
        <>
          <VrButton label="ROTATE LEFT" position={[-0.48, -0.18, 0.045]} onClick={onRotateLeft} />
          <VrButton label="ROTATE RIGHT" position={[0, -0.18, 0.045]} onClick={onRotateRight} />
          <VrButton label="RESET ITEM" position={[0.48, -0.18, 0.045]} onClick={onResetSelected} />
        </>
      )}
      <VrButton label="RESET ROOM" position={[-0.25, -0.36, 0.045]} width={0.62} color="#323746" onClick={onResetAll} />
      <VrButton label="EXIT VR" position={[0.45, -0.36, 0.045]} width={0.62} color="#c83f5b" onClick={onExitVr} />
    </group>
  );
}
