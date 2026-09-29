import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Plane, Vector3 } from "three";
import type { ShowroomLayout, ShowroomProduct } from "./showroom-data";

const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
const dragPoint = new Vector3();
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const snap = (value: number) => Math.round(value * 10) / 10;
type CaptureTarget = EventTarget & {
  setPointerCapture: (pointerId: number) => void;
  releasePointerCapture: (pointerId: number) => void;
};

type Props = {
  product: ShowroomProduct; layout: ShowroomLayout; selected: boolean;
  onSelect: (product: ShowroomProduct) => void;
  onMove: (id: string, position: [number, number, number]) => boolean;
  onDragChange: (dragging: boolean) => void;
};

export function FurnitureItem({ product, layout, selected, onSelect, onMove, onDragChange }: Props) {
  const { scene } = useGLTF(product.model);
  const model = useMemo(() => scene.clone(true), [scene]);
  const [hovered, setHovered] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const dragging = useRef(false);
  const offset = useRef(new Vector3());

  const pulse = (event: ThreeEvent<PointerEvent>, intensity: number, duration: number) => {
    const pointerState = (event as unknown as {
      pointerState?: { inputSource?: XRInputSource };
    }).pointerState;
    const gamepad = pointerState?.inputSource?.gamepad as (Gamepad & {
      hapticActuators?: Array<{ pulse: (value: number, duration: number) => Promise<boolean> }>;
    }) | undefined;
    void gamepad?.hapticActuators?.[0]?.pulse(intensity, duration);
  };

  const getDragPoint = (event: ThreeEvent<PointerEvent>) => {
    if (event.pointerType === "grab") {
      dragPoint.copy(event.point);
      dragPoint.y = 0;
      return true;
    }
    return Boolean(event.ray.intersectPlane(floorPlane, dragPoint));
  };

  const stopDragging = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    event.stopPropagation();
    dragging.current = false;
    setBlocked(false);
    onDragChange(false);
    pulse(event, 0.25, 35);
    (event.target as CaptureTarget | null)?.releasePointerCapture(event.pointerId);
    document.body.style.cursor = hovered ? "grab" : "default";
  };

  return (
    <group position={layout.position} rotation={[0, layout.rotationY, 0]} scale={product.scale}
      onPointerDown={(event) => {
        event.stopPropagation(); onSelect(product); dragging.current = true; onDragChange(true);
        pulse(event, 0.45, 45);
        (event.target as CaptureTarget | null)?.setPointerCapture(event.pointerId);
        if (getDragPoint(event)) {
          offset.current.set(layout.position[0] - dragPoint.x, 0, layout.position[2] - dragPoint.z);
        }
        document.body.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        event.stopPropagation();
        if (getDragPoint(event)) {
          const accepted = onMove(product.id, [
            snap(clamp(dragPoint.x + offset.current.x, -5.5, 5.5)),
            0,
            snap(clamp(dragPoint.z + offset.current.z, -5, 4.5)),
          ]);
          setBlocked(!accepted);
          if (!accepted) pulse(event, 0.18, 25);
        }
      }}
      onPointerUp={stopDragging} onPointerCancel={stopDragging}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "grab"; }}
      onPointerOut={() => { setHovered(false); if (!dragging.current) document.body.style.cursor = "default"; }}
    >
      <primitive object={model} />
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[hovered || selected ? 0.13 : 0.1, 20, 20]} />
        <meshStandardMaterial color={blocked ? "#ff385c" : selected ? "#19d3e4" : "#7451ff"} emissive={blocked ? "#ff385c" : selected ? "#19d3e4" : "#7451ff"} emissiveIntensity={2} />
      </mesh>
      {selected && <>
        <pointLight position={[0, 1.5, 0]} color="#6c46ff" intensity={1.5} distance={3} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[0.65, 0.72, 48]} />
          <meshBasicMaterial color={blocked ? "#ff385c" : "#19d3e4"} transparent opacity={0.85} />
        </mesh>
      </>}
    </group>
  );
}

["/models/modern-arm-chair.glb", "/models/wooden-table.glb", "/models/wooden-shelves.glb", "/models/wooden-stool.glb"].forEach((path) => useGLTF.preload(path));
