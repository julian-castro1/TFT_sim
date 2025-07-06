// TFT color constants (RGB565 format)
export const TFT_COLORS = {
  TFT_BLACK: 0x0000,
  TFT_WHITE: 0xFFFF,
  TFT_RED: 0xF800,
  TFT_GREEN: 0x07E0,
  TFT_BLUE: 0x001F,
  TFT_CYAN: 0x07FF,
  TFT_MAGENTA: 0xF81F,
  TFT_YELLOW: 0xFFE0,
  TFT_ORANGE: 0xFD20,
  TFT_DARKGREY: 0x7BEF,
  TFT_DARKGRAY: 0x7BEF, // Alternative spelling
  TFT_LIGHTGREY: 0xC618,
  TFT_LIGHTGRAY: 0xC618, // Alternative spelling
  TFT_NAVY: 0x000F,
  TFT_DARKGREEN: 0x03E0,
  TFT_DARKCYAN: 0x03EF,
  TFT_MAROON: 0x7800,
  TFT_PURPLE: 0x780F,
  TFT_OLIVE: 0x7BE0,
  TFT_PINK: 0xF81F,
  TFT_GREENYELLOW: 0xAFE5,
  TFT_BROWN: 0xBC40,
  TFT_GOLD: 0xFEA0,
  TFT_SILVER: 0xC618,
  TFT_SKYBLUE: 0x867D,
  TFT_VIOLET: 0x915C,
} as const

// Convert RGB565 to hex color string
export function rgb565ToHex(rgb565: number): string {
  const r = (rgb565 >> 11) & 0x1F
  const g = (rgb565 >> 5) & 0x3F
  const b = rgb565 & 0x1F
  
  // Convert to 8-bit values
  const r8 = (r * 255) / 31
  const g8 = (g * 255) / 63
  const b8 = (b * 255) / 31
  
  // Convert to hex
  const hex = ((Math.round(r8) << 16) | (Math.round(g8) << 8) | Math.round(b8)).toString(16).padStart(6, '0')
  return `#${hex}`
}

// Convert RGB values to RGB565 format
export function rgbToRgb565(r: number, g: number, b: number): number {
  const r5 = (r >> 3) & 0x1F
  const g6 = (g >> 2) & 0x3F
  const b5 = (b >> 3) & 0x1F
  return (r5 << 11) | (g6 << 5) | b5
}

// Convert hex color to RGB565
export function hexToRgb565(hex: string): number {
  const color = parseInt(hex.replace('#', ''), 16)
  const r = (color >> 16) & 0xFF
  const g = (color >> 8) & 0xFF
  const b = color & 0xFF
  return rgbToRgb565(r, g, b)
}

// Convert RGB565 to RGB object
export function rgb565ToRgb(rgb565: number): { r: number; g: number; b: number } {
  const r = (rgb565 >> 11) & 0x1F
  const g = (rgb565 >> 5) & 0x3F
  const b = rgb565 & 0x1F
  
  return {
    r: (r * 255) / 31,
    g: (g * 255) / 63,
    b: (b * 255) / 31,
  }
}

// Get TFT color name from RGB565 value
export function getTFTColorName(rgb565: number): string | null {
  const colorEntry = Object.entries(TFT_COLORS).find(([_, value]) => value === rgb565)
  return colorEntry ? colorEntry[0] : null
}

// Parse color from Arduino code (handles TFT_COLOR constants and rgb functions)
export function parseArduinoColor(colorStr: string): string {
  // Handle TFT color constants
  if (colorStr.startsWith('TFT_')) {
    const colorValue = TFT_COLORS[colorStr as keyof typeof TFT_COLORS]
    return colorValue !== undefined ? rgb565ToHex(colorValue) : '#000000'
  }
  
  // Handle rgbToHex function calls
  const rgbMatch = colorStr.match(/rgbToHex\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
  
  // Handle hex values
  if (colorStr.startsWith('0x')) {
    const rgb565 = parseInt(colorStr, 16)
    return rgb565ToHex(rgb565)
  }
  
  // Handle numeric values
  const numMatch = colorStr.match(/^\d+$/)
  if (numMatch) {
    const rgb565 = parseInt(colorStr)
    return rgb565ToHex(rgb565)
  }
  
  // Default to black
  return '#000000'
}