import React, { useRef, useLayoutEffect, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { TransitionContext } from '../../TransitionContext';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useSharedMousePos, globalMousePos } from '../../hooks/useSharedMousePos';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgLayer1Ref = useRef<HTMLDivElement>(null);
  const bgLayer2Ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frameCountRef = useRef(0);
  const isPageTransition = useContext(TransitionContext);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useSharedMousePos();
  useMagnetic(titleRef);

  const quickToRefs = useRef({
    contentX: null as gsap.QuickToFunc | null,
    contentY: null as gsap.QuickToFunc | null,
    bg1X: null as gsap.QuickToFunc | null,
    bg1Y: null as gsap.QuickToFunc | null,
    bg2X: null as gsap.QuickToFunc | null,
    bg2Y: null as gsap.QuickToFunc | null,
  });

  // Memoized background styles to prevent re-renders
  const bgLayer1Style = useMemo(() => ({
    backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)',
    backgroundSize: '50px 50px'
  }), []);

  const bgLayer2Style = useMemo(() => ({
    backgroundImage: 'linear-gradient(rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.1) 1px, transparent 1px)',
    backgroundSize: '150px 150px'
  }), []);

  const sectionStyle = useMemo(() => ({ perspective: '2500px' }), []);

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Optimized parallax with frame skipping
  const updateParallax = useCallback(() => {
    // Skip every other frame for performance
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    if (!globalMousePos.active || !isInView || isReducedMotion) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const xRel = (globalMousePos.x - centerX) / centerX;
    const yRel = (globalMousePos.y - centerY) / centerY;

    // Smooth Multi-layer Parallax using cached quickTo functions
    const refs = quickToRefs.current;
    refs.contentX?.(xRel * 12);
    refs.contentY?.(yRel * 12);
    refs.bg1X?.(-xRel * 35);
    refs.bg1Y?.(-yRel * 35);
    refs.bg2X?.(-xRel * 70);
    refs.bg2Y?.(-yRel * 70);
  }, [isInView, isReducedMotion]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const content = contentRef.current;
      const bg1 = bgLayer1Ref.current;
      const bg2 = bgLayer2Ref.current;
      const title = titleRef.current;

      // 1. Setup QuickTo functions for sub-pixel smoothness
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

      // 2. Cache DOM queries for entrance animation
      const part1Chars = title?.querySelectorAll('.part-1 .letter-reveal');
      const part2Chars = title?.querySelectorAll('.part-2 .letter-reveal');
      const heroBadge = section.querySelector('.hero-badge');
      const heroDesc = section.querySelector('.hero-desc');
      const heroBtns = section.querySelector('.hero-btns');

      // Batch set initial states
      if (heroBadge && heroDesc && heroBtns) {
        gsap.set([heroBadge, heroDesc, heroBtns], { opacity: 0, y: 30 });
      }
      if (part1Chars && part2Chars) {
        gsap.set([part1Chars, part2Chars], {
          opacity: 0,
          y: 100,
          rotateX: -90,
          transformPerspective: 1000
        });
      }

      // 3. Entrance Animation
      const delay = isPageTransition ? 0.7 : 0.1;
      const entranceTl = gsap.timeline({
        delay,
        defaults: { ease: 'expo.out', force3D: true },
        onStart: () => setIsInView(true),
      });

      entranceTl
        .to(heroBadge, { opacity: 1, y: 0, duration: 1.2 })
        .to(part1Chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.6, stagger: { amount: 0.6, from: 'start' }
        }, "-=0.8")
        .to(part2Chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.6, stagger: { amount: 0.6, from: 'center' }
        }, "-=1.2")
        .to(heroDesc, { opacity: 1, y: 0, duration: 1.2 }, "-=1.0")
        .to(heroBtns, {
          opacity: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)'
        }, "-=0.8");

      // 4. Ticker-based Parallax (only when not reduced motion)
      if (!isReducedMotion) {
        gsap.ticker.add(updateParallax);
      }

      // 5. Intersection Observer for visibility optimization
      observerRef.current = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { threshold: 0.1, rootMargin: '50px' }
      );
      observerRef.current.observe(section);

    }, section);

    return () => {
      ctx.revert();
      observerRef.current?.disconnect();
      gsap.ticker.remove(updateParallax);
    };
  }, [isPageTransition, isReducedMotion, updateParallax]);

  // Optimized title hover with CSS transitions (removed broken Flip dependency)
  const handleTitleHover = useCallback((isEnter: boolean) => {
    if (isReducedMotion || !titleRef.current) return;

    const title = titleRef.current;
    const currentlyActive = title.classList.contains("hover-active");

    // Only proceed if state actually changes
    if (isEnter === currentlyActive) return;

    title.classList.toggle("hover-active", isEnter);

    // Simple letter animation without Flip (which wasn't imported)
    const allLetters = title.querySelectorAll('.letter-reveal');
    if (allLetters.length > 0) {
      gsap.to(allLetters, {
        rotateX: isEnter ? 360 : 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: {
          each: 0.02,
          from: "random"
        },
        overwrite: 'auto'
      });
    }
  }, [isReducedMotion]);

  // Memoized scroll handler
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

      <div ref={contentRef} className="hero-section-content max-w-[95rem] w-full text-center relative z-10 will-change-transform">
        <div className="hero-badge inline-flex items-center space-x-2 px-6 py-2 bg-white/10 dark:bg-blue-500/5 border border-gray-200/50 dark:border-blue-500/10 rounded-full mb-8 md:mb-12 mx-auto backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.7em] text-blue-600 dark:text-blue-400">
            SYSTEM_STATUS: OPERATIONAL
          </span>
        </div>

        <h1
          ref={titleRef}
          onMouseEnter={() => handleTitleHover(true)}
          onMouseLeave={() => handleTitleHover(false)}
          className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[9rem] font-heading font-black tracking-tighter leading-[0.85] text-gray-900 dark:text-white select-none flex flex-col items-center cursor-pointer transition-all duration-500"
        >
          <SplitText text="We Bring Digital Ideas" className="part-1 block mb-2 md:mb-4" />
          <SplitText text="To Life." className="part-2 block" isGradient={true} />
        </h1>

        <p className="hero-desc text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto mt-8 md:mt-12 lg:mt-16 font-light leading-relaxed tracking-tight">
          Engineering <span className="font-semibold text-blue-500">high-performance systems</span> with radical precision.
        </p>

        <div className="hero-btns mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
          <Link
            to="/contact"
            className="group relative overflow-hidden inline-block w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold transition-all duration-700 text-center shadow-3xl shadow-blue-500/30 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-lg flex items-center justify-center space-x-2">
              <span>Let's Build</span>
              <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <button
            className="group px-10 py-5 bg-transparent border border-gray-300/50 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold transition-all duration-500 hover:border-blue-500 hover:text-blue-500"
            onClick={handleExploreClick}
          >
            Explore More
          </button>
        </div>
      </div>

      <style>{`
        .hero-title.hover-active .part-1 {
          transform: scale(0.65) translateY(40px) translateZ(-100px);
          opacity: 0.4;
          filter: blur(4px);
        }
        .hero-title.hover-active .part-2 {
          transform: scale(1.15) translateZ(150px);
          filter: drop-shadow(0 0 50px rgba(37, 99, 235, 0.6));
        }
        .hero-title.hover-active {
          flex-direction: column-reverse;
        }
        .letter-reveal {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
