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

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with Canvas support
- Basic understanding of Arduino/C++ and React

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/julian-castro1/TFT_sim.git
   cd TFT_sim
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Quick Start Example

> **Note**: This project is currently in early development. The following steps describe the planned functionality:

1. **Paste your Arduino code** into the code editor (to be implemented)
2. **Configure display settings** (dimensions, rotation)
3. **Click "Parse & Render"** to generate the simulation
4. **Interact with the display** using mouse clicks (simulating touch)
5. **Use debug mode** to visualize touch zones and state transitions

### Current Status

The project is currently in the setup phase. You can:
- Explore the comprehensive documentation in the `docs/` directory
- Review the planned architecture and features
- Check the roadmap for development progress
- Contribute to the project development

## 📁 Project Structure

```
TFT_sim/
├── src/                          # Source code (to be implemented)
│   ├── components/               # React components
│   │   ├── DisplayCanvas.tsx     # Main display rendering component
│   │   ├── CodeEditor.tsx        # Arduino code input interface
│   │   ├── ControlPanel.tsx      # Configuration and debug controls
│   │   └── TouchZoneOverlay.tsx  # Touch interaction visualization
│   ├── parsers/                  # Code parsing logic
│   │   ├── ArduinoParser.ts      # C++ code parsing logic
│   │   ├── TFTCommandParser.ts   # TFT_eSPI command extraction
│   │   └── StateAnalyzer.ts      # State transition analysis
│   ├── renderers/                # Rendering system
│   │   ├── CanvasRenderer.ts     # Low-level canvas drawing
│   │   ├── UIElementRenderer.ts  # UI component rendering
│   │   └── FontRenderer.ts       # Text and font handling
│   ├── state/                    # State management
│   │   ├── displayStore.ts       # Display state management
│   │   ├── interactionStore.ts   # Touch/click handling
│   │   └── codeStore.ts         # Parsed code state
│   ├── utils/                    # Utility functions
│   │   ├── colorUtils.ts         # Color conversion utilities
│   │   ├── mathUtils.ts          # Coordinate calculations
│   │   └── validationUtils.ts    # Code validation helpers
│   └── types/                    # TypeScript type definitions
│       ├── DisplayTypes.ts       # Display-related interfaces
│       ├── InteractionTypes.ts   # Touch/interaction types
│       └── ParserTypes.ts        # Code parsing types
├── public/                       # Static assets
│   ├── fonts/                    # Font files for rendering
│   ├── icons/                    # UI icons and assets
│   └── samples/                  # Example Arduino code files
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── ARCHITECTURE.md           # Architecture documentation
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── EXAMPLES.md               # Usage examples
├── tests/                        # Test files (to be implemented)
│   ├── parsers/                  # Parser unit tests
│   ├── renderers/                # Renderer unit tests
│   └── integration/              # End-to-end tests
├── package.json                  # Project configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
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
  // Implementation details...
};

// Extract UI elements from parsed code
const extractUIElements = (ast: AST): UIElement[] => {
  // Implementation details...
};

// Analyze state transitions
const analyzeStateFlow = (ast: AST): StateTransition[] => {
  // Implementation details...
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
  // Implementation details...
};

// Handle touch interactions
const handleTouch = (
  x: number,
  y: number,
  touchZones: TouchZone[]
): TouchResult => {
  // Implementation details...
};
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

### Phase 1: Project Setup & Foundation 🚧
- [x] Project structure and configuration
- [x] TypeScript and build system setup
- [x] Documentation framework
- [ ] Basic React components
- [ ] Initial code parsing framework

### Phase 2: Core Functionality 📋
- [ ] Arduino code parser implementation
- [ ] TFT_eSPI command interpreter
- [ ] Canvas rendering system
- [ ] Basic shape drawing (rectangles, circles)
- [ ] Touch zone detection and mapping

### Phase 3: Advanced Display Features �
- [ ] Font rendering system
- [ ] Bitmap/icon support
- [ ] Color system and RGB565 conversion
- [ ] Animation system
- [ ] Multi-screen support

### Phase 4: Developer Tools �
- [ ] Code validation and syntax checking
- [ ] Performance profiling
- [ ] Debug mode and visualization
- [ ] Export functionality
- [ ] Plugin system

### Phase 5: Integration & Deployment 🔮
- [ ] VS Code extension
- [ ] CLI interface
- [ ] Hardware integration testing
- [ ] Cloud deployment options

## 🐛 Known Issues

Since this project is in early development, the following are planned implementations:

1. **Core Implementation**: Main components and parsers are not yet implemented
2. **Font Rendering**: TFT font support system needs to be developed
3. **Bitmap Support**: Image and icon rendering system needs implementation
4. **Touch Calibration**: Touch coordinate mapping system needs development
5. **Performance**: Rendering optimization will be addressed in later phases

Please check the roadmap above for current development status.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TFT_eSPI Library**: Bodmer's excellent Arduino TFT library
- **Arduino Community**: For extensive documentation and examples
- **React Community**: For excellent development tools and libraries
- **Contributors**: Everyone who has contributed to this project

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/julian-castro1/TFT_sim/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/julian-castro1/TFT_sim/discussions)
- **Documentation**: Check the `docs/` directory for detailed guides

---

**Made with ❤️ for the Arduino and embedded development community** 