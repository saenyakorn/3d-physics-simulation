import { useEffect, useRef } from 'react'

import { usePlane } from '@react-three/cannon'
import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import { MeshProps } from '@react-three/fiber'

import { BufferAttribute, Mesh } from 'three'

interface PlaneProps extends MeshProps {}

export function Plane(props: PlaneProps) {
  const [ref] = usePlane<Mesh>(() => ({
    type: 'Static',
    position: [-2.285 * 6, -0.015, -1.325 * 6],
    rotation: [-Math.PI / 2, 0, -0.079],
  }))
  const ref2 = useRef<Mesh>(null)

  const gridMap = useTexture('/textures/grid.png')
  const aoMap = useTexture('/textures/ground-ao.png')
  const alphaMap = useTexture('/textures/alpha-map.png')

  useEffect(() => {
    gridMap.anisotropy = 16
  }, [gridMap])

  useEffect(() => {
    if (ref.current) {
      const uv = ref.current.geometry.attributes.uv as BufferAttribute
      ref.current.geometry.setAttribute('uv2', new BufferAttribute(uv.array, 2))
    }
    if (ref2.current) {
      const uv = ref2.current.geometry.attributes.uv as BufferAttribute
      ref2.current.geometry.setAttribute('uv2', new BufferAttribute(uv.array, 2))
    }
  }, [ref, ref2])

  return (
    <>
      <mesh
        ref={ref2}
        scale={6}
        position={[-2.285 * 6, -0.01, -1.325 * 6]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial opacity={0.7} alphaMap={gridMap} transparent={true} color="white" />
      </mesh>
      <mesh ref={ref} {...props} scale={6}>
        <circleGeometry args={[6.12, 50]} />
        <MeshReflectorMaterial
          aoMap={aoMap}
          alphaMap={alphaMap}
          transparent={true}
          color={[0.5, 0.5, 0.5]}
          envMapIntensity={0.35}
          metalness={0.05}
          roughness={0.4}
          dithering={true}
          blur={[1024, 512]} // Blur ground reflections (width, heigt), 0 skips blur
          mixBlur={3} // How much blur mixes with surface roughness (default = 1)
          mixStrength={30} // Strength of the reflections
          mixContrast={1} // Contrast of the reflections
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
          depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [bl
          reflectorOffset={0.02} // Offsets the virtual camera that projects the reflection. Useful when the reflective
        />
      </mesh>
    </>
  )
}
