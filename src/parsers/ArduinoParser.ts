import { ParsedDisplay, ParseError, Screen, StateDefinition } from '../types/ParserTypes'
import { UIElement } from '../types/DisplayTypes'
import { TouchZone } from '../types/InteractionTypes'
import { parseArduinoColor } from '../utils/colorUtils'

// Main parser function
export async function parseArduinoCode(code: string): Promise<ParsedDisplay> {
  const result: ParsedDisplay = {
    screens: [],
    states: [],
    variables: [],
    functions: [],
    includes: [],
    errors: []
  }

  try {
    // Split code into lines for processing
    const lines = code.split('\n')
    
    // Extract includes
    result.includes = extractIncludes(lines)
    
    // Extract state definitions
    result.states = extractStates(lines)
    
    // Extract variables
    result.variables = extractVariables(lines)
    
    // Extract functions
    result.functions = extractFunctions(lines)
    
    // Extract screens from drawing functions
    result.screens = extractScreens(lines, result.functions)
    
    // Validate the parsed result
    validateParsedDisplay(result)
    
  } catch (error) {
    result.errors.push({
      message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      line: 0,
      column: 0,
      severity: 'error'
    })
  }

  return result
}

// Extract #include statements
function extractIncludes(lines: string[]): string[] {
  const includes: string[] = []
  
  lines.forEach(line => {
    const includeMatch = line.match(/#include\s*[<"](.*?)[>"]/)
    if (includeMatch) {
      includes.push(includeMatch[1])
    }
  })
  
  return includes
}

// Extract state definitions (enums and variables)
function extractStates(lines: string[]): StateDefinition[] {
  const states: StateDefinition[] = []
  
  lines.forEach((line, index) => {
    // Extract enum definitions
    const enumMatch = line.match(/enum\s+(\w+)\s*\{([^}]+)\}/)
    if (enumMatch) {
      const enumValues = enumMatch[2].split(',').map(v => v.trim())
      enumValues.forEach(value => {
        if (value) {
          states.push({
            name: value,
            value: value,
            type: 'enum',
            screens: []
          })
        }
      })
    }
    
    // Extract state variables
    const stateVarMatch = line.match(/(\w+)\s+(\w+)\s*=\s*(\w+)/)
    if (stateVarMatch && line.includes('State')) {
      states.push({
        name: stateVarMatch[2],
        value: stateVarMatch[3],
        type: 'variable',
        screens: []
      })
    }
  })
  
  return states
}

// Extract variable definitions
function extractVariables(lines: string[]): any[] {
  const variables: any[] = []
  
  lines.forEach((line, index) => {
    // Basic variable extraction - can be expanded
    const varMatch = line.match(/^\s*(int|uint16_t|bool|float|double|char\*?)\s+(\w+)/)
    if (varMatch) {
      variables.push({
        name: varMatch[2],
        type: varMatch[1],
        value: null,
        scope: 'global',
        line: index + 1
      })
    }
  })
  
  return variables
}

// Extract function definitions
function extractFunctions(lines: string[]): any[] {
  const functions: any[] = []
  
  lines.forEach((line, index) => {
    // Extract function declarations
    const funcMatch = line.match(/^\s*(void|int|bool|float|double|char\*?)\s+(\w+)\s*\(([^)]*)\)/)
    if (funcMatch) {
      functions.push({
        name: funcMatch[2],
        returnType: funcMatch[1],
        parameters: funcMatch[3] ? funcMatch[3].split(',').map(p => p.trim()) : [],
        body: '',
        line: index + 1
      })
    }
  })
  
  return functions
}

// Extract screens from drawing functions
function extractScreens(lines: string[], functions: any[]): Screen[] {
  const screens: Screen[] = []
  
  // Find drawing functions (functions that start with "draw")
  const drawFunctions = functions.filter(f => f.name.startsWith('draw'))
  
  drawFunctions.forEach(func => {
    const screen: Screen = {
      id: func.name,
      name: func.name,
      elements: [],
      touchZones: [],
      backgroundColor: '#000000',
      transitions: []
    }
    
    // Extract UI elements from function body
    const { elements, touchZones } = extractUIElementsFromFunction(lines, func.name)
    screen.elements = elements
    screen.touchZones = touchZones
    
    screens.push(screen)
  })
  
  // If no drawing functions found, create a default screen
  if (screens.length === 0) {
    const { elements, touchZones } = extractUIElementsFromFunction(lines, 'main')
    screens.push({
      id: 'main',
      name: 'Main Screen',
      elements,
      touchZones,
      backgroundColor: '#000000',
      transitions: []
    })
  }
  
  return screens
}

// Extract UI elements from function body
function extractUIElementsFromFunction(lines: string[], functionName: string): { elements: UIElement[], touchZones: TouchZone[] } {
  const elements: UIElement[] = []
  const touchZones: TouchZone[] = []
  let inFunction = false
  let braceCount = 0
  let elementId = 0
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    
    // Check if we're entering the function
    if (trimmedLine.includes(`${functionName}(`) && trimmedLine.includes('{')) {
      inFunction = true
      braceCount = 1
      return
    }
    
    if (!inFunction) return
    
    // Track braces to know when function ends
    braceCount += (line.match(/\{/g) || []).length
    braceCount -= (line.match(/\}/g) || []).length
    
    if (braceCount === 0) {
      inFunction = false
      return
    }
    
    // Extract TFT commands
    if (trimmedLine.includes('tft.')) {
      const element = parseTFTCommand(trimmedLine, elementId++, index + 1)
      if (element) {
        elements.push(element)
      }
    }
    
    // Extract touch zones from getTouch conditions
    if (trimmedLine.includes('getTouch') || (trimmedLine.includes('>=') && trimmedLine.includes('<='))) {
      const touchZone = parseTouchZone(trimmedLine, lines, index)
      if (touchZone) {
        touchZones.push(touchZone)
      }
    }
  })
  
  return { elements, touchZones }
}

