import { useRef } from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody } from '@react-three/rapier'

import { Vector3 } from 'three'

import { useModelLoader } from '../hooks/useModelLoader'

interface CarProps {
  speed?: number
}

export function Car({ speed = 20 }: CarProps) {
  const { object } = useModelLoader('/assets/car.mtl', '/assets/car.obj')
  const ref = useRef<RapierRigidBody>(null)
  const [, get] = useKeyboardControls()

  const direction = useRef<Vector3>(new Vector3(0, 0, 0))
  const frontVector = useRef<Vector3>(new Vector3(0, 0, 0))
  const sideVector = useRef<Vector3>(new Vector3(0, 0, 0))

  useFrame(({ camera }) => {
    if (!ref.current) {
      return
    }

    // Get keyboard controls
    const { forward, backward, left, right, jump } = get()
    const velocity = ref.current.linvel()

    // movement
    frontVector.current.set(0, 0, Number(forward) - Number(backward))
    sideVector.current.set(Number(right) - Number(left), 0, 0)
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(speed)
    // .applyEuler(camera.rotation)
    ref.current.setLinvel(
      {
        x: direction.current.x,
        y: velocity.y,
        z: direction.current.z,
      },
      true
    )

    // update camera
    const translation = ref.current.translation()
    const cameraOffset = new Vector3(-12, 30, -40)
    camera.position.set(
      translation.x + cameraOffset.x,
      translation.y + cameraOffset.y,
      translation.z + cameraOffset.z
    )

    // console.log({
    //   cameraPosition: `${camera.position.x}, ${camera.position.y}, ${camera.position.z}`,
    //   targetPosition: `${controlRef.current.target.x}, ${controlRef.current.target.y}, ${controlRef.current.target.z}`,
    //   carPosition: `${translation.x}, ${translation.y}, ${translation.z}`,
    // })
  })

  return (
    <RigidBody
      ref={ref}
      colliders="cuboid"
      mass={1}
      type="dynamic"
      position={[0, 0, 0]}
      enabledRotations={[true, true, true]}
      scale={[0.1, 0.1, 0.1]}
    >
      <primitive object={object} />
      <axesHelper args={[100]} />
    </RigidBody>
  )
}
