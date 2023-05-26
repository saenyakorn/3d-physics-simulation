import { forwardRef } from 'react'

import { Mesh } from 'three'

interface ActorProps {}

export const Actor = forwardRef<Mesh, ActorProps>(function Actor({ ...props }, ref) {
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
})
