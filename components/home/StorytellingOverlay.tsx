import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Section {
    id: string;
    label: string;
}

const SECTIONS: Section[] = [
    { id: 'hero', label: 'Home' },
    { id: 'identity', label: 'Services' },
    { id: 'portfolio', label: 'Work' },
    { id: 'cta', label: 'Contact' },
    { id: 'footer', label: 'Footer' }
];

const StorytellingOverlay: React.FC = memo(() => {
    const [activeSection, setActiveSection] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const dotsContainerRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    // Setup scroll triggers for section detection
    useEffect(() => {
        // Delay visibility for smooth entrance
        const showTimer = setTimeout(() => setIsVisible(true), 1500);

        const ctx = gsap.context(() => {
            // Global scroll progress
            ScrollTrigger.create({
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    setScrollProgress(self.progress);
                }
            });

            // Section detection triggers
            SECTIONS.forEach((section, index) => {
                const el = document.getElementById(section.id);
                if (!el) return;

                ScrollTrigger.create({
                    trigger: el,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: () => setActiveSection(index),
                    onEnterBack: () => setActiveSection(index)
                });
            });
        });

        return () => {
            clearTimeout(showTimer);
            ctx.revert();
        };
    }, []);

    // Animate progress bar
    useEffect(() => {
        if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
                scaleY: scrollProgress,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }
    }, [scrollProgress]);

    // Animate active dot
    useEffect(() => {
        if (!dotsContainerRef.current) return;

        const dots = dotsContainerRef.current.querySelectorAll('.section-dot');

        dots.forEach((dot, i) => {
            gsap.to(dot, {
                scale: i === activeSection ? 1.4 : 1,
                opacity: i === activeSection ? 1 : 0.4,
                duration: 0.3,
                ease: 'back.out(1.7)',
                overwrite: 'auto'
            });
        });
    }, [activeSection]);

    const handleDotClick = useCallback((index: number) => {
        if (isScrollingRef.current) return;

        const section = document.getElementById(SECTIONS[index].id);
        if (!section) return;

        isScrollingRef.current = true;

        gsap.to(window, {
            scrollTo: { y: section, offsetY: 0 },
            duration: 1.2,
            ease: 'power3.inOut',
            onComplete: () => {
                isScrollingRef.current = false;
            }
        });
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDotClick(index);
        }
    }, [handleDotClick]);

    return (
        <div
            className={`storytelling-overlay fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
            aria-label="Page navigation"
        >
            {/* Progress Bar Background */}
            <div className="relative w-[3px] h-48 bg-gray-200/20 dark:bg-white/10 rounded-full overflow-hidden">
                {/* Progress Bar Fill */}
                <div
                    ref={progressBarRef}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-full origin-bottom"
                    style={{ height: '100%', transform: 'scaleY(0)' }}
                />
            </div>

            {/* Section Dots */}
            <nav
                ref={dotsContainerRef}
                className="flex flex-col gap-3"
                aria-label="Section navigation"
            >
                {SECTIONS.map((section, index) => (
                    <button
                        key={section.id}
                        className="section-dot group relative w-3 h-3 rounded-full bg-gray-400 dark:bg-white/40 cursor-pointer transition-colors hover:bg-blue-500 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
                        onClick={() => handleDotClick(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        aria-label={`Go to ${section.label} section`}
                        aria-current={index === activeSection ? 'true' : undefined}
                        tabIndex={0}
                    >
                        {/* Tooltip */}
                        <span className="absolute right-full mr-3 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm shadow-lg">
                            {section.label}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
});

StorytellingOverlay.displayName = 'StorytellingOverlay';

export default StorytellingOverlay;
