# Architecture Document

## Overview

The TFT Display Simulator is a web-based application that parses Arduino C++ code and renders an interactive simulation of TFT displays. This document outlines the technical architecture, implementation details, and design decisions for building a fully functional simulator.

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Components](#core-components)
3. [Data Flow](#data-flow)
4. [Parser Implementation](#parser-implementation)
5. [Renderer Implementation](#renderer-implementation)
6. [State Management](#state-management)
7. [Touch Interaction System](#touch-interaction-system)
8. [Performance Considerations](#performance-considerations)
9. [Security Considerations](#security-considerations)
10. [Deployment Strategy](#deployment-strategy)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Code Editor│  │  Display Canvas │  │  Control Panel      │ │
│  │  Component  │  │  Component      │  │  Component          │ │
│  └─────────────┘  └─────────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    React Application Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Parser     │  │  Renderer       │  │  State Management   │ │
│  │  Engine     │  │  Engine         │  │  (Zustand)          │ │
│  └─────────────┘  └─────────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      Core Engine Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Canvas API │  │  Touch Events   │  │  Utility Functions  │ │
│  │  (HTML5)    │  │  (DOM Events)   │  │  (Color, Math)      │ │
│  └─────────────┘  └─────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **Rendering**: HTML5 Canvas API
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules or Styled Components
- **Code Quality**: ESLint + Prettier

---

## 🔧 Core Components

### 1. Arduino Code Parser

**Responsibility**: Parse Arduino C++ code and extract display commands and logic.

**Key Classes**:
```typescript
class ArduinoParser {
  parseCode(code: string): ParsedCode;
  extractIncludes(code: string): string[];
  extractFunctions(code: string): FunctionDefinition[];
  extractVariables(code: string): Variable[];
  extractEnums(code: string): EnumDefinition[];
}

class TFTCommandParser {
  parseCommand(line: string): TFTCommand | null;
  resolveTFTConstants(value: string): any;
  validateParameters(command: TFTCommand): boolean;
}

class StateAnalyzer {
  analyzeStateFlow(code: ParsedCode): StateFlow;
  extractTouchZones(code: ParsedCode): TouchZone[];
  mapStateTransitions(code: ParsedCode): StateTransition[];
}
```

### 2. Display Renderer

**Responsibility**: Render TFT display elements on HTML5 Canvas.

**Key Classes**:
```typescript
class CanvasRenderer {
  constructor(canvas: HTMLCanvasElement, config: DisplayConfig);
  clear(color?: string): void;
  drawRect(x: number, y: number, w: number, h: number, color: string): void;
  drawRoundedRect(x: number, y: number, w: number, h: number, radius: number, color: string): void;
  drawText(text: string, x: number, y: number, font: FontConfig, color: string): void;
  drawBitmap(x: number, y: number, bitmap: ImageData, color: string): void;
}

class DisplayManager {
  renderScreen(screen: Screen): void;
  updateElement(element: UIElement): void;
  handleResize(width: number, height: number): void;
}
```

### 3. Touch Interaction Handler

**Responsibility**: Handle mouse/touch events and map them to Arduino touch logic.

**Key Classes**:
```typescript
class TouchHandler {
  registerTouchZone(zone: TouchZone): void;
  handleClick(x: number, y: number): TouchResult;
  getTouchZoneAt(x: number, y: number): TouchZone | null;
  simulateTouch(x: number, y: number): void;
}

class InteractionManager {
  processTouch(event: TouchEvent): void;
  updateTouchState(zones: TouchZone[]): void;
  triggerStateChange(transition: StateTransition): void;
}
```

---

## 🔄 Data Flow

### Parsing Flow

```
Arduino Code Input
        ↓
    Lexical Analysis
        ↓
    Syntax Analysis
        ↓
    Semantic Analysis
        ↓
    AST Generation
        ↓
    Command Extraction
        ↓
    Screen Definition
        ↓
    Touch Zone Mapping
        ↓
    State Flow Analysis
        ↓
    Renderable Elements
```

### Rendering Flow

```
Parsed Elements
        ↓
    Canvas Preparation
        ↓
    Background Rendering
        ↓
    Element Rendering
        ↓
    Touch Zone Overlay
        ↓
    State Updates
        ↓
    Animation Loop
        ↓
    Event Handling
```

### State Management Flow

```
User Interaction
        ↓
    Touch Detection
        ↓
    Zone Identification
        ↓
    Action Trigger
        ↓
    State Update
        ↓
    Screen Rerender
        ↓
    UI Update
```

---

## 🔍 Parser Implementation

### Code Parsing Strategy

The parser uses a multi-stage approach:

1. **Preprocessing**: Remove comments, handle includes
2. **Tokenization**: Break code into tokens
3. **Parsing**: Build Abstract Syntax Tree (AST)
4. **Analysis**: Extract display commands and logic

### Key Parsing Patterns

```typescript
interface ParsedCode {
  includes: string[];
  defines: Define[];
  variables: Variable[];
  enums: EnumDefinition[];
  functions: FunctionDefinition[];
  classes: ClassDefinition[];
  setup: Statement[];
  loop: Statement[];
  touchHandlers: TouchHandler[];
  stateTransitions: StateTransition[];
}

interface TFTCommand {
  type: TFTCommandType;
  method: string;
  parameters: Parameter[];
  lineNumber: number;
  sourceCode: string;
}

enum TFTCommandType {
  FILL_SCREEN = 'fillScreen',
  DRAW_STRING = 'drawString',
  FILL_RECT = 'fillRect',
  FILL_SMOOTH_ROUND_RECT = 'fillSmoothRoundRect',
  DRAW_BITMAP = 'drawBitmap',
  SET_TEXT_COLOR = 'setTextColor',
  SET_TEXT_FONT = 'setTextFont',
  SET_TEXT_SIZE = 'setTextSize',
  SET_TEXT_DATUM = 'setTextDatum',
  GET_TOUCH = 'getTouch',
  SET_TOUCH = 'setTouch',
  DRAW_CIRCLE = 'drawCircle',
  FILL_CIRCLE = 'fillCircle',
  DRAW_LINE = 'drawLine'
}
```

### Regular Expression Patterns

```typescript
const PATTERNS = {
  INCLUDE: /#include\s*[<"](.*?)[>"]/g,
  DEFINE: /#define\s+(\w+)\s+(.*?)$/gm,
  VARIABLE: /(?:int|float|bool|String|uint16_t|unsigned\s+long)\s+(\w+)\s*(?:=\s*([^;]+))?;/g,
  ENUM: /enum\s+(\w+)\s*\{([^}]+)\}/g,
  FUNCTION: /(?:void|int|float|bool|String|uint16_t)\s+(\w+)\s*\([^)]*\)\s*\{/g,
  TFT_COMMAND: /tft\.(\w+)\s*\(([^)]*)\)/g,
  TOUCH_HANDLER: /if\s*\(\s*tft\.getTouch\s*\(\s*&\s*(\w+)\s*,\s*&\s*(\w+)\s*\)\s*\)/g,
  STATE_ENUM: /enum\s+State\s*\{([^}]+)\}/g,
  CONDITION: /if\s*\(\s*([^)]+)\s*\)/g
};
```

---

## 🎨 Renderer Implementation

### Canvas Management

```typescript
class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private devicePixelRatio: number;
  
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.setupCanvas(width, height);
  }
  
  private setupCanvas(width: number, height: number): void {
    const scaledWidth = width * this.devicePixelRatio;
    const scaledHeight = height * this.devicePixelRatio;
    
    this.canvas.width = scaledWidth;
    this.canvas.height = scaledHeight;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
  }
}
```

### Drawing Operations

```typescript
class DrawingOperations {
  static fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  
  static fillRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  }
  
  static drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: FontConfig, color: string): void {
    ctx.fillStyle = color;
    ctx.font = `${font.weight} ${font.size}px ${font.family}`;
    ctx.textAlign = this.getTextAlign(font.datum);
    ctx.textBaseline = this.getTextBaseline(font.datum);
    ctx.fillText(text, x, y);
  }
  
  private static getTextAlign(datum: TextDatum): CanvasTextAlign {
    const alignMap: Record<string, CanvasTextAlign> = {
      'TL': 'left', 'TC': 'center', 'TR': 'right',
      'ML': 'left', 'MC': 'center', 'MR': 'right',
      'BL': 'left', 'BC': 'center', 'BR': 'right'
    };
    return alignMap[datum] || 'left';
  }
  
  private static getTextBaseline(datum: TextDatum): CanvasTextBaseline {
    const baselineMap: Record<string, CanvasTextBaseline> = {
      'TL': 'top', 'TC': 'top', 'TR': 'top',
      'ML': 'middle', 'MC': 'middle', 'MR': 'middle',
      'BL': 'bottom', 'BC': 'bottom', 'BR': 'bottom'
    };
    return baselineMap[datum] || 'top';
  }
}
```

### Color Management

```typescript
class ColorManager {
  private static readonly TFT_COLORS = {
    TFT_BLACK: '#000000',
    TFT_WHITE: '#FFFFFF',
    TFT_RED: '#F800',
    TFT_GREEN: '#07E0',
    TFT_BLUE: '#001F',
    TFT_YELLOW: '#FFE0',
    TFT_ORANGE: '#FD20',
    TFT_DARKGREY: '#7BEF',
    TFT_LIGHTGREY: '#C618',
    TFT_DARKGREEN: '#0320',
    TFT_MAROON: '#7800',
    TFT_PURPLE: '#780F',
    TFT_OLIVE: '#7BE0',
    TFT_NAVY: '#000F',
    TFT_PINK: '#F81F'
  };
  
  static parseColor(color: string): string {
    // Handle TFT color constants
    if (color.startsWith('TFT_')) {
      return this.TFT_COLORS[color as keyof typeof this.TFT_COLORS] || '#000000';
    }
    
    // Handle rgbToHex function calls
    if (color.includes('rgbToHex')) {
      const match = color.match(/rgbToHex\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match;
        return this.rgbToHex(parseInt(r), parseInt(g), parseInt(b));
      }
    }
    
    // Handle hex values
    if (color.startsWith('0x')) {
      return this.rgb565ToHex(parseInt(color, 16));
    }
    
    return color;
  }
  
  static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  static rgb565ToHex(rgb565: number): string {
    const r = (rgb565 >> 11) & 0x1F;
    const g = (rgb565 >> 5) & 0x3F;
    const b = rgb565 & 0x1F;
    
    const r8 = (r * 255) / 31;
    const g8 = (g * 255) / 63;
    const b8 = (b * 255) / 31;
    
    return this.rgbToHex(Math.round(r8), Math.round(g8), Math.round(b8));
  }
}
```

---

## 🗄️ State Management

### Zustand Store Implementation

```typescript
interface DisplayState {
  // Display configuration
  displayConfig: DisplayConfig;
  
  // Current state
  currentScreen: string;
  screenHistory: string[];
  
  // Variables from Arduino code
  variables: Record<string, any>;
  
  // UI elements
  elements: UIElement[];
  touchZones: TouchZone[];
  
  // Interaction state
  isPressed: boolean;
  lastTouch: { x: number; y: number } | null;
  
  // Debug state
  debugMode: boolean;
  showTouchZones: boolean;
}

interface DisplayActions {
  setDisplayConfig: (config: DisplayConfig) => void;
  setCurrentScreen: (screen: string) => void;
  updateVariable: (name: string, value: any) => void;
  updateElements: (elements: UIElement[]) => void;
  updateTouchZones: (zones: TouchZone[]) => void;
  handleTouch: (x: number, y: number) => void;
  setDebugMode: (enabled: boolean) => void;
  setShowTouchZones: (show: boolean) => void;
}

const useDisplayStore = create<DisplayState & DisplayActions>((set, get) => ({
  // Initial state
  displayConfig: {
    width: 480,
    height: 320,
    pixelRatio: 1,
    antialiasing: true,
    debugMode: false
  },
  currentScreen: 'HOME',
  screenHistory: [],
  variables: {},
  elements: [],
  touchZones: [],
  isPressed: false,
  lastTouch: null,
  debugMode: false,
  showTouchZones: false,
  
  // Actions
  setDisplayConfig: (config) => set({ displayConfig: config }),
  setCurrentScreen: (screen) => set((state) => ({
    currentScreen: screen,
    screenHistory: [...state.screenHistory, screen]
  })),
  updateVariable: (name, value) => set((state) => ({
    variables: { ...state.variables, [name]: value }
  })),
  updateElements: (elements) => set({ elements }),
  updateTouchZones: (zones) => set({ touchZones: zones }),
  handleTouch: (x, y) => {
    const state = get();
    const touchZone = state.touchZones.find(zone => 
      x >= zone.bounds.x && x <= zone.bounds.x + zone.bounds.width &&
      y >= zone.bounds.y && y <= zone.bounds.y + zone.bounds.height
    );
    
    if (touchZone) {
      // Trigger touch action
      set({ lastTouch: { x, y }, isPressed: true });
      // Additional logic for state transitions
    }
  },
  setDebugMode: (enabled) => set({ debugMode: enabled }),
  setShowTouchZones: (show) => set({ showTouchZones: show })
}));
```

---

## 👆 Touch Interaction System

### Touch Zone Detection

```typescript
class TouchZoneManager {
  private zones: TouchZone[] = [];
  
  registerZone(zone: TouchZone): void {
    this.zones.push(zone);
  }
  
  findZoneAt(x: number, y: number): TouchZone | null {
    return this.zones.find(zone => 
      this.isPointInZone(x, y, zone.bounds)
    ) || null;
  }
  
  private isPointInZone(x: number, y: number, bounds: Rectangle): boolean {
    return x >= bounds.x && 
           x <= bounds.x + bounds.width &&
           y >= bounds.y && 
           y <= bounds.y + bounds.height;
  }
  
  visualizeZones(ctx: CanvasRenderingContext2D): void {
    this.zones.forEach(zone => {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        zone.bounds.x, 
        zone.bounds.y, 
        zone.bounds.width, 
        zone.bounds.height
      );
    });
  }
}
```

### Touch Event Handling

```typescript
class TouchEventHandler {
  private canvas: HTMLCanvasElement;
  private zoneManager: TouchZoneManager;
  
  constructor(canvas: HTMLCanvasElement, zoneManager: TouchZoneManager) {
    this.canvas = canvas;
    this.zoneManager = zoneManager;
    this.attachEventListeners();
  }
  
  private attachEventListeners(): void {
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }
  
  private handleClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const zone = this.zoneManager.findZoneAt(x, y);
    if (zone) {
      this.triggerTouchAction(zone, x, y);
    }
  }
  
  private triggerTouchAction(zone: TouchZone, x: number, y: number): void {
    // Emit touch event
    const touchEvent = new CustomEvent('arduinoTouch', {
      detail: {
        zone,
        x,
        y,
        timestamp: Date.now()
      }
    });
    
    this.canvas.dispatchEvent(touchEvent);
  }
}
```

---

## ⚡ Performance Considerations

### Rendering Optimization

1. **Canvas Optimization**:
   - Use `requestAnimationFrame` for smooth animations
   - Implement dirty rectangle updates
   - Use off-screen canvas for complex elements

2. **State Management**:
   - Minimize state updates
   - Use shallow comparison for React re-renders
   - Implement memoization for expensive calculations

3. **Memory Management**:
   - Clean up event listeners
   - Dispose of unused canvases
   - Implement object pooling for frequently created objects

### Code Parsing Optimization

```typescript
class OptimizedParser {
  private cache = new Map<string, ParsedCode>();
  
  parseCode(code: string): ParsedCode {
    const hash = this.generateHash(code);
    
    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }
    
    const parsed = this.performParsing(code);
    this.cache.set(hash, parsed);
    
    return parsed;
  }
  
  private generateHash(code: string): string {
    // Simple hash function for caching
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
}
```

---

## 🔒 Security Considerations

### Code Execution Safety

The simulator only parses and simulates Arduino code - it never executes arbitrary JavaScript. All parsing is done through safe string operations and regular expressions.

### Input Validation

```typescript
class InputValidator {
  static validateArduinoCode(code: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for potentially dangerous patterns
    if (code.includes('eval(') || code.includes('Function(')) {
      errors.push('Dynamic code execution not allowed');
    }
    
    // Check for excessive memory usage
    if (code.length > 100000) {
      warnings.push('Large code files may impact performance');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  }
}
```

### Content Security Policy

```typescript
// Recommended CSP headers
const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'", // For parsing
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'"
  ].join('; ')
};
```

---

## 🚀 Deployment Strategy

### Development Environment

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write src/**/*.{ts,tsx}"
  }
}
```

### Production Build

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 Testing Strategy

### Unit Tests

```typescript
// parser.test.ts
describe('ArduinoParser', () => {
  it('should parse TFT commands correctly', () => {
    const code = 'tft.fillRect(10, 20, 100, 50, TFT_RED);';
    const parser = new ArduinoParser();
    const result = parser.parseCode(code);
    
    expect(result.commands).toHaveLength(1);
    expect(result.commands[0].type).toBe('fillRect');
    expect(result.commands[0].parameters).toEqual([10, 20, 100, 50, 'TFT_RED']);
  });
});
```

### Integration Tests

```typescript
// simulation.test.ts
describe('Display Simulation', () => {
  it('should render and handle touch correctly', () => {
    const canvas = document.createElement('canvas');
    const simulator = new TFTSimulator(canvas);
    
    simulator.loadCode(SAMPLE_ARDUINO_CODE);
    simulator.render();
    
    // Simulate touch
    simulator.handleTouch(100, 100);
    
    expect(simulator.getCurrentScreen()).toBe('CONFIG');
  });
});
```

---

## 📈 Monitoring and Analytics

### Performance Monitoring

```typescript
class PerformanceMonitor {
  private metrics: Record<string, number> = {};
  
  measureParsingTime(code: string): number {
    const start = performance.now();
    // Perform parsing
    const end = performance.now();
    
    const duration = end - start;
    this.metrics.parsingTime = duration;
    
    return duration;
  }
  
  measureRenderTime(): number {
    const start = performance.now();
    // Perform rendering
    const end = performance.now();
    
    const duration = end - start;
    this.metrics.renderTime = duration;
    
    return duration;
  }
  
  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }
}
```

---

This architecture document provides a comprehensive guide for implementing the TFT Display Simulator. The modular design allows for easy extension and maintenance, while the performance considerations ensure the simulator runs smoothly even with complex Arduino code.

## 🔧 Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Set up React + TypeScript project
- [ ] Implement basic Canvas renderer
- [ ] Create Zustand store structure
- [ ] Set up testing framework

### Phase 2: Parser Implementation
- [ ] Implement Arduino code tokenizer
- [ ] Build TFT command parser
- [ ] Add state analysis functionality
- [ ] Create touch zone extractor

### Phase 3: Renderer Implementation
- [ ] Implement drawing operations
- [ ] Add color management
- [ ] Create font rendering system
- [ ] Add animation support

### Phase 4: Interaction System
- [ ] Implement touch event handling
- [ ] Add touch zone visualization
- [ ] Create state transition system
- [ ] Add debug mode

### Phase 5: Polish and Optimization
- [ ] Optimize rendering performance
- [ ] Add error handling
- [ ] Implement caching
- [ ] Add comprehensive testing

This architecture ensures the simulator is maintainable, extensible, and performant while providing an accurate representation of Arduino TFT display behavior. 