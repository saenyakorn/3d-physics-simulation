import { useRef, useState } from 'react'

import { MeshProps, useFrame } from '@react-three/fiber'

import { BufferGeometry, Material, Mesh } from 'three'

export function Box(props: MeshProps) {
  const mesh = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta
    }
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
