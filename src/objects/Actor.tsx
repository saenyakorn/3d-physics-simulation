import { forwardRef } from 'react'

import { Box } from '@react-three/drei'

import { Mesh } from 'three'

interface ActorProps {}

export const Actor = forwardRef<Mesh, ActorProps>(function Actor({ ...props }, ref) {
  return (
    <mesh ref={ref}>
      <Box castShadow receiveShadow material-color="#EAE0AD" />
    </mesh>
  )
})
