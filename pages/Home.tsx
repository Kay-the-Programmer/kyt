
import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { TransitionContext } from '../TransitionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Modular Components
import InteractiveHeroBackground from '../components/home/InteractiveHeroBackground';
import HeroSection from '../components/home/HeroSection';
import IdentitySection from '../components/home/IdentitySection';
import PortfolioScroll from '../components/home/PortfolioScroll';
import CTASection from '../components/home/CTASection';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageTransition = useContext(TransitionContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax
      const handleMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5);
        const yPos = (e.clientY / window.innerHeight - 0.5);
        gsap.to('.hero-bg-glow', {
          x: xPos * 60,
          y: yPos * 60,
          duration: 2.5,
          ease: 'sine.out',
          overwrite: 'auto'
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Hero Entrance Sequence
      // If it's a page transition, wait 0.8s for the curtain. If initial load, sync with preloader exit (1.2s delay).
      const tl = gsap.timeline({ delay: isPageTransition ? 0.8 : 1.2 });
      tl.fromTo('.hero-section .letter-reveal',
        {
          y: 100,
          opacity: 0,
          filter: 'blur(20px)'
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.02,
          duration: 1,
          ease: 'power4.out',
        }
      )
        .to('.hero-badge', { y: 0, opacity: 1, duration: 0.8 }, '-=0.8')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.6')
        .to('.hero-btns', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');

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
        window.removeEventListener('mousemove', handleMouseMove);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white dark:bg-brand-dark text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      <InteractiveHeroBackground />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ willChange: 'transform' }}>
        <div className="hero-bg-glow absolute -top-[20%] -right-[10%] w-[100vw] h-[100vw] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="hero-bg-glow absolute -bottom-[30%] -left-[10%] w-[100vw] h-[100vw] bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-[150px] opacity-20"></div>
      </div>
      <HeroSection />
      <IdentitySection />
      {/* PortfolioScroll now handles its own internal ScrollTrigger logic */}
      <PortfolioScroll />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
