# Usage Examples

This document provides comprehensive examples of how to use the TFT Display Simulator with various Arduino code patterns. These examples demonstrate different features and use cases.

## 📋 Table of Contents

1. [Basic Setup](#basic-setup)
2. [Simple Screen Examples](#simple-screen-examples)
3. [Multi-Screen Applications](#multi-screen-applications)
4. [Touch Interaction Examples](#touch-interaction-examples)
5. [Advanced UI Elements](#advanced-ui-elements)
6. [Real-World Applications](#real-world-applications)
7. [Troubleshooting](#troubleshooting)

## 🚀 Basic Setup

### Minimal Arduino Code

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
}

void loop() {
  drawWelcomeScreen();
  delay(1000);
}

void drawWelcomeScreen() {
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.drawString("Hello, TFT!", 120, 160);
}
```

### Simulator Usage

1. **Paste the code** into the simulator's code editor
2. **Set display dimensions** to 480x320
3. **Click "Parse & Render"**
4. **See the rendered output** with "Hello, TFT!" text

---

## 🎨 Simple Screen Examples

### Example 1: Static Information Display

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  drawInfoScreen();
}

void drawInfoScreen() {
  // Title
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(3);
  tft.drawString("System Info", 120, 30);
  
  // Status indicators
  tft.fillRect(50, 100, 100, 40, TFT_GREEN);
  tft.setTextColor(TFT_BLACK);
  tft.setTextSize(2);
  tft.drawString("ONLINE", 65, 110);
  
  tft.fillRect(200, 100, 100, 40, TFT_ORANGE);
  tft.setTextColor(TFT_BLACK);
  tft.drawString("WARN", 225, 110);
  
  tft.fillRect(350, 100, 100, 40, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.drawString("ERROR", 370, 110);
  
  // Details
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString("Temperature: 25°C", 50, 180);
  tft.drawString("Humidity: 60%", 50, 200);
  tft.drawString("Battery: 85%", 50, 220);
}

void loop() {
  // Static display - no updates needed
}
```

### Example 2: Progress Bar Display

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

int progress = 0;

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
}

void loop() {
  drawProgressScreen(progress);
  progress += 5;
  if (progress > 100) progress = 0;
  delay(200);
}

void drawProgressScreen(int percent) {
  // Clear previous progress
  tft.fillRect(0, 0, 480, 320, TFT_BLACK);
  
  // Title
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.drawString("Loading...", 180, 50);
  
  // Progress bar background
  tft.fillRect(50, 150, 380, 40, TFT_DARKGREY);
  
  // Progress bar fill
  int fillWidth = (percent * 380) / 100;
  tft.fillRect(50, 150, fillWidth, 40, TFT_GREEN);
  
  // Percentage text
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(3);
  String percentText = String(percent) + "%";
  tft.drawString(percentText, 220, 220);
}
```

---

## 🖥️ Multi-Screen Applications

### Example 3: Menu System

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

enum Screen { MAIN_MENU, SETTINGS, ABOUT };
Screen currentScreen = MAIN_MENU;

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
  // Touch calibration
  uint16_t calData[5] = {275, 3620, 264, 3532, 1};
  tft.setTouch(calData);
}

void loop() {
  switch (currentScreen) {
    case MAIN_MENU:
      drawMainMenu();
      handleMainMenuTouch();
      break;
    case SETTINGS:
      drawSettingsScreen();
      handleSettingsTouch();
      break;
    case ABOUT:
      drawAboutScreen();
      handleAboutTouch();
      break;
  }
  delay(50);
}

void drawMainMenu() {
  tft.fillScreen(TFT_BLACK);
  
  // Title
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(3);
  tft.drawString("Main Menu", 160, 30);
  
  // Menu buttons
  tft.fillRect(50, 100, 380, 50, TFT_BLUE);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.drawString("Settings", 200, 115);
  
  tft.fillRect(50, 170, 380, 50, TFT_GREEN);
  tft.drawString("About", 210, 185);
  
  tft.fillRect(50, 240, 380, 50, TFT_RED);
  tft.drawString("Exit", 220, 255);
}

void handleMainMenuTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    if (y >= 100 && y <= 150) {
      currentScreen = SETTINGS;
    } else if (y >= 170 && y <= 220) {
      currentScreen = ABOUT;
    }
  }
}

void drawSettingsScreen() {
  tft.fillScreen(TFT_BLACK);
  
  // Back button
  tft.fillRect(10, 10, 60, 30, TFT_GREY);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString("Back", 25, 18);
  
  // Title
  tft.setTextSize(3);
  tft.drawString("Settings", 180, 60);
  
  // Settings options
  tft.setTextSize(2);
  tft.drawString("Brightness: 80%", 50, 120);
  tft.drawString("Volume: 60%", 50, 150);
  tft.drawString("Auto-save: ON", 50, 180);
}

void handleSettingsTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    if (x >= 10 && x <= 70 && y >= 10 && y <= 40) {
      currentScreen = MAIN_MENU;
    }
  }
}

void drawAboutScreen() {
  tft.fillScreen(TFT_BLACK);
  
  // Back button
  tft.fillRect(10, 10, 60, 30, TFT_GREY);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString("Back", 25, 18);
  
  // Title
  tft.setTextSize(3);
  tft.drawString("About", 200, 60);
  
  // About text
  tft.setTextSize(2);
  tft.drawString("TFT Display Demo", 130, 120);
  tft.setTextSize(1);
  tft.drawString("Version 1.0.0", 180, 150);
  tft.drawString("Built with TFT_eSPI", 160, 170);
}

void handleAboutTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    if (x >= 10 && x <= 70 && y >= 10 && y <= 40) {
      currentScreen = MAIN_MENU;
    }
  }
}
```

---

## 👆 Touch Interaction Examples

### Example 4: Calculator Interface

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

String display = "0";
float num1 = 0, num2 = 0;
char operation = ' ';
bool operationPressed = false;

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
  uint16_t calData[5] = {275, 3620, 264, 3532, 1};
  tft.setTouch(calData);
  
  drawCalculator();
}

void loop() {
  handleCalculatorTouch();
  delay(100);
}

void drawCalculator() {
  tft.fillScreen(TFT_BLACK);
  
  // Display
  tft.fillRect(20, 20, 440, 60, TFT_WHITE);
  tft.setTextColor(TFT_BLACK);
  tft.setTextSize(3);
  tft.drawString(display, 400 - display.length() * 18, 35);
  
  // Button layout
  String buttons[4][4] = {
    {"7", "8", "9", "/"},
    {"4", "5", "6", "*"},
    {"1", "2", "3", "-"},
    {"C", "0", "=", "+"}
  };
  
  for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 4; col++) {
      int x = 20 + col * 110;
      int y = 100 + row * 60;
      
      // Button color
      uint16_t color = TFT_DARKGREY;
      if (buttons[row][col] == "=") color = TFT_GREEN;
      else if (buttons[row][col] == "C") color = TFT_RED;
      else if (col == 3) color = TFT_BLUE; // Operations
      
      tft.fillRect(x, y, 100, 50, color);
      tft.setTextColor(TFT_WHITE);
      tft.setTextSize(2);
      tft.drawString(buttons[row][col], x + 40, y + 15);
    }
  }
}

void handleCalculatorTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    // Determine which button was pressed
    if (y >= 100 && y <= 340) {
      int col = (x - 20) / 110;
      int row = (y - 100) / 60;
      
      if (col >= 0 && col < 4 && row >= 0 && row < 4) {
        String buttons[4][4] = {
          {"7", "8", "9", "/"},
          {"4", "5", "6", "*"},
          {"1", "2", "3", "-"},
          {"C", "0", "=", "+"}
        };
        
        handleButtonPress(buttons[row][col]);
      }
    }
  }
}

