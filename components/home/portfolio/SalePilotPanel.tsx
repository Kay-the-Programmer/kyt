import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../../SplitText';
import salePilotImg from '../../../assets/ads.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SalePilotPanelProps {
    registerMagneticArea?: (el: HTMLDivElement | null) => void;
}

const SalePilotPanel: React.FC<SalePilotPanelProps> = ({ registerMagneticArea }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const headline = headlineRef.current;
        const image = imageRef.current;
        const floatingCard = floatingCardRef.current;

        if (!container || !headline) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            const revealTargets = container.querySelectorAll('.reveal-target');
            const headlineChars = headline.querySelectorAll('.letter-reveal');

            // Common setup for all animations
            const setupAnimation = () => {
                // Set initial states with will-change for better performance
                gsap.set([headlineChars, revealTargets, image, floatingCard].filter(Boolean), {
                    willChange: 'opacity, transform',
                });

                if (headlineChars.length > 0) {
                    gsap.set(headlineChars, {
                        opacity: 0,
                        y: 20,
                        rotationX: -15,
                        transformPerspective: 800,
                        transformStyle: 'preserve-3d'
                    });
                }

                if (revealTargets.length > 0) {
                    gsap.set(revealTargets, {
                        opacity: 0,
                        y: 20
                    });
                }

                if (image) {
                    gsap.set(image, {
                        scale: 1.05,
                        opacity: 0.5
                    });
                }

                if (floatingCard) {
                    gsap.set(floatingCard, {
                        opacity: 0,
                        y: 30,
                        scale: 0.95
                    });
                }
            };

            // Mobile animations - more subtle
            mm.add('(max-width: 1023px)', () => {
                setupAnimation();

                // Headline reveal with softer easing
                if (headlineChars.length > 0) {
                    gsap.to(headlineChars, {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        stagger: {
                            each: 0.015,
                            from: 'start',
                            ease: 'power2.inOut'
                        },
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true,
                            markers: false // Disable debug markers
                        }
                    });
                }

                // Reveal targets with more subtle stagger
                if (revealTargets.length > 0) {
                    gsap.to(revealTargets, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.06,
                        duration: 0.5,
                        delay: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true
                        }
                    });
                }

                // Image reveal - more subtle
                if (image) {
                    gsap.to(image, {
                        scale: 1,
                        opacity: 0.85,
                        duration: 0.8,
                        delay: 0.3,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true
                        }
                    });
                }

                // Floating card reveal
                if (floatingCard) {
                    gsap.to(floatingCard, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: 0.4,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 40%',
                            once: true
                        }
                    });
                }
            });

            // Desktop animations - Self-contained entrance animations
            // SalePilotPanel is the FIRST panel and is excluded from the parent's
            // containerAnimation-based animations. We need our own ScrollTrigger.

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden shrink-0 will-change-transform"
        >
            <div className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                <div className="salepilot-title relative z-10">
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8 reveal-target">
                        <span className="w-8 sm:w-10 h-[1.5px] bg-blue-600" />
                        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase">Our Work</span>
                    </div>
                    <h2
                        ref={headlineRef}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-heading font-black tracking-tighter text-gray-900 dark:text-white mb-6 sm:mb-8 leading-[0.85]"
                    >
                        <SplitText text="Sale" className="inline-block" />
                        <span className="text-blue-600 inline-block ml-2 sm:ml-3">
                            <SplitText text="Pilot." />
                        </span>
                    </h2>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 tracking-tight reveal-target">
                        Retail Management System
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl mb-8 sm:mb-12 reveal-target">
                        A <span className="text-blue-600 font-bold">Next generation</span> retail management system designed to streamline operations and provide actionable insights for business owners.
                    </p>
                    <div className="reveal-target">
                        <Link to="/projects/salepilot" className="magnetic-area inline-flex items-center space-x-4 sm:space-x-6 group">
                            <div className="px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl shadow-blue-600/20 group-hover:bg-blue-700 group-hover:shadow-blue-600/40 transition-all duration-500 group-hover:scale-105">
                                Explore Case Study
                            </div>

                        </Link>
                    </div>
                </div>
                <div className="relative reveal-target" style={{ perspective: '2000px' }}>
                    <div className="relative z-10 aspect-[4/3] bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl p-3 sm:p-5 hover:shadow-blue-600/10 transition-shadow duration-700">
                        <div className="w-full h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4.5rem] bg-gray-50 dark:bg-gray-800 relative">
                            <img
                                ref={imageRef}
                                src={salePilotImg}
                                width="1200"
                                height="900"
                                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 hover:grayscale-0"
                                alt="SalePilot Hub"
                                decoding="async"
                            />
                        </div>
                    </div>
                    <div
                        ref={floatingCardRef}
                        className="floating-card absolute -bottom-6 sm:-bottom-10 right-2 sm:right-0 lg:-bottom-16 lg:-right-16 w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 bg-gray-900 dark:bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] lg:rounded-[6rem] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 shadow-3xl z-20 group lg:hover:-rotate-3 lg:hover:scale-102 transition-all duration-500"
                    >
                        <i className="fa-solid fa-brain text-blue-500 text-2xl sm:text-3xl lg:text-5xl mb-3 sm:mb-4 lg:mb-6 lg:group-hover:scale-105 transition-transform" />
                        <span className="text-[7px] sm:text-[8px] lg:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center text-white dark:text-gray-900 leading-relaxed">
                            Intelligent <br /> POS
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SalePilotPanel);