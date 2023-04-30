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

  useFrame((state) => {
    if (!ref.current) return
    // Get keyboard controls
    const { forward, backward, left, right, jump } = get()
    const velocity = ref.current.linvel()
    // // update camera
    const translation = ref.current.translation()
    state.camera.position.set(10, 10, 10)
    // movement
    frontVector.current.set(0, 0, Number(backward) - Number(forward))
    sideVector.current.set(Number(left) - Number(right), 0, 0)
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation)
    ref.current.setLinvel(
      {
        x: direction.current.x,
        y: velocity.y,
        z: direction.current.z,
      },
      true
    )
  })

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 0, 0]}
      enabledRotations={[true, true, true]}
      scale={[0.1, 0.1, 0.1]}
    >
      <primitive object={object} />
    </RigidBody>
  )
}
