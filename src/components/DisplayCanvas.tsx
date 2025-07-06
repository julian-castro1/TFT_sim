import React, { useRef, useEffect, useCallback } from 'react'
import { useDisplayStore } from '../stores/displayStore'
import { useCodeStore } from '../stores/codeStore'
import { renderDisplay } from '../renderers/CanvasRenderer'
import { handleCanvasClick } from '../utils/interactionUtils'
import './DisplayCanvas.css'

export const DisplayCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { 
    elements, 
    backgroundColor, 
    width, 
    height, 
    touchZones, 
    debugMode,
    currentScreen
  } = useDisplayStore()
  const { parsedDisplay } = useCodeStore()
  
  // Handle canvas click/touch
  const handleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    handleCanvasClick(x, y, touchZones)
  }, [touchZones])
  
  // Render display when state changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = width
    canvas.height = height
    
    // Render the display
    renderDisplay(ctx, {
      elements,
      backgroundColor,
      width,
      height,
      touchZones,
      debugMode,
      currentScreen
    })
  }, [elements, backgroundColor, width, height, touchZones, debugMode, currentScreen])
  
  return (
    <div className="display-canvas-container">
      <div className="display-frame">
        <canvas
          ref={canvasRef}
          className="display-canvas"
          onClick={handleClick}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
        {debugMode && (
          <div className="debug-overlay">
            <div className="debug-info">
              <div>Screen: {currentScreen}</div>
              <div>Elements: {elements.length}</div>
              <div>Touch Zones: {touchZones.length}</div>
              <div>Size: {width}x{height}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}