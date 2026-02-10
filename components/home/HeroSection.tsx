import React, { useRef, useLayoutEffect, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { TransitionContext, useTransition } from '../../TransitionContext';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useSharedMousePos, globalMousePos } from '../../hooks/useSharedMousePos';

// Throttle utility
const throttle = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
};

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgLayer1Ref = useRef<HTMLDivElement>(null);
  const bgLayer2Ref = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State refs to avoid frequent callback recreation
  const frameCountRef = useRef(0);
  const isInViewRef = useRef(true);
  const isReducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);

  // State for hooks that require re-render/logic updates
  const [isMobile, setIsMobile] = useState(false);

  const isPageTransition = useTransition();

  // Cache letter elements for hover effect
  const letterRefs = useRef<NodeListOf<Element> | null>(null);

  // QuickTo Refs
  const quickToRefs = useRef({
    contentX: null as gsap.QuickToFunc | null,
    contentY: null as gsap.QuickToFunc | null,
    bg1X: null as gsap.QuickToFunc | null,
    bg1Y: null as gsap.QuickToFunc | null,
    bg2X: null as gsap.QuickToFunc | null,
    bg2Y: null as gsap.QuickToFunc | null,
  });

  // Memoized styles
  const bgLayer1Style = useMemo(() => ({
    backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)',
    backgroundSize: '50px 50px'
  }), []);

  const bgLayer2Style = useMemo(() => ({
    backgroundImage: 'linear-gradient(rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.1) 1px, transparent 1px)',
    backgroundSize: '150px 150px'
  }), []);

  const sectionStyle = useMemo(() => ({ perspective: '2500px' }), []);

  // Sync state to refs for ticker usage
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // Setup generic matchMedia listener to update refs
    mm.add({
      // Define conditions
      isReduced: "(prefers-reduced-motion: reduce)",
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      const { isReduced, isMobile } = context.conditions as { isReduced: boolean, isMobile: boolean };
      isReducedMotionRef.current = isReduced;
      isMobileRef.current = isMobile;
      setIsMobile(isMobile);
    });

    return () => mm.revert();
  }, []);

  // Visibility Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax Ticker - Persistent Reference
  useEffect(() => {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    const handleResize = throttle(() => {
      centerX = window.innerWidth / 2;
      centerY = window.innerHeight / 2;
    }, 200);

    const updateParallax = () => {
      // Logic checks using refs to avoid closure staleness
      if (isMobileRef.current) return;

      if (!globalMousePos.active || !isInViewRef.current || isReducedMotionRef.current) return;

      // Safety check for 0 division
      if (centerX === 0 || centerY === 0) return;

      const xRel = (globalMousePos.x - centerX) / centerX;
      const yRel = (globalMousePos.y - centerY) / centerY;

      const refs = quickToRefs.current;

      // Batch updates - Using slightly higher values for better responsiveness
      refs.contentX?.(xRel * 15);
      refs.contentY?.(yRel * 15);
      refs.bg1X?.(-xRel * 40);
      refs.bg1Y?.(-yRel * 40);
      refs.bg2X?.(-xRel * 80);
      refs.bg2Y?.(-yRel * 80);
    };

    gsap.ticker.add(updateParallax);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      gsap.ticker.remove(updateParallax);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this never re-binds unnecessarily

  // Main GSAP Setup (Entrance & Local Animations)
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      isReduced: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };

      const content = contentRef.current;
      const bg1 = bgLayer1Ref.current;
      const bg2 = bgLayer2Ref.current;
      const title = titleRef.current;

      // 1. Setup QuickTo
      if (content) {
        quickToRefs.current.contentX = gsap.quickTo(content, 'x', { duration: 0.8, ease: 'power2.out' });
        quickToRefs.current.contentY = gsap.quickTo(content, 'y', { duration: 0.8, ease: 'power2.out' });
      }
      if (bg1) {
        quickToRefs.current.bg1X = gsap.quickTo(bg1, 'x', { duration: 1.2, ease: 'power3.out' });
        quickToRefs.current.bg1Y = gsap.quickTo(bg1, 'y', { duration: 1.2, ease: 'power3.out' });
      }
      if (bg2) {
        quickToRefs.current.bg2X = gsap.quickTo(bg2, 'x', { duration: 2.0, ease: 'power4.out' });
        quickToRefs.current.bg2Y = gsap.quickTo(bg2, 'y', { duration: 2.0, ease: 'power4.out' });
      }

      // 2. Cache letters for hover
      if (title) {
        letterRefs.current = title.querySelectorAll('.letter-reveal');
      }

      // 3. Entrance Animation
      const heroBadge = section.querySelector('.hero-badge');
      const heroDesc = section.querySelector('.hero-desc');
      const heroBtns = section.querySelector('.hero-btns');
      const part1Chars = title?.querySelectorAll('.part-1 .letter-reveal');
      const part2Chars = title?.querySelectorAll('.part-2 .letter-reveal');

      // Set initial state
      if (heroBadge && heroDesc && heroBtns) gsap.set([heroBadge, heroDesc, heroBtns], { opacity: 0, y: 30 });
      if (part1Chars && part2Chars) {
        gsap.set([part1Chars, part2Chars], {
          opacity: 0,
          y: 100,
          rotateX: -90,
          transformPerspective: 1000
        });
      }

      const delay = isPageTransition ? 0.3 : 0.1; // Reduced delays
      const durationMult = isMobile ? 0.7 : 1;

      const tl = gsap.timeline({
        delay,
        defaults: { ease: 'expo.out', force3D: true }
      });

      tl.to(heroBadge, { opacity: 1, y: 0, duration: 1.0 * durationMult })
        .to(part1Chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2 * durationMult,
          stagger: { amount: isMobile ? 0.2 : 0.6, from: 'start' }
        }, "-=0.6")
        .to(part2Chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2 * durationMult,
          stagger: { amount: isMobile ? 0.2 : 0.6, from: 'center' }
        }, "-=0.9")
        .to(heroDesc, { opacity: 1, y: 0, duration: 1.0 * durationMult }, "-=0.8")
        .to(heroBtns, {
          opacity: 1, y: 0, duration: 1.0 * durationMult, ease: 'back.out(1.7)'
        }, "-=0.6");

      // Scroll cue entrance and pulse
      const scrollCue = scrollCueRef.current;
      if (scrollCue) {
        tl.fromTo(scrollCue,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          "-=0.3"
        );

        // Continuous pulse animation
        gsap.to(scrollCue, {
          y: 12,
          opacity: 0.6,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Scroll-linked exit animation - Separated onto scrollContainerRef to avoid conflict with mouse parallax
      if (scrollContainerRef.current && !isMobile) {
        gsap.to(scrollContainerRef.current, {
          y: -100,
          opacity: 0,
          scale: 0.98,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom 50%',
            scrub: true, // Smoother scrub
            invalidateOnRefresh: true
          }
        });
      }

    }, sectionRef); // Scope to section

    return () => mm.revert();
  }, [isPageTransition]);
  // Dependency on isPageTransition is fine as it likely doesn't change after mount/initial transition

  const handleTitleHover = useCallback((isEnter: boolean) => {
    if (isMobileRef.current || isReducedMotionRef.current || !titleRef.current) return;

    const title = titleRef.current;

    // Toggle class for CSS transforms
    title.classList.toggle("hover-active", isEnter);

    // GSAP animation for letters - wave effect
    const letters = letterRefs.current;

    if (letters && letters.length > 0) {
      if (isEnter) {
        // Wave animation - stagger creates flowing motion
        gsap.to(letters, {
          y: (i) => Math.sin(i * 0.5) * 15,
          rotateX: 360,
          scale: 1.05,
          color: (i) => i % 2 === 0 ? '#2563eb' : undefined,
          duration: 0.8,
          ease: "power2.out",
          stagger: {
            each: 0.03,
            from: "start"
          },
          overwrite: 'auto'
        });
      } else {
        // Return to normal
        gsap.to(letters, {
          y: 0,
          rotateX: 0,
          scale: 1,
          clearProps: 'color',
          duration: 0.6,
          ease: "power2.out",
          stagger: {
            each: 0.02,
            from: "end"
          },
          overwrite: 'auto'
        });
      }
    }
  }, []);

  const handleExploreClick = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative z-10 h-screen min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20"
      style={sectionStyle}
    >
      {/* Parallax Grids */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div
          ref={bgLayer1Ref}
          className="absolute inset-[-20%] opacity-[0.06] dark:opacity-[0.12] will-change-transform"
          style={bgLayer1Style}
        />
        <div
          ref={bgLayer2Ref}
          className="absolute inset-[-30%] opacity-[0.03] dark:opacity-[0.07] will-change-transform"
          style={bgLayer2Style}
        />
      </div>

      <div ref={scrollContainerRef} className="hero-scroll-container absolute inset-0 flex items-center justify-center will-change-transform">
        <div ref={contentRef} className="hero-section-content max-w-[95rem] w-full text-center relative z-10 will-change-transform px-2 sm:px-0">
          <div className="hero-badge inline-flex items-center space-x-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-white/10 dark:bg-blue-500/5 border border-gray-200/50 dark:border-blue-500/10 rounded-full mb-6 sm:mb-8 md:mb-12 mx-auto backdrop-blur-md">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.7em] text-blue-600 dark:text-blue-400">
              KYTRIQ TECHNOLOGIES
            </span>
          </div>

          <h1
            ref={titleRef}
            onMouseEnter={() => handleTitleHover(true)}
            onMouseLeave={() => handleTitleHover(false)}
            className="hero-title text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[9rem] font-heading font-black tracking-tighter leading-[0.85] text-gray-900 dark:text-white select-none flex flex-col items-center cursor-pointer transition-all duration-500"
          >
            <SplitText text="We Turn Ideas" className="part-1 block mb-1 sm:mb-2 md:mb-4" />
            <SplitText text="Into Reality." className="part-2 block" isGradient={true} />
          </h1>

          <p className="hero-desc text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto mt-6 sm:mt-8 md:mt-12 lg:mt-16 font-light leading-relaxed tracking-tight px-2">
            Engineering <span className="font-semibold text-blue-500">high-performance systems</span> with stunning designs.
          </p>

          <div className="hero-btns mt-8 sm:mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:space-x-8 px-4 sm:px-0">
            <Link
              to="/contact"
              data-analytics="hero_build_cta"
              className="group relative overflow-hidden inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold transition-all duration-700 text-center shadow-3xl shadow-blue-500/30 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 text-base sm:text-lg flex items-center justify-center space-x-2">
                <span>Let's Build</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <button
              className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border border-gray-300/50 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold transition-all duration-500 hover:border-blue-500 hover:text-blue-500 text-base sm:text-base"
              onClick={handleExploreClick}
              data-analytics="hero_explore_more"
            >
              Explore More
            </button>
          </div>

          {/* Scroll Cue */}
          <div
            ref={scrollCueRef}
            className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 cursor-pointer"
            onClick={handleExploreClick}
            role="button"
            aria-label="Scroll to explore"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExploreClick()}
          >
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
