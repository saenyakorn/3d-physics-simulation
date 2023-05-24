export const KeyBoardControlKey = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
} as const
export type KeyBoardControlKey = (typeof KeyBoardControlKey)[keyof typeof KeyBoardControlKey]
