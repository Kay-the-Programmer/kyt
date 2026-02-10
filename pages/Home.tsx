
import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { TransitionContext, useTransition } from '../TransitionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';
import { useLazyRender } from '../hooks/useLazyRender';
import { trackScrollMilestone } from '../utils/analytics';

// Modular Components
import InteractiveHeroBackground from '../components/home/InteractiveHeroBackground';
import HeroSection from '../components/home/HeroSection';
import StorytellingOverlay from '../components/home/StorytellingOverlay';
// Lazy load non-critical sections
const IdentitySection = React.lazy(() => import('../components/home/IdentitySection'));
const PortfolioScroll = React.lazy(() => import('../components/home/PortfolioScroll'));
const CTASection = React.lazy(() => import('../components/home/CTASection'));
const Footer = React.lazy(() => import('../components/Footer'));

import { useSharedMousePos, globalMousePos } from '../hooks/useSharedMousePos';

gsap.registerPlugin(ScrollTrigger);

// Viewport-based lazy section wrapper
interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
}

interface LazySectionInternalProps extends LazySectionProps {
  id?: string;
}

const LazySection: React.FC<LazySectionInternalProps> = ({
  children,
  minHeight = 'min-h-screen',
  rootMargin = '200px',
  id
}) => {
  const { ref, shouldRender } = useLazyRender(rootMargin);

  return (
    <div ref={ref} id={id} className={`section-reveal ${!shouldRender ? minHeight : ''}`}>
      {shouldRender ? (
        <React.Suspense fallback={
          <div className={`${minHeight} flex items-center justify-center`}>
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        }>
          {children}
        </React.Suspense>
      ) : (
        <div className={`${minHeight} flex items-center justify-center`}>
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin opacity-30" />
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageTransition = useTransition();
  const glowXTo = useRef<gsap.QuickToFunc | null>(null);
  const glowYTo = useRef<gsap.QuickToFunc | null>(null);
  useSharedMousePos();

  // Scroll progress state for storytelling
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('Home');

  // SEO Configuration
  useSEO({
    title: 'Kytriq Technologies | Bringing Digital Ideas to Life',
    description: 'Kytriq Technologies is a software development company specializing in AI integration, web application development, mobile apps, and strategic digital design. We bring your digital ideas to life.',
    keywords: 'Kytriq, software development, AI integration, web development, digital transformation',
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track visibility for performance optimization
    let isGlowVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isGlowVisible = entry.isIntersecting; },
      { threshold: 0.1, rootMargin: '100px' }
    );
    visibilityObserver.observe(container);

    const ctx = gsap.context(() => {
      const glows = document.querySelectorAll('.hero-bg-glow');

      // Smoother parallax with longer duration and softer easing
      if (glows.length > 0) {
        glowXTo.current = gsap.quickTo(glows, "x", { duration: 3, ease: "power2.out" });
        glowYTo.current = gsap.quickTo(glows, "y", { duration: 3, ease: "power2.out" });
      }

      // Cache window dimensions to avoid repeated reads in the ticker
      let winW = window.innerWidth;
      let winH = window.innerHeight;

      const handleResize = () => {
        winW = window.innerWidth;
        winH = window.innerHeight;
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // Reduced parallax intensity for subtler movement - only runs when visible
      const updateGlow = () => {
        if (!isGlowVisible || !globalMousePos.active || winW === 0) return;
        const xPos = (globalMousePos.x / winW - 0.5) * 40;
        const yPos = (globalMousePos.y / winH - 0.5) * 40;

        glowXTo.current?.(xPos);
        glowYTo.current?.(yPos);
      };

      gsap.ticker.add(updateGlow);

      // Ambient floating effect for background glows
      glows.forEach((glow, i) => {
        gsap.to(glow, {
          y: i === 0 ? '+=15' : '-=12',
          x: i === 0 ? '-=10' : '+=8',
          duration: 6 + i * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });

      // Hero Entrance with refined timing and subtle scale
      const tl = gsap.timeline({ delay: isPageTransition ? 0.6 : 0.02 });

      tl.fromTo('.hero-bg-glow',
        { opacity: 0, scale: 0.85, filter: 'blur(160px)' },
        {
          opacity: (i) => i === 0 ? 0.35 : 0.18,
          scale: 1,
          filter: 'blur(120px)',
          duration: 1.8,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );

      // Enhanced scroll reveal for main sections
      const sections = gsap.utils.toArray<HTMLElement>('.section-reveal');
      sections.forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              once: true,
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              // Vital for PortfolioScroll: remove transform context so position:fixed (pinning) works relative to viewport
              // Use clearProps only for the specific transform property to minimize layout impact
              gsap.set(section, { clearProps: 'transform' });
            }
          }
        );
      });

      // Unified reveal-on-scroll logic for smaller elements
      const revealElements = gsap.utils.toArray<HTMLElement>('.reveal-on-scroll');
      if (revealElements.length > 0) {
        revealElements.forEach((el) => {
          const children = el.querySelectorAll('.reveal-child');
          if (children.length === 0) return;

          gsap.set(children, { opacity: 0, y: 20, scale: 0.98 });

          gsap.to(children, {
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true
            },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        });
      }

      // Global scroll progress tracker
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setScrollProgress(self.progress)
      });

      // Section tracking for active labels
      const sectionMap = [
        { id: 'hero', label: 'Home' },
        { id: 'identity', label: 'What We Do' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'cta', label: 'Contact' }
      ];

      const trackedSections = new Set<string>();

      sectionMap.forEach(({ id, label }) => {
        const section = document.getElementById(id);
        if (section) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => {
              setActiveSection(label);
              // Track milestone when entering a section (only once)
              const sectionSlug = label.toLowerCase().replace(/\s+/g, '_');
              if (!trackedSections.has(sectionSlug)) {
                trackedSections.add(sectionSlug);
                trackScrollMilestone(sectionSlug);
              }
            },
            onEnterBack: () => setActiveSection(label)
          });
        }
      });

      return () => {
        gsap.ticker.remove(updateGlow);
        window.removeEventListener('resize', handleResize);
      };
    }, containerRef);

    return () => {
      visibilityObserver.disconnect();
      ctx.revert();
    };
  }, [isPageTransition]);


  return (
    <div ref={containerRef} className="relative bg-white dark:bg-brand-dark text-gray-900 dark:text-white transition-colors duration-500">
      <InteractiveHeroBackground />
      <StorytellingOverlay />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="hero-bg-glow absolute -top-[20%] -right-[10%] w-[100vw] h-[100vw] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[120px] opacity-0"></div>
        <div className="hero-bg-glow absolute -bottom-[30%] -left-[10%] w-[100vw] h-[100vw] bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-[150px] opacity-0"></div>
      </div>

      {/* Scroll Progress Indicators - Enhanced Visibility */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          style={{ transform: `scaleX(${scrollProgress})`, willChange: 'transform' }}
        />
      </div>

      {/* Vertical Progress with Enhanced Section Label */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-6">
        <div className="relative h-40 w-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
            style={{ height: `${scrollProgress * 100}%`, willChange: 'height' }}
          />
          {/* Progress nodes */}
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 ${scrollProgress > 0 ? 'bg-blue-500 border-blue-500 scale-110' : 'bg-gray-300 border-gray-300'}`} style={{ top: '0%' }} />
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 ${scrollProgress > 0.25 ? 'bg-purple-500 border-purple-500 scale-110' : 'bg-gray-300 border-gray-300'}`} style={{ top: '33%' }} />
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 ${scrollProgress > 0.5 ? 'bg-pink-500 border-pink-500 scale-110' : 'bg-gray-300 border-gray-300'}`} style={{ top: '66%' }} />
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 ${scrollProgress > 0.9 ? 'bg-indigo-500 border-indigo-500 scale-110' : 'bg-gray-300 border-gray-300'}`} style={{ top: '100%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 whitespace-nowrap">
            {activeSection}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Floating Ambient Particles - Scroll-responsive */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-500/20 dark:bg-blue-400/30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
              transform: `translateY(${scrollProgress * (i % 2 ? -50 : 50)}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        ))}
      </div>

      {/* Hero Section handles its own entrance */}
      <div id="hero">
        <HeroSection />
      </div>

      <LazySection id="identity" minHeight="min-h-screen">
        <IdentitySection />
      </LazySection>

      <LazySection id="portfolio" minHeight="min-h-screen">
        <PortfolioScroll />
      </LazySection>

      <LazySection id="cta" minHeight="min-h-[50vh]">
        <CTASection />
      </LazySection>

      <LazySection id="footer" minHeight="min-h-[40vh]">
        <Footer />
      </LazySection>
    </div>
  );
};

export default Home;
