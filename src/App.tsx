import { Canvas } from '@react-three/fiber'
import { MainScene } from './scenes/main'

export function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <MainScene />
    </Canvas>
  )
}
