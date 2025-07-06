#include "TFT_eSPI.h"
#include <FastLED.h>
#include <SPI.h>
#include <Wire.h>

// Firing delay timer variables
int firingDuration = 1000; // Duration in milliseconds
int selectedOutput = 1;    // Which output is selected (1 or 2)
unsigned long firingStartTime = 0;
bool isFiring = false;

// Debug macros
#define DEBUG_PRINT(x) Serial.print(x)
#define DEBUG_PRINTLN(x) Serial.println(x)
#define DEBUG_PRINTF(...) Serial.printf(__VA_ARGS__)
#define DEBUG_FUNCTION_ENTRY() DEBUG_PRINTF("[DEBUG] Entering %s\n", __func__)
#define DEBUG_FUNCTION_EXIT() DEBUG_PRINTF("[DEBUG] Exiting %s\n", __func__)

#define TRAINING_CHARGER_VERSION "ITD-V2.0.1"

/*** SCREEN ***/
TFT_eSPI tft = TFT_eSPI();

#define SCREEN_WIDTH 480
#define SCREEN_HEIGHT 320
#define FONT_SIZE 2
#define TFT_BACKLIGHT 4

/*** OUTPUTS ***/
#define output1Pin 12  
#define output2Pin 14  
#define touchPin 13    

const int global_background = TFT_BLACK;

enum Color { RED, GREEN, BLUE };
enum Status { DISCONNECTED, CHARGING, CHARGED, ARMED };
Status statuses[10];

enum InputState { ON, OFF };

uint16_t rgbToHex(uint8_t red, uint8_t green, uint8_t blue) {
  uint16_t r = (red >> 3) & 0x1F;   
  uint16_t g = (green >> 2) & 0x3F; 
  uint16_t b = (blue >> 3) & 0x1F;  
  return (r << 11) | (g << 5) | b;
}

void drawLocalVersion() {
  tft.setTextFont(1);
  tft.setTextColor(TFT_DARKGREY);
  tft.setTextDatum(BL_DATUM);
  tft.drawString(TRAINING_CHARGER_VERSION, 4, SCREEN_HEIGHT - 3, 1);
}

void drawOverlay() {
  tft.setTextDatum(TL_DATUM);
  tft.setFreeFont(&FreeSansBold12pt7b);
  tft.setTextColor(TFT_WHITE);
  tft.drawString("TAMARA [ ITD ]",
                 (SCREEN_WIDTH - tft.textWidth("TAMARA [ ITD ]")) / 2, 20);
  drawLocalVersion();
}

void fetchStatuses() {
  Status fixedStatuses[10] = {CHARGED, CHARGED, CHARGED, CHARGED, CHARGED,
                              CHARGED, CHARGED, CHARGED, CHARGED, CHARGED};
  for (int i = 0; i < 10; i++) {
    statuses[i] = fixedStatuses[i];
  }
}

uint16_t statusToColor(Status status) {
  switch (status) {
  case CHARGED:
    return rgbToHex(73, 160, 76);
  case CHARGING:
    return rgbToHex(185, 160, 50);
  case DISCONNECTED:
    return rgbToHex(75, 75, 75);
  case ARMED:
    return TFT_RED;
  }
}

void updateStatuses() {
  fetchStatuses();
  int iconSize = 50;
  int iconMargin = 20;
  int outerMargin = iconMargin;
  int topMargin = 60;
  int sideMargin = 53;
  
  for (int i = 0; i < 10; i++) {
    int x = sideMargin + outerMargin + (i % 5) * (iconSize + iconMargin);
    int y = topMargin + outerMargin + (i / 5) * (iconSize + iconMargin);
    
    tft.fillSmoothRoundRect(x, y, iconSize, iconSize, 10,
                            statusToColor(statuses[i]), TFT_BLACK);
    
    // Draw status indicator (simplified)
    tft.fillCircle(x + iconSize/2, y + iconSize/2, iconSize/3, TFT_WHITE);
  }
}

