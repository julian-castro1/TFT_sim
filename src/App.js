import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DisplayCanvas } from './components/DisplayCanvas';
import { CodeEditor } from './components/CodeEditor';
import { ControlPanel } from './components/ControlPanel';
import { TouchZoneOverlay } from './components/TouchZoneOverlay';
import { useDisplayStore } from './stores/displayStore';
import './App.css';
function App() {
    const { debugMode } = useDisplayStore();
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "app-header", children: [_jsx("h1", { children: "TFT Display Simulator" }), _jsx("p", { children: "Parse Arduino code and visualize TFT displays in real-time" })] }), _jsxs("div", { className: "app-content", children: [_jsx("div", { className: "editor-panel", children: _jsx(CodeEditor, {}) }), _jsxs("div", { className: "display-panel", children: [_jsxs("div", { className: "display-container", children: [_jsx(DisplayCanvas, {}), debugMode && _jsx(TouchZoneOverlay, {})] }), _jsx(ControlPanel, {})] })] })] }));
}
export default App;