void handleButtonPress(String button) {
  if (button == "C") {
    display = "0";
    num1 = 0;
    num2 = 0;
    operation = ' ';
    operationPressed = false;
  } else if (button == "+" || button == "-" || button == "*" || button == "/") {
    num1 = display.toFloat();
    operation = button.charAt(0);
    operationPressed = true;
  } else if (button == "=") {
    if (operationPressed) {
      num2 = display.toFloat();
      float result = 0;
      
      switch (operation) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 != 0 ? num1 / num2 : 0; break;
      }
      
      display = String(result);
      operationPressed = false;
    }
  } else {
    // Number button
    if (display == "0" || operationPressed) {
      display = button;
      operationPressed = false;
    } else {
      display += button;
    }
  }
  
  drawCalculator();
}
```

---

## 🎛️ Advanced UI Elements

### Example 5: Dashboard with Gauges

```cpp
#include "TFT_eSPI.h"
#include <math.h>

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
}

void loop() {
  drawDashboard();
  delay(1000);
}

void drawDashboard() {
  tft.fillScreen(TFT_BLACK);
  
  // Title
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.drawString("System Dashboard", 140, 10);
  
  // Draw gauges
  drawGauge(120, 120, 80, 75, "CPU", TFT_GREEN);
  drawGauge(360, 120, 80, 60, "Memory", TFT_YELLOW);
  drawGauge(120, 260, 80, 90, "Disk", TFT_RED);
  drawGauge(360, 260, 80, 45, "Network", TFT_BLUE);
}

