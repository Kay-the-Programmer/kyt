
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EngineeringGridProps {
    desktopTween?: gsap.core.Tween | null;
}

const EngineeringGrid: React.FC<EngineeringGridProps> = ({ desktopTween }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            // 1. Initial State
            gsap.set(".blueprint-element", { opacity: 0, scale: 0.8, rotateX: 45 });
            gsap.set(".grid-line", { opacity: 0 });

            // 2. Grid Entrance Logic (linked to desktopTween if available)
            if (desktopTween) {
                gsap.to(".grid-line", {
                    opacity: 0.1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: container,
                        containerAnimation: desktopTween,
                        start: "left 80%",
                        end: "left 20%",
                        scrub: 1
                    }
                });

                gsap.to(".blueprint-element", {
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        containerAnimation: desktopTween,
                        start: "left 70%",
                        end: "left 10%",
                        scrub: 1
                    }
                });
            } else {
                // Fallback for mobile or direct trigger
                gsap.to(".grid-line", {
                    opacity: 0.1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        once: true
                    }
                });
                gsap.to(".blueprint-element", {
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 70%",
                        once: true
                    }
                });
            }

            // 3. Mouse Tilt Interaction
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = container.getBoundingClientRect();
                const x = (clientX - left - width / 2) / 30;
                const y = (clientY - top - height / 2) / 30;

                gsap.to(elementsRef.current, {
                    rotateY: x,
                    rotateX: -y,
                    duration: 0.8,
                    ease: "power2.out"
                });

                gsap.to(".blueprint-parallax", {
                    x: x * 2,
                    y: y * 2,
                    duration: 1,
                    ease: "power2.out",
                    stagger: 0.02
                });
            };

            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);

        }, containerRef);

        return () => ctx.revert();
    }, [desktopTween]);

    return (
        <div
            ref={containerRef}
            className="engineering-grid-wrapper relative w-full aspect-square max-w-[600px] flex items-center justify-center p-8 overflow-hidden"
            style={{ perspective: '1200px' }}
        >
            {/* 3D Grid Layer */}
            <div
                ref={gridRef}
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'rotateX(60deg) translateZ(-100px) scale(2)'
                }}
            />

            {/* Floating Blueprint Elements */}
            <div ref={elementsRef} className="relative w-full h-full flex items-center justify-center transform-gpu preserve-3d">

                {/* Central Component Hub */}
                <div className="blueprint-element blueprint-parallax w-48 h-48 border-2 border-blue-500/40 rounded-3xl relative flex items-center justify-center bg-blue-500/5 backdrop-blur-sm">
                    <div className="w-32 h-32 border border-blue-400/30 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-lg rotate-45 border border-blue-500/50" />
                    </div>

                    {/* Connecting Lines */}
                    <div className="absolute -top-12 left-1/2 w-px h-12 bg-gradient-to-t from-blue-500/50 to-transparent" />
                    <div className="absolute -bottom-12 left-1/2 w-px h-12 bg-gradient-to-b from-blue-500/50 to-transparent" />
                    <div className="absolute top-1/2 -left-12 h-px w-12 bg-gradient-to-l from-blue-500/50 to-transparent" />
                    <div className="absolute top-1/2 -right-12 h-px w-12 bg-gradient-to-r from-blue-500/50 to-transparent" />
                </div>

                {/* Orbiting UI Fragments */}
                <div className="blueprint-element blueprint-parallax absolute top-0 left-0 p-3 border border-blue-400/20 bg-white/5 rounded-lg -translate-x-1/2 -translate-y-1/2">
                    <div className="text-[8px] text-blue-500 font-mono">MODULE_01</div>
                    <div className="w-12 h-1 bg-blue-500/20 mt-1" />
                </div>

                <div className="blueprint-element blueprint-parallax absolute bottom-1/4 right-0 p-3 border border-indigo-400/20 bg-white/5 rounded-lg translate-x-1/2">
                    <div className="text-[8px] text-indigo-500 font-mono">SYS_COORD</div>
                    <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                        <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                    </div>
                </div>

                {/* Diagonal Crossbeams */}
                <div className="blueprint-element absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[140%] h-px bg-blue-500/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <div className="absolute top-1/2 left-1/2 w-[140%] h-px bg-blue-500/10 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 pointer-events-none" />
        </div>
    );
};

export default EngineeringGrid;
