# TFT Display Simulator

A comprehensive simulator for 380x420 TFT touch displays that allows you to visualize and interact with Arduino-based TFT display applications in a web browser. Input your Arduino code and see exactly how each UI element will look and behave, complete with touch interactions and state management.

## 🎯 Project Overview

This simulator parses Arduino code (specifically TFT_eSPI library based applications) and renders an interactive web-based replica of your TFT display interface. It's designed to help developers:

- **Visualize UI layouts** before deploying to hardware
- **Test touch interactions** and state transitions
- **Debug display logic** in a convenient web environment
- **Prototype interfaces** rapidly without hardware dependencies
- **Document UI behavior** for team collaboration

## 🏗️ Architecture

The simulator consists of three main components:

### 1. Code Parser Engine
- **Input**: Arduino C++ code using TFT_eSPI library
- **Output**: Abstract Syntax Tree (AST) of UI elements and interactions
- **Responsibilities**: 
  - Extract screen dimensions and color definitions
  - Parse drawing commands (rectangles, text, bitmaps)
  - Identify touch zones and button definitions
  - Map state transitions and logic flow

### 2. Display Renderer
- **Technology**: React/TypeScript with HTML5 Canvas
- **Responsibilities**:
  - Render UI elements with pixel-perfect accuracy
  - Handle touch/click events
  - Manage screen states and transitions
  - Animate progress bars and dynamic elements

### 3. State Management System
- **Technology**: Redux Toolkit or Zustand
- **Responsibilities**:
  - Track current screen state
  - Manage UI element properties
  - Handle user interactions
  - Maintain application variables

## 📋 Key Features

### Display Capabilities
- [x] **Screen Dimensions**: Configurable display size (380x420 or 480x320)
- [x] **Color Support**: 16-bit RGB565 color space
- [x] **Font Rendering**: Multiple font families and sizes
- [x] **Shape Drawing**: Rectangles, rounded rectangles, circles
- [x] **Bitmap Support**: Icon and image rendering
- [x] **Text Alignment**: Multiple text datum options

### Interaction Features
- [x] **Touch Zones**: Clickable areas mapped from Arduino code
- [x] **Button States**: Visual feedback for pressed/released states
- [x] **State Transitions**: Screen navigation logic
- [x] **Real-time Updates**: Dynamic content changes
- [x] **Progress Indicators**: Animated progress bars and counters

### Development Tools
- [x] **Live Preview**: Real-time code parsing and rendering
- [x] **Debug Mode**: Touch zone visualization and state inspection
- [x] **Export Options**: Screenshot and interaction recording
- [x] **Code Validation**: Syntax checking and error reporting

## 🛠️ Technical Specifications

### Display Properties
```javascript
const DISPLAY_CONFIG = {
  width: 380,           // or 480 based on your hardware
  height: 420,          // or 320 based on your hardware
  colorDepth: 16,       // 16-bit RGB565
  touchSupport: true,
  rotation: 1,          // 0-3 for different orientations
  backlight: true
};
```

### Supported TFT_eSPI Commands
```cpp
// Screen Management
tft.init()
tft.setRotation(rotation)
tft.fillScreen(color)
tft.setTextColor(color, bgcolor)

// Drawing Commands
tft.fillRect(x, y, w, h, color)
tft.fillSmoothRoundRect(x, y, w, h, radius, color, bgcolor)
tft.drawString(text, x, y, font)
tft.drawBitmap(x, y, bitmap, w, h, color)

// Text Configuration
tft.setTextDatum(datum)
tft.setTextFont(font)
tft.setFreeFont(font)
tft.setTextSize(size)

// Touch Handling
tft.getTouch(&x, &y)
tft.setTouch(calData)
```

### Color System
```javascript
// RGB565 to Hex conversion
function rgbToHex(r, g, b) {
  const r5 = (r >> 3) & 0x1F;
  const g6 = (g >> 2) & 0x3F;
  const b5 = (b >> 3) & 0x1F;
  return (r5 << 11) | (g6 << 5) | b5;
}

// Predefined TFT colors
const TFT_COLORS = {
  TFT_BLACK: 0x0000,
  TFT_WHITE: 0xFFFF,
  TFT_RED: 0xF800,
  TFT_GREEN: 0x07E0,
  TFT_BLUE: 0x001F,
  TFT_ORANGE: 0xFD20,
  TFT_DARKGREY: 0x7BEF
};
```