void drawGauge(int centerX, int centerY, int radius, int value, String label, uint16_t color) {
  // Gauge background
  tft.drawCircle(centerX, centerY, radius, TFT_WHITE);
  tft.drawCircle(centerX, centerY, radius - 5, TFT_DARKGREY);
  
  // Scale marks
  for (int i = 0; i <= 100; i += 10) {
    float angle = (i * 1.8 - 90) * PI / 180; // -90 to +90 degrees
    int x1 = centerX + (radius - 10) * cos(angle);
    int y1 = centerY + (radius - 10) * sin(angle);
    int x2 = centerX + (radius - 15) * cos(angle);
    int y2 = centerY + (radius - 15) * sin(angle);
    
    tft.drawLine(x1, y1, x2, y2, TFT_WHITE);
  }
  
  // Value needle
  float angle = (value * 1.8 - 90) * PI / 180;
  int x = centerX + (radius - 20) * cos(angle);
  int y = centerY + (radius - 20) * sin(angle);
  
  tft.drawLine(centerX, centerY, x, y, color);
  tft.fillCircle(centerX, centerY, 3, color);
  
  // Label and value
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString(label, centerX - 15, centerY + radius + 10);
  tft.drawString(String(value) + "%", centerX - 10, centerY + radius + 25);
}
```

### Example 6: Custom Widgets

```cpp
#include "TFT_eSPI.h"

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
  drawWidgets();
}

void loop() {
  // Static display
}

void drawWidgets() {
  // Toggle switch
  drawToggleSwitch(50, 50, 80, 30, true, "WiFi");
  drawToggleSwitch(50, 100, 80, 30, false, "Bluetooth");
  
  // Slider
  drawSlider(200, 50, 200, 20, 75, "Volume");
  drawSlider(200, 100, 200, 20, 50, "Brightness");
  
  // LED indicator
  drawLED(50, 200, 20, true, "Status", TFT_GREEN);
  drawLED(50, 250, 20, false, "Error", TFT_RED);
}

void drawToggleSwitch(int x, int y, int width, int height, bool state, String label) {
  // Switch background
  uint16_t bgColor = state ? TFT_GREEN : TFT_DARKGREY;
  tft.fillRoundRect(x, y, width, height, height/2, bgColor);
  
  // Switch knob
  int knobX = state ? x + width - height : x;
  tft.fillCircle(knobX + height/2, y + height/2, height/2 - 2, TFT_WHITE);
  
  // Label
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString(label, x, y + height + 5);
}

void drawSlider(int x, int y, int width, int height, int value, String label) {
  // Slider track
  tft.fillRoundRect(x, y, width, height, height/2, TFT_DARKGREY);
  
  // Slider fill
  int fillWidth = (value * width) / 100;
  tft.fillRoundRect(x, y, fillWidth, height, height/2, TFT_BLUE);
  
  // Slider knob
  int knobX = x + fillWidth - height/2;
  tft.fillCircle(knobX, y + height/2, height/2 + 2, TFT_WHITE);
  
  // Label and value
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString(label, x, y + height + 5);
  tft.drawString(String(value) + "%", x + width - 20, y + height + 5);
}

