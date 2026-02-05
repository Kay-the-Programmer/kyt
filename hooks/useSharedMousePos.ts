import { useEffect } from 'react';

interface MousePosition {
    x: number;
    y: number;
    active: boolean;
}

// Global mouse position object
export const globalMousePos: MousePosition = { x: 0, y: 0, active: false };

let isInitialized = false;

const initGlobalListener = () => {
    if (typeof window === 'undefined' || isInitialized) return;

    const handleMouseMove = (e: MouseEvent) => {
        globalMousePos.x = e.clientX;
        globalMousePos.y = e.clientY;
        globalMousePos.active = true;
    };

    const handleMouseLeave = () => {
        globalMousePos.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    isInitialized = true;
};

/**
 * Hook to ensure global mouse listener is initialized.
 * Components can read from globalMousePos in their own animation loops (e.g. gsap.ticker)
 */
export const useSharedMousePos = () => {
    useEffect(() => {
        initGlobalListener();
    }, []);

    return globalMousePos;
};
