import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

gsap.registerPlugin(ScrollTrigger);

// Memoized style constants
const SECTION_STYLE = { perspective: '2000px' } as const;

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const glowBorderRef = useRef<HTMLDivElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  // Viewport-based content rendering
  const [isInViewport, setIsInViewport] = useState(false);

  // Detect when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animations only run after content is in viewport
  useEffect(() => {
    if (!isInViewport || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const bg = bgRef.current;
    const glowBorder = glowBorderRef.current;

    // Get elements and set initial hidden states
    const paths = section.querySelectorAll('.cta-data-path');
    const hudLines = section.querySelectorAll('.cta-hud-line');
    const hudCorners = section.querySelectorAll('.cta-hud-corner');
    const titleChars = section.querySelectorAll('.cta-title .letter-reveal');
    const desc = section.querySelector('.cta-desc');
    const btnWraps = section.querySelectorAll('.cta-btn-wrap');

    // SET INITIAL HIDDEN STATES
    gsap.set(hudLines, { scaleX: 0, opacity: 0 });
    gsap.set(hudCorners, { scale: 0, opacity: 0 });
    if (titleChars.length > 0) {
      gsap.set(titleChars, { y: 60, opacity: 0, rotateX: -90 });
    }
    if (desc) gsap.set(desc, { y: 30, opacity: 0 });
    if (btnWraps.length > 0) {
      gsap.set(btnWraps, { y: 40, opacity: 0, scale: 0.9 });
    }

    const ctx = gsap.context(() => {
      // Background "Data Stream" Animation - lightweight continuous
      if (paths.length > 0) {
        gsap.fromTo(paths,
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 10, repeat: -1, ease: 'none', stagger: 2 }
        );
      }

      // HUD corners rotation - lightweight
      gsap.to(hudCorners, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center'
      });

      // Entrance Sequence Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true
        }
      });

      tl.to(hudLines, {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.inOut'
      })
        .to(hudCorners, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'back.out(1.7)'
        }, '-=1');

      if (titleChars.length > 0) {
        tl.to(titleChars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: { amount: 0.5, from: 'center' },
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6');
      }

      if (desc) {
        tl.to(desc, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.7');
      }

      if (btnWraps.length > 0) {
        tl.to(btnWraps, {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'back.out(1.5)'
        }, '-=0.5');
      }
    }, section);

    // Mouse interaction - only on desktop, with caching
    const updateBounding = () => {
      if (sectionRef.current) {
        boundingRef.current = sectionRef.current.getBoundingClientRect();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !bg) return;
      if (!boundingRef.current) updateBounding();

      const { left, top, width, height } = boundingRef.current!;
      const xPercent = (e.clientX - left) / width - 0.5;
      const yPercent = (e.clientY - top) / height - 0.5;

      gsap.to(bg, {
        x: xPercent * 40,
        y: yPercent * 40,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (glowBorder) {
        const cRect = container.getBoundingClientRect(); // This is the only reflow left, but it's less frequent and container is smaller
        gsap.to(glowBorder, {
          left: e.clientX - cRect.left,
          top: e.clientY - cRect.top,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const handleMouseLeave = () => {
      if (glowBorder) {
        gsap.to(glowBorder, { opacity: 0, duration: 0.8, overwrite: 'auto' });
      }
    };

    // Only add mouse listeners on desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop) {
      updateBounding();
      window.addEventListener('resize', updateBounding, { passive: true });
      section.addEventListener('mousemove', handleMouseMove, { passive: true });
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      ctx.revert();
      window.removeEventListener('resize', updateBounding);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isInViewport]);

  return (
    <section
      ref={sectionRef}
      className="relative py-48 md:py-72 px-6 overflow-hidden bg-transparent"
      style={SECTION_STYLE}
    >
      {/* Show placeholder until in viewport, then render full content */}
      {isInViewport ? (
        <>
          {/* Dynamic Animated Background Layer */}
          <div ref={bgRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-20">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[1, 2, 3, 4, 5].map((i) => {
                const yPos = 100 + i * 80;
                return (
                  <path
                    key={i}
                    className="cta-data-path"
                    d={`M -100 ${yPos} Q 960 ${yPos + (i % 2 ? 100 : -100)} 2020 ${yPos}`}
                    stroke="url(#pathGrad)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="500 500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_center,#2563eb_1px,transparent_1px)] [background-size:60px_60px] opacity-20" />
            <div className="cta-orb absolute top-0 left-0 w-[60vw] h-[60vw] bg-blue-600/5 rounded-full blur-[150px]" />
            <div className="cta-orb absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div
              ref={containerRef}
              className="relative p-12 md:p-32 rounded-[3.5rem] lg:rounded-[7rem] bg-transparent border border-gray-100/20 dark:border-white/5 backdrop-blur-2xl overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)]"
            >
              {/* Animated Border Glow Follower */}
              <div ref={glowBorderRef} className="absolute w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0" />

              {/* HUD Decorative Corners */}
              <div className="cta-hud-corner absolute top-10 left-10 w-24 h-24 pointer-events-none opacity-20 dark:opacity-40">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-600 fill-none stroke-2">
                  <path d="M10,40 L10,10 L40,10" />
                  <circle cx="10" cy="10" r="4" fill="currentColor" />
                </svg>
              </div>
              <div className="cta-hud-corner absolute bottom-10 right-10 w-24 h-24 pointer-events-none opacity-20 dark:opacity-40 rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-600 fill-none stroke-2">
                  <path d="M10,40 L10,10 L40,10" />
                  <circle cx="10" cy="10" r="4" fill="currentColor" />
                </svg>
              </div>

              <div className="cta-hud-line absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
              <div className="cta-hud-line absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

              <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="cta-title text-6xl md:text-8xl lg:text-[11rem] font-heading font-black mb-12 text-gray-900 dark:text-white tracking-tighter leading-[0.85]">
                  <SplitText text="Ready to" className="block" />
                  <SplitText text="Transcend?" isGradient={true} className="block" />
                </h2>

                <p className="cta-desc text-gray-500 dark:text-gray-400 text-xl md:text-3xl font-light mb-20 leading-relaxed max-w-2xl mx-auto">
                  We engineer the <span className="text-gray-900 dark:text-white font-medium">solutions</span> that drives the future. Let's build your enterprise legacy with <span className="text-blue-600 font-medium">unrivaled precision</span>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-14">
                  <div className="cta-btn-wrap group/btn">
                    <Link
                      to="/contact"
                      className="magnetic-area inline-flex px-16 py-8 bg-blue-600 text-white rounded-full font-black text-2xl shadow-4xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-4 overflow-hidden"
                    >
                      <span className="relative z-10">Initiate Project</span>
                      <i className="fa-solid fa-bolt-lightning text-lg group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        // Minimal placeholder while waiting for viewport intersection
        <div className="h-[600px]" aria-hidden="true" />
      )}
    </section>
  );
};

export default React.memo(CTASection);
