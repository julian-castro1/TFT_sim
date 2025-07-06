// Display configuration interface
export interface DisplayConfig {
  width: number
  height: number
  pixelRatio: number
  touchCalibration: number[]
  rotation: number
  flipX: boolean
  flipY: boolean
}

// TFT color definitions
export interface TFTColors {
  TFT_BLACK: number
  TFT_WHITE: number
  TFT_RED: number
  TFT_GREEN: number
  TFT_BLUE: number
  TFT_CYAN: number
  TFT_MAGENTA: number
  TFT_YELLOW: number
  TFT_ORANGE: number
  TFT_DARKGREY: number
  TFT_LIGHTGREY: number
  TFT_NAVY: number
  TFT_DARKGREEN: number
  TFT_DARKCYAN: number
  TFT_MAROON: number
  TFT_PURPLE: number
  TFT_OLIVE: number
  TFT_PINK: number
  TFT_GREENYELLOW: number
}

// UI element types
export interface UIElement {
  id: string
  type: 'rectangle' | 'roundedRectangle' | 'circle' | 'text' | 'bitmap'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  color?: string
  backgroundColor?: string
  text?: string
  font?: string
  fontSize?: number
  textAlign?: 'left' | 'center' | 'right'
  textBaseline?: 'top' | 'middle' | 'bottom'
  visible: boolean
  zIndex: number
}

// Display state interface
export interface DisplayState {
  elements: UIElement[]
  backgroundColor: string
  currentScreen: string
  debugMode: boolean
  showTouchZones: boolean
  animationSpeed: number
  rotation: number
}

// Rendering configuration
export interface RenderConfig {
  antialiasing: boolean
  fontSmoothing: boolean
  debugMode: boolean
  showTouchZones: boolean
  animationSpeed: number
}

// Screen dimensions
export interface ScreenDimensions {
  width: number
  height: number
}

// Canvas context wrapper
export interface CanvasContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scale: number
}