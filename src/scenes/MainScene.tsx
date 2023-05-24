import { useEffect, useRef } from 'react'

import { Triplet, useBox, usePlane } from '@react-three/cannon'
import { OrbitControls, PerspectiveCamera, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Mesh, Vector3 } from 'three'

import { KeyBoardControlKey } from '../constants/keyboard'
import { Actor } from '../objects/Actor'
import { Plane } from '../objects/Plane'

const MOVEMENT_FORCE = 0.2
const MAX_VELOCITY = 2

export function MainScene() {
  const leftPressed = useKeyboardControls((state) => state[KeyBoardControlKey.LEFT])
  const rightPressed = useKeyboardControls((state) => state[KeyBoardControlKey.RIGHT])
  const backwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.BACKWARD])
  const forwardPressed = useKeyboardControls((state) => state[KeyBoardControlKey.FORWARD])

  const [actorRef, actorApi] = useBox<Mesh>(() => ({ mass: 1, position: [0, 5, 0] }))
  const [planeRef] = usePlane<Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0] }))
  const cameraRef = useRef<Mesh>()
  const actorVelocity = useRef(new Vector3())

  // Subscribe to the actor velocity to use it in the movement logic
  useEffect(() => {
    const unsubscribe = actorApi.velocity.subscribe((v) => {
      actorVelocity.current = new Vector3(...v)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const handleMovement = () => {
    const impulseDirection = new Vector3()

    if (leftPressed && actorVelocity.current.x > -MAX_VELOCITY) {
      impulseDirection.add(new Vector3(-MOVEMENT_FORCE, 0, 0))
    }
    if (rightPressed && actorVelocity.current.x < MAX_VELOCITY) {
      impulseDirection.add(new Vector3(MOVEMENT_FORCE, 0, 0))
    }
    if (forwardPressed && actorVelocity.current.z > -MAX_VELOCITY) {
      impulseDirection.add(new Vector3(0, 0, -MOVEMENT_FORCE))
    }
    if (backwardPressed && actorVelocity.current.z < MAX_VELOCITY) {
      impulseDirection.add(new Vector3(0, 0, MOVEMENT_FORCE))
    }

    const impulseTriplet = impulseDirection?.toArray() as Triplet
    actorApi.applyImpulse(impulseTriplet, [0, 0, 0])
  }

  useFrame(() => {
    handleMovement()

    // Move the camera to the actor position
    if (cameraRef.current && actorRef.current) {
      const actorPosition = actorRef.current.getWorldPosition(new Vector3())
      const actorDirection = actorRef.current.getWorldDirection(new Vector3())
      cameraRef.current.position.copy(actorPosition)
      cameraRef.current.position.add(new Vector3(10, 10, 10))
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
      <Plane ref={planeRef} />
    </>
  )
}
