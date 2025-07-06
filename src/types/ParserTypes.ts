import { UIElement } from './DisplayTypes'
import { TouchZone } from './InteractionTypes'

// Abstract Syntax Tree node types
export interface ASTNode {
  type: string
  value?: string | number
  children?: ASTNode[]
  line?: number
  column?: number
}

// Parsed display structure
export interface ParsedDisplay {
  screens: Screen[]
  states: StateDefinition[]
  variables: Variable[]
  functions: Function[]
  includes: string[]
  errors: ParseError[]
  displayConfig?: {
    rotation: number
    width: number
    height: number
  }
}

// Screen definition
export interface Screen {
  id: string
  name: string
  elements: UIElement[]
  touchZones: TouchZone[]
  backgroundColor: string
  transitions: StateTransition[]
}

// State definition
export interface StateDefinition {
  name: string
  value: string | number
  type: 'enum' | 'variable' | 'constant'
  screens: string[]
}

// State transition
export interface StateTransition {
  from: string
  to: string
  trigger: string
  condition?: string
  action?: string
}

// Variable definition
export interface Variable {
  name: string
  type: string
  value: string | number | boolean
  scope: 'global' | 'local'
  line: number
}

// Function definition
export interface Function {
  name: string
  returnType: string
  parameters: Parameter[]
  body: string
  line: number
}

// Parameter definition
export interface Parameter {
  name: string
  type: string
  defaultValue?: string | number
}

// Parse error
export interface ParseError {
  message: string
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
}

// TFT command
export interface TFTCommand {
  command: string
  parameters: (string | number)[]
  line: number
  parsed: boolean
}

// Parser configuration
export interface ParserConfig {
  strictMode: boolean
  ignoreComments: boolean
  extractIncludes: boolean
  followIncludes: boolean
  maxRecursionDepth: number
}