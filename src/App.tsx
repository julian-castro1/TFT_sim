import React from 'react'
import { DisplayCanvas } from './components/DisplayCanvas'
import { CodeEditor } from './components/CodeEditor'
import { ControlPanel } from './components/ControlPanel'
import { TouchZoneOverlay } from './components/TouchZoneOverlay'
import { useDisplayStore } from './stores/displayStore'
import './App.css'

function App() {
  const { debugMode } = useDisplayStore()

  return (
    <div className="app">
      <header className="app-header">
        <h1>TFT Display Simulator</h1>
        <p>Parse Arduino code and visualize TFT displays in real-time</p>
      </header>
      
      <div className="app-content">
        <div className="editor-panel">
          <CodeEditor />
        </div>
        
        <div className="display-panel">
          <div className="display-container">
            <DisplayCanvas />
            {debugMode && <TouchZoneOverlay />}
          </div>
          <ControlPanel />
        </div>
      </div>
    </div>
  )
}

export default App