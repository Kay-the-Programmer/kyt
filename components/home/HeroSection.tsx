import React, { useRef, useLayoutEffect, useContext } from 'react';
import { TransitionContext } from '../../TransitionContext';
import logo from '../../assets/logo.png';
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
  const isPageTransition = useContext(TransitionContext);
  useSharedMousePos();

  const contentXTo = useRef<gsap.QuickToFunc | null>(null);
  const contentYTo = useRef<gsap.QuickToFunc | null>(null);
  const hudXTo = useRef<gsap.QuickToFunc | null>(null);
  const hudYTo = useRef<gsap.QuickToFunc | null>(null);
  useMagnetic(titleRef);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation - Favoring immediate LCP
      const delay = isPageTransition ? 0.35 : 0;
      const entranceTl = gsap.timeline({
        delay: delay,
        defaults: { ease: 'power3.out', force3D: true }
      });

      // Set initial states once, aiming for zero-opacity to visible handoff
      gsap.set('.hero-badge, .hero-desc, .hero-btns', { opacity: 0, y: 15 });

      entranceTl
        .set('.hud-element', { opacity: 0, scale: 0.8 })
        .to('.hero-badge', { opacity: 1, y: 0, duration: 0.4 }, 0.02)
        .to('.letter-reveal', {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.004,
          ease: 'power2.out',
          overwrite: 'auto'
        }, 0.05)
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.6 }, 0.05) // Start with letters
        .to('.hero-btns', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to('.hud-element', {
          opacity: 0.4,
          scale: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'expo.out'
        }, 0.2);

      // 2. Continuous HUD animations - optimized
      gsap.to('.hud-rotate', {
        rotation: 360,
        duration: 30, // Slower is often smoother/less distracting
        repeat: -1,
        ease: 'none',
        force3D: true
      });

      // 3. Set up quickTo for smooth parallax
      if (contentRef.current) {
        contentXTo.current = gsap.quickTo(contentRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        contentYTo.current = gsap.quickTo(contentRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
      }

      const hudElements = document.querySelectorAll('.hud-element');
      if (hudElements.length > 0) {
        hudXTo.current = gsap.quickTo(hudElements, 'x', { duration: 1, ease: 'power3.out' });
        hudYTo.current = gsap.quickTo(hudElements, 'y', { duration: 1, ease: 'power3.out' });
      }

      const updateParallax = () => {
        if (!globalMousePos.active) return;
        const x = (globalMousePos.x - window.innerWidth / 2) / 50;
        const y = (globalMousePos.y - window.innerHeight / 2) / 50;

        contentXTo.current?.(x);
        contentYTo.current?.(y);
        hudXTo.current?.(-x * 0.4);
        hudYTo.current?.(-y * 0.4);
      };

      gsap.ticker.add(updateParallax);

      // 4. Cinematic exit animation - optimized
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: 0.5
        }
      });

      exitTl.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        y: -100,
        ease: 'none',
        force3D: true
      });

      return () => {
        gsap.ticker.remove(updateParallax);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section ref={sectionRef} className="hero-section relative z-10 h-screen min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* Technical HUD Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[5]" style={{ contain: 'paint' }}>
        <div className="hud-element absolute top-[15%] left-[10%] font-mono text-[10px] text-blue-500/40 hidden lg:block shrink-0" style={{ willChange: 'transform, opacity' }}>
          <div className="flex flex-col space-y-1">
            <span>SYS_MODEL: V-ARCH_2026</span>
            <span>COORD: [34.22, 118.44]</span>
            <div className="w-16 h-[1px] bg-blue-500/20" />
            <span>LATENCY: 12ms</span>
          </div>
        </div>

        <div className="hud-element absolute bottom-[20%] right-[10%] w-32 h-32 opacity-20 hidden lg:block shrink-0" style={{ willChange: 'transform, opacity' }}>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>

        <div className="hud-element hud-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/5 rounded-full hidden xl:block shrink-0" style={{ willChange: 'transform' }} />
        <div className="hud-element hud-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/10 rounded-full border-dashed hidden xl:block shrink-0" style={{ animationDirection: 'reverse', willChange: 'transform' }} />
      </div>

      <div ref={contentRef} className="hero-section-content max-w-[95rem] w-full text-center relative z-10" style={{ willChange: 'transform, opacity' }}>
        <div className="hero-badge inline-flex items-center space-x-2 px-6 py-2 bg-white/5 dark:bg-blue-500/5 border border-gray-200/50 dark:border-blue-500/10 rounded-full mb-8 md:mb-12 mx-auto backdrop-blur-md" style={{ willChange: 'transform, opacity' }}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">KYTRIQ TECHNOLOGIES</span>
        </div>

        <h1 ref={titleRef} className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-heading font-extrabold tracking-tighter leading-[0.95] text-gray-900 dark:text-white select-none overflow-visible flex flex-col items-center [&_.letter-reveal]:translate-y-[60px] [&_.letter-reveal]:rotate-x-[45deg] [&_.letter-reveal]:blur-[10px]">
          <SplitText text="Bringing Digital Ideas" className="block mb-2 md:mb-4" />
          <SplitText text="To Life." className="block" isGradient={true} />
        </h1>

        <p className="hero-desc text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-500 max-w-3xl mx-auto mt-8 md:mt-12 lg:mt-16 font-light leading-relaxed tracking-tight" style={{ willChange: 'transform, opacity' }}>
          Engineering high-performance digital organisms. <br className="hidden md:block" /> Creating visionary architectures with absolute precision.
        </p>

        <div className="hero-btns mt-10 magnetic-area md:mt-12 lg:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-12" style={{ willChange: 'transform, opacity' }}>
          <Link to="/contact" className="group relative overflow-hidden inline-block w-full sm:w-auto px-10 md:px-16 py-4 md:py-5 bg-blue-600 text-white rounded-full font-bold transition-all duration-700 text-center shadow-xl shadow-blue-500/20">
            <span className="relative z-10 text-lg">Let's Build Together</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;