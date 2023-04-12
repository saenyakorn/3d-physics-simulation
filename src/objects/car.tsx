import { useModelLoader } from '../hooks/useModelLoader'
import { useEffect } from 'react'

export function Car() {
  const { object } = useModelLoader('/assets/car.mtl', '/assets/car.obj')

  useEffect(() => {
    object.scale.set(0.1, 0.1, 0.1)
  }, [object])

  return <primitive object={object} />
}
