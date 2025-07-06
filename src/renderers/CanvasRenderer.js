// Main render function
export function renderDisplay(ctx, display) {
    // Clear canvas
    ctx.clearRect(0, 0, display.width, display.height);
    // Set background
    ctx.fillStyle = display.backgroundColor;
    ctx.fillRect(0, 0, display.width, display.height);
    // Sort elements by z-index
    const sortedElements = [...display.elements].sort((a, b) => a.zIndex - b.zIndex);
    // Render each element
    sortedElements.forEach(element => {
        if (element.visible) {
            renderElement(ctx, element);
        }
    });
    // Render touch zones if in debug mode
    if (display.debugMode) {
        renderTouchZones(ctx, display.touchZones);
    }
}
// Render a single UI element
function renderElement(ctx, element) {
    ctx.save();
    try {
        switch (element.type) {
            case 'rectangle':
                renderRectangle(ctx, element);
                break;
            case 'roundedRectangle':
                renderRoundedRectangle(ctx, element);
                break;
            case 'circle':
                renderCircle(ctx, element);
                break;
            case 'text':
                renderText(ctx, element);
                break;
            case 'bitmap':
                renderBitmap(ctx, element);
                break;
        }
    }
    catch (error) {
        console.error('Error rendering element:', element, error);
    }
    ctx.restore();
}
// Render rectangle
function renderRectangle(ctx, element) {
    if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        ctx.fillRect(element.x, element.y, element.width || 0, element.height || 0);
    }
    if (element.color && element.color !== element.backgroundColor) {
        ctx.strokeStyle = element.color;
        ctx.strokeRect(element.x, element.y, element.width || 0, element.height || 0);
    }
}
// Render rounded rectangle
function renderRoundedRectangle(ctx, element) {
    const radius = element.radius || 5;
    const width = element.width || 0;
    const height = element.height || 0;
    ctx.beginPath();
    ctx.moveTo(element.x + radius, element.y);
    ctx.lineTo(element.x + width - radius, element.y);
    ctx.quadraticCurveTo(element.x + width, element.y, element.x + width, element.y + radius);
    ctx.lineTo(element.x + width, element.y + height - radius);
    ctx.quadraticCurveTo(element.x + width, element.y + height, element.x + width - radius, element.y + height);
    ctx.lineTo(element.x + radius, element.y + height);
    ctx.quadraticCurveTo(element.x, element.y + height, element.x, element.y + height - radius);
    ctx.lineTo(element.x, element.y + radius);
    ctx.quadraticCurveTo(element.x, element.y, element.x + radius, element.y);
    ctx.closePath();
    if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        ctx.fill();
    }
    if (element.color && element.color !== element.backgroundColor) {
        ctx.strokeStyle = element.color;
        ctx.stroke();
    }
}
// Render circle
function renderCircle(ctx, element) {
    const radius = element.radius || Math.min(element.width || 0, element.height || 0) / 2;
    const centerX = element.x + radius;
    const centerY = element.y + radius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        ctx.fill();
    }
    if (element.color && element.color !== element.backgroundColor) {
        ctx.strokeStyle = element.color;
        ctx.stroke();
    }
}
// Render text
function renderText(ctx, element) {
    if (!element.text)
        return;
    // Set font properties
    const fontSize = element.fontSize || 16;
    const fontFamily = element.font || 'Arial, sans-serif';
    ctx.font = `${fontSize}px ${fontFamily}`;
    // Set text color
    if (element.color) {
        ctx.fillStyle = element.color;
    }
    // Set text alignment
    ctx.textAlign = getCanvasTextAlign(element.textAlign);
    ctx.textBaseline = getCanvasTextBaseline(element.textBaseline);
    // Render text
    ctx.fillText(element.text, element.x, element.y);
}
// Render bitmap (placeholder)
function renderBitmap(ctx, element) {
    // Placeholder for bitmap rendering
    // In a real implementation, this would load and render actual bitmap images
    ctx.fillStyle = element.color || '#cccccc';
    ctx.fillRect(element.x, element.y, element.width || 32, element.height || 32);
    // Draw placeholder icon
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('IMG', element.x + (element.width || 32) / 2, element.y + (element.height || 32) / 2);
}
// Render touch zones for debugging
function renderTouchZones(ctx, touchZones) {
    touchZones.forEach((zone, index) => {
        if (!zone.visible)
            return;
        ctx.save();
        // Set touch zone style
        ctx.strokeStyle = zone.debugColor || `hsl(${(index * 60) % 360}, 70%, 50%)`;
        ctx.fillStyle = zone.debugColor ? zone.debugColor + '20' : `hsla(${(index * 60) % 360}, 70%, 50%, 0.1)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        // Draw touch zone
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        // Draw label
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelX = zone.x + zone.width / 2;
        const labelY = zone.y + zone.height / 2;
        // Draw label background
        const labelWidth = ctx.measureText(zone.action).width + 6;
        ctx.fillRect(labelX - labelWidth / 2, labelY - 8, labelWidth, 16);
        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(zone.action, labelX, labelY);
        ctx.restore();
    });
}
// Convert text alignment to canvas text alignment
function getCanvasTextAlign(align) {
    switch (align) {
        case 'left': return 'left';
        case 'center': return 'center';
        case 'right': return 'right';
        default: return 'center';
    }
}
// Convert text baseline to canvas text baseline
function getCanvasTextBaseline(baseline) {
    switch (baseline) {
        case 'top': return 'top';
        case 'middle': return 'middle';
        case 'bottom': return 'bottom';
        default: return 'middle';
    }
}
// Helper function to measure text dimensions
export function measureText(ctx, text, fontSize, fontFamily) {
    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    ctx.restore();
    return {
        width: metrics.width,
        height: fontSize
    };
}
// Helper function to clear canvas
export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}
