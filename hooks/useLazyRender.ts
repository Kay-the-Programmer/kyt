import { useState, useEffect, useRef } from 'react';

/**
 * Hook for viewport-based lazy rendering.
 * Returns a ref to attach to a placeholder element and a boolean indicating
 * whether the component should be rendered.
 * 
 * @param rootMargin - Margin around the viewport to trigger rendering early (default: 200px)
 * @returns { ref, shouldRender } - Attach ref to placeholder, render when shouldRender is true
 */
export function useLazyRender(rootMargin = '200px') {
    const [shouldRender, setShouldRender] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || shouldRender) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect(); // Only need to trigger once
                }
            },
            { rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [rootMargin, shouldRender]);

    return { ref, shouldRender };
}
