import React from 'react'
import { useDisplayStore } from '../stores/displayStore'
import './TouchZoneOverlay.css'

export const TouchZoneOverlay: React.FC = () => {
  const { touchZones, width, height, showTouchZones } = useDisplayStore()

  if (!showTouchZones || touchZones.length === 0) {
    return null
  }

  return (
    <div 
      className="touch-zone-overlay"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {touchZones.map((zone) => (
        <div
          key={zone.id}
          className="touch-zone"
          style={{
            left: `${zone.x}px`,
            top: `${zone.y}px`,
            width: `${zone.width}px`,
            height: `${zone.height}px`,
            borderColor: zone.debugColor || '#ff0000',
          }}
          title={`Touch Zone: ${zone.action} (${zone.x}, ${zone.y}, ${zone.width}×${zone.height})`}
        >
          <div className="touch-zone-label">
            {zone.action}
          </div>
        </div>
      ))}
    </div>
  )
}