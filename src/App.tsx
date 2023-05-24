import { Suspense } from 'react'

import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { KeyBoardControlKey } from './constants/keyboard'
import { MainScene } from './scenes/MainScene'

export function App() {
  return (
    <KeyboardControls
      map={[
        { name: KeyBoardControlKey.FORWARD, keys: ['ArrowUp', 'w', 'W'] },
        { name: KeyBoardControlKey.BACKWARD, keys: ['ArrowDown', 's', 'S'] },
        { name: KeyBoardControlKey.LEFT, keys: ['ArrowLeft', 'a', 'A'] },
        { name: KeyBoardControlKey.RIGHT, keys: ['ArrowRight', 'd', 'D'] },
        { name: KeyBoardControlKey.JUMP, keys: ['Space'] },
      ]}
    >
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        shadows
        camera={{ position: [10, 10, 10], fov: 30 }}
      >
        <color attach="background" args={['#ececec']} />
        <Suspense>
          <Physics debug>
            <MainScene />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
