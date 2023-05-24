import { forwardRef } from 'react'

import { PlaneProps as CanonPlanProps } from '@react-three/cannon'

import { Mesh } from 'three'

interface PlaneProps extends CanonPlanProps {}

export const Plane = forwardRef<Mesh, PlaneProps>(function Actor(props, ref) {
  return <mesh ref={ref}></mesh>
})
