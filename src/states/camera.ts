import { create } from 'zustand'

import { CameraType } from '../constants/camera'

interface CameraState {
  cameraType: CameraType
  setCameraType: (cameraType: CameraType) => void
}

export const useCameraStore = create<CameraState>((set, get) => {
  return {
    cameraType: CameraType.FOLLOW,
    setCameraType: (cameraType) => set({ cameraType }),
  }
})
