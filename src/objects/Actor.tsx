import { forwardRef } from 'react'

import { Box } from '@react-three/drei'
import { RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier'

interface ActorProps extends RigidBodyProps {}

export const Actor = forwardRef<RapierRigidBody, ActorProps>(function Actor(props, ref) {
  return (
    <RigidBody
      {...props}
      name="actor"
      colliders="trimesh"
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      ref={ref}
    >
      <Box castShadow receiveShadow material-color="#EAE0AD" position={[1, 1, 0]} />
    </RigidBody>
  )
})
