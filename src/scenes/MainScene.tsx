import { useEffect, useRef } from 'react'

import { useBox } from '@react-three/cannon'
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useKeyboardControls,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Mesh, Vector3 } from 'three'

import { CameraType } from '../constants/camera'
import { KeyBoardControlKey } from '../constants/keyboard'
import { Actor } from '../objects/Actor'
import { Plane } from '../objects/Plane'
import { Track } from '../objects/Track'
import { useCameraStore } from '../states/camera'

const MOVEMENT_FORCE = 0.2
const MAX_VELOCITY = 2
const JUMP_FORCE = 5
const PLANE_NAME = 'PLANE'

// Define that X-axis is forward moving and Z-axis is side moving

export function MainScene() {
  const cameraType = useCameraStore((state) => state.cameraType)
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])
  const jumpPressed = useKeyboardControls((state) => state[KeyBoardControlKey.JUMP])

  const cameraRef = useRef<Mesh>()
  const cameraPosition = useRef(new Vector3())
  const actorVelocity = useRef(new Vector3())
  const isOnPlane = useRef(false)

  // TODO: move movement logic to actor component
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
      isOnPlane.current = false
    }
  }

  // Handle keyboard pressed and control actor movement
  const handleMovement = () => {
    let movementForce = MOVEMENT_FORCE

    // Slow down the actor when it is not on the plane
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

  // Move the camera to the actor position
  const followActor = (delta: number) => {
    if (cameraRef.current && actorRef.current) {
      const actorPosition = actorRef.current.getWorldPosition(new Vector3())
      cameraRef.current.position.copy(actorPosition)
      cameraRef.current.position.add(new Vector3(-10, 10, 0))
      cameraRef.current.lookAt(actorPosition)
    }
  }

  // Close up the camera to the actor for decoration
  const closeUpActor = (delta: number) => {
    if (cameraRef.current && actorRef.current) {
      const actorPosition = actorRef.current.getWorldPosition(new Vector3())
      cameraRef.current.position.copy(actorPosition)
      cameraRef.current.position.add(new Vector3(-2, 2, 3))
      cameraRef.current.lookAt(actorPosition.add(new Vector3(-1, 0, 0)))
    }
  }

  useFrame((state, delta) => {
    switch (cameraType) {
      case CameraType.FOLLOW: {
        // Jump when the jump key is pressed
        if (jumpPressed) jump()
        // Handle keyboard pressed and control actor movement
        handleMovement()
        // followActor(delta)
        break
      }
      case CameraType.DECORATION: {
        closeUpActor(delta)
        break
      }
    }
  })

  return (
    <>
      <Environment files={'/textures/envmap.hdr'} background />
      <ambientLight intensity={0.2} />
      {/* <directionalLight position={[-10, 10, 0]} intensity={0.4} /> */}
      <OrbitControls />
      <PerspectiveCamera ref={cameraRef} makeDefault position={[-6, 3.9, 6.21]} />
      <Actor ref={actorRef} />
      <Plane name={PLANE_NAME} />
      <Track />
    </>
  )
}
