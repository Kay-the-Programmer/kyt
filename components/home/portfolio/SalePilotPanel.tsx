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

    useEffect(() => {
        const container = containerRef.current;
        const headline = headlineRef.current;
        const image = imageRef.current;

        if (!container || !headline) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Mobile animations
            mm.add('(max-width: 1023px)', () => {
                // Headline stagger reveal
                const headlineChars = headline.querySelectorAll('.split-text-char');
                if (headlineChars.length > 0) {
                    gsap.set(headlineChars, {
                        opacity: 0,
                        y: 35,
                        rotationX: -25,
                        transformPerspective: 700
                    });

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
                            trigger: container,
                            start: 'top 80%',
                            once: true
                        }
                    });
                }

                // Reveal targets
                const revealTargets = container.querySelectorAll('.reveal-target');
                if (revealTargets.length > 0) {
                    gsap.set(revealTargets, {
                        opacity: 0,
                        y: 30
                    });

                    gsap.to(revealTargets, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.7,
                        delay: 0.3,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 80%',
                            once: true
                        }
                    });
                }

                // Image reveal
                if (image) {
                    gsap.set(image, {
                        scale: 1.15,
                        opacity: 0
                    });

                    gsap.to(image, {
                        scale: 1,
                        opacity: 0.9,
                        duration: 1,
                        delay: 0.4,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 80%',
                            once: true
                        }
                    });
                }
            });

            // Desktop - set initial state for horizontal scroll parent to animate
            mm.add('(min-width: 1024px)', () => {
                const headlineChars = headline.querySelectorAll('.split-text-char');
                if (headlineChars.length > 0) {
                    gsap.set(headlineChars, {
                        opacity: 0,
                        y: 50,
                        rotationX: -40,
                        transformPerspective: 900
                    });
                }
            });
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden shrink-0 z-[1] will-change-transform"
        >
            <div className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                <div className="salepilot-title relative z-10">
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8 reveal-target">
                        <span className="w-8 sm:w-10 h-[1.5px] bg-blue-600" />
                        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase">Our Work</span>
                    </div>
                    <h2
                        ref={headlineRef}
                        className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-heading font-black tracking-tighter text-gray-900 dark:text-white mb-6 sm:mb-8 leading-[0.85]"
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
                        Moving beyond traditional POS by simplifying operations and providing AI-driven insights into everyday operations. Scalable, usability-first, and resilient.
                    </p>
                    <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 reveal-target">
                        {[{ label: 'Automation', val: 'Low Overhead' }, { label: 'Reliability', val: 'Offline Core' }].map((f, i) => (
                            <div key={i} className="border-l border-blue-600/20 pl-4 sm:pl-6 py-2 hover:border-blue-600 transition-colors duration-500">
                                <div className="text-[8px] sm:text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">{f.label}</div>
                                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{f.val}</div>
                            </div>
                        ))}
                    </div>
                    <div className="reveal-target">
                        <Link to="/projects/salepilot" className="magnetic-area inline-flex items-center space-x-4 sm:space-x-6 group">
                            <div className="px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl shadow-blue-600/20 group-hover:bg-blue-700 group-hover:shadow-blue-600/40 transition-all duration-500 group-hover:scale-105">
                                Explore Case Study
                            </div>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600/5 transition-all duration-500">
                                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform duration-500 dark:text-white" />
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
                                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 hover:grayscale-0 hover:scale-105"
                                alt="SalePilot Hub"
                            />
                        </div>
                    </div>
                    <div className="floating-card absolute -bottom-6 sm:-bottom-10 right-2 sm:right-0 lg:-bottom-16 lg:-right-16 w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 bg-gray-900 dark:bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] lg:rounded-[6rem] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 shadow-3xl z-20 group hover:-rotate-6 hover:scale-105 transition-all duration-700">
                        <i className="fa-solid fa-brain text-blue-500 text-2xl sm:text-3xl lg:text-5xl mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[7px] sm:text-[8px] lg:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center text-white dark:text-gray-900 leading-relaxed">
                            Cognitive <br />Insights Engine
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalePilotPanel;

