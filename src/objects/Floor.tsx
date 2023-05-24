import { forwardRef } from 'react'

import { Box } from '@react-three/drei'
import { RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier'

interface FloorProps extends RigidBodyProps {}

export const Floor = forwardRef<RapierRigidBody, FloorProps>(function Floor(props, ref) {
  return (
    <RigidBody type="fixed" name={props.name} ref={ref}>
      <Box position={[0, 0, 0]} args={[100, 0.1, 100]}>
        <meshStandardMaterial color="#EAE0AD" />
      </Box>
    </RigidBody>
  )
})
