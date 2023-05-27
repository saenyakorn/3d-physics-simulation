import { ConvexPolyhedronArgs, useConvexPolyhedron } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'

import { BufferGeometry } from 'three'
import { Mesh } from 'three'
import { GLTF, Geometry } from 'three-stdlib'

import { scalarMultiply, scale } from '../../util/scale'

const debug = false

type GLTFResult = GLTF & {
  nodes: {
    ['Ramp_-_Applied_transform']: THREE.Mesh
  }
  materials: {
    ['Material.015']: THREE.MeshStandardMaterial
  }
}

function toConvexProps(bufferGeometry: BufferGeometry): ConvexPolyhedronArgs {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry)
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices()
  return [geo.vertices.map((v) => scalarMultiply([v.x, v.y, v.z], scale)), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}

export function Ramp() {
  const result = useGLTF('/models/ramp.glb') as GLTFResult

  const geometry = result.nodes['Ramp_-_Applied_transform'].geometry

  const [ref] = useConvexPolyhedron<Mesh>(() => ({
    args: toConvexProps(geometry),
    type: 'Static',
  }))

  return debug ? (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshBasicMaterial transparent={true} opacity={0.5} />
    </mesh>
  ) : null
}