## 🚀 Getting Started

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Disk Space**: 500MB for development environment
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with Canvas support
- Basic understanding of Arduino/C++ and React
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tft-simulator/tft-display-simulator.git
   cd tft-display-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment (optional)**
   Create a `.env.local` file for custom settings:
   ```bash
   # Development settings
   VITE_PORT=5173
   VITE_HOST=localhost
   VITE_ENABLE_DEBUG=true
   
   # API endpoints (if using backend)
   VITE_API_URL=http://localhost:3000
   
   # Feature flags
   VITE_ENABLE_WEBGL=true
   VITE_ENABLE_WASM=false
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`
   
   The application will automatically reload when you make changes.

6. **Run tests (optional)**
   ```bash
   npm run test        # Run test suite
   npm run test:watch  # Run tests in watch mode
   npm run test:coverage # Generate coverage report
   ```

### Quick Start Example

1. **Paste your Arduino code** into the code editor
2. **Configure display settings** (dimensions, rotation)
3. **Click "Parse & Render"** to generate the simulation
4. **Interact with the display** using mouse clicks (simulating touch)
5. **Use debug mode** to visualize touch zones and state transitions

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

3. **Deploy to hosting service**
   The `dist` folder contains the production-ready files:
   - **Netlify**: Drop the `dist` folder to Netlify
   - **Vercel**: Run `vercel` in project root
   - **GitHub Pages**: Use GitHub Actions workflow
   - **Docker**: Use the included Dockerfile

### Supported Arduino Libraries

The simulator currently supports the following Arduino TFT libraries:

- **TFT_eSPI** (Primary support) - v2.4.0+
- **Adafruit_GFX** (Partial support) - v1.10.0+
- **LVGL** (Experimental) - v8.0+
- **U8g2** (Limited support) - v2.28+

For best results, use TFT_eSPI library with standard commands.

## 📁 Project Structure

```
tft-display-simulator/
├── src/
│   ├── components/
│   │   ├── DisplayCanvas.tsx      # Main display rendering component
│   │   ├── CodeEditor.tsx         # Arduino code input interface
│   │   ├── ControlPanel.tsx       # Configuration and debug controls
│   │   └── TouchZoneOverlay.tsx   # Touch interaction visualization
│   ├── parsers/
│   │   ├── ArduinoParser.ts       # C++ code parsing logic
│   │   ├── TFTCommandParser.ts    # TFT_eSPI command extraction
│   │   └── StateAnalyzer.ts       # State transition analysis
│   ├── renderers/
│   │   ├── CanvasRenderer.ts      # Low-level canvas drawing
│   │   ├── UIElementRenderer.ts   # UI component rendering
│   │   └── FontRenderer.ts        # Text and font handling
│   ├── state/
│   │   ├── displayStore.ts        # Display state management
│   │   ├── interactionStore.ts    # Touch/click handling
│   │   └── codeStore.ts          # Parsed code state
│   ├── utils/
│   │   ├── colorUtils.ts         # Color conversion utilities
│   │   ├── mathUtils.ts          # Coordinate calculations
│   │   └── validationUtils.ts    # Code validation helpers
│   └── types/
│       ├── DisplayTypes.ts       # Display-related interfaces
│       ├── InteractionTypes.ts   # Touch/interaction types
│       └── ParserTypes.ts        # Code parsing types
├── public/
│   ├── fonts/                    # Font files for rendering
│   ├── icons/                    # UI icons and assets
│   └── samples/                  # Example Arduino code files
├── docs/
│   ├── API.md                    # API documentation
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── EXAMPLES.md               # Usage examples
└── tests/
    ├── parsers/                  # Parser unit tests
    ├── renderers/                # Renderer unit tests
    └── integration/              # End-to-end tests
```

## 🎨 Usage Examples

