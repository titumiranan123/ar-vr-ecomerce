import { AdaptiveDpr, ContactShadows, PerformanceMonitor } from "@react-three/drei";
import {
  IfInSessionMode,
  XR,
  XROrigin,
  useXRControllerLocomotion,
  type XRStore,
} from "@react-three/xr";
import { useRef } from "react";
import type { Group, Vector3 } from "three";
import { DesktopControls } from "./desktop-controls";
import { FurnitureItem } from "./furniture-item";
import { ShowroomRoom } from "./showroom-room";
import {
  showroomProducts,
  type ShowroomLayout,
  type ShowroomProduct,
} from "./showroom-data";
import { VrControlPanel } from "./vr-control-panel";

type Props = {
  store: XRStore;
  layouts: Record<string, ShowroomLayout>;
  selected: ShowroomProduct | null;
  dragging: boolean;
  onSelect: (product: ShowroomProduct) => void;
  onMove: (id: string, position: [number, number, number]) => boolean;
  onDragChange: (dragging: boolean) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onResetSelected: () => void;
  onResetAll: () => void;
  onExitVr: () => void;
};

function VrExperience(props: Omit<Props, "store">) {
  const origin = useRef<Group>(null);
  useXRControllerLocomotion(
    (velocity, rotationVelocityY, deltaTime) => {
      if (!origin.current) return;
      origin.current.position.x = Math.min(
        5.7,
        Math.max(-5.7, origin.current.position.x + velocity.x * deltaTime),
      );
      origin.current.position.z = Math.min(
        4,
        Math.max(-5, origin.current.position.z + velocity.z * deltaTime),
      );
      origin.current.rotation.y += rotationVelocityY;
    },
    { speed: 2 },
    { type: "snap", degrees: 30, deadZone: 0.65 },
    "left",
  );

  const teleport = (point: Vector3) => {
    if (!origin.current) return;
    const nextX = Math.min(5.7, Math.max(-5.7, origin.current.position.x + point.x));
    const nextZ = Math.min(4, Math.max(-5, origin.current.position.z + point.z));
    origin.current.position.set(nextX, 0, nextZ);
  };

  return (
    <>
      <color attach="background" args={["#0b0c10"]} />
      <PerformanceMonitor flipflops={3}>
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>
      <fog attach="fog" args={["#111218", 10, 22]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 2]} intensity={2.2} color="#fff1dc" castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-4, 5, 1]} angle={0.55} penumbra={0.7} intensity={45} color="#9a82ff" />
      <spotLight position={[4, 5, -1]} angle={0.55} penumbra={0.8} intensity={38} color="#62d7e5" />
      <ShowroomRoom onTeleport={teleport} />
      {showroomProducts.map((product) => (
        <FurnitureItem
          key={product.id}
          product={product}
          layout={props.layouts[product.id]}
          selected={props.selected?.id === product.id}
          onSelect={props.onSelect}
          onMove={props.onMove}
          onDragChange={props.onDragChange}
        />
      ))}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={14} blur={2.8} far={6} />
      <IfInSessionMode deny="immersive-vr">
        <DesktopControls enabled={!props.dragging} />
      </IfInSessionMode>
      <XROrigin ref={origin}>
        <IfInSessionMode allow="immersive-vr">
          <VrControlPanel
            selected={props.selected}
            onRotateLeft={props.onRotateLeft}
            onRotateRight={props.onRotateRight}
            onResetSelected={props.onResetSelected}
            onResetAll={props.onResetAll}
            onExitVr={props.onExitVr}
          />
        </IfInSessionMode>
      </XROrigin>
    </>
  );
}

export function ShowroomScene({ store, ...props }: Props) {
  return (
    <XR store={store}>
      <VrExperience {...props} />
    </XR>
  );
}
