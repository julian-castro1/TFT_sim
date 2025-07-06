import { TouchZone, TouchResult } from '../types/InteractionTypes'
import { useDisplayStore } from '../stores/displayStore'

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
  const { setCurrentScreen } = useDisplayStore.getState()
  
  console.log(`Touch action: ${zone.action}`, zone)
  
  // Handle different action types
  switch (zone.action.toLowerCase()) {
    case 'home':
      setCurrentScreen('home')
      break
    case 'config':
    case 'configuration':
      setCurrentScreen('config')
      break
    case 'back':
      setCurrentScreen('home')
      break
    case 'menu':
      setCurrentScreen('menu')
      break
    case 'settings':
      setCurrentScreen('settings')
      break
    default:
      // For other actions, try to set the screen to the action name
      if (zone.targetState) {
        setCurrentScreen(zone.targetState)
      } else {
        setCurrentScreen(zone.action)
      }
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