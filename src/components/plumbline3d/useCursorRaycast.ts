import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCallback, useMemo } from "react";

export function useCursorRaycast() {
  const { camera, size } = useThree();

  // Pre-allocated static references to support zero-allocation calculations per-frame
  const tempV2 = useMemo(() => new THREE.Vector2(), []);
  const tempV3 = useMemo(() => new THREE.Vector3(), []);
  const tempForceV3 = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  /**
   * Converts pixel coordinates of the pointer into stabilized 3D world coordinates on the plane Z = zPlane.
   */
  const get3DWorldPosition = useCallback(
    (pointerX: number, pointerY: number, zPlane: number = 0): THREE.Vector3 => {
      // 1. Convert pixel space to normalized device coordinates (NDC) [-1, 1]
      const ndcX = (pointerX / size.width) * 2 - 1;
      const ndcY = -(pointerY / size.height) * 2 + 1;

      tempV2.set(ndcX, ndcY);

      // 2. Set ray direction from camera parameters
      raycaster.setFromCamera(tempV2, camera);

      // 3. Project coordinates on the Z-plane
      const origin = raycaster.ray.origin;
      const dir = raycaster.ray.direction;

      if (Math.abs(dir.z) > 0.0001) {
        const t = (zPlane - origin.z) / dir.z;
        tempV3.copy(dir).multiplyScalar(t).add(origin);
      } else {
        // Safe proportional fallback projection
        tempV3.set(ndcX * 5, ndcY * 5, zPlane);
      }

      return tempV3;
    },
    [camera, size, tempV2, tempV3, raycaster]
  );

  /**
   * Calculates the 3D world space attraction/energy force exerted by the cursor onto the bob.
   */
  const getCursorForce = useCallback(
    (pointerX: number, pointerY: number, bobPos: THREE.Vector3, isMobile: boolean): THREE.Vector3 => {
      const targetWorld = get3DWorldPosition(pointerX, pointerY, 0);
      
      // Calculate force direction vector
      tempForceV3.set(
        targetWorld.x - bobPos.x,
        targetWorld.y - bobPos.y,
        0 - bobPos.z // Force pulls towards the depth plane where mouse pointer rests
      );

      const distance = tempForceV3.length();
      const maxDistance = 10.0;

      // Apply proportional magnetic pull/tension force field
      if (distance < maxDistance && distance > 0.05 && !isMobile) {
        const intensity = Math.pow((maxDistance - distance) / maxDistance, 1.8);
        const dynamicGravityForce = 38.0 * intensity;
        tempForceV3.normalize().multiplyScalar(dynamicGravityForce);
      } else {
        tempForceV3.set(0, 0, 0);
      }

      return tempForceV3;
    },
    [get3DWorldPosition, tempForceV3]
  );

  /**
   * Performs high-precision recursive 3D raycasting against any target Object3D.
   */
  const checkIntersection = useCallback(
    (pointerX: number, pointerY: number, targetObject: THREE.Object3D): boolean => {
      const ndcX = (pointerX / size.width) * 2 - 1;
      const ndcY = -(pointerY / size.height) * 2 + 1;

      tempV2.set(ndcX, ndcY);
      raycaster.setFromCamera(tempV2, camera);

      // Check intersections recursively
      const intersects = raycaster.intersectObject(targetObject, true);
      return intersects.length > 0;
    },
    [camera, size, tempV2, raycaster]
  );

  return {
    get3DWorldPosition,
    getCursorForce,
    checkIntersection,
  };
}
