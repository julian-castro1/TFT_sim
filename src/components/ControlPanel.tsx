import React from 'react'
import { useDisplayStore } from '../stores/displayStore'
import { Settings, Eye, EyeOff, RotateCw, Palette, Monitor } from 'lucide-react'
import './ControlPanel.css'

export const ControlPanel: React.FC = () => {
  const {
    debugMode,
    setDebugMode,
    showTouchZones,
    setShowTouchZones,
    rotation,
    setRotation,
    width,
    height,
    setDimensions,
    backgroundColor,
    setBackgroundColor,
    animationSpeed,
    setAnimationSpeed,
    elements,
    touchZones
  } = useDisplayStore()

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation)
    // Swap dimensions for 90 and 270 degree rotations
    if ((newRotation === 1 || newRotation === 3) && width === 380) {
      setDimensions(420, 380)
    } else if ((newRotation === 0 || newRotation === 2) && width === 420) {
      setDimensions(380, 420)
    }
  }

  const handleDimensionsChange = (newWidth: number, newHeight: number) => {
    setDimensions(newWidth, newHeight)
  }

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <Settings size={18} />
        <span>Display Controls</span>
      </div>
      
      <div className="control-section">
        <h3>Display Settings</h3>
        <div className="control-group">
          <label>Display Size:</label>
          <select 
            value={`${width}x${height}`}
            onChange={(e) => {
              const [w, h] = e.target.value.split('x').map(Number)
              handleDimensionsChange(w, h)
            }}
          >
            <option value="380x420">380x420 (Portrait)</option>
            <option value="420x380">420x380 (Landscape)</option>
            <option value="480x320">480x320 (Landscape)</option>
            <option value="320x480">320x480 (Portrait)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Rotation:</label>
          <div className="rotation-buttons">
            {[0, 1, 2, 3].map(rot => (
              <button
                key={rot}
                className={`btn-rotation ${rotation === rot ? 'active' : ''}`}
                onClick={() => handleRotationChange(rot)}
              >
                <RotateCw size={16} />
                {rot * 90}°
              </button>
            ))}
          </div>
        </div>
        
        <div className="control-group">
          <label>Background Color:</label>
          <div className="color-input-group">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="color-text"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Debug Options</h3>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            <span className="checkbox-text">
              {debugMode ? <Eye size={16} /> : <EyeOff size={16} />}
              Debug Mode
            </span>
          </label>
        </div>
        
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showTouchZones}
              onChange={(e) => setShowTouchZones(e.target.checked)}
            />
            <span className="checkbox-text">
              <Monitor size={16} />
              Show Touch Zones
            </span>
          </label>
        </div>
        
        <div className="control-group">
          <label>Animation Speed:</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="range-input"
          />
          <span className="range-value">{animationSpeed}x</span>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Display Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Elements:</span>
            <span className="stat-value">{elements.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Touch Zones:</span>
            <span className="stat-value">{touchZones.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Resolution:</span>
            <span className="stat-value">{width}×{height}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Aspect Ratio:</span>
            <span className="stat-value">{(width/height).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}