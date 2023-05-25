import { useEffect, useRef } from 'react'

import { useBox, usePlane } from '@react-three/cannon'
import { OrbitControls, PerspectiveCamera, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Mesh, Vector3 } from 'three'

import { KeyBoardControlKey } from '../constants/keyboard'
import { Actor } from '../objects/Actor'
import { Plane } from '../objects/Plane'

const MOVEMENT_FORCE = 0.2
const MAX_VELOCITY = 2
const JUMP_FORCE = 2
const PLANE_NAME = 'PLANE'

// Define that X-axis is forward moving and Z-axis is side moving

export function MainScene() {
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])
  const jumpPressed = useKeyboardControls((state) => state[KeyBoardControlKey.JUMP])

  const cameraRef = useRef<Mesh>()
  const actorVelocity = useRef(new Vector3())
  const isOnPlane = useRef(false)

  const [planeRef] = usePlane<Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0] }))
  const [actorRef, actorApi] = useBox<Mesh>(() => ({
    mass: 1,
    position: [0, 5, 0],
    onCollideBegin: (e) => {
      if (e.body.name === PLANE_NAME) isOnPlane.current = true
    },
    onCollideEnd: (e) => {
      if (e.body.name === PLANE_NAME) isOnPlane.current = false
    },
  }))

  // Subscribe to the actor velocity to use it in the movement logic
  useEffect(() => {
    const unsubscribe = actorApi.velocity.subscribe((v) => {
      actorVelocity.current = new Vector3(...v)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  // Apply a force to the actor when the jump key is pressed
  const jump = () => {
    if (isOnPlane.current) {
      actorApi.applyImpulse([0, JUMP_FORCE, 0], [0, 0, 0])
    }
  }

  // Handle keyboard pressed and control actor movement
  const handleMovement = () => {
    // Cannot move if the actor is not on the plane
    let movementForce = MOVEMENT_FORCE
    if (!isOnPlane.current) {
      movementForce *= 0.5
    }

    const impulseDirection = new Vector3()

    if (leftPressed && actorVelocity.current.z > -MAX_VELOCITY) {
      impulseDirection.add(new Vector3(0, 0, -movementForce))
    }
    if (rightPressed && actorVelocity.current.z < MAX_VELOCITY) {
      impulseDirection.add(new Vector3(0, 0, movementForce))
    }
    if (forwardPressed && actorVelocity.current.x < MAX_VELOCITY) {
      impulseDirection.add(new Vector3(movementForce, 0, 0))
    }
    if (backwardPressed && actorVelocity.current.x > -MAX_VELOCITY) {
      impulseDirection.add(new Vector3(-movementForce, 0, 0))
    }

    actorApi.applyImpulse(impulseDirection?.toArray(), [0, 0, 0])
  }

  useFrame(() => {
    console.log(isOnPlane.current)
    // Jump when the jump key is pressed
    if (jumpPressed) {
      jump()
    }
    // Handle keyboard pressed and control actor movement
    handleMovement()

    // Move the camera to the actor position
    if (cameraRef.current && actorRef.current) {
      const actorPosition = actorRef.current.getWorldPosition(new Vector3())
      const actorDirection = actorRef.current.getWorldDirection(new Vector3())
      cameraRef.current.position.copy(actorPosition)
      cameraRef.current.position.add(new Vector3(-10, 10, 0))
      cameraRef.current.lookAt(actorPosition)
      // console.log(actorDirection.multiplyScalar(1000).round().divideScalar(100))
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      <PerspectiveCamera ref={cameraRef} makeDefault />
      <Actor ref={actorRef} />
      <Plane ref={planeRef} name={PLANE_NAME} />
    </>
  )
}
