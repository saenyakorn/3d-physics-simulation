export const KeyBoardControlKey = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  LEFT: 'left',
  RIGHT: 'right',
  ROTATE_LEFT: 'rotateLeft',
  ROTATE_RIGHT: 'rotateRight',
  JUMP: 'jump',
} as const
export type KeyBoardControlKey = (typeof KeyBoardControlKey)[keyof typeof KeyBoardControlKey]
