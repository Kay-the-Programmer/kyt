
import React, { useLayoutEffect, useRef, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';

const Footer = React.lazy(() => import('../components/Footer'));

gsap.registerPlugin(ScrollTrigger);

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

const stats = [
  { label: 'Active Systems', value: 12, suffix: '+' },
  { label: 'Success Rate', value: 99, suffix: '%' },
  { label: 'Lines of Code', value: 250, suffix: 'k+' },
  { label: 'Uptime Core', value: 99, suffix: '.9%' }
];

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: 'About Us | Kytriq Technologies',
    description: 'Learn about Kytriq Technologies - a software development company with the heart of a pioneer and precision of a master engineer. We architect digital life.',
    keywords: 'about Kytriq, software company, AI solutions, digital innovation, tech startup',
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanupFns: (() => void)[] = [];
    const mm = gsap.matchMedia();

    mm.add({
      // Desktop specific animations
      isDesktop: "(min-width: 769px)",
      // Mobile specific animations
      isMobile: "(max-width: 768px)",
      // Global animations
      all: "all"
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };
      const baseDuration = prefersReducedMotion ? 0.01 : 1;
      const baseStagger = prefersReducedMotion ? 0 : 0.1;

      const container = containerRef.current;
      if (!container) return;

      // Cache all DOM elements
      const headerLabel = container.querySelector('.header-label');
      const headerTitle = container.querySelector('.header-title');
      const headerDesc = container.querySelector('.header-desc');
      const missionCard = container.querySelector('.mission-card');
      const visionCard = container.querySelector('.vision-card');
      const missionIcon = container.querySelector('.mission-icon');
      const visionIcon = container.querySelector('.vision-icon');
      const imgContainer = container.querySelector('.img-reveal');
      const philosophyHeader = container.querySelector('.philosophy-header');
      const philosophyTitle = container.querySelector('.philosophy-title');
      const philosophyDesc = container.querySelector('.philosophy-desc');
      const philosophyCards = container.querySelectorAll<HTMLElement>('.philosophy-card');
      const statsHeader = container.querySelector('.stats-header');
      const statItems = container.querySelectorAll<HTMLElement>('.stat-item');
      const statNumbers = container.querySelectorAll<HTMLElement>('.stat-number');
      const decorElements = container.querySelectorAll<HTMLElement>('.decor-element');

      // Helper to execute GSAP only if targets exist
      const safeAnimate = (method: 'set' | 'to' | 'from' | 'fromTo', targets: any, vars: gsap.TweenVars, timeline?: gsap.core.Timeline, position?: string | number, fromVars?: gsap.TweenVars) => {
        const validTargets = Array.isArray(targets) ? targets.filter(t => t !== null && t !== undefined) : (targets ? [targets] : []);
        if (validTargets.length === 0) return;

        if (timeline) {
          if (method === 'to') timeline.to(validTargets, vars, position);
          else if (method === 'from') timeline.from(validTargets, vars, position);
          else if (method === 'set') timeline.set(validTargets, vars, position);
          else if (method === 'fromTo') timeline.fromTo(validTargets, fromVars || {}, vars, position);
        } else {
          if (method === 'set') gsap.set(validTargets, vars);
          else if (method === 'to') gsap.to(validTargets, vars);
          else if (method === 'from') gsap.from(validTargets, vars);
          else if (method === 'fromTo') gsap.fromTo(validTargets, fromVars || {}, vars);
        }
      };

      // ===== SET INITIAL STATES =====
      safeAnimate('set', [headerLabel, headerTitle, headerDesc], {
        y: 80,
        opacity: 0,
        filter: prefersReducedMotion ? 'none' : 'blur(10px)',
        rotation: prefersReducedMotion ? 0 : -2
      });

      safeAnimate('set', [missionCard, visionCard], {
        y: 100,
        opacity: 0,
        rotateX: isDesktop ? 15 : 0,
        scale: 0.95,
        filter: isDesktop && !prefersReducedMotion ? 'blur(8px)' : 'none'
      });

      safeAnimate('set', [missionIcon, visionIcon], { scale: 0, rotation: -45, opacity: 0 });
      safeAnimate('set', imgContainer, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1, filter: isDesktop ? 'blur(5px)' : 'none' });
      safeAnimate('set', [philosophyHeader, philosophyTitle, philosophyDesc], { y: 50, opacity: 0, filter: isDesktop ? 'blur(5px)' : 'none' });
      safeAnimate('set', Array.from(philosophyCards), { y: 60, opacity: 0, scale: 0.9, filter: isDesktop ? 'blur(5px)' : 'none' });
      safeAnimate('set', statsHeader, { y: 40, opacity: 0 });
      safeAnimate('set', Array.from(statItems), { y: 50, opacity: 0, scale: 0.85 });
      safeAnimate('set', Array.from(decorElements), { scale: 0, opacity: 0, filter: isDesktop ? 'blur(20px)' : 'none' });

      // ===== HERO ENTRANCE TIMELINE =====
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-header',
          start: isDesktop ? 'top 85%' : 'top 95%',
          once: true
        },
        defaults: { ease: 'expo.out', force3D: true }
      });

      safeAnimate('to', headerLabel, { y: 0, opacity: 1, filter: 'blur(0px)', rotation: 0, duration: baseDuration * 1.2 }, heroTl);
      safeAnimate('to', headerTitle, { y: 0, opacity: 1, filter: 'blur(0px)', rotation: 0, duration: baseDuration * 1.4 }, heroTl, '-=0.9');
      safeAnimate('to', headerDesc, { y: 0, opacity: 1, filter: 'blur(0px)', rotation: 0, duration: baseDuration * 1.2 }, heroTl, '-=0.8');

      // ===== CARDS REVEAL =====

      [missionCard, visionCard].forEach((card, i) => {
        if (!card) return;
        const icon = card.querySelector('.mission-icon, .vision-icon');
        const label = card.querySelector('.mission-label, .vision-label');
        const title = card.querySelector('.mission-title, .vision-title');
        const text = card.querySelector('.mission-text, .vision-text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: isDesktop ? 'top 80%' : 'top 90%',
            once: true
          }
        });

        safeAnimate('to', card, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: baseDuration * 1.4,
          ease: 'power3.out',
        }, tl, isDesktop ? i * 0.15 : 0);

        safeAnimate('to', icon, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: baseDuration * 0.8,
          ease: 'back.out(2)'
        }, tl, '-=0.6');
        safeAnimate('to', label, { x: 0, opacity: 1, duration: baseDuration * 0.6 }, tl, '-=0.6');
        safeAnimate('to', title, { y: 0, opacity: 1, duration: baseDuration * 0.8 }, tl, '-=0.4');
        safeAnimate('to', text, { y: 0, opacity: 1, duration: baseDuration * 0.8 }, tl, '-=0.5');

        // Desktop Only Interactions
        if (isDesktop && !prefersReducedMotion) {
          const xTo = gsap.quickTo(card, "rotateY", { duration: 0.3, ease: "power2.out" });
          const yTo = gsap.quickTo(card, "rotateX", { duration: 0.3, ease: "power2.out" });

          let rect: DOMRect | null = null;
          const updateRect = () => { rect = card.getBoundingClientRect(); };

          const handleMouseEnter = () => {
            updateRect();
            gsap.to(card, { scale: 1.02, duration: 0.4, ease: 'power2.out' });
            const inner = card.querySelector('.card-inner');
            if (inner) gsap.to(inner, { y: -5, duration: 0.4, ease: 'power2.out' });
          };

          const handleMouseLeave = () => {
            gsap.to(card, { scale: 1, duration: 0.5, ease: 'power2.out' });
            xTo(0);
            yTo(0);
            const inner = card.querySelector('.card-inner');
            if (inner) gsap.to(inner, { y: 0, duration: 0.4, ease: 'power2.out' });
            rect = null;
          };

          const handleMouseMove = (e: MouseEvent) => {
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            yTo(rotateX);
            xTo(rotateY);
          };

          card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
          card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
          card.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
          window.addEventListener('scroll', updateRect, { passive: true });

          cleanupFns.push(() => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeEventListener('mousemove', handleMouseMove as EventListener);
            window.removeEventListener('scroll', updateRect);
          });
        }
      });

      // ===== IMAGE REVEAL =====
      gsap.to(imgContainer, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        filter: 'blur(0px)',
        duration: baseDuration * 2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: imgContainer,
          start: isDesktop ? 'top 80%' : 'top 95%',
          once: true
        }
      });

      // ===== PHILOSOPHY SECTION =====
      const philoTl = gsap.timeline({
        scrollTrigger: {
          trigger: philosophyHeader,
          start: isDesktop ? 'top 85%' : 'top 95%',
          once: true
        }
      });
      safeAnimate('to', philosophyHeader, { y: 0, opacity: 1, filter: 'blur(0px)', duration: baseDuration }, philoTl);
      safeAnimate('to', philosophyTitle, { y: 0, opacity: 1, filter: 'blur(0px)', duration: baseDuration }, philoTl, '-=0.7');
      safeAnimate('to', philosophyDesc, { y: 0, opacity: 1, filter: 'blur(0px)', duration: baseDuration }, philoTl, '-=0.6');

      philosophyCards.forEach((card, i) => {
        const icon = card.querySelector('.philosophy-icon');
        const title = card.querySelector('h4');
        const desc = card.querySelector('p');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: isDesktop ? 'top 88%' : 'top 95%',
            once: true
          }
        });

        safeAnimate('to', card, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: baseDuration * 1.1,
          ease: 'power3.out'
        }, cardTl, isDesktop ? i * baseStagger * 1.5 : 0);

        safeAnimate('from', icon, { scale: 0, rotation: -30, duration: baseDuration * 0.6, ease: 'back.out(2)' }, cardTl, '-=0.7');
        safeAnimate('from', title, { y: 20, opacity: 0, duration: baseDuration * 0.5 }, cardTl, '-=0.4');
        safeAnimate('from', desc, { y: 15, opacity: 0, duration: baseDuration * 0.5 }, cardTl, '-=0.3');

        if (isDesktop && !prefersReducedMotion) {
          const handleMouseEnter = () => {
            gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
            if (icon) gsap.to(icon, { scale: 1.2, backgroundColor: 'rgb(59, 130, 246)', color: 'white', duration: 0.3 });
          };

          const handleMouseLeave = () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
            if (icon) gsap.to(icon, { scale: 1, clearProps: 'backgroundColor,color', duration: 0.3 });
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);

          cleanupFns.push(() => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
          });
        }
      });

      // ===== STATS SECTION =====
      const statsTl = gsap.timeline({
        scrollTrigger: {
          trigger: statsHeader,
          start: isDesktop ? 'top 85%' : 'top 95%',
          once: true
        }
      });
      statsTl.to(statsHeader, { y: 0, opacity: 1, duration: baseDuration });

      statItems.forEach((item, i) => {
        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: isDesktop ? 'top 90%' : 'top 98%',
            once: true
          }
        });

        safeAnimate('to', item, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: baseDuration,
          ease: 'power3.out'
        }, itemTl, isDesktop ? i * baseStagger * 1.2 : 0);

        if (isDesktop && !prefersReducedMotion) {
          const handleMouseEnter = () => gsap.to(item, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
          const handleMouseLeave = () => gsap.to(item, { scale: 1, duration: 0.3, ease: 'power2.out' });

          item.addEventListener('mouseenter', handleMouseEnter);
          item.addEventListener('mouseleave', handleMouseLeave);

          cleanupFns.push(() => {
            item.removeEventListener('mouseenter', handleMouseEnter);
            item.removeEventListener('mouseleave', handleMouseLeave);
          });
        }
      });

      // Counter animation
      statNumbers.forEach((stat) => {
        const value = parseInt(stat.getAttribute('data-value') || '0', 10);
        safeAnimate('fromTo', stat, {
          innerText: value,
          duration: prefersReducedMotion ? 0.1 : 3,
          snap: { innerText: 1 },
          ease: 'expo.out',
          scrollTrigger: {
            trigger: stat,
            start: isDesktop ? 'top 90%' : 'top 98%',
            once: true
          }
        }, undefined, undefined, { innerText: 0 });
      });

      // Decorative elements
      decorElements.forEach((el) => {
        safeAnimate('to', el, {
          scale: 1,
          opacity: 1,
          filter: 'blur(40px)',
          duration: baseDuration * 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 95%', once: true }
        });
      });
    });

    const refreshId = setInterval(() => ScrollTrigger.refresh(), 2000);

    return () => {
      mm.revert();
      clearInterval(refreshId);
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-x-hidden" style={{ perspective: '1500px' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="about-header mb-20 md:mb-40 max-w-5xl">
          <h2 className="header-label text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 md:mb-8">
            01 // Who We Are
          </h2>
          <h1 className="header-title text-4xl sm:text-5xl md:text-[7rem] lg:text-[9rem] font-heading font-extrabold leading-[1] md:leading-[0.9] tracking-tighter mb-8 md:mb-14 text-gray-900 dark:text-white">
            ARCHITECTING <br /> <span className="gradient-text">DIGITAL LIFE.</span>
          </h1>
          <p className="header-desc text-gray-600 dark:text-gray-400 text-base md:text-2xl font-light leading-relaxed max-w-3xl">
            Kytriq Technologies was founded on a simple premise: <strong className="text-gray-900 dark:text-white">Digital ideas deserve to live.</strong> We are a startup with the heart of a pioneer and the precision of a master engineer.
          </p>
        </header>

        {/* Mission & Vision Cards */}
        <section className="mb-20 md:mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12" style={{ perspective: '1200px' }}>

            {/* Mission Card */}
            <div className="mission-card interactive-card group relative will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-12 lg:p-16 h-full min-h-[350px] md:min-h-[500px]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-400/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <span className="mission-label inline-block text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-[0.4em]">Our Mission</span>
                    <div className="mission-icon">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white shadow-blue-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
                        <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mission-title text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight">
                    Empowering Businesses Through Intelligent Software
                  </h3>
                  <p className="mission-text text-blue-100/90 text-sm md:text-lg leading-relaxed mt-auto">
                    We exist to transform bold ideas into powerful digital realities. By combining cutting-edge AI with human-centered design, we build software that doesn't just work—it thinks, adapts, and grows with your business.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="vision-card interactive-card group relative will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-6 md:p-12 lg:p-16 h-full min-h-[350px] md:min-h-[500px]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <span className="vision-label inline-block text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Our Vision</span>
                    <div className="vision-icon">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="vision-title text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                    A World Where Every Business Has Access to Intelligent Technology
                  </h3>
                  <p className="vision-text text-gray-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed mt-auto">
                    We envision a future where advanced software and seamless digital experiences are not exclusive to tech giants. Every entrepreneur, every small business, and every dreamer deserves tools that amplify their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center mb-20 md:mb-40">
          <div className="img-reveal order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-1 md:p-2 bg-gray-50 dark:bg-gray-900/20">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000"
                srcSet="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600 600w, https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000 1000w"
                sizes="(max-width: 768px) 100vw, 50vw"
                width="1000"
                height="1250"
                alt="Innovation"
                loading="lazy"
                className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[3.5rem] grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="decor-element absolute -bottom-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[60px] md:blur-[80px] -z-10"></div>
            <div className="decor-element absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -z-10"></div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 md:space-y-12">
            <div>
              <h2 className="philosophy-header text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 md:mb-6">02 // Philosophy</h2>
              <h3 className="philosophy-title text-3xl md:text-5xl font-heading font-bold mb-6 md:mb-8 text-gray-900 dark:text-white leading-tight">
                Software That <span className="gradient-text">Feels Alive</span>
              </h3>
              <p className="philosophy-desc text-gray-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
                We believe that software is a living entity. It shouldn't just function; it should evolve. At Kytriq, we bridge the gap between human ambition and technological reality by building systems that feel human and act intelligent.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                {philosophyItems.map((item, i) => (
                  <div key={i} className="philosophy-card p-5 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 transition-shadow duration-300">
                    <div className="philosophy-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-3 md:mb-4 transition-all duration-300">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base mb-1 md:mb-2 transition-colors">{item.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-12 md:py-28 border-y border-gray-100 dark:border-gray-800/50 mb-12 md:mb-16">
          <div className="stats-header text-center mb-10 md:mb-16">
            <h2 className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-3 md:mb-4">03 // By The Numbers</h2>
            <h3 className="text-2xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Our Impact</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="flex items-center justify-center text-3xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 transition-colors duration-300">
                  <span className="stat-number" data-value={stat.value}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-[9px] md:text-xs text-blue-600 dark:text-blue-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <React.Suspense fallback={<div className="h-20" />}>
        <Footer />
      </React.Suspense>
    </div>
  );
};


export default About;

