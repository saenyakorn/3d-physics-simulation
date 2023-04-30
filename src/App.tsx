import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { MainScene } from './scenes/main'

export const KeyBoardControlKey = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
} as const
export type KeyBoardControlKey = (typeof KeyBoardControlKey)[keyof typeof KeyBoardControlKey]

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
      <Canvas style={{ width: '100vw', height: '100vh' }} shadows>
        <MainScene />
      </Canvas>
    </KeyboardControls>
  )
}
