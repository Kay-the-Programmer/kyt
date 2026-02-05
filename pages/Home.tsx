
import React, { useEffect, useRef, useContext, useState } from 'react';
import { gsap } from 'gsap';
import { TransitionContext } from '../TransitionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';

// Modular Components
import InteractiveHeroBackground from '../components/home/InteractiveHeroBackground';
import HeroSection from '../components/home/HeroSection';
import IdentitySection from '../components/home/IdentitySection';
// Lazy load non-critical sections
const PortfolioScroll = React.lazy(() => import('../components/home/PortfolioScroll'));
const CTASection = React.lazy(() => import('../components/home/CTASection'));
const Footer = React.lazy(() => import('../components/Footer'));

import { useSharedMousePos, globalMousePos } from '../hooks/useSharedMousePos';

gsap.registerPlugin(ScrollTrigger);

// Lightweight skeleton placeholder for lazy-loaded sections
const SectionPlaceholder = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageTransition = useContext(TransitionContext);
  const glowXTo = useRef<gsap.QuickToFunc | null>(null);
  const glowYTo = useRef<gsap.QuickToFunc | null>(null);
  useSharedMousePos();

  // SEO Configuration
  useSEO({
    title: 'Kytriq Technologies | Bringing Digital Ideas to Life',
    description: 'Kytriq Technologies is a software development company specializing in AI integration, web application development, mobile apps, and strategic digital design. We bring your digital ideas to life.',
    keywords: 'Kytriq, software development, AI integration, web development, digital transformation',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Optimized Background Parallax using quickTo (created once, called on mousemove)
      const glows = document.querySelectorAll('.hero-bg-glow');
      if (glows.length > 0) {
        glowXTo.current = gsap.quickTo(glows, "x", { duration: 2.5, ease: "sine.out" });
        glowYTo.current = gsap.quickTo(glows, "y", { duration: 2.5, ease: "sine.out" });
      }

      const updateGlow = () => {
        if (!globalMousePos.active) return;
        const xPos = (globalMousePos.x / window.innerWidth - 0.5) * 60;
        const yPos = (globalMousePos.y / window.innerHeight - 0.5) * 60;

        glowXTo.current?.(xPos);
        glowYTo.current?.(yPos);
      };

      gsap.ticker.add(updateGlow);

      // Hero Entrance Orchestration - Slightly faster
      const tl = gsap.timeline({ delay: isPageTransition ? 0.6 : 0.02 });

      tl.fromTo('.hero-bg-glow',
        { opacity: 0, scale: 0.8 },
        {
          opacity: (i) => i === 0 ? 0.3 : 0.15,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );

      // Global Reveal orchestration
      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((el) => {
        gsap.from(el.querySelectorAll('.reveal-child'), {
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out'
        });
      });

      return () => {
        gsap.ticker.remove(updateGlow);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }, containerRef);

    return () => ctx.revert();
  }, [isPageTransition]);


  return (
    <div ref={containerRef} className="relative bg-white dark:bg-brand-dark text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      <InteractiveHeroBackground />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="hero-bg-glow absolute -top-[20%] -right-[10%] w-[100vw] h-[100vw] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[120px] opacity-0"></div>
        <div className="hero-bg-glow absolute -bottom-[30%] -left-[10%] w-[100vw] h-[100vw] bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-[150px] opacity-0"></div>
      </div>
      <HeroSection />

      <React.Suspense fallback={<div className="min-h-screen" />}>
        <IdentitySection />
      </React.Suspense>

      <React.Suspense fallback={<div className="min-h-screen" />}>
        <PortfolioScroll />
      </React.Suspense>

      <React.Suspense fallback={<div className="min-h-[50vh]" />}>
        <CTASection />
      </React.Suspense>

      <React.Suspense fallback={<div className="min-h-[40vh]" />}>
        <Footer />
      </React.Suspense>
    </div>
  );
};

export default Home;
