import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useCodeStore } from '../stores/codeStore';
import { useDisplayStore } from '../stores/displayStore';
import { parseArduinoCode } from '../parsers/ArduinoParser';
import { Play, Square, FileText, AlertCircle } from 'lucide-react';
import './CodeEditor.css';
export const CodeEditor = () => {
    const { code, setCode, parsedDisplay, setParsedDisplay, errors, setErrors, isLoading, setIsLoading, loadSample } = useCodeStore();
    const { setElements, setTouchZones, clearDisplay } = useDisplayStore();
    const [isExpanded, setIsExpanded] = useState(false);
    // Handle code change
    const handleCodeChange = useCallback((event) => {
        setCode(event.target.value);
    }, [setCode]);
    // Parse and render code
    const handleParseCode = useCallback(async () => {
        setIsLoading(true);
        setErrors([]);
        try {
            const result = await parseArduinoCode(code);
            setParsedDisplay(result);
            if (result.errors.length > 0) {
                setErrors(result.errors);
            }
            else {
                // Extract elements and touch zones from parsed display
                const allElements = result.screens.flatMap(screen => screen.elements);
                const allTouchZones = result.screens.flatMap(screen => screen.touchZones);
                setElements(allElements);
                setTouchZones(allTouchZones);
            }
        }
        catch (error) {
            setErrors([{
                    message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    line: 0,
                    column: 0,
                    severity: 'error'
                }]);
        }
        finally {
            setIsLoading(false);
        }
    }, [code, setParsedDisplay, setErrors, setIsLoading, setElements, setTouchZones]);
    // Clear display
    const handleClearDisplay = useCallback(() => {
        clearDisplay();
        setErrors([]);
    }, [clearDisplay, setErrors]);
    // Load sample code
    const handleLoadSample = useCallback((sampleName) => {
        loadSample(sampleName);
    }, [loadSample]);
    return (_jsxs("div", { className: "code-editor", children: [_jsxs("div", { className: "code-editor-header", children: [_jsxs("div", { className: "header-left", children: [_jsx(FileText, { size: 18 }), _jsx("span", { children: "Arduino Code Editor" })] }), _jsx("div", { className: "header-right", children: _jsx("button", { className: "btn btn-secondary", onClick: () => setIsExpanded(!isExpanded), children: isExpanded ? 'Collapse' : 'Expand' }) })] }), _jsxs("div", { className: "code-editor-toolbar", children: [_jsxs("div", { className: "toolbar-left", children: [_jsxs("button", { className: "btn btn-primary", onClick: handleParseCode, disabled: isLoading, children: [isLoading ? (_jsx(Square, { size: 16 })) : (_jsx(Play, { size: 16 })), isLoading ? 'Parsing...' : 'Parse & Render'] }), _jsx("button", { className: "btn btn-secondary", onClick: handleClearDisplay, children: "Clear" })] }), _jsx("div", { className: "toolbar-right", children: _jsxs("select", { className: "sample-select", onChange: (e) => handleLoadSample(e.target.value), defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Load Sample" }), _jsx("option", { value: "basic", children: "Basic Example" }), _jsx("option", { value: "advanced", children: "Advanced Example" })] }) })] }), _jsxs("div", { className: `code-editor-container ${isExpanded ? 'expanded' : ''}`, children: [_jsx("textarea", { className: "code-textarea", value: code, onChange: handleCodeChange, placeholder: "Paste your Arduino TFT_eSPI code here...", spellCheck: false }), errors.length > 0 && (_jsxs("div", { className: "error-panel", children: [_jsxs("div", { className: "error-header", children: [_jsx(AlertCircle, { size: 16 }), _jsxs("span", { children: ["Errors (", errors.length, ")"] })] }), _jsx("div", { className: "error-list", children: errors.map((error, index) => (_jsxs("div", { className: `error-item ${error.severity}`, children: [_jsxs("span", { className: "error-line", children: ["Line ", error.line, ":"] }), _jsx("span", { className: "error-message", children: error.message })] }, index))) })] }))] })] }));
};
