import React, { useState, useCallback } from 'react'
import { useCodeStore } from '../stores/codeStore'
import { useDisplayStore } from '../stores/displayStore'
import { parseArduinoCode } from '../parsers/ArduinoParser'
import { Play, Square, FileText, AlertCircle } from 'lucide-react'
import './CodeEditor.css'

export const CodeEditor: React.FC = () => {
  const { 
    code, 
    setCode, 
    setParsedDisplay,
    errors, 
    setErrors,
    isLoading,
    setIsLoading,
    loadSample
  } = useCodeStore()
  
  const { setElements, setTouchZones, clearDisplay, width, height } = useDisplayStore()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Handle code change
  const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value)
  }, [setCode])
  
  // Parse and render code
  const handleParseCode = useCallback(async () => {
    setIsLoading(true)
    setErrors([])
    
    try {
      const result = await parseArduinoCode(code, width, height)
      setParsedDisplay(result)
      
      if (result.errors.length > 0) {
        setErrors(result.errors)
      } else {
        // Extract elements and touch zones from parsed display
        const allElements = result.screens.flatMap(screen => screen.elements)
        const allTouchZones = result.screens.flatMap(screen => screen.touchZones)
        
        setElements(allElements)
        setTouchZones(allTouchZones)
      }
    } catch (error) {
      setErrors([{
        message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        line: 0,
        column: 0,
        severity: 'error'
      }])
    } finally {
      setIsLoading(false)
    }
  }, [code, width, height, setParsedDisplay, setErrors, setIsLoading, setElements, setTouchZones])
  
  // Clear display
  const handleClearDisplay = useCallback(() => {
    clearDisplay()
    setErrors([])
  }, [clearDisplay, setErrors])
  
  // Load sample code
  const handleLoadSample = useCallback(async (sampleName: string) => {
    loadSample(sampleName)
    // Automatically parse the loaded sample after a short delay to allow state update
    setTimeout(() => {
      handleParseCode()
    }, 100)
  }, [loadSample, handleParseCode])
  
  return (
    <div className="code-editor">
      <div className="code-editor-header">
        <div className="header-left">
          <FileText size={18} />
          <span>Arduino Code Editor</span>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div className="code-editor-toolbar">
        <div className="toolbar-left">
          <button 
            className="btn btn-primary"
            onClick={handleParseCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <Square size={16} />
            ) : (
              <Play size={16} />
            )}
            {isLoading ? 'Parsing...' : 'Parse & Render'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleClearDisplay}
          >
            Clear
          </button>
        </div>
        
        <div className="toolbar-right">
          <select 
            className="sample-select"
            onChange={(e) => handleLoadSample(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Load Sample</option>
            <option value="basic">Basic Example</option>
            <option value="advanced">Advanced Example</option>
          </select>
        </div>
      </div>
      
      <div className={`code-editor-container ${isExpanded ? 'expanded' : ''}`}>
        <textarea
          className="code-textarea"
          value={code}
          onChange={handleCodeChange}
          placeholder="Paste your Arduino TFT_eSPI code here..."
          spellCheck={false}
        />
        
        {errors.length > 0 && (
          <div className="error-panel">
            <div className="error-header">
              <AlertCircle size={16} />
              <span>Errors ({errors.length})</span>
            </div>
            <div className="error-list">
              {errors.map((error, index) => (
                <div key={index} className={`error-item ${error.severity}`}>
                  <span className="error-line">Line {error.line}:</span>
                  <span className="error-message">{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}