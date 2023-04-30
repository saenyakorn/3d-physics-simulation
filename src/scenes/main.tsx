import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { Box } from '../objects/Box'
import { Car } from '../objects/Car'
import { Floor } from '../objects/Floor'

export function MainScene() {
  useThree(({ camera }) => {
    camera.position.set(100, 100, 100)
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Box />
        <Car />
        <Floor />
      </Physics>
      <CameraControls />
    </>
  )
}
