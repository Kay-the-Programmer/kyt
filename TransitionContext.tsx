import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Simple boolean context: true = page transition (delay animations), false = initial load
const TransitionContext = createContext<boolean>(false);

/**
 * TransitionProvider encapsulates the logic for detecting page transitions vs initial load.
 * Place this around components that need to adjust animation timing based on navigation state.
 */
export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [isPageTransition, setIsPageTransition] = useState(false);
    const firstPath = useRef(location.pathname);

    useEffect(() => {
        // Once we navigate away from the first path, all subsequent loads are transitions
        if (location.pathname !== firstPath.current && !isPageTransition) {
            setIsPageTransition(true);
        }
    }, [location.pathname, isPageTransition]);

    // Memoize value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => isPageTransition, [isPageTransition]);

    return (
        <TransitionContext.Provider value={value}>
            {children}
        </TransitionContext.Provider>
    );
};

/**
 * Hook to consume the transition state.
 * Returns true if the current view is a result of page navigation.
 */
export const useTransition = () => useContext(TransitionContext);

// Re-export for backward compatibility if needed (though hook is preferred)
export { TransitionContext };
