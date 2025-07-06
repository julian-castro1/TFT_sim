import { jsx as _jsx } from "react/jsx-runtime";
import { useDisplayStore } from '../stores/displayStore';
import './TouchZoneOverlay.css';
export const TouchZoneOverlay = () => {
    const { touchZones, width, height, showTouchZones } = useDisplayStore();
    if (!showTouchZones || touchZones.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "touch-zone-overlay", style: {
            width: `${width}px`,
            height: `${height}px`,
        }, children: touchZones.map((zone) => (_jsx("div", { className: "touch-zone", style: {
                left: `${zone.x}px`,
                top: `${zone.y}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                borderColor: zone.debugColor || '#ff0000',
            }, title: `Touch Zone: ${zone.action} (${zone.x}, ${zone.y}, ${zone.width}×${zone.height})`, children: _jsx("div", { className: "touch-zone-label", children: zone.action }) }, zone.id))) }));
};