void drawLED(int x, int y, int radius, bool state, String label, uint16_t color) {
  // LED outer ring
  tft.fillCircle(x + radius, y + radius, radius, TFT_DARKGREY);
  
  // LED inner circle
  if (state) {
    tft.fillCircle(x + radius, y + radius, radius - 3, color);
  }
  
  // Label
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString(label, x, y + radius * 2 + 5);
}
```

---

## 🏭 Real-World Applications

### Example 7: IoT Control Panel

```cpp
#include "TFT_eSPI.h"
#include "WiFi.h"

TFT_eSPI tft = TFT_eSPI();

struct Device {
  String name;
  bool state;
  int value;
  String type;
};

Device devices[] = {
  {"Living Room Light", false, 0, "light"},
  {"Kitchen Fan", false, 0, "fan"},
  {"Bedroom AC", false, 22, "ac"},
  {"Garden Sprinkler", false, 0, "sprinkler"}
};

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
  uint16_t calData[5] = {275, 3620, 264, 3532, 1};
  tft.setTouch(calData);
}

void loop() {
  drawControlPanel();
  handleControlTouch();
  delay(100);
}

void drawControlPanel() {
  tft.fillScreen(TFT_BLACK);
  
  // Header
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(2);
  tft.drawString("Smart Home Control", 120, 10);
  
  // WiFi status
  tft.setTextSize(1);
  tft.drawString("WiFi: Connected", 350, 10);
  
  // Device cards
  for (int i = 0; i < 4; i++) {
    int x = (i % 2) * 240;
    int y = 50 + (i / 2) * 120;
    
    drawDeviceCard(x, y, devices[i]);
  }
}

void drawDeviceCard(int x, int y, Device device) {
  // Card background
  uint16_t cardColor = device.state ? TFT_DARKGREEN : TFT_DARKGREY;
  tft.fillRoundRect(x + 10, y, 220, 100, 10, cardColor);
  
  // Device name
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString(device.name, x + 20, y + 10);
  
  // State indicator
  uint16_t stateColor = device.state ? TFT_GREEN : TFT_RED;
  tft.fillCircle(x + 200, y + 20, 8, stateColor);
  
  // Value display
  if (device.type == "ac") {
    tft.setTextSize(2);
    tft.drawString(String(device.value) + "°C", x + 20, y + 40);
  } else if (device.type == "fan") {
    tft.setTextSize(2);
    tft.drawString(String(device.value) + "%", x + 20, y + 40);
  }
  
  // Control buttons
  tft.fillRoundRect(x + 20, y + 70, 60, 20, 5, TFT_BLUE);
  tft.setTextColor(TFT_WHITE);
  tft.setTextSize(1);
  tft.drawString("Toggle", x + 30, y + 75);
  
  if (device.type == "ac" || device.type == "fan") {
    tft.fillRoundRect(x + 90, y + 70, 30, 20, 5, TFT_ORANGE);
    tft.drawString("+", x + 102, y + 75);
    
    tft.fillRoundRect(x + 130, y + 70, 30, 20, 5, TFT_ORANGE);
    tft.drawString("-", x + 142, y + 75);
  }
}

void handleControlTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    // Determine which device card was touched
    int cardIndex = -1;
    if (x >= 10 && x <= 230) {
      if (y >= 50 && y <= 150) cardIndex = 0;
      else if (y >= 170 && y <= 270) cardIndex = 2;
    } else if (x >= 250 && x <= 470) {
      if (y >= 50 && y <= 150) cardIndex = 1;
      else if (y >= 170 && y <= 270) cardIndex = 3;
    }
    
    if (cardIndex >= 0) {
      handleDeviceTouch(cardIndex, x, y);
    }
  }
}

