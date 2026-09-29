import {
  showroomProducts,
  type ShowroomLayout,
  type ShowroomProduct,
} from "./showroom-data";

const ROOM = { minX: -6.35, maxX: 6.35, minZ: -5.55, maxZ: 4.65 };
const GAP = 0.12;
const TABLE_SEATING_OVERLAP_LIMIT = 0.5;

function rotatedHalfExtents(product: ShowroomProduct, rotationY: number) {
  const [width, depth] = product.footprint;
  const cosine = Math.abs(Math.cos(rotationY));
  const sine = Math.abs(Math.sin(rotationY));
  return {
    x: (width * cosine + depth * sine) / 2,
    z: (width * sine + depth * cosine) / 2,
  };
}

export function canPlaceProduct(
  productId: string,
  candidate: ShowroomLayout,
  layouts: Record<string, ShowroomLayout>,
) {
  const product = showroomProducts.find((item) => item.id === productId);
  if (!product) return false;
  const half = rotatedHalfExtents(product, candidate.rotationY);
  const [x, , z] = candidate.position;

  if (
    x - half.x < ROOM.minX ||
    x + half.x > ROOM.maxX ||
    z - half.z < ROOM.minZ ||
    z + half.z > ROOM.maxZ
  ) return false;

  return showroomProducts.every((other) => {
    if (other.id === productId) return true;
    const otherLayout = layouts[other.id];
    if (!otherLayout) return true;
    const otherHalf = rotatedHalfExtents(other, otherLayout.rotationY);
    const distanceX = Math.abs(x - otherLayout.position[0]);
    const distanceZ = Math.abs(z - otherLayout.position[2]);
    const overlapX = Math.max(0, half.x + otherHalf.x - distanceX);
    const overlapZ = Math.max(0, half.z + otherHalf.z - distanceZ);

    if (overlapX === 0 || overlapZ === 0) {
      return (
        distanceX >= half.x + otherHalf.x + GAP ||
        distanceZ >= half.z + otherHalf.z + GAP
      );
    }

    const tableAndSeating =
      (product.placementKind === "table" && other.placementKind === "seating") ||
      (product.placementKind === "seating" && other.placementKind === "table");
    if (!tableAndSeating) return false;

    const overlapArea = overlapX * overlapZ;
    const productArea = half.x * 2 * (half.z * 2);
    const otherArea = otherHalf.x * 2 * (otherHalf.z * 2);
    const overlapRatio = overlapArea / Math.min(productArea, otherArea);
    return overlapRatio <= TABLE_SEATING_OVERLAP_LIMIT;
  });
}

export function findNearestValidPlacement(
  productId: string,
  candidate: ShowroomLayout,
  layouts: Record<string, ShowroomLayout>,
) {
  if (canPlaceProduct(productId, candidate, layouts)) return candidate;

  const step = 0.1;
  const maxDistance = 1.2;
  const offsets: Array<[number, number]> = [];
  for (let x = -maxDistance; x <= maxDistance; x += step) {
    for (let z = -maxDistance; z <= maxDistance; z += step) {
      offsets.push([x, z]);
    }
  }
  offsets.sort(([ax, az], [bx, bz]) => ax * ax + az * az - (bx * bx + bz * bz));

  for (const [offsetX, offsetZ] of offsets) {
    const adjusted: ShowroomLayout = {
      ...candidate,
      position: [
        Math.round((candidate.position[0] + offsetX) * 10) / 10,
        candidate.position[1],
        Math.round((candidate.position[2] + offsetZ) * 10) / 10,
      ],
    };
    if (canPlaceProduct(productId, adjusted, layouts)) return adjusted;
  }
  return null;
}
