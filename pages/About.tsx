
import React, { useLayoutEffect, useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useSEO } from '../hooks/useSEO';
import SplitText from '../components/SplitText';

const Footer = React.lazy(() => import('../components/Footer'));

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Philosophy items data
const philosophyItems = [
  {
    title: 'Intelligence Driven',
    desc: 'Every line of code is infused with purpose and predictive logic.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
        <path d="m15.7 10.4-.9.4" />
        <path d="m9.2 13.2-.9.4" />
        <path d="m13.6 15.7-.4-.9" />
        <path d="m10.8 9.2-.4-.9" />
        <path d="m15.7 13.5-.9-.4" />
        <path d="m9.2 10.9-.9-.4" />
        <path d="m10.5 15.7.4-.9" />
        <path d="m13.1 9.2.4-.9" />
      </svg>
    )
  },
  {
    title: 'Zero Friction',
    desc: 'We design for the human experience first, technology second.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    )
  },
  {
    title: 'Global Scale',
    desc: 'Our architectures are built to handle the demands of tomorrow.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    )
  },
  {
    title: 'Radical Trust',
    desc: 'Security and transparency are baked into our DNA.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
];

// Stats data
const stats = [
  { label: 'Active Systems', value: 12, suffix: '+' },
  { label: 'Success Rate', value: 99, suffix: '%' },
  { label: 'Lines of Code', value: 250, suffix: 'k+' },
  { label: 'Uptime Core', value: 99, suffix: '.9%' }
];


