import { useLoader } from '@react-three/fiber'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export function useModelLoader(mtlUrl: string, objUrl: string) {
  const mtl = useLoader(MTLLoader, mtlUrl)
  const object = useLoader(OBJLoader, objUrl, (loader) => {
    mtl.preload()
    loader.setMaterials(mtl)
  })
  return { object, mtl }
}
