import { Environment } from '@react-three/drei'

import { Actor } from '../objects/Actor'
import { Plane } from '../objects/Plane'
import { Track } from '../objects/Track'

export const PLANE_NAME = 'PLANE'

// Define that X-axis is forward moving and Z-axis is side moving

export function MainScene() {
  return (
    <>
      <Environment files={'/textures/envmap.hdr'} background />
      <ambientLight intensity={0.2} />
      {/* <directionalLight position={[-10, 10, 0]} intensity={0.4} /> */}
      <Actor />
      <Plane name={PLANE_NAME} />
      <Track />
    </>
  )
}
