// Touch zone definition
export interface TouchZone {
  id: string
  x: number
  y: number
  width: number
  height: number
  action: string
  targetState?: string
  visible: boolean
  debugColor?: string
}

// Touch event data
export interface TouchEvent {
  x: number
  y: number
  timestamp: number
  type: 'touch' | 'release' | 'longpress'
}

// Touch result
export interface TouchResult {
  hit: boolean
  zone?: TouchZone
  coordinates: { x: number; y: number }
}

// Interaction state
export interface InteractionState {
  touchZones: TouchZone[]
  currentTouch: TouchEvent | null
  lastTouch: TouchEvent | null
  isPressed: boolean
  pressStartTime: number
  longPressThreshold: number
  touchDelay: number
}

// Button state
export interface ButtonState {
  id: string
  pressed: boolean
  hovered: boolean
  disabled: boolean
  label: string
  x: number
  y: number
  width: number
  height: number
  color: string
  pressedColor: string
  textColor: string
}