void drawHome() {
  DEBUG_FUNCTION_ENTRY();
  DEBUG_SCREEN_UPDATE("Home");
  
  tft.setTextDatum(TC_DATUM);
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold24pt7b);
  
  tft.fillSmoothRoundRect(50, 58, SCREEN_WIDTH - 100, 167, 15,
                          rgbToHex(10, 10, 10), TFT_BLACK);
  
  tft.fillSmoothRoundRect(65, 238, SCREEN_WIDTH - 130, 55, 15,
                          rgbToHex(15, 209, 20), TFT_BLACK);
  
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold12pt7b);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("CONFIGURE", (SCREEN_WIDTH) / 2, 265);
  
  updateStatuses();
  DEBUG_FUNCTION_EXIT();
}

void drawConfigScreen() {
  DEBUG_FUNCTION_ENTRY();
  DEBUG_SCREEN_UPDATE("Config Screen");
  
  int centerScreen = SCREEN_WIDTH / 2;
  int buttonMargin = 12;
  int buttonOffset = 160;
  int buttonCenter = buttonOffset / 2;
  
  int MinusButtonX = centerScreen - buttonOffset - buttonMargin;
  int PlusButtonX = centerScreen + buttonMargin;
  
  tft.fillSmoothRoundRect(50, 58, SCREEN_WIDTH - 100, 167, 15,
                          rgbToHex(10, 10, 10), TFT_BLACK);
  
  tft.fillSmoothRoundRect(MinusButtonX, 238, buttonOffset, 55, 15, TFT_RED,
                          TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("-", MinusButtonX + buttonCenter, 265);
  
  tft.fillSmoothRoundRect(PlusButtonX, 238, buttonOffset, 55, 15,
                          rgbToHex(15, 209, 20), TFT_BLACK);
  tft.drawString("+", PlusButtonX + buttonCenter, 265);
  
  // FIRING DURATION LABEL
  tft.setTextColor(rgbToHex(200, 200, 200));
  tft.setTextDatum(TC_DATUM);
  tft.setFreeFont(&FreeSansBold9pt7b);
  tft.drawString("FIRING DURATION", SCREEN_WIDTH / 2, 70);
  
  // DURATION VALUE
  tft.setTextColor(TFT_WHITE);
  String durationString = String(firingDuration);
  tft.setTextSize(2);
  tft.setFreeFont(&FreeSansBold24pt7b);
  tft.drawString(durationString, SCREEN_WIDTH / 2, 115);
  
  // UNIT
  tft.setTextSize(1);
  tft.setTextColor(rgbToHex(150, 150, 150));
  tft.setFreeFont(&FreeSansBold18pt7b);
  tft.drawString("ms", SCREEN_WIDTH - 100, 180);
  
  // OUTPUT SELECTION
  int statusMargin = 8;
  tft.setTextDatum(CC_DATUM);
  tft.fillSmoothRoundRect(50 + statusMargin, 58 + statusMargin, 80, 35, 11,
                          selectedOutput == 1 ? rgbToHex(15, 209, 20) : rgbToHex(30, 30, 30), TFT_BLACK);
  tft.setFreeFont(&FreeSansBold12pt7b);
  tft.drawString("OUT1", 50 + statusMargin + 40, 58 + statusMargin + 15);
  
  tft.fillSmoothRoundRect(140 + statusMargin, 58 + statusMargin, 80, 35, 11,
                          selectedOutput == 2 ? rgbToHex(15, 209, 20) : rgbToHex(30, 30, 30), TFT_BLACK);
  tft.drawString("OUT2", 140 + statusMargin + 40, 58 + statusMargin + 15);
  
  // FIRE BUTTON
  tft.fillSmoothRoundRect(SCREEN_WIDTH - 120, 140, 100, 40, 8, TFT_ORANGE, TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold12pt7b);
  tft.drawString("FIRE", SCREEN_WIDTH - 70, 155);
  
  DEBUG_FUNCTION_EXIT();
}

void updateConfigValue() {
  DEBUG_FUNCTION_ENTRY();
  
  tft.fillRect(145, 100, 200, 110, rgbToHex(10, 10, 10));
  tft.setTextColor(TFT_WHITE);
  String durationString = String(firingDuration);
  tft.setTextSize(2);
  tft.setTextDatum(TC_DATUM);
  tft.setFreeFont(&FreeSansBold24pt7b);
  tft.drawString(durationString, SCREEN_WIDTH / 2, 115);
  tft.setTextSize(1);
  
  DEBUG_FUNCTION_EXIT();
}

enum State { HOME, OUTPUT_SELECT, DURATION_CONFIG, FIRING, DONE };

const char *getStateName(State state) {
  switch (state) {
  case HOME:
    return "HOME";
  case OUTPUT_SELECT:
    return "OUTPUT_SELECT";
  case DURATION_CONFIG:
    return "DURATION_CONFIG";
  case FIRING:
    return "FIRING";
  case DONE:
    return "DONE";
  default:
    return "UNKNOWN";
  }
}

State curState = HOME;
State prevState = DONE;

void setup() {
  DEBUG_PRINTLN("[DEBUG] Starting setup...");
  Serial.begin(115200);
  
  Wire.begin();
  
  pinMode(output1Pin, OUTPUT);
  pinMode(output2Pin, OUTPUT);
  pinMode(touchPin, INPUT_PULLUP);
  digitalWrite(output1Pin, LOW);
  digitalWrite(output2Pin, LOW);
  
  pinMode(TFT_BACKLIGHT, OUTPUT);
  digitalWrite(TFT_BACKLIGHT, HIGH);
  
  SPI.begin();
  
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  
  // Splash screen
  int centerX = (SCREEN_WIDTH - 200) / 2;
  int centerY = (SCREEN_HEIGHT - 200) / 2;
  tft.fillCircle(centerX + 100, centerY + 100, 80, TFT_WHITE);
  tft.setTextColor(TFT_BLACK);
  tft.setTextSize(2);
  tft.drawString("LUNAR", centerX + 60, centerY + 95);
  
  delay(2000);
  tft.fillScreen(TFT_BLACK);
  drawOverlay();
  
  uint16_t calData[5] = {390, 3358, 318, 3329, 7};
  tft.setTouch(calData);
  
  DEBUG_PRINTLN("[DEBUG] Setup complete");
}

void clearCenterScreen() {
  int SIDE_MARGIN = 0;
  int VERT_MARGIN = 57;
  tft.fillRect(SIDE_MARGIN, VERT_MARGIN, SCREEN_WIDTH - SIDE_MARGIN * 2,
               SCREEN_HEIGHT - VERT_MARGIN / 2, TFT_BLACK);
}

bool minusButtonEnabled = false;
bool plusButtonEnabled = false;
InputState plusButtonState = OFF;
InputState prevPlusButtonState = OFF;

void drawButtonRejected(String button) {
  delay(200);
}

#define INCREMENT 100
#define MAX_DURATION 10000
#define MIN_DURATION 100

void incrementDuration() {
  firingDuration += INCREMENT;
  if (firingDuration > MAX_DURATION) {
    firingDuration = MAX_DURATION;
  }
  updateConfigValue();
}

void decrementDuration() {
  firingDuration -= INCREMENT;
  if (firingDuration < MIN_DURATION) {
    firingDuration = MIN_DURATION;
  }
  updateConfigValue();
}

void startFiring() {
  isFiring = true;
  firingStartTime = millis();
  
  if (selectedOutput == 1) {
    digitalWrite(output1Pin, HIGH);
  } else {
    digitalWrite(output2Pin, HIGH);
  }
}

void stopFiring() {
  isFiring = false;
  digitalWrite(output1Pin, LOW);
  digitalWrite(output2Pin, LOW);
}

void drawFiringScreen() {
  DEBUG_FUNCTION_ENTRY();
  
  unsigned long elapsed = millis() - firingStartTime;
  unsigned long remaining = firingDuration - elapsed;
  
  if (remaining > firingDuration) remaining = 0;
  
  float progress = (float)elapsed / (float)firingDuration;
  if (progress > 1.0) progress = 1.0;
  
  tft.fillSmoothRoundRect(20, 60, SCREEN_WIDTH - 40, SCREEN_HEIGHT - 120, 15,
                          rgbToHex(40, 40, 40), TFT_BLACK);
  tft.fillSmoothRoundRect(21, 61, SCREEN_WIDTH - 42, SCREEN_HEIGHT - 122, 15,
                          TFT_BLACK, TFT_BLACK);
  
  tft.setTextColor(TFT_WHITE);
  tft.setFreeFont(&FreeSansBold18pt7b);
  tft.setTextDatum(TC_DATUM);
  tft.drawString("FIRING OUTPUT " + String(selectedOutput), SCREEN_WIDTH / 2, 90);
  
  // Progress bar
  tft.fillSmoothRoundRect(40, 140, SCREEN_WIDTH - 80, 96, 8,
                          rgbToHex(30, 30, 30), TFT_BLACK);
  tft.fillSmoothRoundRect(44, 144, progress * (SCREEN_WIDTH - 88), 88, 8, 
                          TFT_ORANGE, TFT_BLACK);
  
  // Time remaining
  tft.setFreeFont(&FreeSansBold12pt7b);
  tft.drawString(String(remaining) + " ms", SCREEN_WIDTH / 2, 200);
  
  DEBUG_FUNCTION_EXIT();
}

void loop() {
  InputState newTouchButtonState = digitalRead(touchPin) == LOW ? ON : OFF;
  
  if (newTouchButtonState != plusButtonState) {
    plusButtonState = newTouchButtonState;
  }
  
  if (isFiring && (millis() - firingStartTime >= firingDuration)) {
    stopFiring();
    curState = DURATION_CONFIG;
  }
  
  if (curState == FIRING) {
    drawFiringScreen();
  }
  
  if (plusButtonState == ON) {
    if (!plusButtonEnabled) {
      drawButtonRejected("plus");
    } else {
      delay(40);
    }
  }
  
  if (curState == HOME) {
    if (curState != prevState) {
      clearCenterScreen();
      plusButtonEnabled = false;
      minusButtonEnabled = false;
      drawOverlay();
      drawHome();
      prevState = curState;
    }
    
    uint16_t x, y;
    if (tft.getTouch(&x, &y)) {
      Serial.print(x);
      Serial.print(" ");
      Serial.println(y);
      
      if (x > 65 && x < SCREEN_WIDTH - 65 && y > 238 && y < 293) {
        curState = DURATION_CONFIG;
        Serial.println("DURATION_CONFIG");
      }
    }
  } else if (curState == DURATION_CONFIG) {
    if (curState != prevState) {
      clearCenterScreen();
      prevState = curState;
      drawConfigScreen();
      minusButtonEnabled = true;
      plusButtonEnabled = true;
    }
    
    uint16_t x, y;
    if (tft.getTouch(&x, &y)) {
      // Output 1 selection
      if (x > 58 && x < 138 && y > 66 && y < 101) {
        selectedOutput = 1;
        drawConfigScreen();
      } 
      // Output 2 selection
      else if (x > 148 && x < 228 && y > 66 && y < 101) {
        selectedOutput = 2;
        drawConfigScreen();
      }
      // Decrement duration
      else if (x < SCREEN_WIDTH / 2 && y > 2 * SCREEN_HEIGHT / 3) {
        decrementDuration();
      } 
      // Increment duration
      else if (x > SCREEN_WIDTH / 2 && y > 2 * SCREEN_HEIGHT / 3) {
        incrementDuration();
      }
      // Fire button
      else if (x > SCREEN_WIDTH - 120 && y > 140 && y < 180) {
        startFiring();
        curState = FIRING;
      }
    }
  } else if (curState == FIRING) {
    if (curState != prevState) {
      clearCenterScreen();
      prevState = curState;
      minusButtonEnabled = false;
      plusButtonEnabled = false;
    }
    
    if (!isFiring) {
      curState = DURATION_CONFIG;
    }
  }
  
  delay(50);
} 