import { Suspense } from 'react'

import { Debug, Physics } from '@react-three/cannon'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { Button, FormLabel, Input, Stack, Typography } from '@mui/joy'

import { CameraType } from './constants/camera'
import { KeyBoardControlKey } from './constants/keyboard'
import { MainScene } from './scenes/MainScene'
import { useCameraStore } from './states/camera'
import { useColorStore } from './states/color'

export function App() {
  const [cameraType, setCameraType] = useCameraStore((state) => [
    state.cameraType,
    state.setCameraType,
  ])
  const [color1, color2, color3] = useColorStore((state) => [
    state.color1,
    state.color2,
    state.color3,
  ])
  const [setColor1, setColor2, setColor3] = useColorStore((state) => [
    state.setColor1,
    state.setColor2,
    state.setColor3,
  ])

  return (
    <KeyboardControls
      map={[
        { name: KeyBoardControlKey.FORWARD, keys: ['ArrowUp', 'w', 'W'] },
        { name: KeyBoardControlKey.BACKWARD, keys: ['ArrowDown', 's', 'S'] },
        { name: KeyBoardControlKey.LEFT, keys: ['ArrowLeft', 'a', 'A'] },
        { name: KeyBoardControlKey.RIGHT, keys: ['ArrowRight', 'd', 'D'] },
        { name: KeyBoardControlKey.ROTATE_LEFT, keys: ['q', 'Q'] },
        { name: KeyBoardControlKey.ROTATE_RIGHT, keys: ['e', 'E'] },
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

      {cameraType === CameraType.DECORATION && (
        <Stack
          sx={{ position: 'fixed', top: 20, left: 20, borderRadius: 4 }}
          gap={2}
          direction="column"
          padding={2}
          minWidth={200}
          bgcolor="white"
        >
          <Typography level="h6" textAlign="center">
            Adjust Color
          </Typography>
          <FormLabel>Color 1</FormLabel>
          <Input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
          <FormLabel>Color 2</FormLabel>
          <Input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
          <FormLabel>Color 3</FormLabel>
          <Input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} />
        </Stack>
      )}

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