// Parse individual TFT commands
function parseTFTCommand(line: string, id: number, lineNumber: number): UIElement | null {
  const trimmedLine = line.trim()
  
  // fillScreen
  if (trimmedLine.includes('fillScreen')) {
    const colorMatch = trimmedLine.match(/fillScreen\s*\(\s*([^)]+)\s*\)/)
    if (colorMatch) {
      return {
        id: `bg_${id}`,
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 380,
        height: 420,
        color: parseArduinoColor(colorMatch[1]),
        backgroundColor: parseArduinoColor(colorMatch[1]),
        visible: true,
        zIndex: 0
      }
    }
  }
  
  // fillRect
  if (trimmedLine.includes('fillRect')) {
    const rectMatch = trimmedLine.match(/fillRect\s*\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\s*\)/)
    if (rectMatch) {
      return {
        id: `rect_${id}`,
        type: 'rectangle',
        x: parseInt(rectMatch[1]),
        y: parseInt(rectMatch[2]),
        width: parseInt(rectMatch[3]),
        height: parseInt(rectMatch[4]),
        color: parseArduinoColor(rectMatch[5]),
        backgroundColor: parseArduinoColor(rectMatch[5]),
        visible: true,
        zIndex: 1
      }
    }
  }
  
  // fillSmoothRoundRect
  if (trimmedLine.includes('fillSmoothRoundRect')) {
    const roundRectMatch = trimmedLine.match(/fillSmoothRoundRect\s*\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*([^)]+))?\s*\)/)
    if (roundRectMatch) {
      return {
        id: `roundrect_${id}`,
        type: 'roundedRectangle',
        x: parseInt(roundRectMatch[1]),
        y: parseInt(roundRectMatch[2]),
        width: parseInt(roundRectMatch[3]),
        height: parseInt(roundRectMatch[4]),
        radius: parseInt(roundRectMatch[5]),
        color: parseArduinoColor(roundRectMatch[6]),
        backgroundColor: parseArduinoColor(roundRectMatch[6]),
        visible: true,
        zIndex: 1
      }
    }
  }
  
  // drawString
  if (trimmedLine.includes('drawString')) {
    const stringMatch = trimmedLine.match(/drawString\s*\(\s*"([^"]+)"\s*,\s*([^,]+),\s*([^)]+)\s*\)/)
    if (stringMatch) {
      return {
        id: `text_${id}`,
        type: 'text',
        x: parseInt(stringMatch[2]),
        y: parseInt(stringMatch[3]),
        text: stringMatch[1],
        color: '#ffffff', // Default color, could be extracted from setTextColor
        visible: true,
        zIndex: 2,
        fontSize: 16,
        textAlign: 'center'
      }
    }
  }
  
  return null
}

// Parse touch zones from touch handling code
function parseTouchZone(line: string, lines: string[], lineIndex: number): TouchZone | null {
  // Look for touch conditions like: if (x >= 65 && x <= 315 && y >= 200 && y <= 255)
  const touchCondition = line.match(/x\s*>=\s*(\d+)\s*&&\s*x\s*<=\s*(\d+)\s*&&\s*y\s*>=\s*(\d+)\s*&&\s*y\s*<=\s*(\d+)/)
  if (touchCondition) {
    const x = parseInt(touchCondition[1])
    const x2 = parseInt(touchCondition[2])
    const y = parseInt(touchCondition[3])
    const y2 = parseInt(touchCondition[4])
    
    // Try to find the action by looking at the next few lines
    let action = 'touch'
    for (let i = lineIndex + 1; i < Math.min(lineIndex + 5, lines.length); i++) {
      const nextLine = lines[i].trim()
      if (nextLine.includes('=')) {
        const actionMatch = nextLine.match(/(\w+)\s*=\s*(\w+)/)
        if (actionMatch) {
          action = actionMatch[2]
          break
        }
      }
    }
    
    return {
      id: `touch_${lineIndex}`,
      x: x,
      y: y,
      width: x2 - x,
      height: y2 - y,
      action: action,
      visible: true,
      debugColor: '#ff0000'
    }
  }
  
  return null
}

// Validate parsed display
function validateParsedDisplay(display: ParsedDisplay): void {
  // Check for common errors
  if (display.screens.length === 0) {
    display.errors.push({
      message: 'No screens found. Make sure your code includes drawing functions.',
      line: 0,
      column: 0,
      severity: 'warning'
    })
  }
  
  // Check for missing TFT_eSPI include
  if (!display.includes.includes('TFT_eSPI.h')) {
    display.errors.push({
      message: 'TFT_eSPI.h not found in includes. Make sure to include the library.',
      line: 0,
      column: 0,
      severity: 'warning'
    })
  }
}