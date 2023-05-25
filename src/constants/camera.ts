export const CameraType = {
  FOLLOW: 'FOLLOW',
  DECORATION: 'DECORATION',
} as const
export type CameraType = (typeof CameraType)[keyof typeof CameraType]
