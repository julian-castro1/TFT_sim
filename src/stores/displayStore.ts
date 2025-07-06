import { create } from 'zustand'
import { DisplayState, UIElement } from '../types/DisplayTypes'
import { TouchZone } from '../types/InteractionTypes'

interface DisplayStore extends DisplayState {
  // Actions
  setElements: (elements: UIElement[]) => void
  addElement: (element: UIElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<UIElement>) => void
  setBackgroundColor: (color: string) => void
  setCurrentScreen: (screen: string) => void
  setDebugMode: (enabled: boolean) => void
  setShowTouchZones: (enabled: boolean) => void
  setAnimationSpeed: (speed: number) => void
  setRotation: (rotation: number) => void
  clearDisplay: () => void
  
  // Touch zones
  touchZones: TouchZone[]
  setTouchZones: (zones: TouchZone[]) => void
  addTouchZone: (zone: TouchZone) => void
  removeTouchZone: (id: string) => void
  
  // Screen dimensions
  width: number
  height: number
  setDimensions: (width: number, height: number) => void
}

export const useDisplayStore = create<DisplayStore>((set, get) => ({
  // Initial state
  elements: [],
  backgroundColor: '#000000',
  currentScreen: 'home',
  debugMode: false,
  showTouchZones: false,
  animationSpeed: 1.0,
  rotation: 1,
  touchZones: [],
  width: 380,
  height: 420,
  
  // Actions
  setElements: (elements) => set({ elements }),
  
  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  })),
  
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id)
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    )
  })),
  
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  setDebugMode: (enabled) => set({ debugMode: enabled }),
  
  setShowTouchZones: (enabled) => set({ showTouchZones: enabled }),
  
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  
  setRotation: (rotation) => set({ rotation }),
  
  clearDisplay: () => set({ 
    elements: [],
    touchZones: [],
    backgroundColor: '#000000'
  }),
  
  // Touch zone actions
  setTouchZones: (zones) => set({ touchZones: zones }),
  
  addTouchZone: (zone) => set((state) => ({
    touchZones: [...state.touchZones, zone]
  })),
  
  removeTouchZone: (id) => set((state) => ({
    touchZones: state.touchZones.filter(zone => zone.id !== id)
  })),
  
  setDimensions: (width, height) => set({ width, height }),
}))