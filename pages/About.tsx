
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
    const duration = prefersReducedMotion ? 0.01 : 1;
    const stagger = prefersReducedMotion ? 0 : 0.1;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      // Cache all DOM elements
      const headerLabel = container.querySelector('.header-label');
      const headerTitle = container.querySelector('.header-title');
      const headerDesc = container.querySelector('.header-desc');
      const missionCard = container.querySelector('.mission-card');
      const visionCard = container.querySelector('.vision-card');
      const missionIcon = container.querySelector('.mission-icon');
      const missionLabel = container.querySelector('.mission-label');
      const missionTitle = container.querySelector('.mission-title');
      const missionText = container.querySelector('.mission-text');
      const visionIcon = container.querySelector('.vision-icon');
      const visionLabel = container.querySelector('.vision-label');
      const visionTitle = container.querySelector('.vision-title');
      const visionText = container.querySelector('.vision-text');
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
      safeAnimate('set', [headerLabel, headerTitle, headerDesc], { y: 80, opacity: 0 });
      safeAnimate('set', [missionCard, visionCard], { y: 100, opacity: 0, rotateX: 15, scale: 0.95 });
      safeAnimate('set', [missionIcon, visionIcon], { scale: 0, rotation: -45 });
      safeAnimate('set', [missionLabel, visionLabel], { x: -30, opacity: 0 });
      safeAnimate('set', [missionTitle, visionTitle], { y: 40, opacity: 0 });
      safeAnimate('set', [missionText, visionText], { y: 30, opacity: 0 });
      safeAnimate('set', imgContainer, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1 });
      safeAnimate('set', [philosophyHeader, philosophyTitle, philosophyDesc], { y: 50, opacity: 0 });
      safeAnimate('set', Array.from(philosophyCards), { y: 60, opacity: 0, scale: 0.9 });
      safeAnimate('set', statsHeader, { y: 40, opacity: 0 });
      safeAnimate('set', Array.from(statItems), { y: 50, opacity: 0, scale: 0.85 });
      safeAnimate('set', Array.from(decorElements), { scale: 0, opacity: 0 });

      // ===== HERO ENTRANCE TIMELINE =====
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-header',
          start: 'top 85%',
          once: true
        },
        defaults: { ease: 'power4.out', force3D: true }
      });
      safeAnimate('to', headerLabel, { y: 0, opacity: 1, duration: duration * 1.2 }, heroTl);
      safeAnimate('to', headerTitle, { y: 0, opacity: 1, duration: duration * 1.4 }, heroTl, '-=0.9');
      safeAnimate('to', headerDesc, { y: 0, opacity: 1, duration: duration * 1.2 }, heroTl, '-=0.8');

      // ===== MISSION CARD TIMELINE =====
      const missionTl = gsap.timeline({
        scrollTrigger: { trigger: missionCard, start: 'top 80%', once: true }
      });
      safeAnimate('to', missionCard, { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: duration * 1.4, ease: 'power3.out' }, missionTl);
      safeAnimate('to', missionIcon, { scale: 1, rotation: 0, duration: duration * 0.8, ease: 'back.out(2)' }, missionTl, '-=0.8');
      safeAnimate('to', missionLabel, { x: 0, opacity: 1, duration: duration * 0.6 }, missionTl, '-=0.6');
      safeAnimate('to', missionTitle, { y: 0, opacity: 1, duration: duration * 0.8 }, missionTl, '-=0.4');
      safeAnimate('to', missionText, { y: 0, opacity: 1, duration: duration * 0.8 }, missionTl, '-=0.5');

      // ===== VISION CARD TIMELINE =====
      const visionTl = gsap.timeline({
        scrollTrigger: { trigger: visionCard, start: 'top 80%', once: true }
      });
      safeAnimate('to', visionCard, { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: duration * 1.4, ease: 'power3.out', delay: 0.15 }, visionTl);
      safeAnimate('to', visionIcon, { scale: 1, rotation: 0, duration: duration * 0.8, ease: 'back.out(2)' }, visionTl, '-=0.8');
      safeAnimate('to', visionLabel, { x: 0, opacity: 1, duration: duration * 0.6 }, visionTl, '-=0.6');
      safeAnimate('to', visionTitle, { y: 0, opacity: 1, duration: duration * 0.8 }, visionTl, '-=0.4');
      safeAnimate('to', visionText, { y: 0, opacity: 1, duration: duration * 0.8 }, visionTl, '-=0.5');

      // ===== CARD HOVER INTERACTIONS =====
      const cards = container.querySelectorAll<HTMLElement>('.interactive-card');
      cards.forEach((card) => {
        const inner = card.querySelector('.card-inner');
        const icon = card.querySelector('.card-icon-wrap');

        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.02, duration: 0.4, ease: 'power2.out' });
          gsap.to(inner, { y: -5, duration: 0.4, ease: 'power2.out' });
          if (icon) gsap.to(icon, { scale: 1.15, rotation: 5, duration: 0.4, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.4, ease: 'power2.out' });
          gsap.to(inner, { y: 0, duration: 0.4, ease: 'power2.out' });
          if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
        });

        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
        });
      });

      // ===== IMAGE REVEAL =====
      gsap.to(imgContainer, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: duration * 2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: imgContainer, start: 'top 80%', once: true }
      });

      // ===== PHILOSOPHY SECTION =====
      const philoTl = gsap.timeline({
        scrollTrigger: { trigger: philosophyHeader, start: 'top 85%', once: true }
      });
      safeAnimate('to', philosophyHeader, { y: 0, opacity: 1, duration: duration }, philoTl);
      safeAnimate('to', philosophyTitle, { y: 0, opacity: 1, duration: duration }, philoTl, '-=0.7');
      safeAnimate('to', philosophyDesc, { y: 0, opacity: 1, duration: duration }, philoTl, '-=0.6');

      // Philosophy cards with staggered entrance
      philosophyCards.forEach((card, i) => {
        const icon = card.querySelector('.philosophy-icon');
        const title = card.querySelector('h4');
        const desc = card.querySelector('p');

        const cardTl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });

        safeAnimate('to', card, { y: 0, opacity: 1, scale: 1, duration: duration * 1.1, delay: i * stagger * 1.5, ease: 'power3.out' }, cardTl);
        safeAnimate('from', icon, { scale: 0, rotation: -30, duration: duration * 0.6, ease: 'back.out(2)' }, cardTl, '-=0.7');
        safeAnimate('from', title, { y: 20, opacity: 0, duration: duration * 0.5 }, cardTl, '-=0.4');
        safeAnimate('from', desc, { y: 15, opacity: 0, duration: duration * 0.5 }, cardTl, '-=0.3');

        // Hover interaction for philosophy cards
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
          if (icon) gsap.to(icon, { scale: 1.2, backgroundColor: 'rgb(59, 130, 246)', color: 'white', duration: 0.3 });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
          if (icon) gsap.to(icon, { scale: 1, clearProps: 'backgroundColor,color', duration: 0.3 });
        });
      });

      // ===== STATS SECTION =====
      const statsTl = gsap.timeline({
        scrollTrigger: { trigger: statsHeader, start: 'top 85%', once: true }
      });
      statsTl.to(statsHeader, { y: 0, opacity: 1, duration: duration });

      statItems.forEach((item, i) => {
        const number = item.querySelector('.stat-number');
        const label = item.querySelector('p');

        const itemTl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 90%', once: true }
        });

        safeAnimate('to', item, { y: 0, opacity: 1, scale: 1, duration: duration, delay: i * stagger * 1.2, ease: 'power3.out' }, itemTl);
        safeAnimate('from', label, { y: 10, opacity: 0, duration: duration * 0.5 }, itemTl, '-=0.4');

        // Hover
        item.addEventListener('mouseenter', () => {
          gsap.to(item, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
        });
        item.addEventListener('mouseleave', () => {
          gsap.to(item, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });

      // Counter animation
      statNumbers.forEach((stat) => {
        const value = parseInt(stat.getAttribute('data-value') || '0', 10);
        safeAnimate('fromTo', stat, {
          innerText: value,
          duration: prefersReducedMotion ? 0.1 : 2.5,
          snap: { innerText: 1 },
          ease: 'power2.out',
          scrollTrigger: { trigger: stat, start: 'top 90%', once: true }
        }, undefined, undefined, { innerText: 0 });
      });

      // Decorative elements
      decorElements.forEach((el) => {
        safeAnimate('to', el, {
          scale: 1, opacity: 1, duration: duration * 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 95%', once: true }
        });
      });

    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-40 pb-20 md:pb-32 px-6 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden" style={{ perspective: '1500px' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="about-header mb-24 md:mb-40 max-w-5xl">
          <h2 className="header-label text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6 md:mb-8">
            01 // Who We Are
          </h2>
          <h1 className="header-title text-5xl md:text-[7rem] lg:text-[9rem] font-heading font-extrabold leading-[0.9] tracking-tighter mb-10 md:mb-14 text-gray-900 dark:text-white">
            ARCHITECTING <br /> <span className="gradient-text">DIGITAL LIFE.</span>
          </h1>
          <p className="header-desc text-gray-600 dark:text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-3xl">
            Kytriq Technologies was founded on a simple premise: <strong className="text-gray-900 dark:text-white">Digital ideas deserve to live.</strong> We are a startup with the heart of a pioneer and the precision of a master engineer.
          </p>
        </header>

        {/* Mission & Vision Cards */}
        <section className="mb-24 md:mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12" style={{ perspective: '1200px' }}>

            {/* Mission Card */}
            <div className="mission-card interactive-card group relative cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 lg:p-16 h-full min-h-[420px] md:min-h-[500px]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-400/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-8">

                    <span className="mission-label text-xs font-bold text-blue-200 uppercase tracking-[0.4em]">Our Mission</span>
                  </div>
                  <h3 className="mission-title text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                    Empowering Businesses Through Intelligent Software
                  </h3>
                  <p className="mission-text text-blue-100/90 text-base md:text-lg leading-relaxed mt-auto">
                    We exist to transform bold ideas into powerful digital realities. By combining cutting-edge AI with human-centered design, we build software that doesn't just work—it thinks, adapts, and grows with your business.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="vision-card interactive-card group relative cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card-inner relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-8 md:p-12 lg:p-16 h-full min-h-[420px] md:min-h-[500px]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-8">

                    <span className="vision-label text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Our Vision</span>
                  </div>
                  <h3 className="vision-title text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    A World Where Every Business Has Access to Intelligent Technology
                  </h3>
                  <p className="vision-text text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mt-auto">
                    We envision a future where advanced software and seamless digital experiences are not exclusive to tech giants. Every entrepreneur, every small business, and every dreamer deserves tools that amplify their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-24 md:mb-40">
          <div className="img-reveal order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-900/20">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000"
                alt="Innovation"
                loading="lazy"
                className="w-full h-full object-cover rounded-[2.2rem] md:rounded-[3.5rem] grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="decor-element absolute -bottom-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[60px] md:blur-[80px] -z-10"></div>
            <div className="decor-element absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -z-10"></div>
          </div>

          <div className="order-1 lg:order-2 space-y-10 md:space-y-12">
            <div>
              <h2 className="philosophy-header text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6">02 // Philosophy</h2>
              <h3 className="philosophy-title text-3xl md:text-5xl font-heading font-bold mb-8 text-gray-900 dark:text-white leading-tight">
                Software That <span className="gradient-text">Feels Alive</span>
              </h3>
              <p className="philosophy-desc text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-10">
                We believe that software is a living entity. It shouldn't just function; it should evolve. At Kytriq, we bridge the gap between human ambition and technological reality by building systems that feel human and act intelligent.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {philosophyItems.map((item, i) => (
                  <div key={i} className="philosophy-card cursor-pointer p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 transition-shadow duration-300">
                    <div className="philosophy-icon w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4 transition-all duration-300">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-16 md:py-28 border-t border-b border-gray-100 dark:border-gray-800/50 mb-16">
          <div className="stats-header text-center mb-12 md:mb-16">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-4">03 // By The Numbers</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Our Impact</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item cursor-pointer">
                <div className="flex items-center justify-center text-4xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 transition-colors duration-300">
                  <span className="stat-number" data-value={stat.value}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-500 font-bold uppercase tracking-[0.3em]">{stat.label}</p>
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

