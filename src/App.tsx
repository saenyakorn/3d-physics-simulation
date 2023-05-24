import { Suspense } from 'react'

import { Debug, Physics } from '@react-three/cannon'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

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
        <Suspense>
          <Physics>
            <Debug>
              <MainScene />
            </Debug>
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
