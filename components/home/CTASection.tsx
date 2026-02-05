
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

gsap.registerPlugin(ScrollTrigger);

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const glowBorderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context((self) => {
      // 1. Background "Data Stream" Animation
      const paths = self.selector?.('.cta-data-path');
      gsap.fromTo(paths,
        { strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 10, repeat: -1, ease: 'none', stagger: 2 }
      );

      // 2. HUD Element continuous rotation
      gsap.to('.cta-hud-corner', {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center'
      });

      // 3. Entrance Sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.from('.cta-hud-line', {
        scaleX: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.inOut'
      })
        .from('.cta-hud-corner', {
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(2)'
        }, '-=1.2');

      const titleChars = self.selector?.('.cta-title .letter-reveal');
      if (titleChars) {
        tl.from(titleChars, {
          y: 60,
          opacity: 0,
          rotateX: -90,
          filter: 'blur(15px)',
          stagger: { amount: 0.6, from: 'center' },
          duration: 1.4,
          ease: 'power4.out'
        }, '-=0.8');
      }

      tl.from('.cta-desc', {
        y: 30,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.2,
        ease: 'power3.out'
      }, '-=1.0')
        .from('.cta-btn-wrap', {
          y: 40,
          opacity: 0,
          scale: 0.9,
          stagger: 0.2,
          duration: 1.2,
          ease: 'elastic.out(1, 0.6)'
        }, '-=0.8');

      // 4. Mouse Interactivity: Parallax and Cursor Tracking Border
      const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current || !containerRef.current) return;
        const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
        const xPercent = (e.clientX - left) / width - 0.5;
        const yPercent = (e.clientY - top) / height - 0.5;

        // Background Parallax
        gsap.to(bgRef.current, {
          x: xPercent * 50,
          y: yPercent * 50,
          rotation: xPercent * 5,
          duration: 2,
          ease: 'power2.out'
        });

        // Glowing border tracking
        const cRect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - cRect.left;
        const mouseY = e.clientY - cRect.top;

        gsap.to(glowBorderRef.current, {
          left: mouseX,
          top: mouseY,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(glowBorderRef.current, { opacity: 0, duration: 1 });
      };

      sectionRef.current.addEventListener('mousemove', handleMouseMove);
      sectionRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        sectionRef.current?.removeEventListener('mousemove', handleMouseMove);
        sectionRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-48 md:py-72 px-6 overflow-hidden bg-transparent"
      style={{ perspective: '2000px' }}
    >
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
        <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_center,#2563eb_1px,transparent_1px)] [background-size:60px_60px] opacity-20"></div>
        <div className="cta-orb absolute top-0 left-0 w-[60vw] h-[60vw] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="cta-orb absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={containerRef}
          className="relative p-12 md:p-32 rounded-[3.5rem] lg:rounded-[7rem] bg-gray-50/10 dark:bg-white/[0.01] border border-gray-100/20 dark:border-white/5 backdrop-blur-2xl overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)]"
        >
          {/* Animated Border Glow Follower */}
          <div ref={glowBorderRef} className="absolute w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0"></div>

          {/* HUD Decorative Corners - Enhanced with SVG Details */}
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

          <div className="cta-hud-line absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent"></div>
          <div className="cta-hud-line absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-12 inline-flex items-center space-x-4 px-6 py-2 bg-blue-600/5 border border-blue-600/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600">Digital Evolution</span>
            </div>

            <h2 className="cta-title text-6xl md:text-8xl lg:text-[11rem] font-heading font-black mb-12 text-gray-900 dark:text-white tracking-tighter leading-[0.85]">
              <SplitText text="Ready to" className="block" />
              <SplitText text="Transcend?" isGradient={true} className="block" />
            </h2>

            <p className="cta-desc text-gray-500 dark:text-gray-400 text-xl md:text-3xl font-light mb-20 leading-relaxed max-w-2xl mx-auto">
              We engineer the <span className="text-gray-900 dark:text-white font-medium">intelligence</span> that drives the future. Let’s build your enterprise legacy with <span className="text-blue-600 font-medium">unrivaled precision</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-14">
              <div className="cta-btn-wrap group/btn">
                <Link
                  to="/contact"
                  className="magnetic-area inline-flex px-16 py-8 bg-blue-600 text-white rounded-full font-black text-2xl shadow-4xl shadow-blue-600/30 transition-all duration-700 hover:scale-105 active:scale-95 flex items-center space-x-4 overflow-hidden"
                >
                  <span className="relative z-10">Initiate Project</span>
                  <i className="fa-solid fa-bolt-lightning text-lg group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500"></i>
                </Link>
              </div>

              <div className="cta-btn-wrap">
                <Link
                  to="/services"
                  className="px-12 py-6 border-b border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-600 transition-all text-lg font-bold tracking-widest uppercase"
                >
                  Capabilities
                </Link>
              </div>
            </div>
          </div>

          {/* Background Decorative Tech Text */}
          <div className="absolute -bottom-12 -left-12 text-[15rem] font-black opacity-[0.03] dark:opacity-[0.01] pointer-events-none select-none font-heading italic tracking-tighter">
            EST. 2024
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
