
import React, { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { useSEO } from '../hooks/useSEO';

gsap.registerPlugin(ScrollTrigger);

// Feature data
const features = [
  { title: 'Neural POS', icon: 'fa-brain', text: 'Active learning agents that optimize checkout paths.' },
  { title: 'Global Sync', icon: 'fa-globe', text: 'Zero-latency inventory state management across continents.' },
  { title: 'Predictive Analytics', icon: 'fa-chart-line', text: 'Real-time sales forecasting with 92% accuracy.' },
  { title: 'Security Core', icon: 'fa-shield-halved', text: 'Biometric transaction authorization and end-to-end encryption.' },
  { title: 'Offline-First', icon: 'fa-database', text: 'Robust local-state synchronization for intermittent networks.' },
  { title: 'Custom UI', icon: 'fa-wand-magic-sparkles', text: 'Minimalistic interfaces designed for muscle memory.' }
];

// Problem items
const problemItems = [
  'Legacy lag during peak high-frequency transactions',
  'Disconnected inventory data across global storefronts',
  'Zero predictive capability for seasonal fluctuations',
  'Complex user onboarding for non-technical staff'
];

const SalePilotDetail: React.FC = () => {
  useSEO({
    title: 'SalePilot POS | Kytriq Technologies',
    description: 'SalePilot - our flagship intelligent POS system that bridges hardware precision and neural business intelligence. 40% throughput increase, 100% inventory accuracy.',
    keywords: 'SalePilot, POS system, retail management, inventory management, AI POS',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const uiNodesRef = useRef<HTMLDivElement[]>([]);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);

  // Memoized parallax style
  const parallaxStyle = useMemo(() => ({
    backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.12) 1px, transparent 1px)',
    backgroundSize: '50px 50px'
  }), []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cleanupFns: (() => void)[] = [];
    let mm: gsap.MatchMedia | null = null;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        all: "all"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        const baseDuration = prefersReducedMotion ? 0.01 : 1;
        const container = containerRef.current;
        if (!container) return;

        // ===== 1. CINEMATIC HERO ENTRANCE =====
        const heroSection = container.querySelector('.detail-header');
        const heroTitleChars = container.querySelectorAll('.detail-header .letter-reveal');
        const heroDesc = container.querySelector('.header-desc');
        const heroBadge = container.querySelector('.header-badge');
        const backBtn = container.querySelector('.back-btn');
        const decorOrbs = container.querySelectorAll('.decor-orb');

        // Set initial states
        if (heroBadge) gsap.set(heroBadge, { y: 30, opacity: 0, scale: 0.9 });
        if (heroTitleChars.length > 0) {
          gsap.set(heroTitleChars, {
            y: 100,
            opacity: 0,
            rotateX: isDesktop ? -90 : -45,
            scale: 0.8,
            filter: isDesktop ? 'blur(8px)' : 'blur(4px)',
            transformPerspective: 1200
          });
        }
        if (heroDesc) gsap.set(heroDesc, { y: 50, opacity: 0, filter: isDesktop ? 'blur(12px)' : 'blur(6px)' });
        if (backBtn) gsap.set(backBtn, { x: -40, opacity: 0 });
        if (decorOrbs.length > 0) gsap.set(decorOrbs, { scale: 0, opacity: 0 });

        // Hero entrance timeline
        const heroTl = gsap.timeline({ delay: 0.2 });

        if (backBtn) {
          heroTl.to(backBtn, { x: 0, opacity: 1, duration: baseDuration * 0.8, ease: 'power3.out' });
        }

        if (heroBadge) {
          heroTl.to(heroBadge, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: baseDuration * 0.9,
            ease: 'back.out(1.7)'
          }, '-=0.5');
        }

        if (heroTitleChars.length > 0) {
          heroTl.to(heroTitleChars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: baseDuration * 1.4,
            stagger: { amount: prefersReducedMotion ? 0 : 0.6, from: 'start' },
            ease: 'expo.out'
          }, '-=0.6');
        }

        if (heroDesc) {
          heroTl.to(heroDesc, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: baseDuration * 1.2,
            ease: 'power3.out'
          }, '-=0.8');
        }

        // Decorative orbs animation
        if (decorOrbs.length > 0) {
          heroTl.to(decorOrbs, {
            scale: 1,
            opacity: 1,
            duration: baseDuration * 1.5,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.5)'
          }, '-=1');

          // Floating effect for orbs
          decorOrbs.forEach((orb, i) => {
            gsap.to(orb, {
              y: `+=${20 + i * 10}`,
              x: `+=${10 + i * 5}`,
              duration: 4 + i,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          });
        }

        // ===== 2. HERO IMAGE PARALLAX + FLOATING UI =====
        if (heroImgRef.current) {
          const heroImg = heroImgRef.current.querySelector('img');
          const overlayBg = heroImgRef.current.querySelector('.hero-overlay');

          if (heroImg) {
            gsap.fromTo(heroImg,
              { scale: 1.25, y: 0 },
              {
                scale: 1,
                y: -60,
                ease: 'none',
                scrollTrigger: {
                  trigger: heroImgRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5
                }
              }
            );
          }

          // Floating UI elements with staggered entrance
          uiNodesRef.current.forEach((node, i) => {
            if (!node) return;

            gsap.set(node, { y: 80, opacity: 0, scale: 0.9 });

            gsap.to(node, {
              scrollTrigger: {
                trigger: heroImgRef.current,
                start: 'top 70%',
              },
              y: 0,
              opacity: 1,
              scale: 1,
              duration: baseDuration * 1.3,
              delay: 0.4 + (i * 0.25),
              ease: 'power4.out'
            });

            // Continuous floating animation
            gsap.to(node, {
              y: '-=12',
              x: `+=${i % 2 === 0 ? 8 : -8}`,
              rotation: i % 2 === 0 ? 2 : -2,
              duration: 3 + (i * 0.6),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: i * 0.3
            });
          });
        }

        // ===== 3. MULTI-STAGE SECTION REVEALS =====
        const caseSections = container.querySelectorAll<HTMLElement>('.case-section');
        caseSections.forEach((section, sectionIndex) => {
          const title = section.querySelector('.section-title');
          const titleChars = title?.querySelectorAll('.letter-reveal');
          const contents = section.querySelectorAll('.section-content-reveal');
          const sectionLine = section.querySelector('.section-line');

          // Set initial states
          gsap.set(section, { y: 80, opacity: 0 });
          if (sectionLine) gsap.set(sectionLine, { scaleX: 0, transformOrigin: 'left' });
          if (titleChars && titleChars.length > 0) {
            gsap.set(titleChars, { y: 40, opacity: 0, rotateX: -60 });
          }
          if (contents.length > 0) gsap.set(contents, { y: 40, opacity: 0 });

          const sectionTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: isDesktop ? 'top 80%' : 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });

          sectionTl.to(section, {
            y: 0,
            opacity: 1,
            duration: baseDuration * 1.2,
            ease: 'power3.out'
          });

          if (sectionLine) {
            sectionTl.to(sectionLine, {
              scaleX: 1,
              duration: baseDuration * 0.8,
              ease: 'power2.inOut'
            }, '-=0.8');
          }

          if (titleChars && titleChars.length > 0) {
            sectionTl.to(titleChars, {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: baseDuration * 0.9,
              stagger: prefersReducedMotion ? 0 : 0.02,
              ease: 'power3.out'
            }, '-=0.6');
          }

          if (contents.length > 0) {
            sectionTl.to(contents, {
              y: 0,
              opacity: 1,
              duration: baseDuration,
              stagger: 0.12,
              ease: 'power3.out'
            }, '-=0.5');
          }
        });

        // ===== 4. FEATURE CARDS WITH 3D TILT =====
        featureCardsRef.current.forEach((card, i) => {
          if (!card) return;

          gsap.set(card, { y: 60, opacity: 0, scale: 0.92, rotateX: isDesktop ? 10 : 0 });

          gsap.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: baseDuration * 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true
            },
            delay: isDesktop ? (i % 3) * 0.1 : 0
          });

          // 3D tilt on desktop
          if (isDesktop && !prefersReducedMotion) {
            const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
            const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
            let rect: DOMRect | null = null;

            const handleEnter = () => {
              rect = card.getBoundingClientRect();
              gsap.to(card, {
                scale: 1.03,
                boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.25)',
                borderColor: 'rgba(37, 99, 235, 0.3)',
                duration: 0.4
              });
              gsap.to(card.querySelector('.feature-icon'), {
                scale: 1.15,
                rotation: 8,
                duration: 0.4
              });
            };

            const handleLeave = () => {
              gsap.to(card, {
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                boxShadow: 'none',
                borderColor: 'rgba(229, 231, 235, 0.5)',
                duration: 0.5
              });
              gsap.to(card.querySelector('.feature-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.4
              });
              rect = null;
            };

            const handleMove = (e: MouseEvent) => {
              if (!rect) return;
              const x = (e.clientX - rect.left - rect.width / 2) / 15;
              const y = (e.clientY - rect.top - rect.height / 2) / 15;
              rotateYTo(x);
              rotateXTo(-y);
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

        // ===== 5. IMPACT STATS WITH PROGRESS RINGS =====
        const statItems = container.querySelectorAll<HTMLElement>('.impact-stat-container');
        statItems.forEach((stat) => {
          const valueEl = stat.querySelector('.impact-stat');
          const ringEl = stat.querySelector<SVGCircleElement>('.progress-ring-circle');
          const value = parseInt(valueEl?.getAttribute('data-value') || '0');

          // Animate number
          if (valueEl) {
            gsap.fromTo(valueEl,
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
                },
                onUpdate: function () {
                  // Pulse effect during counting
                  if (!prefersReducedMotion && this.ratio > 0.1 && this.ratio < 0.9) {
                    gsap.to(stat, {
                      scale: 1 + (Math.sin(this.ratio * Math.PI) * 0.03),
                      duration: 0.1,
                      overwrite: 'auto'
                    });
                  }
                },
                onComplete: () => {
                  gsap.to(stat, { scale: 1, duration: 0.3 });
                }
              }
            );
          }

          // Animate progress ring
          if (ringEl) {
            const circumference = 2 * Math.PI * 45;
            const percentage = value / 100;
            ringEl.style.strokeDasharray = `${circumference}`;
            ringEl.style.strokeDashoffset = `${circumference}`;

            gsap.to(ringEl, {
              strokeDashoffset: circumference * (1 - percentage),
              duration: prefersReducedMotion ? 0.1 : 2.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                once: true
              }
            });
          }
        });

        // ===== 6. LIQUID CIRCLE EFFECTS =====
        const liquidCircles = container.querySelectorAll('.liquid-circle');
        liquidCircles.forEach((circle, i) => {
          gsap.to(circle, {
            rotation: 360,
            duration: 25 + (i * 5),
            repeat: -1,
            ease: 'none'
          });

          gsap.to(circle, {
            scale: 1 + (i * 0.1),
            duration: 4 + i,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });

        // ===== 7. MAGNETIC CTA BUTTON =====
        if (ctaButtonRef.current && isDesktop && !prefersReducedMotion) {
          const btn = ctaButtonRef.current;
          const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
          let rect: DOMRect | null = null;

          const handleEnter = () => {
            rect = btn.getBoundingClientRect();
            gsap.to(btn, {
              scale: 1.05,
              boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.5)',
              duration: 0.4
            });
          };

          const handleLeave = () => {
            gsap.to(btn, { scale: 1, x: 0, y: 0, boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.3)', duration: 0.5 });
            rect = null;
          };

          const handleMove = (e: MouseEvent) => {
            if (!rect) return;
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            xTo(x);
            yTo(y);
          };

          btn.addEventListener('mouseenter', handleEnter);
          btn.addEventListener('mouseleave', handleLeave);
          btn.addEventListener('mousemove', handleMove);
          cleanupFns.push(() => {
            btn.removeEventListener('mouseenter', handleEnter);
            btn.removeEventListener('mouseleave', handleLeave);
            btn.removeEventListener('mousemove', handleMove);
          });
        }

        // ===== 8. CTA SECTION REVEAL =====
        const ctaSection = container.querySelector('.cta-section');
        if (ctaSection) {
          const ctaTitle = ctaSection.querySelector('h2');
          const ctaTitleChars = ctaTitle?.querySelectorAll('.letter-reveal');

          if (ctaTitleChars && ctaTitleChars.length > 0) {
            gsap.set(ctaTitleChars, { y: 60, opacity: 0, rotateX: -45 });

            gsap.to(ctaTitleChars, {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: baseDuration * 1.2,
              stagger: prefersReducedMotion ? 0 : 0.02,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: ctaSection,
                start: 'top 80%',
                once: true
              }
            });
          }
        }

        // ===== 9. PARALLAX BACKGROUND =====
        const parallaxBg = container.querySelector('.parallax-grid');
        if (parallaxBg && isDesktop && !prefersReducedMotion) {
          gsap.to(parallaxBg, {
            y: 150,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 2
            }
          });
        }

      });
    }, containerRef);

    // Refresh ScrollTrigger after layout settles
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
      className="min-h-screen pt-32 md:pt-48 bg-white dark:bg-brand-dark transition-colors duration-500 overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Parallax Grid Background */}
      <div
        className="parallax-grid fixed inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none z-0"
        style={parallaxStyle}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Decorative Gradient Orbs */}
        <div className="decor-orb absolute top-0 -left-32 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] -z-10" aria-hidden="true" />
        <div className="decor-orb absolute top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10" aria-hidden="true" />
        <div className="decor-orb absolute top-[60vh] left-1/4 w-64 h-64 bg-pink-500/8 rounded-full blur-[80px] -z-10" aria-hidden="true" />

        {/* Back Link */}
        <Link to="/projects" className="back-btn group inline-flex items-center space-x-3 text-gray-400 hover:text-blue-600 mb-16 transition-all duration-300">
          <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-600 group-hover:-translate-x-2 group-hover:bg-blue-600/5 transition-all duration-300">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em]">Back to Projects</span>
        </Link>

        {/* Header */}
        <header className="detail-header mb-24 lg:mb-40" style={{ transformStyle: 'preserve-3d' }}>
          <div className="header-badge inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-600/15 dark:border-blue-500/20 rounded-full mb-10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">Flagship Intelligent System</span>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-heading font-black tracking-tighter leading-[0.85] text-gray-900 dark:text-white mb-14">
            <SplitText text="SalePilot" className="block" />
            <span className="gradient-text"><SplitText text="Future POS." /></span>
          </h1>
          <p className="header-desc text-2xl md:text-4xl text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-5xl">
            Designing a central nervous system for retail. SalePilot bridges the gap between hardware precision and neural business intelligence.
          </p>
        </header>

        {/* Hero Section with Floating UI */}
        <section ref={heroImgRef} className="case-section mb-40 relative group">
          <div className="aspect-[21/9] rounded-[3rem] lg:rounded-[5rem] overflow-hidden border border-gray-100 dark:border-gray-800/50 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1.5s]"
              alt="SalePilot Terminal"
            />
            <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/30 to-transparent"></div>

            {/* Floating UI Elements */}
            <div
              ref={el => { if (el) uiNodesRef.current[0] = el; }}
              className="absolute top-10 right-10 md:top-16 md:right-16 p-5 md:p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl hidden lg:block shadow-xl"
            >
              <div className="text-[9px] md:text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Live Throughput</div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-white">4.2k <span className="text-sm opacity-50">tx/m</span></div>
            </div>

            <div
              ref={el => { if (el) uiNodesRef.current[1] = el; }}
              className="absolute bottom-32 right-32 p-5 md:p-6 bg-gradient-to-br from-blue-600/25 to-indigo-600/25 backdrop-blur-xl border border-blue-400/25 rounded-2xl md:rounded-3xl hidden lg:block shadow-xl"
            >
              <div className="text-[9px] md:text-[10px] text-blue-300 font-black uppercase tracking-widest mb-2">Neural Prediction</div>
              <div className="text-lg md:text-xl font-heading font-bold text-white">Inventory: +12% Efficiency</div>
            </div>

            <div className="absolute bottom-12 left-12 md:bottom-16 md:left-16 text-white z-10">
              <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.7em] mb-4 md:mb-6 opacity-60">System Core v2.4 // Cognitive Core</div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tighter">SalePilot Engine.</div>
            </div>
          </div>
        </section>

        {/* Grid: Overview & Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 mb-48">
          <section className="case-section">
            <div className="flex items-center space-x-5 mb-10">
              <div className="section-line h-px w-16 bg-blue-600"></div>
              <h2 className="section-title text-[11px] font-black text-blue-600 uppercase tracking-[0.6em]">
                <SplitText text="THE MISSION" />
              </h2>
            </div>
            <p className="section-content-reveal text-2xl md:text-3xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              SalePilot was conceived to solve the disconnect between physical transactions and digital foresight. We engineered a system that doesn't just record sales but anticipates them.
            </p>
          </section>

          <section className="case-section">
            <div className="flex items-center space-x-5 mb-10">
              <div className="section-line h-px w-16 bg-pink-500"></div>
              <h2 className="section-title text-[11px] font-black text-pink-500 uppercase tracking-[0.6em]">
                <SplitText text="THE FRICTION" />
              </h2>
            </div>
            <ul className="problem-list space-y-8">
              {problemItems.map((item, i) => (
                <li key={i} className="section-content-reveal flex items-start space-x-5 text-gray-500 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center shrink-0 mt-1 border border-pink-500/20">
                    <i className="fa-solid fa-bolt-lightning text-pink-500 text-sm"></i>
                  </div>
                  <span className="text-xl md:text-2xl font-light">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Architecture Section */}
        <section className="case-section mb-48 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/60 dark:to-gray-950/60 border border-gray-100 dark:border-white/5 rounded-[3rem] lg:rounded-[5rem] p-12 lg:p-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
            <i className="fa-solid fa-microchip text-[35rem] text-blue-600"></i>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-16">
              <div className="section-line h-px w-20 bg-blue-600"></div>
              <h2 className="section-title text-[11px] font-black text-blue-600 uppercase tracking-[0.8em]">
                <SplitText text="INTELLIGENT LAYERS" />
              </h2>
            </div>
            <h3 className="section-content-reveal text-4xl md:text-7xl lg:text-8xl font-heading font-black text-gray-900 dark:text-white mb-20 tracking-tighter max-w-5xl leading-[0.9]">
              Built for <br /> <span className="gradient-text">Absolute Scale.</span>
            </h3>

            <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {features.map((feat, i) => (
                <div
                  key={i}
                  ref={el => { if (el) featureCardsRef.current[i] = el; }}
                  className="feature-card group p-10 bg-white dark:bg-gray-950/80 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] transition-all duration-500 cursor-default"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="feature-icon w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/25 transition-all duration-300">
                    <i className={`fa-solid ${feat.icon} text-2xl`}></i>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{feat.title}</h4>
                  <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">{feat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcome & Impact */}
        <section className="case-section mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <div>
              <div className="flex items-center space-x-6 mb-12">
                <div className="section-line h-px w-16 bg-green-500"></div>
                <h2 className="section-title text-[11px] font-black text-green-500 uppercase tracking-[0.6em]">
                  <SplitText text="THE IMPACT" />
                </h2>
              </div>
              <h3 className="section-content-reveal text-4xl md:text-6xl lg:text-7xl font-heading font-black text-gray-900 dark:text-white mb-12 tracking-tighter leading-[0.9]">
                Zero Lag. <br /> <span className="text-green-500">Infinite Trust.</span>
              </h3>
              <p className="section-content-reveal text-gray-500 dark:text-gray-400 text-xl md:text-2xl leading-relaxed font-light mb-16 max-w-xl">
                The Result? A 40% increase in checkout throughput and a complete elimination of inventory discrepancies within 6 months of deployment.
              </p>

              {/* Stats with Progress Rings */}
              <div className="grid grid-cols-2 gap-12 md:gap-16">
                <div className="impact-stat-container relative">
                  <svg className="absolute -top-4 -left-4 w-28 h-28 md:w-32 md:h-32 -z-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="progress-ring-circle"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter font-heading">
                    <span className="impact-stat inline-block" data-value="40">0</span>%
                  </div>
                  <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Throughput Increase</div>
                </div>

                <div className="impact-stat-container relative">
                  <svg className="absolute -top-4 -left-4 w-28 h-28 md:w-32 md:h-32 -z-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="url(#progress-gradient-2)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="progress-ring-circle"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="progress-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter font-heading">
                    <span className="impact-stat inline-block" data-value="100">0</span>%
                  </div>
                  <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory Accuracy</div>
                </div>
              </div>
            </div>

            {/* Reflection Card */}
            <div className="section-content-reveal relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[4rem] lg:rounded-[6rem] flex items-center justify-center p-16 md:p-20 text-center text-white relative overflow-hidden group shadow-2xl shadow-blue-600/20">
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <i className="fa-solid fa-lightbulb text-2xl"></i>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Kytriq Reflection</h4>
                  <p className="text-blue-100/90 font-light text-lg md:text-xl leading-relaxed">
                    SalePilot represents our dedication to building software that behaves like a living organism—constantly observing, learning, and protecting.
                  </p>
                </div>
                {/* Rotating Liquid Effects */}
                <div className="liquid-circle absolute inset-0 bg-white/5 -z-0 scale-[2] blur-[60px] pointer-events-none border-[30px] border-blue-400/10 rounded-full"></div>
                <div className="liquid-circle absolute inset-0 bg-indigo-400/5 -z-0 scale-[1.5] blur-[40px] pointer-events-none rounded-full" style={{ animationDelay: '-5s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-section case-section mb-48 text-center" style={{ transformStyle: 'preserve-3d' }}>
          <h2 className="text-5xl md:text-[8rem] lg:text-[9rem] font-heading font-black mb-16 tracking-tighter text-gray-900 dark:text-white leading-[0.85]">
            <SplitText text="Let's Build your" className="block" /> <br />
            <SplitText isGradient={true} text="Masterpiece." />
          </h2>
          <Link
            ref={ctaButtonRef}
            to="/contact"
            className="inline-block px-16 md:px-20 py-6 md:py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-xl md:text-2xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 active:scale-95"
            style={{ willChange: 'transform' }}
          >
            <span className="flex items-center space-x-3">
              <span>Send Inquiry</span>
              <i className="fa-solid fa-arrow-right text-lg"></i>
            </span>
          </Link>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default SalePilotDetail;
