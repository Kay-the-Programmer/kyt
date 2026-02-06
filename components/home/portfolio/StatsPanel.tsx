import React, { useEffect, useRef, useCallback } from 'react';
import SplitText from '../../SplitText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatsPanelProps {
    gridLayer1Ref: React.RefObject<HTMLDivElement>;
    gridLayer2Ref: React.RefObject<HTMLDivElement>;
    gridLayer3Ref: React.RefObject<HTMLDivElement>;
    glowRef: React.RefObject<HTMLDivElement>;
    vignetteRef: React.RefObject<HTMLDivElement>;
    registerMagneticArea?: (el: HTMLDivElement | null) => void;
}

const STATS_DATA = [
    { label: 'Security', value: 'Zero-Trust', icon: 'fa-fingerprint', desc: 'Enterprise-grade encryption for every single transaction.' },
    { label: 'Latency', value: '0.04s', icon: 'fa-gauge-high', desc: 'Edge-optimized processing for high-frequency retail environments.' },
    { label: 'Integration', value: 'Omni-Sync', icon: 'fa-network-wired', desc: 'Fluid data exchange across hardware, cloud, and local hubs.' }
] as const;

const StatsPanel = React.forwardRef<HTMLDivElement, StatsPanelProps>(({
    gridLayer1Ref,
    gridLayer2Ref,
    gridLayer3Ref,
    glowRef,
    vignetteRef,
    registerMagneticArea
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const statsCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const headlineRef = useRef<HTMLDivElement>(null);

    // Set up scroll-triggered animations
    useEffect(() => {
        const container = containerRef.current;
        const headline = headlineRef.current;
        const cards = statsCardsRef.current.filter(Boolean) as HTMLDivElement[];

        if (!container || !headline || cards.length === 0) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Mobile animations (vertical scroll)
            mm.add('(max-width: 1023px)', () => {
                // Simpler mobile animations for performance
                gsap.set(cards, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                    willChange: 'transform, opacity'
                });

                // Headline animation for mobile - triggers first
                const headlineChars = headline.querySelectorAll('.split-text-char');
                if (headlineChars.length > 0) {
                    gsap.set(headlineChars, {
                        opacity: 0,
                        y: 30
                    });

                    gsap.to(headlineChars, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.02,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: headline,
                            start: 'top 85%',
                            once: true
                        }
                    });
                }

                // Staggered card entrance on mobile - use container trigger with delays
                cards.forEach((card, index) => {
                    // Icon initial state
                    const icon = card.querySelector('.stats-icon');
                    if (icon) {
                        gsap.set(icon, {
                            scale: 0,
                            rotation: -180
                        });
                    }

                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        delay: 0.3 + (index * 0.15),
                        ease: 'power3.out',
                        onComplete: () => {
                            gsap.set(card, { willChange: 'auto' });
                        },
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true
                        }
                    });

                    // Icon bounce effect - coordinated with card animation
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.6,
                            delay: 0.5 + (index * 0.15),
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                once: true
                            }
                        });
                    }
                });
            });
        }, container);

        return () => ctx.revert();
    }, []);

    // Register magnetic areas for desktop hover effects
    const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
        statsCardsRef.current[index] = el;
        if (registerMagneticArea && el) {
            registerMagneticArea(el);
        }
    }, [registerMagneticArea]);

    return (
        <div
            ref={(node) => {
                containerRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            }}
            className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:p-12 lg:p-24 bg-white dark:bg-gray-950 overflow-visible lg:overflow-hidden relative shrink-0 z-[2] will-change-transform touch-pan-y"
        >
            {/* Parallax Background Layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '3000px' }}>
                <div
                    ref={gridLayer3Ref}
                    className="absolute inset-[-20%] opacity-[0.01] dark:opacity-[0.02] hidden md:block"
                    style={{
                        backgroundImage: 'linear-gradient(#2563eb 2px, transparent 2px), linear-gradient(90deg, #2563eb 2px, transparent 2px)',
                        backgroundSize: '240px 240px',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div
                    ref={gridLayer2Ref}
                    className="absolute inset-[-15%] opacity-[0.02] dark:opacity-[0.04] hidden sm:block"
                    style={{
                        backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
                        backgroundSize: '120px 120px',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div
                    ref={gridLayer1Ref}
                    className="absolute inset-[-10%] opacity-[0.04] dark:opacity-[0.08]"
                    style={{
                        backgroundImage: 'linear-gradient(#2563eb 0.5px, transparent 0.5px), linear-gradient(90deg, #2563eb 0.5px, transparent 0.5px)',
                        backgroundSize: '40px 40px',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div
                    ref={glowRef}
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] -translate-x-1/2 -translate-y-1/2 opacity-15 md:opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(147,51,234,0.12) 30%, transparent 70%)',
                        willChange: 'transform'
                    }}
                />
                <div
                    ref={vignetteRef}
                    className="absolute inset-[-10%] opacity-20 md:opacity-30 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(3,7,18,0.5) 100%)' }}
                />
            </div>

            {/* Content */}
            <div className="max-w-7xl w-full text-center relative z-10 stats-container">
                {/* Headline Section */}
                <div ref={headlineRef} className="flex flex-col items-center justify-center mb-10 sm:mb-16 md:mb-24">
                    <div className="w-10 sm:w-14 h-px bg-blue-600 mb-6 sm:mb-8" />
                    <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[8.5rem] font-heading font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                        <SplitText text="Architecting" className="inline-block" />
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        <span className="text-blue-600 inline-block">
                            <SplitText text="Absolute Trust." />
                        </span>
                    </h2>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mt-6 sm:mt-8">
                    {STATS_DATA.map((stat, i) => (
                        <div
                            key={stat.label}
                            ref={(el) => setCardRef(el, i)}
                            className="reveal-target magnetic-area group relative p-6 sm:p-8 md:p-10 lg:p-14 bg-gray-50/80 dark:bg-white/[0.02] backdrop-blur-sm border border-gray-100 dark:border-white/5 rounded-2xl sm:rounded-3xl lg:rounded-[4rem] transition-all duration-500 ease-out hover:bg-white dark:hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-blue-600/10 z-20 active:scale-[0.98] lg:hover:-translate-y-3 lg:hover:scale-[1.02]"
                            style={{
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            {/* Icon */}
                            <div className="stats-icon w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl lg:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 lg:mb-10 mx-auto group-hover:rotate-6 lg:group-hover:rotate-12 group-hover:scale-105 lg:group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-600/25">
                                <i className={`fa-solid ${stat.icon} text-xl sm:text-2xl lg:text-3xl`} />
                            </div>

                            {/* Value */}
                            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 dark:text-white mb-2 sm:mb-4 tracking-tighter font-heading">
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-blue-600 mb-4 sm:mb-6">
                                {stat.label}
                            </div>

                            {/* Description */}
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-[280px] mx-auto">
                                {stat.desc}
                            </p>

                            {/* Subtle hover glow effect for desktop */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl lg:rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

StatsPanel.displayName = 'StatsPanel';

export default React.memo(StatsPanel);
