import { create } from 'zustand'

interface ColorState {
  color1: string
  color2: string
  color3: string
  setColor1: (color1: string) => void
  setColor2: (color2: string) => void
  setColor3: (color3: string) => void
}

export const useColorStore = create<ColorState>((set, get) => {
  return {
    color1: '#ff0000',
    color2: '#0000ff',
    color3: '#00ff00',
    setColor1: (color1) => set({ color1 }),
    setColor2: (color2) => set({ color2 }),
    setColor3: (color3) => set({ color3 }),
  }
})
