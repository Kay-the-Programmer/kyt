import React, { useRef, useLayoutEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';
import { useMagnetic } from '../../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useMagnetic(titleRef);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic exit animation with smooth scrub for handoff to IdentitySection
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: 0.8, // Smooth scrub for fluid motion
          onUpdate: (self) => {
            // Progressive blur for cinematic depth
            const blur = self.progress * 16;
            if (contentRef.current) {
              contentRef.current.style.filter = `blur(${blur}px)`;
            }
          }
        }
      });

      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.92,
        y: -80, // Move up to create "rising" handoff
        ease: 'none'
      });

      // Parallax effect for individual elements
      gsap.to('.hero-badge', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 60%',
          scrub: 0.5
        },
        y: -60,
        opacity: 0,
        ease: 'none'
      });

      gsap.to('.hero-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 65%',
          scrub: 0.6
        },
        y: -40,
        opacity: 0,
        ease: 'none'
      });

      gsap.to('.hero-btns', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 70%',
          scrub: 0.7
        },
        y: -30,
        opacity: 0,
        ease: 'none'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero-section relative z-10 min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
      <div ref={contentRef} className="hero-section-content max-w-[95rem] w-full text-center" style={{ willChange: 'transform, opacity, filter' }}>
        <div className="hero-badge opacity-0 translate-y-4 inline-flex items-center space-x-2 px-6 py-2 bg-white/5 dark:bg-blue-500/5 border border-gray-200/50 dark:border-blue-500/10 rounded-full mb-8 md:mb-12 mx-auto backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">KYTRIQ TECHNOLOGIES</span>
        </div>

        <h1 ref={titleRef} className="magnetic-area text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-heading font-extrabold tracking-tighter leading-[0.95] text-gray-900 dark:text-white select-none overflow-visible flex flex-col items-center [&_.letter-reveal]:opacity-0 [&_.letter-reveal]:translate-y-[100px] [&_.letter-reveal]:blur-[20px]">
          <SplitText text="Bringing Digital Ideas" className="block mb-2 md:mb-4" />
          <SplitText text="To Life." className="block" isGradient={true} />
        </h1>

        <p className="hero-desc opacity-0 translate-y-4 text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-500 max-w-3xl mx-auto mt-8 md:mt-12 lg:mt-16 font-light leading-relaxed tracking-tight">
          Engineering high-performance digital organisms. <br className="hidden md:block" /> Creating visionary architectures with absolute precision.
        </p>

        <div className="hero-btns opacity-0 translate-y-4 mt-10 magnetic-area md:mt-12 lg:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-12">
          <Link to="/contact" className="group relative overflow-hidden inline-block w-full sm:w-auto px-10 md:px-16 py-4 md:py-5 bg-blue-600 text-white rounded-full font-bold transition-all duration-700 text-center shadow-xl shadow-blue-500/20">
            <span className="relative z-10 text-lg">Let's Build Together</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;