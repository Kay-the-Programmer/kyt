import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackScrollDepth } from '../utils/analytics';

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%)
 * Each milestone is tracked once per page view.
 */
export const useScrollDepth = () => {
    const location = useLocation();
    const trackedDepths = useRef<Set<number>>(new Set());
    const milestones = [25, 50, 75, 100];

    useEffect(() => {
        // Reset tracked depths on route change
        trackedDepths.current.clear();

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) return;

            const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
                    trackedDepths.current.add(milestone);
                    trackScrollDepth(milestone);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check in case page is already scrolled (e.g. reload)
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);
};
