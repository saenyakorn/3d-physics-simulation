import { useEffect, useRef } from 'react'

import { useBox } from '@react-three/cannon'
import { CameraControls, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Mesh } from 'three'
import { Vector3 } from 'three'

import CameraControlsImpl from 'camera-controls'

import { CameraType } from '../constants/camera'
import { KeyBoardControlKey } from '../constants/keyboard'
import { PLANE_NAME } from '../scenes/MainScene'
import { useCameraStore } from '../states/camera'
import { useColorStore } from '../states/color'

const MOVEMENT_FORCE = 0.4
const MAX_VELOCITY = 4
const JUMP_FORCE = 5
const ROTATE_SPEED = Math.PI / 2 // per second
const CAMERA_OFFSET_RADIUS = 20
const CAMERA_OFFSET_HEIGHT = 12

export function Actor() {
  const [color1, color2, color3] = useColorStore((state) => [
    state.color1,
    state.color2,
    state.color3,
  ])

  const cameraType = useCameraStore((state) => state.cameraType)
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])
  const rotateLeftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.ROTATE_LEFT])
  const rotateRightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.ROTATE_RIGHT])
  const jumpPressed = useKeyboardControls((state) => state[KeyBoardControlKey.JUMP])

  const cameraControlRef = useRef<CameraControls>(null)
  const actorVelocity = useRef(new Vector3())
  const actorPosition = useRef(new Vector3())
  const cameraAngle = useRef(Math.PI / 2)
  const isOnPlane = useRef(false)

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
    const unsubscribeVelocity = actorApi.velocity.subscribe((v) => {
      actorVelocity.current = new Vector3(...v)
    })
    const unsubscribePosition = actorApi.position.subscribe((p) => {
      actorPosition.current = new Vector3(...p)
    })
    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
    }
  }, [])

  // Apply a force to the actor when the jump key is pressed
  const jump = () => {
    if (isOnPlane.current) {
      actorApi.applyImpulse([0, JUMP_FORCE, 0], [0, 0, 0])
      isOnPlane.current = false
    }
  }

  const handleRotateCamera = (delta: number) => {
    if (!cameraControlRef.current) return

    if (rotateLeftPressed) {
      cameraAngle.current += ROTATE_SPEED * delta
    }
    if (rotateRightPressed) {
      cameraAngle.current -= ROTATE_SPEED * delta
    }
  }

  // Handle keyboard pressed and control actor movement
  const handleMovement = () => {
    if (!cameraControlRef.current) return

    const impulseDirection = new Vector3()
    const forwardDirection = cameraControlRef.current.camera.getWorldDirection(new Vector3())

    forwardDirection.y = 0
    forwardDirection.normalize()
    const leftDirection = new Vector3(forwardDirection.z, 0, -forwardDirection.x)

    if (forwardPressed && actorVelocity.current.length() < MAX_VELOCITY) {
      impulseDirection.add(forwardDirection.clone().multiplyScalar(MOVEMENT_FORCE))
    }
    if (backwardPressed && actorVelocity.current.length() < MAX_VELOCITY) {
      impulseDirection.add(forwardDirection.clone().multiplyScalar(-MOVEMENT_FORCE))
    }
    if (leftPressed && actorVelocity.current.length() < MAX_VELOCITY) {
      impulseDirection.add(leftDirection.clone().multiplyScalar(MOVEMENT_FORCE))
    }
    if (rightPressed && actorVelocity.current.length() < MAX_VELOCITY) {
      impulseDirection.add(leftDirection.clone().multiplyScalar(-MOVEMENT_FORCE))
    }

    actorApi.applyImpulse(impulseDirection?.toArray(), [0, 0, 0])
  }

  // Move the camera to the actor position
  const followActor = () => {
    if (!cameraControlRef.current || !actorRef.current) return

    // calculate new camera position with polar coordinates
    const cameraOffset = new Vector3(
      CAMERA_OFFSET_RADIUS * Math.sin(cameraAngle.current),
      CAMERA_OFFSET_HEIGHT,
      CAMERA_OFFSET_RADIUS * Math.cos(cameraAngle.current)
    )

    cameraControlRef.current.setLookAt(
      actorPosition.current.x + cameraOffset.x,
      actorPosition.current.y + cameraOffset.y,
      actorPosition.current.z + cameraOffset.z,
      actorPosition.current.x,
      actorPosition.current.y,
      actorPosition.current.z,
      true
    )
    cameraControlRef.current?.zoomTo(1, true)
  }

  // Close up the camera to the actor for decoration
  const closeUpActor = () => {
    if (!actorPosition.current || !cameraControlRef.current) return

    const currentActorPosition = actorPosition.current.clone()

    const expectedCameraPosition = currentActorPosition
    const expectedCameraLookAt = currentActorPosition

    cameraControlRef.current?.setLookAt(
      expectedCameraPosition.x - 2,
      expectedCameraPosition.y + 2,
      expectedCameraPosition.z + 3,
      expectedCameraLookAt.x - 1,
      expectedCameraLookAt.y,
      expectedCameraLookAt.z,
      true
    )
    cameraControlRef.current?.zoomTo(0.8, true)
  }

  useFrame((state, delta) => {
    switch (cameraType) {
      case CameraType.FOLLOW: {
        if (jumpPressed) {
          jump()
        }
        handleRotateCamera(delta)
        handleMovement()
        followActor()
        break
      }
      case CameraType.DECORATION: {
        closeUpActor()
        break
      }
    }
  })

  return (
    <>
      <mesh ref={actorRef} castShadow receiveShadow>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material-0" color={color1} />
        <meshStandardMaterial attach="material-1" color={color1} />
        <meshStandardMaterial attach="material-2" color={color3} />
        <meshStandardMaterial attach="material-3" color={color3} />
        <meshStandardMaterial attach="material-4" color={color2} />
        <meshStandardMaterial attach="material-5" color={color2} />
      </mesh>
      <CameraControls
        ref={cameraControlRef}
        makeDefault
        mouseButtons={{
          wheel: CameraControlsImpl.ACTION.NONE,
          left: CameraControlsImpl.ACTION.NONE,
          middle: CameraControlsImpl.ACTION.NONE,
          right: CameraControlsImpl.ACTION.NONE,
        }}
      />
    </>
  )
}
