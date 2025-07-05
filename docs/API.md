# API Documentation

## Overview

The TFT Display Simulator API provides a comprehensive interface for parsing Arduino code, rendering display elements, and handling user interactions. This document outlines all available APIs, their parameters, and usage examples.

## Table of Contents

1. [Parser APIs](#parser-apis)
2. [Rendering APIs](#rendering-apis)
3. [State Management APIs](#state-management-apis)
4. [Interaction APIs](#interaction-apis)
5. [Utility APIs](#utility-apis)
6. [Configuration APIs](#configuration-apis)

---

## Parser APIs

### `ArduinoParser`

Parses Arduino C++ code and extracts TFT display commands.

#### `parseCode(code: string): ParsedCode`

Parses the complete Arduino code file.

```typescript
interface ParsedCode {
  includes: string[];
  constants: Constant[];
  variables: Variable[];
  functions: FunctionDefinition[];
  states: StateDefinition[];
  setupCode: string[];
  loopCode: string[];
  errors: ParseError[];
}
```

**Parameters:**
- `code` (string): The Arduino source code to parse

**Returns:** `ParsedCode` object containing all parsed elements

**Example:**
```typescript
const parser = new ArduinoParser();
const result = parser.parseCode(`
  #include "TFT_eSPI.h"
  TFT_eSPI tft = TFT_eSPI();
  
  void setup() {
    tft.init();
    tft.setRotation(1);
  }
  
  void drawHome() {
    tft.fillScreen(TFT_BLACK);
    tft.drawString("Hello", 100, 100);
  }
`);
```

#### `extractDisplayCommands(functionCode: string): DisplayCommand[]`

Extracts TFT display commands from a function.

```typescript
interface DisplayCommand {
  type: 'fillScreen' | 'drawString' | 'fillRect' | 'drawBitmap' | 'setTextColor' | 'fillSmoothRoundRect';
  parameters: any[];
  lineNumber: number;
  originalCode: string;
}
```

**Parameters:**
- `functionCode` (string): Function source code containing TFT commands

**Returns:** Array of `DisplayCommand` objects

### `TFTCommandParser`

Specialized parser for TFT_eSPI library commands.

#### `parseCommand(command: string): ParsedCommand`

Parses a single TFT command line.

```typescript
interface ParsedCommand {
  object: string;        // e.g., "tft"
  method: string;        // e.g., "fillRect"
  parameters: Parameter[];
  isValid: boolean;
  error?: string;
}

interface Parameter {
  value: string | number;
  type: 'number' | 'string' | 'color' | 'font' | 'variable';
  resolvedValue?: any;
}
```

**Example:**
```typescript
const parser = new TFTCommandParser();
const result = parser.parseCommand('tft.fillRect(10, 20, 100, 50, TFT_RED)');
// Result: { object: 'tft', method: 'fillRect', parameters: [10, 20, 100, 50, 0xF800] }
```

#### `resolveConstants(parameters: Parameter[], constants: Constant[]): Parameter[]`

Resolves constant values in parameters.

### `StateAnalyzer`

Analyzes state transitions and UI flow.

#### `analyzeStates(code: ParsedCode): StateAnalysis`

Analyzes state enumeration and transitions.

```typescript
interface StateAnalysis {
  states: State[];
  transitions: StateTransition[];
  currentState: string;
  stateVariables: Variable[];
}

interface StateTransition {
  from: string;
  to: string;
  condition: string;
  trigger: 'touch' | 'timer' | 'external';
  touchZone?: TouchZone;
}
```

---

## Rendering APIs

### `CanvasRenderer`

Low-level canvas rendering operations.

#### `constructor(canvas: HTMLCanvasElement, config: DisplayConfig)`

Creates a new canvas renderer.

```typescript
interface DisplayConfig {
  width: number;
  height: number;
  pixelRatio: number;
  antialiasing: boolean;
  debugMode: boolean;
}
```

#### `clear(color?: string): void`

Clears the canvas with specified color.

#### `fillRect(x: number, y: number, width: number, height: number, color: string): void`

Draws a filled rectangle.

#### `fillSmoothRoundRect(x: number, y: number, width: number, height: number, radius: number, color: string, borderColor?: string): void`

Draws a filled rounded rectangle with smooth corners.

#### `drawString(text: string, x: number, y: number, font: FontConfig, color: string): void`

Draws text with specified font and color.

```typescript
interface FontConfig {
  family: string;
  size: number;
  weight: 'normal' | 'bold';
  datum: TextDatum;
}

type TextDatum = 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR' | 'BL' | 'BC' | 'BR';
```

#### `drawBitmap(x: number, y: number, bitmap: ImageData, width: number, height: number, color: string): void`

Draws a bitmap image.

### `UIElementRenderer`

High-level UI element rendering.

#### `renderScreen(screen: Screen): void`

Renders a complete screen with all its elements.

```typescript
interface Screen {
  name: string;
  elements: UIElement[];
  background: string;
  touchZones: TouchZone[];
}

interface UIElement {
  type: 'rectangle' | 'text' | 'bitmap' | 'button';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: ElementStyle;
  properties: any;
}
```

#### `renderElement(element: UIElement): void`

Renders a single UI element.

#### `renderTouchZones(zones: TouchZone[], visible: boolean): void`

Renders touch zone overlays for debugging.

### `FontRenderer`

Font rendering and text measurement.

#### `measureText(text: string, font: FontConfig): TextMetrics`

Measures text dimensions.

```typescript
interface TextMetrics {
  width: number;
  height: number;
  ascent: number;
  descent: number;
}
```

#### `renderText(text: string, x: number, y: number, font: FontConfig, color: string): void`

Renders text with proper alignment and styling.

---

## State Management APIs

### `DisplayStore`

Manages display state and properties.

#### `useDisplayStore(): DisplayStoreState`

React hook for accessing display state.

```typescript
interface DisplayStoreState {
  currentScreen: string;
  screenHistory: string[];
  displayConfig: DisplayConfig;
  variables: Record<string, any>;
  
  // Actions
  setScreen: (screen: string) => void;
  updateVariable: (name: string, value: any) => void;
  setDisplayConfig: (config: DisplayConfig) => void;
}
```

#### `getScreenState(screenName: string): ScreenState`

Gets the current state of a specific screen.

### `InteractionStore`

Manages user interactions and touch events.

#### `useInteractionStore(): InteractionStoreState`

React hook for interaction state.

```typescript
interface InteractionStoreState {
  touchZones: TouchZone[];
  lastTouch: TouchEvent | null;
  isPressed: boolean;
  debugMode: boolean;
  
  // Actions
  registerTouchZone: (zone: TouchZone) => void;
  handleTouch: (x: number, y: number) => void;
  setDebugMode: (enabled: boolean) => void;
}
```

### `CodeStore`

Manages parsed code and compilation state.

#### `useCodeStore(): CodeStoreState`

React hook for code state.

```typescript
interface CodeStoreState {
  sourceCode: string;
  parsedCode: ParsedCode | null;
  compilationErrors: ParseError[];
  isCompiling: boolean;
  
  // Actions
  setSourceCode: (code: string) => void;
  compileCode: () => Promise<void>;
  clearErrors: () => void;
}
```

---

## Interaction APIs

### `TouchHandler`

Handles touch interactions and gesture recognition.

#### `handleTouch(event: TouchEvent): TouchResult`

Processes touch events and determines interactions.

```typescript
interface TouchEvent {
  x: number;
  y: number;
  type: 'down' | 'up' | 'move';
  timestamp: number;
}

interface TouchResult {
  handled: boolean;
  touchZone?: TouchZone;
  action?: string;
  stateChange?: StateChange;
}
```

#### `registerTouchZone(zone: TouchZone): void`

Registers a new touch zone.

```typescript
interface TouchZone {
  id: string;
  bounds: Rectangle;
  action: string;
  state?: string;
  condition?: string;
  enabled: boolean;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

#### `getTouchZone(x: number, y: number): TouchZone | null`

Finds the touch zone at specified coordinates.

### `GestureRecognizer`

Recognizes gestures and complex interactions.

#### `recognizeGesture(touches: TouchEvent[]): Gesture | null`

Recognizes gestures from touch sequence.

```typescript
interface Gesture {
  type: 'tap' | 'long_press' | 'drag' | 'swipe';
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  duration: number;
  distance: number;
}
```

---

## Utility APIs

### `ColorUtils`

Color conversion and manipulation utilities.

#### `rgb565ToHex(rgb565: number): string`

Converts RGB565 color to hex string.

#### `hexToRgb565(hex: string): number`

Converts hex color to RGB565 format.

#### `rgbToHex(r: number, g: number, b: number): string`

Converts RGB values to hex string.

#### `parseColor(color: string): string`

Parses various color formats (TFT_RED, #FF0000, etc.).

```typescript
const colorUtils = {
  // TFT color constants
  TFT_BLACK: 0x0000,
  TFT_WHITE: 0xFFFF,
  TFT_RED: 0xF800,
  TFT_GREEN: 0x07E0,
  TFT_BLUE: 0x001F,
  TFT_ORANGE: 0xFD20,
  TFT_DARKGREY: 0x7BEF,
  
  // Conversion functions
  rgb565ToHex: (color: number) => string,
  parseColor: (color: string) => string,
  rgbToHex: (r: number, g: number, b: number) => string
};
```

### `MathUtils`

Mathematical calculations and coordinate transformations.

#### `rotatePoint(x: number, y: number, angle: number, centerX: number, centerY: number): Point`

Rotates a point around a center.

#### `scalePoint(x: number, y: number, scaleX: number, scaleY: number): Point`

Scales a point by given factors.

#### `isPointInRect(point: Point, rect: Rectangle): boolean`

Checks if a point is inside a rectangle.

### `ValidationUtils`

Code validation and error checking utilities.

#### `validateBounds(element: UIElement, screenSize: Size): ValidationResult`

Validates that UI elements fit within screen bounds.

#### `validateTouchZones(zones: TouchZone[]): ValidationResult`

Validates touch zone definitions.

#### `validateColors(colors: string[]): ValidationResult`

Validates color definitions.

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  type: string;
  message: string;
  line?: number;
  column?: number;
}
```

---

## Configuration APIs

### `ConfigManager`

Manages application configuration.

#### `loadConfig(path?: string): Promise<AppConfig>`

Loads configuration from file or defaults.

#### `saveConfig(config: AppConfig): Promise<void>`

Saves configuration to file.

#### `getDisplayConfig(): DisplayConfig`

Gets current display configuration.

#### `setDisplayConfig(config: DisplayConfig): void`

Updates display configuration.

```typescript
interface AppConfig {
  display: DisplayConfig;
  parser: ParserConfig;
  renderer: RenderConfig;
  interaction: InteractionConfig;
  debug: DebugConfig;
}

interface ParserConfig {
  strictMode: boolean;
  ignoreComments: boolean;
  maxRecursionDepth: number;
}

interface RenderConfig {
  antialiasing: boolean;
  fontSmoothing: boolean;
  animationSpeed: number;
}

interface InteractionConfig {
  touchDelay: number;
  longPressThreshold: number;
  multiTouchSupport: boolean;
}

interface DebugConfig {
  showTouchZones: boolean;
  showGrid: boolean;
  logCommands: boolean;
}
```

---

## Error Handling

### Error Types

```typescript
enum ErrorType {
  PARSE_ERROR = 'PARSE_ERROR',
  RENDER_ERROR = 'RENDER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERACTION_ERROR = 'INTERACTION_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR'
}

interface SimulatorError {
  type: ErrorType;
  message: string;
  code?: string;
  line?: number;
  column?: number;
  stack?: string;
}
```

### Error Handling APIs

#### `ErrorHandler.handleError(error: SimulatorError): void`

Handles and reports errors.

#### `ErrorHandler.getErrors(): SimulatorError[]`

Gets all current errors.

#### `ErrorHandler.clearErrors(): void`

Clears all errors.

---

## Events

### Event Types

```typescript
enum EventType {
  SCREEN_CHANGE = 'SCREEN_CHANGE',
  TOUCH_EVENT = 'TOUCH_EVENT',
  STATE_UPDATE = 'STATE_UPDATE',
  RENDER_COMPLETE = 'RENDER_COMPLETE',
  PARSE_COMPLETE = 'PARSE_COMPLETE',
  ERROR_OCCURRED = 'ERROR_OCCURRED'
}

interface SimulatorEvent {
  type: EventType;
  data: any;
  timestamp: number;
}
```

### Event APIs

#### `EventEmitter.on(event: EventType, handler: (data: any) => void): void`

Subscribes to events.

#### `EventEmitter.emit(event: EventType, data: any): void`

Emits an event.

#### `EventEmitter.off(event: EventType, handler: Function): void`

Unsubscribes from events.

---

## Usage Examples

### Complete Example

```typescript
import { 
  ArduinoParser, 
  CanvasRenderer, 
  TouchHandler,
  useDisplayStore 
} from 'tft-simulator';

// Initialize components
const parser = new ArduinoParser();
const renderer = new CanvasRenderer(canvasElement, {
  width: 480,
  height: 320,
  pixelRatio: 1,
  antialiasing: true,
  debugMode: false
});

// Parse code
const parsedCode = parser.parseCode(arduinoCode);

// Render screens
const screens = parser.extractScreens(parsedCode);
screens.forEach(screen => renderer.renderScreen(screen));

// Handle interactions
const touchHandler = new TouchHandler();
touchHandler.on('touch', (event) => {
  const result = touchHandler.handleTouch(event);
  if (result.stateChange) {
    displayStore.setScreen(result.stateChange.newState);
  }
});
```

### React Component Example

```typescript
import React, { useEffect } from 'react';
import { useDisplayStore, useInteractionStore } from 'tft-simulator';

const TFTSimulator: React.FC = () => {
  const { currentScreen, setScreen } = useDisplayStore();
  const { handleTouch } = useInteractionStore();

  const handleCanvasClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    handleTouch(x, y);
  };

  return (
    <canvas
      width={480}
      height={320}
      onClick={handleCanvasClick}
      style={{ border: '1px solid #ccc' }}
    />
  );
};
```

---

This API documentation provides comprehensive coverage of all available functions and interfaces in the TFT Display Simulator. For more examples and detailed usage instructions, refer to the main README and example files. 