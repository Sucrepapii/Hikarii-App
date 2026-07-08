import { create } from 'zustand';

interface UIState {
    isFocusMode: boolean;
    toggleFocusMode: () => void;
    setFocusMode: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isFocusMode: localStorage.getItem('focusMode') === 'true',
    toggleFocusMode: () => set((state) => {
        const newValue = !state.isFocusMode;
        localStorage.setItem('focusMode', String(newValue));
        return { isFocusMode: newValue };
    }),
    setFocusMode: (value: boolean) => {
        localStorage.setItem('focusMode', String(value));
        set({ isFocusMode: value });
    },
}));
