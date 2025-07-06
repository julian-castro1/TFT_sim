import { TouchZone, TouchResult } from '../types/InteractionTypes'
import { useDisplayStore } from '../stores/displayStore'
import { useCodeStore } from '../stores/codeStore'

// Handle canvas click/touch events
export function handleCanvasClick(x: number, y: number, touchZones: TouchZone[]): TouchResult {
  const result: TouchResult = {
    hit: false,
    coordinates: { x, y }
  }
  
  // Check if click is within any touch zone
  for (const zone of touchZones) {
    if (isPointInZone(x, y, zone)) {
      result.hit = true
      result.zone = zone
      
      // Execute the touch action
      executeTouchAction(zone)
      break
    }
  }
  
  return result
}

// Check if a point is within a touch zone
function isPointInZone(x: number, y: number, zone: TouchZone): boolean {
  return x >= zone.x && 
         x <= zone.x + zone.width && 
         y >= zone.y && 
         y <= zone.y + zone.height
}

// Execute touch action
function executeTouchAction(zone: TouchZone): void {
  const { setCurrentScreen, setElements, setTouchZones, setBackgroundColor } = useDisplayStore.getState()
  const { parsedDisplay } = useCodeStore.getState()
  
  console.log(`Touch action: ${zone.action}`, zone)
  
  // If we have a targetState, try to switch to that screen
  if (zone.targetState && parsedDisplay) {
    const targetStateStr = zone.targetState // Store in a variable we know is defined
    // Find the screen matching the target state
    const targetScreen = parsedDisplay.screens.find(screen => 
      screen.id.toLowerCase() === targetStateStr.toLowerCase() ||
      screen.name.toLowerCase() === targetStateStr.toLowerCase() ||
      screen.id === `draw${targetStateStr}` ||
      screen.id === `draw${targetStateStr.charAt(0).toUpperCase() + targetStateStr.slice(1)}`
    )
    
    if (targetScreen) {
      // Switch to the target screen
      setCurrentScreen(targetScreen.id)
      setElements(targetScreen.elements)
      setTouchZones(targetScreen.touchZones)
      
      // Update background color if needed
      const bgElement = targetScreen.elements.find(el => el.id.startsWith('bg_'))
      if (bgElement && bgElement.backgroundColor) {
        setBackgroundColor(bgElement.backgroundColor)
      }
      
      return
    }
  }
  
  // Fallback to the old behavior for compatibility
  switch (zone.action.toLowerCase()) {
    case 'home':
      switchToScreen('home')
      break
    case 'config':
    case 'configuration':
      switchToScreen('config')
      break
    case 'back':
      switchToScreen('home')
      break
    case 'menu':
      switchToScreen('menu')
      break
    case 'settings':
      switchToScreen('settings')
      break
    default:
      // For other actions, try to set the screen to the action name
      switchToScreen(zone.action)
  }
}

// Helper function to switch screens
function switchToScreen(screenName: string): void {
  const { setCurrentScreen, setElements, setTouchZones, setBackgroundColor } = useDisplayStore.getState()
  const { parsedDisplay } = useCodeStore.getState()
  
  if (!parsedDisplay) {
    setCurrentScreen(screenName)
    return
  }
  
  // Find the matching screen
  const targetScreen = parsedDisplay.screens.find(screen => 
    screen.id.toLowerCase() === screenName.toLowerCase() ||
    screen.name.toLowerCase() === screenName.toLowerCase() ||
    screen.id === `draw${screenName}` ||
    screen.id === `draw${screenName.charAt(0).toUpperCase() + screenName.slice(1)}`
  )
  
  if (targetScreen) {
    setCurrentScreen(targetScreen.id)
    setElements(targetScreen.elements)
    setTouchZones(targetScreen.touchZones)
    
    // Update background color if needed
    const bgElement = targetScreen.elements.find(el => el.id.startsWith('bg_'))
    if (bgElement && bgElement.backgroundColor) {
      setBackgroundColor(bgElement.backgroundColor)
    }
  } else {
    // Just update the screen name without changing elements
    setCurrentScreen(screenName)
  }
}

// Get touch zones in a specific area
export function getTouchZonesInArea(x: number, y: number, width: number, height: number, touchZones: TouchZone[]): TouchZone[] {
  return touchZones.filter(zone => {
    return !(zone.x > x + width || 
             zone.x + zone.width < x || 
             zone.y > y + height || 
             zone.y + zone.height < y)
  })
}

// Check if two touch zones overlap
export function doTouchZonesOverlap(zone1: TouchZone, zone2: TouchZone): boolean {
  return !(zone1.x > zone2.x + zone2.width || 
           zone1.x + zone1.width < zone2.x || 
           zone1.y > zone2.y + zone2.height || 
           zone1.y + zone1.height < zone2.y)
}

// Get the center point of a touch zone
export function getTouchZoneCenter(zone: TouchZone): { x: number, y: number } {
  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2
  }
}

// Create a touch zone from coordinates
export function createTouchZone(x: number, y: number, width: number, height: number, action: string): TouchZone {
  return {
    id: `touch_${Date.now()}_${Math.random()}`,
    x,
    y,
    width,
    height,
    action,
    visible: true,
    debugColor: '#ff0000'
  }
}