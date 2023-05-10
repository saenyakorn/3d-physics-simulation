import { Box } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

interface FloorProps {}

export function Floor(props: FloorProps) {
  return (
    <RigidBody {...props} type="fixed" friction={100}>
      <Box material-color="yellow" receiveShadow position={[0, 0, 0]} args={[1000, 1, 1000]} />
    </RigidBody>
  )
}