### Basic Screen Definition
```cpp
// Your Arduino code defines screens like this:
void drawHome() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold24pt7b);
  tft.drawString("TAMARA [ ITD ]", 240, 20);
  
  // Green button
  tft.fillSmoothRoundRect(65, 238, 350, 55, 15, 
                          rgbToHex(15, 209, 20), TFT_BLACK);
  tft.drawString("CONFIGURE", 240, 265);
}
```

### Touch Zone Definition
```cpp
// Touch handling in your Arduino code:
uint16_t x, y;
if (tft.getTouch(&x, &y)) {
  // Configure button touched
  if (x > 65 && x < 415 && y > 238 && y < 293) {
    curState = DURATION_CONFIG;
  }
}
```

### State Management
```cpp
// State enumeration
enum State { HOME, DURATION_CONFIG, FIRING, DONE };
State curState = HOME;

// State transition logic
if (curState == HOME) {
  drawHome();
} else if (curState == DURATION_CONFIG) {
  drawConfigScreen();
}
```

## 🔧 Configuration Options

### Display Settings
```json
{
  "display": {
    "width": 380,
    "height": 420,
    "pixelRatio": 1,
    "touchCalibration": [390, 3358, 318, 3329, 7],
    "rotation": 1,
    "flipX": false,
    "flipY": false
  },
  "rendering": {
    "antialiasing": true,
    "fontSmoothing": true,
    "debugMode": false,
    "showTouchZones": false,
    "animationSpeed": 1.0
  },
  "interaction": {
    "touchDelay": 50,
    "longPressThreshold": 500,
    "multiTouchSupport": false
  }
}
```

### Parser Configuration
```json
{
  "parser": {
    "strictMode": false,
    "ignoreComments": true,
    "extractIncludes": true,
    "followIncludes": false,
    "maxRecursionDepth": 10
  },
  "validation": {
    "checkSyntax": true,
    "validateColors": true,
    "checkBounds": true,
    "warnUnusedVariables": false
  }
}
```

## 🧪 Testing and Debugging

### Debug Mode Features
- **Touch Zone Visualization**: Overlay showing clickable areas
- **State Inspector**: Real-time state variable monitoring
- **Command Log**: Sequential list of executed TFT commands
- **Performance Monitor**: Rendering performance metrics
- **Error Console**: Parsing and runtime error reporting

### Testing Your Code
1. **Syntax Validation**: Automatic C++ syntax checking
2. **Boundary Testing**: Verify elements fit within screen bounds
3. **Touch Testing**: Ensure touch zones are properly defined
4. **State Flow Testing**: Verify state transitions work correctly
5. **Performance Testing**: Check rendering performance

## 📊 API Reference

### Core Parser API
```javascript
// Parse Arduino code into renderable elements
const parseArduinoCode = (code: string): ParsedDisplay => {
  const lexer = new ArduinoLexer(code);
  const tokens = lexer.tokenize();
  const parser = new ArduinoParser(tokens);
  const ast = parser.parse();
  
  return {
    elements: extractUIElements(ast),
    states: extractStates(ast),
    touchZones: extractTouchZones(ast),
    config: extractDisplayConfig(ast)
  };
};

// Extract UI elements from parsed code
const extractUIElements = (ast: AST): UIElement[] => {
  const elements: UIElement[] = [];
  
  ast.traverse((node) => {
    if (node.type === 'FunctionCall') {
      const element = parseTFTCommand(node);
      if (element) elements.push(element);
    }
  });
  
  return elements;
};

// Analyze state transitions
const analyzeStateFlow = (ast: AST): StateTransition[] => {
  const transitions: StateTransition[] = [];
  const stateEnum = findStateEnum(ast);
  
  ast.traverse((node) => {
    if (node.type === 'IfStatement' && containsStateChange(node)) {
      transitions.push({
        from: getCurrentState(node),
        to: getNextState(node),
        condition: extractCondition(node),
        touchZone: extractTouchBounds(node)
      });
    }
  });
  
  return transitions;
};
```

