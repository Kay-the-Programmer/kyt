import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export const useMagnetic = (elementRef: React.RefObject<HTMLElement>) => {
    const boundingRef = useRef<DOMRect | null>(null);

    const updateBounding = useCallback(() => {
        if (elementRef.current) {
            boundingRef.current = elementRef.current.getBoundingClientRect();
        }
    }, [elementRef]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || window.innerWidth < 1024) return;

        // Initialize bounding rect
        updateBounding();

        const xTo = gsap.quickTo(element, "x", { duration: 0.3, ease: "power3" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.3, ease: "power3" });

        const handleMove = (e: MouseEvent) => {
            if (!boundingRef.current) updateBounding();
            const { left, top, width, height } = boundingRef.current!;

            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            xTo(x * 0.35);
            yTo(y * 0.35);
        };

        const handleLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener("mousemove", handleMove, { passive: true });
        element.addEventListener("mouseleave", handleLeave);
        window.addEventListener("resize", updateBounding, { passive: true });

        return () => {
            element.removeEventListener("mousemove", handleMove);
            element.removeEventListener("mouseleave", handleLeave);
            window.removeEventListener("resize", updateBounding);
        };
    }, [elementRef, updateBounding]);
};

