import { useRef } from 'react'

import { Sphere, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody, vec3 } from '@react-three/rapier'

import { Vector3 } from 'three'

export function SphereRigidBody() {
  const ref = useRef<RapierRigidBody>(null)
  const [, get] = useKeyboardControls()

  useFrame(({ camera }) => {
    if (!ref.current) {
      return
    }

    // Get keyboard controls
    const { forward, backward, left, right, jump } = get()

    ref.current.applyImpulse(new Vector3(0, 0, Number(forward) - Number(backward)), true)

    // update camera
    const cameraOffset = new Vector3(0, 5, -10)
    const translation = vec3(ref.current.translation())
    camera.position.set(
      translation.x + cameraOffset.x,
      translation.y + cameraOffset.y,
      translation.z + cameraOffset.z
    )
  })

  return (
    <RigidBody ref={ref} colliders="ball" mass={1} type="dynamic" position={[0, 10, 0]}>
      <Sphere castShadow receiveShadow material-color="pink" />
    </RigidBody>
  )
}
