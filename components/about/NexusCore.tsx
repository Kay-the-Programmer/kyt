
import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NexusCore: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<SVGSVGElement>(null);
    const ringsRef = useRef<SVGGElement>(null);
    const orbitRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            // 1. Core Pulsation
            gsap.to(".nexus-core-pulse", {
                scale: 1.1,
                opacity: 0.8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 2. Rings Rotation (Base)
            const rings = gsap.utils.toArray<SVGElement>(".nexus-ring");
            rings.forEach((ring, i) => {
                gsap.to(ring, {
                    rotation: i % 2 === 0 ? 360 : -360,
                    duration: 10 + i * 5,
                    repeat: -1,
                    ease: "none"
                });
            });

            // 3. ScrollTriggered Interactivity
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1,
                }
            });

            tl.to(".nexus-container", {
                scale: 1.2,
                duration: 1,
                ease: "power2.inOut"
            })
                .to(rings, {
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5
                }, 0);

            // 4. Mouse Move Tilt
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = container.getBoundingClientRect();
                const x = (clientX - left - width / 2) / 25;
                const y = (clientY - top - height / 2) / 25;

                gsap.to(".nexus-content", {
                    rotateY: x,
                    rotateX: -y,
                    duration: 0.6,
                    ease: "power2.out"
                });
            };

            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="nexus-wrapper relative w-full h-full flex items-center justify-center p-4"
            style={{ perspective: '1000px' }}
        >
            <div className="nexus-content relative w-full aspect-square max-w-[500px] flex items-center justify-center transition-transform duration-300">
                <svg
                    viewBox="0 0 200 200"
                    className="nexus-svg w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Definitions for Glows */}
                    <defs>
                        <radialGradient id="coreGradient">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Outer Orbit Rings */}
                    <g className="nexus-rings" ref={ringsRef}>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="nexus-ring text-blue-500/20" strokeDasharray="10 5" />
                        <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="0.5" className="nexus-ring text-indigo-500/30" strokeDasharray="5 10" />
                        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="nexus-ring text-blue-400/40" />
                    </g>

                    {/* Neural Links (Decorative) */}
                    <g className="nexus-links opacity-20">
                        <line x1="100" y1="100" x2="160" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
                        <line x1="100" y1="100" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
                        <circle cx="160" cy="40" r="2" fill="currentColor" className="text-blue-400" />
                        <circle cx="40" cy="160" r="2" fill="currentColor" className="text-blue-400" />
                    </g>

                    {/* Central Core */}
                    <g className="nexus-core">
                        <circle
                            cx="100"
                            cy="100"
                            r="25"
                            fill="url(#coreGradient)"
                            filter="url(#glow)"
                            className="nexus-core-pulse shadow-xl"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="12"
                            fill="white"
                            className="opacity-40"
                            filter="url(#glow)"
                        />
                    </g>
                </svg>

                {/* Floating Node Labels (UI Overlay) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="absolute top-0 right-0 p-4 border border-blue-500/20 bg-white/5 backdrop-blur-md rounded-lg transform translate-x-1/4 -translate-y-1/4 scale-75 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Neural Sync</div>
                        <div className="text-[10px] text-gray-400">98.2% Active</div>
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full -z-10" />
        </div>
    );
};

export default NexusCore;
