import { useRef } from 'react'

import { OrbitControls, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CollisionTarget, RapierRigidBody } from '@react-three/rapier'

import { KeyBoardControlKey } from '../constants/keyboard'
import { Actor } from '../objects/Actor'
import { Floor } from '../objects/Floor'

const MOVEMENT_FORCE = 0.5
const JUMP_FORCE = 5
const FLOOR_NAME = 'floor'

export function MainScene() {
  const jumpPressed = useKeyboardControls((state) => state[KeyBoardControlKey.JUMP])
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])

  // Declare a ref to the objects
  const actorRef = useRef<RapierRigidBody>(null)
  const isOnFloor = useRef<boolean>(false)

  const jump = () => {
    // Can not jump if the actor is not on the floor
    if (!isOnFloor.current) return
    actorRef.current?.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true)
  }

  const handleMovement = () => {
    // Do nothing if the actor is not on the floor
    if (!isOnFloor.current) return

    if (leftPressed) {
      actorRef.current?.applyImpulse({ x: -MOVEMENT_FORCE, y: 0, z: 0 }, true)
    }

    if (rightPressed) {
      actorRef.current?.applyImpulse({ x: MOVEMENT_FORCE, y: 0, z: 0 }, true)
    }

    if (backwardPressed) {
      actorRef.current?.applyImpulse({ x: 0, y: 0, z: -MOVEMENT_FORCE }, true)
    }

    if (forwardPressed) {
      actorRef.current?.applyImpulse({ x: 0, y: 0, z: MOVEMENT_FORCE }, true)
    }
  }

  const handleOnCollision = (other: CollisionTarget, expectedValue: boolean) => {
    if (other?.rigidBodyObject?.name === FLOOR_NAME) {
      isOnFloor.current = expectedValue
    }
  }

  useFrame(() => {
    if (jumpPressed) {
      jump()
    }
    handleMovement()
    console.log('FLOOR', isOnFloor.current)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      <Actor
        ref={actorRef}
        onCollisionEnter={({ other }) => handleOnCollision(other, true)}
        onCollisionExit={({ other }) => handleOnCollision(other, false)}
      />
      <Floor name={FLOOR_NAME} friction={10} />
    </>
  )
}
