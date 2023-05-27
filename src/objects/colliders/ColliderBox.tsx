import { useBox } from '@react-three/cannon'

const debug = false

interface ColliderBoxProps {
  position: [x: number, y: number, z: number]
  scale: [x: number, y: number, z: number]
}

export function ColliderBox({ position, scale }: ColliderBoxProps) {
  useBox(() => ({
    args: scale,
    position: position,
    type: 'Static',
  }))

  return debug ? (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshBasicMaterial transparent={true} opacity={0.5} />
    </mesh>
  ) : null
}
