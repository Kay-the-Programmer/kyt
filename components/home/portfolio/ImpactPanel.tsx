import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../../SplitText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImpactPanelProps {
    registerMagneticArea?: (el: HTMLDivElement | null) => void;
    desktopTween?: gsap.core.Tween | null;
}

const ImpactPanel: React.FC<ImpactPanelProps> = ({ registerMagneticArea, desktopTween }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const ctaContainerRef = useRef<HTMLDivElement>(null);
    const blueGlowRef = useRef<HTMLDivElement>(null);
    const purpleGlowRef = useRef<HTMLDivElement>(null);
    const primaryButtonRef = useRef<HTMLAnchorElement>(null);
    const secondaryButtonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const headline = headlineRef.current;
        const ctaContainer = ctaContainerRef.current;
        const blueGlow = blueGlowRef.current;
        const purpleGlow = purpleGlowRef.current;

        if (!container || !headline) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Get elements that need animation
        const headlineChars = headline.querySelectorAll('.letter-reveal');
        const buttons = ctaContainer?.querySelectorAll('a');

        // SET INITIAL HIDDEN STATE IMMEDIATELY ON MOUNT
        // This prevents flash of visible content before animations
        if (headlineChars.length > 0) {
            gsap.set(headlineChars, {
                opacity: 0,
                y: 40,
                scale: 0.9,
                rotationX: -20,
                transformPerspective: 1000,
                willChange: 'transform, opacity'
            });
        }
        if (buttons && buttons.length > 0) {
            gsap.set(buttons, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                willChange: 'transform, opacity'
            });
        }
        if (blueGlow && purpleGlow) {
            gsap.set([blueGlow, purpleGlow], {
                scale: 0.6,
                opacity: 0,
                willChange: 'transform, opacity'
            });
        }

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Mobile animations
            mm.add('(max-width: 1023px)', () => {
                // Background glow pulse animation on scroll
                if (blueGlow && purpleGlow) {
                    gsap.to(blueGlow, {
                        scale: 1,
                        opacity: 0.15,
                        duration: 1.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true
                        },
                        onComplete: () => {
                            gsap.to(blueGlow, {
                                scale: 1.1,
                                opacity: 0.1,
                                duration: 3,
                                yoyo: true,
                                repeat: -1,
                                ease: 'sine.inOut'
                            });
                        }
                    });

                    gsap.to(purpleGlow, {
                        scale: 1,
                        opacity: 0.15,
                        duration: 1.5,
                        delay: 0.3,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true
                        },
                        onComplete: () => {
                            gsap.to(purpleGlow, {
                                scale: 1.1,
                                opacity: 0.1,
                                duration: 4,
                                delay: 1,
                                yoyo: true,
                                repeat: -1,
                                ease: 'sine.inOut'
                            });
                        }
                    });
                }

                // Headline staggered reveal
                if (headlineChars.length > 0) {
                    gsap.to(headlineChars, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotationX: 0,
                        stagger: {
                            each: 0.02,
                            from: 'center'
                        },
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: headline,
                            start: 'top 85%',
                            once: true
                        }
                    });
                }

                // CTA buttons bounce entrance
                if (buttons && buttons.length > 0) {
                    gsap.to(buttons, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.1,
                        duration: 0.8,
                        delay: 0.4,
                        ease: 'back.out(1.5)',
                        scrollTrigger: {
                            trigger: ctaContainer,
                            start: 'top 85%',
                            once: true
                        },
                        onComplete: () => {
                            gsap.to(ctaContainer, {
                                y: -5,
                                duration: 2.5,
                                ease: 'sine.inOut',
                                yoyo: true,
                                repeat: -1
                            });
                        }
                    });
                }
            });

            // Desktop animations
            mm.add('(min-width: 1024px)', () => {
                if (!desktopTween) return;

                // Headline reveal
                if (headlineChars.length > 0) {
                    gsap.to(headlineChars, {
                        opacity: 1,
                        rotateX: 0,
                        y: 0,
                        scaleY: 1,
                        stagger: 0.04,
                        ease: 'back.out(1.5)',
                        scrollTrigger: {
                            trigger: headlineRef.current,
                            containerAnimation: desktopTween,
                            start: "left 60%",
                            end: "left 20%",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }

                // CTA Entrance - animate buttons directly since they have hidden state
                if (buttons && buttons.length > 0) {
                    gsap.to(buttons, {
                        opacity: 1, y: 0, scale: 1,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: ctaContainerRef.current,
                            containerAnimation: desktopTween,
                            start: "left 65%",
                            end: "left 30%",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }
            });

        }, container);

        return () => ctx.revert();
    }, [desktopTween]);

    // Register magnetic areas for desktop
    useEffect(() => {
        if (registerMagneticArea) {
            if (primaryButtonRef.current) {
                registerMagneticArea(primaryButtonRef.current as unknown as HTMLDivElement);
            }
        }
    }, [registerMagneticArea]);

    return (
        <div
            ref={containerRef}
            className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 bg-transparent relative overflow-hidden shrink-0 z-[4] will-change-transform"
        >
            {/* Animated Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    ref={blueGlowRef}
                    className="absolute top-0 right-0 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[180px]"
                />
                <div
                    ref={purpleGlowRef}
                    className="absolute bottom-0 left-0 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[150px]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-gray-900 dark:text-white max-w-5xl px-4 sm:px-6">

                <h2
                    ref={headlineRef}
                    className="flex flex-col items-center text-5xl sm:text-6xl md:text-8xl lg:text-[11rem] font-heading font-bold mb-10 sm:mb-16 tracking-tighter leading-[0.85]"
                >
                    <SplitText text="Let's Build" />
                    <SplitText text="Your Idea" isGradient={true} />
                </h2>


                {/* CTA Buttons */}
                <div
                    ref={ctaContainerRef}
                    className="reveal-target flex flex-col md:flex-row items-center justify-center w-full space-y-6 sm:space-y-10 md:space-y-0 md:space-x-14"
                >
                    <Link
                        ref={primaryButtonRef as React.RefObject<HTMLAnchorElement>}
                        to="/contact"
                        className="magnetic-area group w-full max-w-xs md:w-auto md:max-w-none px-10 sm:px-16 py-6 sm:py-8 bg-blue-600 text-white rounded-full font-black text-xl sm:text-2xl lg:hover:bg-blue-700 transition-all duration-500 shadow-2xl shadow-blue-600/20 dark:shadow-blue-600/30 active:scale-95 lg:hover:scale-105 lg:hover:shadow-blue-600/40 dark:lg:hover:shadow-blue-600/50 flex justify-center items-center"
                    >
                        Contact us
                    </Link>
                    <Link
                        ref={secondaryButtonRef as React.RefObject<HTMLAnchorElement>}
                        to="/services"
                        className="text-base sm:text-lg font-bold tracking-widest uppercase border-b-2 border-gray-300 dark:border-white/20 hover:border-blue-600 pb-2 transition-all group"
                    >
                        View Services
                        <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-3 transition-transform duration-500" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ImpactPanel);

