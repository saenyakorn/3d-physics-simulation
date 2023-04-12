import { useThree } from '@react-three/fiber'
import { Box } from '../objects/box'
import { Car } from '../objects/car'
import { CameraControls, Stage } from '@react-three/drei'

export function MainScene() {
  useThree(({ camera }) => {
    camera.position.set(100, 100, 100)
  })

  return (
    <>
      {/* <Stage preset="rembrandt" intensity={1} environment="city"> */}
      <Car />
      <Box />
      {/* </Stage> */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <CameraControls />
    </>
  )
}
