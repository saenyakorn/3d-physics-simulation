export const scale = 6

export function scalarMultiply(
  [x, y, z]: [x: number, y: number, z: number],
  scalar: number
): [x: number, y: number, z: number] {
  return [x * scalar, y * scalar, z * scalar]
}
