import React, { useEffect } from 'react';
import { gsap } from 'gsap';

export const useMagnetic = (elementRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const element = elementRef.current;
        if (!element || window.innerWidth < 1024) return;

        const xTo = gsap.quickTo(element, "x", { duration: 0.3, ease: "power3" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.3, ease: "power3" });

        const handleMove = (e: MouseEvent) => {
            const { left, top, width, height } = element.getBoundingClientRect();
            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            xTo(x * 0.35);
            yTo(y * 0.35);
        };

        const handleLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener("mousemove", handleMove);
        element.addEventListener("mouseleave", handleLeave);

        return () => {
            element.removeEventListener("mousemove", handleMove);
            element.removeEventListener("mouseleave", handleLeave);
            // Optional: reset position on cleanup
        };
    }, [elementRef]);
};
