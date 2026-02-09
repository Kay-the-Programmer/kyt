
import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { TransitionContext, useTransition } from '../TransitionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';
import { useLazyRender } from '../hooks/useLazyRender';

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

      sectionMap.forEach(({ id, label }) => {
        const section = document.getElementById(id);
        if (section) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setActiveSection(label),
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

      {/* Scroll Progress Indicators */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-start gap-4">
        <div className="relative h-32 w-[2px] bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {activeSection}
        </span>
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
