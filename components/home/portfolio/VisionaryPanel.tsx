import React, { useEffect, useRef } from 'react';
import SplitText from '../../SplitText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VisionaryPanelProps {
    registerMagneticArea?: (el: HTMLDivElement | null) => void;
    desktopTween?: gsap.core.Tween | null;
}

const VisionaryPanel: React.FC<VisionaryPanelProps> = ({ registerMagneticArea, desktopTween }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const backgroundTextRef = useRef<HTMLSpanElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const headline = headlineRef.current;
        const paragraph = paragraphRef.current;
        const bgText = backgroundTextRef.current;
        const imageContainer = imageContainerRef.current;

        if (!container || !headline) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Get elements that need animation
        const headlineChars = headline.querySelectorAll('.letter-reveal');

        // SET INITIAL HIDDEN STATE IMMEDIATELY ON MOUNT
        // This prevents flash of visible content before animations
        if (headlineChars.length > 0) {
            gsap.set(headlineChars, {
                opacity: 0,
                y: 40,
                rotationX: -30,
                transformPerspective: 800,
                willChange: 'transform, opacity'
            });
        }
        if (paragraph) {
            gsap.set(paragraph, {
                opacity: 0,
                y: 30,
                willChange: 'transform, opacity'
            });
        }
        if (bgText) {
            gsap.set(bgText, {
                opacity: 0,
                scale: 0.8,
                willChange: 'transform, opacity'
            });
        }
        if (imageContainer) {
            gsap.set(imageContainer, {
                opacity: 0,
                scale: 0.85,
                rotate: 12,
                filter: 'blur(8px)'
            });
        }

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Mobile animations (vertical scroll)
            mm.add('(max-width: 1023px)', () => {
                // Background text animation
                if (bgText) {
                    gsap.to(bgText, {
                        opacity: 0.02,
                        scale: 1,
                        duration: 1.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 85%',
                            once: true
                        }
                    });
                }

                // Headline character stagger animation
                if (headlineChars.length > 0) {
                    gsap.to(headlineChars, {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        stagger: {
                            each: 0.025,
                            from: 'start'
                        },
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: headline,
                            start: 'top 85%',
                            once: true
                        }
                    });
                }

                // Paragraph slide up
                if (paragraph) {
                    gsap.to(paragraph, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.4,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: paragraph,
                            start: 'top 85%',
                            once: true
                        }
                    });
                }
            });

            // Desktop Animations
            mm.add('(min-width: 1024px)', () => {
                if (!desktopTween) return;

                // Headline Stagger
                if (headlineChars.length > 0) {
                    gsap.to(headlineChars, {
                        opacity: 1,
                        rotateX: 0,
                        y: 0,
                        scaleY: 1,
                        stagger: 0.04,
                        ease: 'back.out(1.5)',
                        scrollTrigger: {
                            trigger: headline,
                            containerAnimation: desktopTween,
                            start: "left 60%",
                            end: "left 20%",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }

                // Paragraph Fade
                if (paragraph) {
                    gsap.to(paragraph, {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: paragraph,
                            containerAnimation: desktopTween,
                            start: "left 65%",
                            end: "left 30%",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }

                // Image Entrance
                if (imageContainer) {
                    gsap.to(imageContainer, {
                        opacity: 1, scale: 1, rotate: 6, filter: 'blur(0px)',
                        duration: 1.5,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: imageContainer,
                            containerAnimation: desktopTween,
                            start: "left 60%",
                            end: "left 20%",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }
            });

        }, container);

        return () => ctx.revert();
    }, [desktopTween]);

    return (
        <div
            ref={containerRef}
            className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 relative overflow-hidden shrink-0 z-[3] will-change-transform"
        >
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                    ref={backgroundTextRef}
                    className="text-[30vw] lg:text-[45vw] font-black text-blue-600/[0.02] dark:text-white/[0.01] tracking-tighter leading-none pointer-events-none uppercase"
                >
                    Kytriq
                </span>
            </div>

            {/* Content Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center max-w-7xl w-full px-4 sm:px-0">
                <div className="text-left">
                    <h2
                        ref={headlineRef}
                        className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-gray-900 dark:text-white mb-6 sm:mb-8 lg:mb-12 tracking-tighter leading-[0.85]"
                    >
                        <SplitText text="Visionary" className="block" />
                        <SplitText isGradient={true} text="Engineering." />
                    </h2>
                    <p
                        ref={paragraphRef}
                        className="reveal-target text-base sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-8 sm:mb-12 max-w-lg"
                    >
                        We architect digital solutions that adapt, learn, and grow alongside your evolving business mission.
                    </p>
                </div>

                {/* Desktop Image */}
                <div
                    ref={imageContainerRef}
                    className="relative hidden lg:block reveal-target"
                >
                    <div className="w-[550px] h-[550px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[5rem] rotate-6 relative overflow-hidden group shadow-2xl lg:hover:rotate-3 lg:hover:scale-105 transition-all duration-700 shadow-blue-600/20">
                        <img
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000"
                            className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 -rotate-6"
                            alt="The Workshop"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(VisionaryPanel);