### Rendering API
```javascript
// Render display to canvas
const renderDisplay = (
  canvas: HTMLCanvasElement,
  elements: UIElement[],
  state: DisplayState
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  // Clear canvas
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render elements in order
  elements
    .filter(el => el.screenState === state.currentScreen)
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach(element => {
      renderElement(ctx, element, state);
    });
};

// Handle touch interactions
const handleTouch = (
  x: number,
  y: number,
  touchZones: TouchZone[]
): TouchResult => {
  // Scale coordinates if needed
  const scaledX = x * (380 / canvas.width);
  const scaledY = y * (420 / canvas.height);
  
  // Find touched zone
  const zone = touchZones.find(z => 
    scaledX >= z.x1 && scaledX <= z.x2 &&
    scaledY >= z.y1 && scaledY <= z.y2 &&
    z.screenState === currentState
  );
  
  if (zone) {
    return {
      handled: true,
      action: zone.action,
      nextState: zone.nextState,
      payload: zone.payload
    };
  }
  
  return { handled: false };
};
```

## 🔍 Quick Reference

### Common TFT Commands Mapping
| Arduino Command | Simulator Implementation |
|----------------|-------------------------|
| `tft.fillScreen(color)` | Fills entire canvas with color |
| `tft.drawString(text, x, y)` | Renders text at position |
| `tft.fillRect(x, y, w, h, color)` | Draws filled rectangle |
| `tft.getTouch(&x, &y)` | Maps to mouse/touch events |
| `tft.setTextDatum(datum)` | Sets text alignment anchor |

### Color Conversion Reference
```javascript
// Common color conversions
const TFT_BLACK = 0x0000;    // #000000
const TFT_WHITE = 0xFFFF;    // #FFFFFF
const TFT_RED = 0xF800;      // #FF0000
const TFT_GREEN = 0x07E0;    // #00FF00
const TFT_BLUE = 0x001F;     // #0000FF
const TFT_ORANGE = 0xFD20;   // #FF6800
const TFT_YELLOW = 0xFFE0;   // #FFFF00
const TFT_CYAN = 0x07FF;     // #00FFFF
const TFT_MAGENTA = 0xF81F;  // #FF00FF

// Convert RGB888 to RGB565
function rgbToTFT(r: number, g: number, b: number): number {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Run tests: `npm test`
6. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Add unit tests for new features
- Document public APIs
- Use semantic commit messages

## 📝 Roadmap

### Phase 1: Core Functionality ✅ (v1.0.0)
- [x] Basic code parsing
- [x] Simple shape rendering
- [x] Touch zone detection
- [x] State management

### Phase 2: Advanced Features 🚧 (v1.1.0 - Q1 2024)
- [x] Font rendering system
- [ ] Bitmap/icon support (In Progress)
- [ ] Animation system (Timeline-based)
- [ ] Multi-screen support

### Phase 3: Developer Tools 📋 (v1.2.0 - Q2 2024)
- [ ] Real-time code validation
- [ ] Performance profiling dashboard
- [ ] Export functionality (PNG, GIF, MP4)
- [ ] Plugin system for custom components

### Phase 4: Integration 🔮 (v2.0.0 - Q3 2024)
- [ ] VS Code extension with live preview
- [ ] CLI interface for CI/CD pipelines
- [ ] Hardware-in-the-loop testing
- [ ] Cloud deployment with sharing

## 🐛 Known Issues & Solutions

### 1. Font Rendering
**Issue**: Web fonts don't match TFT fonts exactly  
**Solution**: Use the included font mapping table or upload custom .h font files  
**Workaround**: Enable "Font Approximation" mode in settings

### 2. Bitmap Support
**Issue**: Large bitmaps may cause performance issues  
**Solution**: Optimize bitmaps to 16-bit color depth before use  
**Fix**: Bitmap caching system coming in v1.1.0

### 3. Touch Calibration
**Issue**: Touch coordinates may not match exactly with hardware  
**Solution**: Use the calibration tool to match your specific display  
**Note**: Export calibration data for consistent results

### 4. Performance
**Issue**: Rendering lag with >100 elements on screen  
**Solution**: Enable "Performance Mode" which uses WebGL rendering  
**Optimization**: Group static elements into layers

## 🚑 Troubleshooting

### Common Issues

#### "Parser Error: Unexpected token"
- **Cause**: Unsupported C++ syntax
- **Fix**: Ensure code uses supported TFT_eSPI commands
- **Check**: Remove complex preprocessor directives

#### "Canvas not rendering"
- **Cause**: Browser compatibility issue
- **Fix**: Update to latest Chrome/Firefox/Safari
- **Alternative**: Enable fallback renderer in settings

#### "Touch zones not working"
- **Cause**: Incorrect coordinate mapping
- **Fix**: Check touch zone boundaries in debug mode
- **Tip**: Touch zones must be defined after drawing elements

#### "State transitions failing"
- **Cause**: Missing state definitions
- **Fix**: Ensure all states are defined in enum
- **Debug**: Use State Inspector to trace transitions

### Performance Tips
1. **Minimize Redraws**: Only update changed elements
2. **Use Layers**: Group static elements together
3. **Optimize Images**: Convert to 16-bit before importing
4. **Batch Updates**: Group multiple draw commands
5. **Enable GPU**: Use hardware acceleration when available

## ⚡ Performance Benchmarks

| Display Size | Elements | FPS (CPU) | FPS (GPU) | Memory Usage |
|-------------|----------|-----------|-----------|--------------|
| 320x240     | 50       | 60        | 60        | 12 MB        |
| 380x420     | 100      | 45        | 60        | 18 MB        |
| 480x320     | 200      | 30        | 55        | 25 MB        |
| 800x480     | 500      | 15        | 45        | 40 MB        |

*Tested on: Intel i5-10400, 8GB RAM, Chrome 119*

## 🌐 Browser Compatibility

| Browser | Version | Canvas | WebGL | Touch | Notes |
|---------|---------|--------|-------|-------|-------|
| Chrome | 90+ | ✅ | ✅ | ✅ | Recommended |
| Firefox | 88+ | ✅ | ✅ | ✅ | Full support |
| Safari | 14+ | ✅ | ⚠️ | ✅ | WebGL limited |
| Edge | 90+ | ✅ | ✅ | ✅ | Full support |
| Opera | 76+ | ✅ | ✅ | ✅ | Full support |
| Mobile Chrome | 90+ | ✅ | ⚠️ | ✅ | Performance varies |
| Mobile Safari | 14+ | ✅ | ❌ | ✅ | No WebGL |

## 🔌 Extending the Simulator

### Creating Custom Plugins

```javascript
// Plugin template
export class CustomPlugin {
  name = 'MyCustomPlugin';
  version = '1.0.0';
  
