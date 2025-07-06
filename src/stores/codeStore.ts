import { create } from 'zustand'
import { ParsedDisplay, ParseError } from '../types/ParserTypes'

interface CodeStore {
  // Code state
  code: string
  parsedDisplay: ParsedDisplay | null
  isValid: boolean
  errors: ParseError[]
  isLoading: boolean
  
  // Actions
  setCode: (code: string) => void
  setParsedDisplay: (display: ParsedDisplay) => void
  setErrors: (errors: ParseError[]) => void
  setIsValid: (valid: boolean) => void
  setIsLoading: (loading: boolean) => void
  clearErrors: () => void
  
  // Sample code
  loadSample: (sampleName: string) => void
}

// Default sample code
const DEFAULT_SAMPLE_CODE = `// TFT Display Example
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

enum State { HOME, CONFIG, FIRING, DONE };
State curState = HOME;

void setup() {
  tft.init();
  tft.setRotation(1);
}

void loop() {
  if (curState == HOME) {
    drawHome();
  } else if (curState == CONFIG) {
    drawConfig();
  }
  
  handleTouch();
}

void drawHome() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold24pt7b);
  tft.drawString("TFT SIMULATOR", 190, 50);
  
  // Green button
  tft.fillSmoothRoundRect(65, 200, 250, 55, 15, TFT_GREEN, TFT_BLACK);
  tft.setTextColor(TFT_BLACK);
  tft.drawString("START", 190, 225);
}

void drawConfig() {
  tft.fillScreen(TFT_DARKGREY);
  tft.setTextColor(TFT_WHITE);
  tft.drawString("Configuration", 190, 50);
  
  // Back button
  tft.fillRect(20, 20, 80, 40, TFT_RED);
  tft.setTextColor(TFT_WHITE);
  tft.drawString("BACK", 60, 35);
}

void handleTouch() {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) {
    if (curState == HOME) {
      // Start button: x=65-315, y=200-255
      if (x >= 65 && x <= 315 && y >= 200 && y <= 255) {
        curState = CONFIG;
      }
    } else if (curState == CONFIG) {
      // Back button: x=20-100, y=20-60
      if (x >= 20 && x <= 100 && y >= 20 && y <= 60) {
        curState = HOME;
      }
    }
  }
}`

export const useCodeStore = create<CodeStore>((set) => ({
  // Initial state
  code: DEFAULT_SAMPLE_CODE,
  parsedDisplay: null,
  isValid: false,
  errors: [],
  isLoading: false,
  
  // Actions
  setCode: (code) => set({ code }),
  
  setParsedDisplay: (display) => set({ parsedDisplay: display }),
  
  setErrors: (errors) => set({ 
    errors,
    isValid: errors.filter(e => e.severity === 'error').length === 0
  }),
  
  setIsValid: (valid) => set({ isValid: valid }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  clearErrors: () => set({ errors: [], isValid: true }),
  
  loadSample: (sampleName) => {
    // Load different sample codes based on name
    let sampleCode = DEFAULT_SAMPLE_CODE
    
    switch (sampleName) {
      case 'basic':
        sampleCode = DEFAULT_SAMPLE_CODE
        break
      case 'advanced':
        sampleCode = `// Advanced TFT Example with multiple screens
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

enum State { MENU, SETTINGS, DISPLAY_TEST, INFO };
State currentState = MENU;

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
}

void loop() {
  switch(currentState) {
    case MENU: drawMenu(); break;
    case SETTINGS: drawSettings(); break;
    case DISPLAY_TEST: drawDisplayTest(); break;
    case INFO: drawInfo(); break;
  }
  handleTouch();
}

void drawMenu() {
  tft.fillScreen(TFT_NAVY);
  tft.setTextColor(TFT_WHITE);
  tft.drawString("MAIN MENU", 190, 30);
  
  // Menu buttons
  tft.fillRoundRect(50, 100, 280, 50, 10, TFT_BLUE);
  tft.drawString("SETTINGS", 190, 120);
  
  tft.fillRoundRect(50, 170, 280, 50, 10, TFT_GREEN);
  tft.drawString("DISPLAY TEST", 190, 190);
  
  tft.fillRoundRect(50, 240, 280, 50, 10, TFT_ORANGE);
  tft.drawString("INFO", 190, 260);
}`
        break
      default:
        sampleCode = DEFAULT_SAMPLE_CODE
    }
    
    set({ code: sampleCode })
  },
}))