const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const motionPathCtxRef = useRef<gsap.Context | null>(null);

  useSEO({
    title: 'About Us | Kytriq Technologies',
    description: 'Learn about Kytriq Technologies - a software development company with the heart of a pioneer and precision of a master engineer. We architect digital life.',
    keywords: 'about Kytriq, software company, AI solutions, digital innovation, tech startup',
  });

  // Memoized styles for parallax layers
  const parallaxStyle = useMemo(() => ({
    backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.15) 1px, transparent 1px)',
    backgroundSize: '60px 60px'
  }), []);


  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cleanupFns: (() => void)[] = [];
    let mm: gsap.MatchMedia | null = null;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        all: "all"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        const baseDuration = prefersReducedMotion ? 0.01 : 1;
        const container = containerRef.current;
        if (!container) return;

        // ===== HERO SECTION - SplitText Animation =====
        const heroSection = container.querySelector('.hero-section');
        const heroLabel = heroSection?.querySelector('.hero-label');
        const heroTitleChars = heroSection?.querySelectorAll('.hero-title .letter-reveal');
        const heroDesc = heroSection?.querySelector('.hero-desc');
        const parallaxBg = container.querySelector('.parallax-bg');

        // Set initial states
        if (heroLabel) gsap.set(heroLabel, { y: 40, opacity: 0 });
        if (heroTitleChars && heroTitleChars.length > 0) {
          gsap.set(heroTitleChars, {
            y: 120,
            opacity: 0,
            rotateX: -90,
            transformPerspective: 1000
          });
        }
        if (heroDesc) gsap.set(heroDesc, { y: 60, opacity: 0, filter: isDesktop ? 'blur(10px)' : 'none' });

        // Hero entrance timeline
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top 80%',
            once: true
          }
        });

        heroTl
          .to(heroLabel, { y: 0, opacity: 1, duration: baseDuration * 0.8, ease: 'power3.out' })
          .to(heroTitleChars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: baseDuration * 1.4,
            stagger: { amount: prefersReducedMotion ? 0 : 0.8, from: 'start' },
            ease: 'expo.out'
          }, '-=0.4')
          .to(heroDesc, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: baseDuration * 1.2
          }, '-=0.6');

        // Parallax background on scroll
        if (parallaxBg && isDesktop && !prefersReducedMotion) {
          gsap.to(parallaxBg, {
            y: 200,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5
            }
          });
        }


        // ===== MISSION & VISION CARDS =====
        const cards = container.querySelectorAll<HTMLElement>('.story-card');
        cards.forEach((card, i) => {
          const inner = card.querySelector('.card-inner');
          const titleChars = card.querySelectorAll('.card-title .letter-reveal');
          const cardText = card.querySelector('.card-text');
          const cardIcon = card.querySelector('.card-icon');

          gsap.set(card, {
            y: 100,
            opacity: 0,
            rotateX: isDesktop ? 15 : 0,
            scale: 0.95
          });
          if (titleChars.length > 0) gsap.set(titleChars, { y: 40, opacity: 0 });
          if (cardText) gsap.set(cardText, { y: 30, opacity: 0 });
          if (cardIcon) gsap.set(cardIcon, { scale: 0, rotation: -45 });

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: isDesktop ? 'top 75%' : 'top 85%',
              once: true
            }
          });

          cardTl
            .to(card, {
              y: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              duration: baseDuration * 1.4,
              ease: 'power3.out'
            }, i * 0.15)
            .to(cardIcon, { scale: 1, rotation: 0, duration: baseDuration * 0.6, ease: 'back.out(2)' }, '-=0.8')
            .to(titleChars, {
              y: 0,
              opacity: 1,
              duration: baseDuration * 0.8,
              stagger: prefersReducedMotion ? 0 : 0.03,
              ease: 'power2.out'
            }, '-=0.6')
            .to(cardText, { y: 0, opacity: 1, duration: baseDuration * 0.8 }, '-=0.5');

          // 3D tilt effect on desktop
          if (isDesktop && !prefersReducedMotion) {
            const xTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
            const yTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
            let rect: DOMRect | null = null;

            const handleEnter = () => {
              rect = card.getBoundingClientRect();
              gsap.to(card, { scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', duration: 0.4 });
            };
            const handleLeave = () => {
              gsap.to(card, { scale: 1, rotateX: 0, rotateY: 0, boxShadow: 'none', duration: 0.5 });
              rect = null;
            };
            const handleMove = (e: MouseEvent) => {
              if (!rect) return;
              const x = (e.clientX - rect.left - rect.width / 2) / 20;
              const y = (e.clientY - rect.top - rect.height / 2) / 20;
              xTo(x);
              yTo(-y);
            };

            card.addEventListener('mouseenter', handleEnter);
            card.addEventListener('mouseleave', handleLeave);
            card.addEventListener('mousemove', handleMove as EventListener);
            cleanupFns.push(() => {
              card.removeEventListener('mouseenter', handleEnter);
              card.removeEventListener('mouseleave', handleLeave);
              card.removeEventListener('mousemove', handleMove as EventListener);
            });
          }
        });

        // ===== PHILOSOPHY SECTION =====
        const philoSection = container.querySelector('.philosophy-section');
        const philoHeader = philoSection?.querySelector('.section-header');
        const philoTitleChars = philoSection?.querySelectorAll('.section-title .letter-reveal');
        const philoCards = container.querySelectorAll<HTMLElement>('.philosophy-card');

        if (philoHeader) gsap.set(philoHeader, { y: 50, opacity: 0 });
        if (philoTitleChars && philoTitleChars.length > 0) {
          gsap.set(philoTitleChars, { y: 60, opacity: 0, rotateX: -60 });
        }

        const philoTl = gsap.timeline({
          scrollTrigger: {
            trigger: philoSection,
            start: 'top 75%',
            once: true
          }
        });

        philoTl
          .to(philoHeader, { y: 0, opacity: 1, duration: baseDuration * 0.8 })
          .to(philoTitleChars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: baseDuration * 1.2,
            stagger: prefersReducedMotion ? 0 : 0.04,
            ease: 'expo.out'
          }, '-=0.5');

        philoCards.forEach((card, i) => {
          const icon = card.querySelector('.philosophy-icon');
          gsap.set(card, { y: 60, opacity: 0, scale: 0.9 });

          gsap.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: baseDuration * 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: isDesktop ? 'top 85%' : 'top 92%',
              once: true
            },
            delay: isDesktop ? i * 0.1 : 0
          });

          if (isDesktop && !prefersReducedMotion) {
            const handleEnter = () => {
              gsap.to(card, { y: -8, scale: 1.03, duration: 0.3 });
              if (icon) gsap.to(icon, { scale: 1.15, rotation: 5, duration: 0.3 });
            };
            const handleLeave = () => {
              gsap.to(card, { y: 0, scale: 1, duration: 0.3 });
              if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3 });
            };
            card.addEventListener('mouseenter', handleEnter);
            card.addEventListener('mouseleave', handleLeave);
            cleanupFns.push(() => {
              card.removeEventListener('mouseenter', handleEnter);
              card.removeEventListener('mouseleave', handleLeave);
            });
          }
        });

        // ===== STATS SECTION =====
        const statsSection = container.querySelector('.stats-section');
        const statsHeader = statsSection?.querySelector('.section-header');
        const statsTitleChars = statsSection?.querySelectorAll('.section-title .letter-reveal');
        const statItems = container.querySelectorAll<HTMLElement>('.stat-item');
        const statNumbers = container.querySelectorAll<HTMLElement>('.stat-number');

        if (statsHeader) gsap.set(statsHeader, { y: 40, opacity: 0 });
        if (statsTitleChars && statsTitleChars.length > 0) {
          gsap.set(statsTitleChars, { y: 50, opacity: 0 });
        }
        statItems.forEach(item => gsap.set(item, { y: 50, opacity: 0, scale: 0.85 }));

        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: statsSection,
            start: 'top 75%',
            once: true
          }
        });

        statsTl
          .to(statsHeader, { y: 0, opacity: 1, duration: baseDuration * 0.8 })
          .to(statsTitleChars, {
            y: 0,
            opacity: 1,
            duration: baseDuration,
            stagger: prefersReducedMotion ? 0 : 0.05,
            ease: 'power2.out'
          }, '-=0.5');

        statItems.forEach((item, i) => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: baseDuration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true
            },
            delay: isDesktop ? i * 0.1 : 0
          });

          if (isDesktop && !prefersReducedMotion) {
            const handleEnter = () => gsap.to(item, { scale: 1.1, duration: 0.3 });
            const handleLeave = () => gsap.to(item, { scale: 1, duration: 0.3 });
            item.addEventListener('mouseenter', handleEnter);
            item.addEventListener('mouseleave', handleLeave);
            cleanupFns.push(() => {
              item.removeEventListener('mouseenter', handleEnter);
              item.removeEventListener('mouseleave', handleLeave);
            });
          }
        });

        // Counter animation
        statNumbers.forEach((stat) => {
          const value = parseInt(stat.getAttribute('data-value') || '0', 10);
          gsap.fromTo(stat,
            { innerText: 0 },
            {
              innerText: value,
              duration: prefersReducedMotion ? 0.1 : 2.5,
              snap: { innerText: 1 },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                once: true
              }
            }
          );
        });

        // ===== IMAGE SECTION - MASK REVEAL =====
        const imgReveal = container.querySelector('.img-reveal');
        if (imgReveal) {
          gsap.set(imgReveal, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            scale: 1.15
          });
          gsap.to(imgReveal, {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            scale: 1,
            duration: baseDuration * 1.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: imgReveal,
              start: isDesktop ? 'top 70%' : 'top 85%',
              once: true
            }
          });
        }

        // ===== DECORATIVE ELEMENTS =====
        const decorElements = container.querySelectorAll<HTMLElement>('.decor-element');
        decorElements.forEach((el) => {
          gsap.set(el, { scale: 0, opacity: 0 });
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration: baseDuration * 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
        });
      });
    }, containerRef);

    const timerId = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      cleanupFns.forEach(fn => fn());
      cleanupFns.length = 0;
      if (mm) mm.revert();
      ctx.revert();
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300 overflow-x-hidden no-scrollbar"
      style={{ perspective: '2000px' }}
    >
      {/* Parallax Background */}
      <div
        className="parallax-bg fixed inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none z-0"
        style={parallaxStyle}
        aria-hidden="true"
      />


      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="hero-section relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="hero-label inline-block text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-10">
            01 // Who We Are
          </span>

          <h1 className="hero-title text-5xl sm:text-6xl md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-heading font-black leading-[0.85] tracking-tighter mb-8 md:mb-12 text-gray-900 dark:text-white">
            <SplitText text="ARCHITECTING" className="block" />
            <span className="gradient-text">
              <SplitText text="DIGITAL LIFE." isGradient={true} />
            </span>
          </h1>

          <p className="hero-desc text-gray-600 dark:text-gray-400 text-lg md:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto">
            A startup with the <strong className="text-gray-900 dark:text-white font-semibold">heart of a pioneer</strong> and the <strong className="text-gray-900 dark:text-white font-semibold">precision of a master engineer</strong>.
          </p>
        </div>

        {/* Decorative gradient orbs */}
        <div className="decor-element absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" aria-hidden="true" />
        <div className="decor-element absolute bottom-1/4 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -z-10" aria-hidden="true" />
      </section>


      {/* ===== MISSION & VISION CARDS ===== */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16" style={{ perspective: '1500px' }}>

            {/* Mission Card */}
            <div className="story-card will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-14 min-h-[400px] md:min-h-[500px]">
                {/* Glows */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-[0.4em]">Our Mission</span>
                    <div className="card-icon w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="card-title text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                    <SplitText text="Empowering Through" className="block" />
                    <SplitText text="Intelligent Software" className="block" />
                  </h3>

                  <p className="card-text text-blue-100/90 text-base md:text-lg leading-relaxed mt-auto">
                    We transform bold ideas into powerful digital realities. By combining cutting-edge AI with human-centered design, we build software that thinks, adapts, and grows.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="story-card will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 p-8 md:p-14 min-h-[400px] md:min-h-[500px]">
                {/* Glows */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Our Vision</span>
                    <div className="card-icon w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="card-title text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    <SplitText text="Technology For" className="block" />
                    <span className="gradient-text"><SplitText text="Everyone" isGradient={true} /></span>
                  </h3>

                  <p className="card-text text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mt-auto">
                    We envision a future where intelligent technology isn't exclusive to giants. Every entrepreneur and dreamer deserves tools that amplify their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY SECTION ===== */}
      <section className="philosophy-section py-20 md:py-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Image */}
            <div className="img-reveal order-2 lg:order-1 relative overflow-hidden rounded-[2rem] md:rounded-[4rem]">
              <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-900/30 p-1.5 md:p-2.5 rounded-[2rem] md:rounded-[4rem] border border-gray-200/50 dark:border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000"
                  srcSet="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600 600w, https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000 1000w"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Team collaboration and innovation"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[1.6rem] md:rounded-[3.3rem] grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="decor-element absolute -bottom-12 -left-12 w-56 md:w-72 h-56 md:h-72 bg-blue-600/15 rounded-full blur-[80px] -z-10" aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-10">
              <div>
                <span className="section-header text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] mb-4 block">
                  03 // Philosophy
                </span>
                <h2 className="section-title text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
                  <SplitText text="Software That" className="block" />
                  <span className="gradient-text"><SplitText text="Feels Alive" isGradient={true} /></span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl leading-relaxed">
                  We believe software is a living entity. It shouldn't just function—it should evolve. We bridge human ambition and technology by building systems that feel human and act intelligent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {philosophyItems.map((item, i) => (
                  <div
                    key={i}
                    className="philosophy-card group p-5 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800 hover:border-blue-500/30 transition-all duration-300 cursor-default"
                  >
                    <div className="philosophy-icon w-11 h-11 md:w-13 md:h-13 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4 transition-all duration-300">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="stats-section py-20 md:py-32 px-4 md:px-8 border-y border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <span className="section-header text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] mb-4 block">
              04 // By The Numbers
            </span>
            <h2 className="section-title text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white">
              <SplitText text="Our Impact" />
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item group cursor-default">
                <div className="flex items-center justify-center text-4xl md:text-7xl lg:text-8xl font-heading font-black text-gray-900 dark:text-white mb-3 md:mb-5 transition-colors duration-300">
                  <span className="stat-number" data-value={stat.value}>0</span>
                  <span className="text-blue-500">{stat.suffix}</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.25em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <React.Suspense fallback={<div className="h-20" />}>
        <Footer />
      </React.Suspense>
    </div>
  );
};

export default About;