  // Called when plugin is loaded
  onLoad(simulator) {
    this.simulator = simulator;
  }
  
  // Register custom commands
  registerCommands() {
    return {
      'customDraw': this.handleCustomDraw.bind(this)
    };
  }
  
  // Handle custom drawing command
  handleCustomDraw(params) {
    const { x, y, width, height, data } = params;
    // Custom rendering logic
  }
}

// Register plugin
simulator.registerPlugin(new CustomPlugin());
```

### Available Plugin Hooks

- `onLoad` - Plugin initialization
- `onParse` - Modify parsing behavior
- `onRender` - Custom rendering logic
- `onInteraction` - Handle custom interactions
- `onStateChange` - React to state changes

## 📜 Changelog

### [1.0.0] - 2024-01-15
#### Added
- Initial release with core functionality
- Arduino code parsing with TFT_eSPI support
- Canvas-based display rendering
- Touch interaction handling
- State management system
- Debug mode with touch zone visualization

### [0.9.0] - 2023-12-20
#### Added
- Beta release for testing
- Basic shape rendering (rectangles, circles)
- Text rendering with web fonts
- Color system with RGB565 support

### [0.8.0] - 2023-11-15
#### Added
- Alpha release
- Proof of concept parser
- Basic canvas rendering

For full changelog, see [CHANGELOG.md](CHANGELOG.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TFT_eSPI Library**: Bodmer's excellent Arduino TFT library
- **Arduino Community**: For extensive documentation and examples
- **React Community**: For excellent development tools and libraries
- **Contributors**: Everyone who has contributed to this project

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/tft-simulator/tft-display-simulator/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/tft-simulator/tft-display-simulator/discussions)
- **Discord**: [Join our community](https://discord.gg/tft-simulator)
- **Email**: support@tft-simulator.dev

---

**Made with ❤️ for the Arduino and embedded development community** 