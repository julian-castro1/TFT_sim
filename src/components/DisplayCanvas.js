import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useCallback } from 'react';
import { useDisplayStore } from '../stores/displayStore';
import { useCodeStore } from '../stores/codeStore';
import { renderDisplay } from '../renderers/CanvasRenderer';
import { handleCanvasClick } from '../utils/interactionUtils';
import './DisplayCanvas.css';
export const DisplayCanvas = () => {
    const canvasRef = useRef(null);
    const { elements, backgroundColor, width, height, touchZones, debugMode, currentScreen } = useDisplayStore();
    const { parsedDisplay } = useCodeStore();
    // Handle canvas click/touch
    const handleClick = useCallback((event) => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        handleCanvasClick(x, y, touchZones);
    }, [touchZones]);
    // Render display when state changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        // Render the display
        renderDisplay(ctx, {
            elements,
            backgroundColor,
            width,
            height,
            touchZones,
            debugMode,
            currentScreen
        });
    }, [elements, backgroundColor, width, height, touchZones, debugMode, currentScreen]);
    return (_jsx("div", { className: "display-canvas-container", children: _jsxs("div", { className: "display-frame", children: [_jsx("canvas", { ref: canvasRef, className: "display-canvas", onClick: handleClick, style: {
                        width: `${width}px`,
                        height: `${height}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    } }), debugMode && (_jsx("div", { className: "debug-overlay", children: _jsxs("div", { className: "debug-info", children: [_jsxs("div", { children: ["Screen: ", currentScreen] }), _jsxs("div", { children: ["Elements: ", elements.length] }), _jsxs("div", { children: ["Touch Zones: ", touchZones.length] }), _jsxs("div", { children: ["Size: ", width, "x", height] })] }) }))] }) }));
};
