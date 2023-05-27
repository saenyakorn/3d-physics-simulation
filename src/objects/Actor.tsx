import { useEffect, useRef } from 'react'

import { useBox } from '@react-three/cannon'
import { CameraControls, OrbitControls, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Mesh } from 'three'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { CameraType } from '../constants/camera'
import { KeyBoardControlKey } from '../constants/keyboard'
import { PLANE_NAME } from '../scenes/MainScene'
import { useCameraStore } from '../states/camera'

const MOVEMENT_FORCE = 0.4
const MAX_VELOCITY = 4
const JUMP_FORCE = 5
const ROTATE_SPEED = Math.PI / 3 // per second
const PERSPECRIVE_CAMERA_POSITION = new Vector3(10, 10, 0)

interface ActorProps {}

export function Actor({ ...props }) {
  const cameraType = useCameraStore((state) => state.cameraType)
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])
  const jumpPressed = useKeyboardControls((state) => state[KeyBoardControlKey.JUMP])

  const cameraRef = useRef<Mesh>()
  const cameraControlRef = useRef<CameraControls>(null)
  const orbitControlRef = useRef<OrbitControlsImpl>(null)
  const actorVelocity = useRef(new Vector3())
  const actorPosition = useRef(new Vector3())
  const cameraAngle = useRef(Math.PI / 2)
  const isOnPlane = useRef(false)
  const lastActorPosition = useRef(new Vector3())

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

    if (leftPressed) {
      cameraAngle.current += ROTATE_SPEED * delta
    }
    if (rightPressed) {
      cameraAngle.current -= ROTATE_SPEED * delta
    }

    cameraControlRef.current.rotateAzimuthTo(cameraAngle.current, true)
  }

  // Handle keyboard pressed and control actor movement
  const handleMovement = () => {
    if (!cameraControlRef.current) return

    let movementForce = MOVEMENT_FORCE

    // Slow down the actor when it is not on the plane
    if (!isOnPlane.current) {
      movementForce *= 0.5
    }

    const impulseDirection = new Vector3()
    const forwardDirection = cameraControlRef.current.getPosition(new Vector3())

    forwardDirection.y = 0
    forwardDirection.normalize()

    if (forwardPressed && actorVelocity.current.length() < MAX_VELOCITY) {
      impulseDirection.add(forwardDirection.clone().multiplyScalar(movementForce))
    }
    if (backwardPressed && actorVelocity.current.length() > -MAX_VELOCITY) {
      impulseDirection.add(forwardDirection.clone().multiplyScalar(-movementForce))
    }

    actorApi.applyImpulse(impulseDirection?.toArray(), [0, 0, 0])
  }

  // Move the camera to the actor position
  const followActor = (delta: number) => {
    if (!cameraControlRef.current || !actorRef.current) return

    cameraControlRef.current.setLookAt(
      actorPosition.current.x + PERSPECRIVE_CAMERA_POSITION.x,
      actorPosition.current.y + PERSPECRIVE_CAMERA_POSITION.y,
      actorPosition.current.z + PERSPECRIVE_CAMERA_POSITION.z,
      actorPosition.current.x,
      actorPosition.current.y,
      actorPosition.current.z,
      true
    )

    // const actorPosition = actorRef.current.getWorldPosition(new Vector3())

    // // If the actor is moving, move the camera with it
    // if (!lastActorPosition.current.equals(new Vector3())) {
    //   const positionDiff = actorPosition.clone().sub(lastActorPosition.current)

    //   // cameraRef.current.position.add(positionDiff)

    //   // const expectedCameraPosition = cameraRef.current
    //   //   .getWorldPosition(new Vector3())
    //   //   .add(positionDiff)

    //   // orbitControlRef.current.target.set(actorPosition.x, actorPosition.y, actorPosition.z)
    // }

    // // update the last actor position
    // lastActorPosition.current = actorPosition
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

  const resetCamera = () => {
    if (!actorPosition.current) return

    const currentActorPosition = actorPosition.current.clone()

    cameraControlRef.current?.setLookAt(
      currentActorPosition.x + PERSPECRIVE_CAMERA_POSITION.x,
      currentActorPosition.y + PERSPECRIVE_CAMERA_POSITION.y,
      currentActorPosition.z + PERSPECRIVE_CAMERA_POSITION.z,
      currentActorPosition.x,
      currentActorPosition.y,
      currentActorPosition.z,
      true
    )
    cameraControlRef.current?.zoomTo(1, true)
  }

  // Handle on camera type change
  useEffect(() => {
    // Reset the camera position
    switch (cameraType) {
      case CameraType.FOLLOW: {
        resetCamera()
        break
      }
      case CameraType.DECORATION: {
        closeUpActor()
        break
      }
    }
  }, [cameraType])

  useFrame((state, delta) => {
    switch (cameraType) {
      case CameraType.FOLLOW: {
        if (jumpPressed) {
          jump()
        }
        handleRotateCamera(delta)
        handleMovement()
        followActor(delta)
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
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
      {/* <PerspectiveCamera ref={cameraRef} position={[10, 10, 0]} /> */}
      <OrbitControls ref={orbitControlRef} />
      <CameraControls ref={cameraControlRef} makeDefault />
    </>
  )
}
