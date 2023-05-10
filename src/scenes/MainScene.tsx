import { Stats } from '@react-three/drei'
import { Vector3, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { Euler } from 'three'

import { Floor } from '../objects/Floor'
import { SphereRigidBody } from '../objects/SphereRigidBody'
import { Box } from '../objects/box'

export function MainScene() {
  useThree(({ camera }) => {
    camera.setRotationFromEuler(new Euler(Math.PI / 8, Math.PI, 0, 'XYZ'))
  })

  const boxPositions: Vector3[] = []
  for (let i = -100; i <= 100; i += 10) {
    for (let j = -100; j <= 100; j += 10) {
      boxPositions.push([i, 1, j])
    }
  }

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight castShadow intensity={0.4} position={[0, 10, 0]} />
      <Stats />
      <Physics debug>
        {boxPositions.map((position, index) => (
          <Box key={index} position={position} />
        ))}
        {/* <Car /> */}
        <SphereRigidBody />
        <Floor />
      </Physics>
    </>
  )
}
