import { CuboidCollider, RigidBody } from '@react-three/rapier'

interface FloorProps {}

export function Floor(props: FloorProps) {
  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  )
}
