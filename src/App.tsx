import { Suspense } from 'react'

import { Debug, Physics } from '@react-three/cannon'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { Button, Stack } from '@mui/joy'

import { CameraType } from './constants/camera'
import { KeyBoardControlKey } from './constants/keyboard'
import { MainScene } from './scenes/MainScene'
import { useCameraStore } from './states/camera'

export function App() {
  const [cameraType, setCameraType] = useCameraStore((state) => [
    state.cameraType,
    state.setCameraType,
  ])

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
      <Stack sx={{ position: 'fixed', bottom: 20, left: 20 }} gap={2}>
        <Button
          variant={cameraType === CameraType.DECORATION ? 'outlined' : 'solid'}
          onClick={() => setCameraType(CameraType.DECORATION)}
          disabled={cameraType === CameraType.DECORATION}
        >
          Decorate
        </Button>
        <Button
          variant={cameraType === CameraType.FOLLOW ? 'outlined' : 'solid'}
          onClick={() => setCameraType(CameraType.FOLLOW)}
          disabled={cameraType === CameraType.FOLLOW}
        >
          Play
        </Button>
      </Stack>
    </KeyboardControls>
  )
}
