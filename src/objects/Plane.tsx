import { forwardRef } from 'react'

import { MeshProps } from '@react-three/fiber'

import { Mesh } from 'three'

interface PlaneProps extends MeshProps {}

export const Plane = forwardRef<Mesh, PlaneProps>(function Actor(props, ref) {
  return <mesh ref={ref} {...props}></mesh>
})