void handleDeviceTouch(int deviceIndex, int x, int y) {
  int cardX = (deviceIndex % 2) * 240;
  int cardY = 50 + (deviceIndex / 2) * 120;
  
  // Check if toggle button was pressed
  if (x >= cardX + 20 && x <= cardX + 80 && y >= cardY + 70 && y <= cardY + 90) {
    devices[deviceIndex].state = !devices[deviceIndex].state;
    if (!devices[deviceIndex].state) {
      devices[deviceIndex].value = 0;
    }
  }
  
  // Check if + button was pressed
  if (x >= cardX + 90 && x <= cardX + 120 && y >= cardY + 70 && y <= cardY + 90) {
    if (devices[deviceIndex].state) {
      if (devices[deviceIndex].type == "ac") {
        devices[deviceIndex].value = min(30, devices[deviceIndex].value + 1);
      } else if (devices[deviceIndex].type == "fan") {
        devices[deviceIndex].value = min(100, devices[deviceIndex].value + 10);
      }
    }
  }
  
  // Check if - button was pressed
  if (x >= cardX + 130 && x <= cardX + 160 && y >= cardY + 70 && y <= cardY + 90) {
    if (devices[deviceIndex].state) {
      if (devices[deviceIndex].type == "ac") {
        devices[deviceIndex].value = max(16, devices[deviceIndex].value - 1);
      } else if (devices[deviceIndex].type == "fan") {
        devices[deviceIndex].value = max(0, devices[deviceIndex].value - 10);
      }
    }
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Display Not Rendering

**Problem**: Code parses but display shows blank screen.

**Solution**:
```cpp
// Ensure proper initialization
void setup() {
  tft.init();
  tft.setRotation(1);  // Set rotation
  tft.fillScreen(TFT_BLACK);  // Clear screen
  
  // Add your drawing code here
}
```

#### 2. Touch Not Working

**Problem**: Touch events not detected.

**Solution**:
```cpp
// Add touch calibration in setup
void setup() {
  uint16_t calData[5] = {275, 3620, 264, 3532, 1};
  tft.setTouch(calData);
}

// Check touch in loop
void loop() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    // Handle touch event
  }
}
```

#### 3. Colors Not Displaying Correctly

**Problem**: Colors appear wrong or not as expected.

**Solution**:
```cpp
// Use proper color constants
#define TFT_BLACK 0x0000
#define TFT_WHITE 0xFFFF
#define TFT_RED   0xF800
#define TFT_GREEN 0x07E0
#define TFT_BLUE  0x001F

// Or use rgbToHex function
uint16_t rgbToHex(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}
```

#### 4. Text Not Displaying

**Problem**: Text commands not showing text.

**Solution**:
```cpp
// Set text properties before drawing
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("Hello World", 100, 100);

// For centered text
tft.setTextDatum(MC_DATUM);
tft.drawString("Centered", 240, 160);
```

#### 5. Performance Issues

**Problem**: Slow rendering or flickering.

**Solution**:
```cpp
// Minimize redraws
void updateDisplay() {
  static int lastValue = -1;
  int currentValue = getCurrentValue();
  
  if (currentValue != lastValue) {
    // Only redraw changed parts
    drawChangedArea(currentValue);
    lastValue = currentValue;
  }
}

// Use double buffering concept
void drawFrame() {
  // Clear only necessary areas
  tft.fillRect(x, y, width, height, TFT_BLACK);
  // Draw new content
  drawContent();
}
```

### Debugging Tips

1. **Use Serial Output**: Add `Serial.println()` statements to debug logic
2. **Check Coordinates**: Verify touch coordinates are within expected ranges
3. **Test Simple Cases**: Start with basic shapes before complex UI
4. **Use Debug Mode**: Enable touch zone visualization in simulator
5. **Check Memory**: Ensure sufficient memory for large displays

### Best Practices

1. **Organize Code**: Separate drawing functions from logic
2. **Use Constants**: Define colors and dimensions as constants
3. **Optimize Redraws**: Only update changed screen areas
4. **Handle Errors**: Add bounds checking for coordinates
5. **Test Thoroughly**: Test all touch zones and state transitions

---

This examples document provides a comprehensive guide to using the TFT Display Simulator with various Arduino code patterns. Each example demonstrates different aspects of the simulator's capabilities and provides practical, real-world usage scenarios. 