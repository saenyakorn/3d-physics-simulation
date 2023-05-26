/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.11 public/models/track.glb --types
*/
import { useEffect } from 'react'

import { useGLTF, useTexture } from '@react-three/drei'

import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    ['Street003_-_applied_transform']: THREE.Mesh
  }
}

export function Track() {
  const { nodes } = useGLTF('/models/track.glb') as GLTFResult
  const colorMap = useTexture('/textures/track.png')

  useEffect(() => {
    colorMap.anisotropy = 16
  }, [colorMap])

  return (
    <mesh geometry={nodes['Street003_-_applied_transform'].geometry} scale={6}>
      <meshStandardMaterial toneMapped={false} map={colorMap} />
    </mesh>
  )
}

useGLTF.preload('/models/track.glb')