import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

import webAppImg from '../../assets/web-app-dev.png';
import mobileAppImg from '../../assets/mobile-app-dev.png';
import aiIntegrationImg from '../../assets/ai-integration.png';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_INTERVAL = 4000; // 4 seconds between auto-rotations

const IdentitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Memoize features to prevent re-creation
  const features = React.useMemo(() => [
    { title: 'Web applications', text: 'We build responsive and user-friendly web applications.', icon: 'fa-brain', image: webAppImg },
    { title: 'Mobile applications', text: 'We build responsive and user-friendly mobile applications.', icon: 'fa-user-astronaut', image: mobileAppImg },
    { title: 'AI Integration', text: 'We can integrate AI into your applications to make them more intelligent and user-friendly.', icon: 'fa-server', image: aiIntegrationImg }
  ], []);

  // Synchronized transition animation
  const animateTransition = useCallback((fromIndex: number, toIndex: number) => {
    const tl = gsap.timeline();

    // Animate out current feature highlight
    if (featureRefs.current[fromIndex]) {
      tl.to(featureRefs.current[fromIndex]?.querySelector('.feature-icon'), {
        scale: 1,
        rotate: 0,
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out'
      }, 0);
    }

    // Animate in new feature highlight
    if (featureRefs.current[toIndex]) {
      tl.to(featureRefs.current[toIndex]?.querySelector('.feature-icon'), {
        scale: 1.1,
        rotate: -12,
        duration: 0.4,
        ease: 'back.out(1.5)'
      }, 0.1);
    }

    // Image crossfade with scale effect - use hardware acceleration
    if (imageRefs.current[fromIndex] && imageRefs.current[toIndex]) {
      tl.to(imageRefs.current[fromIndex], {
        opacity: 0,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: 'auto'
      }, 0);

      tl.fromTo(imageRefs.current[toIndex],
        { opacity: 0, scale: 1.15 },
        {
          opacity: 1,
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        },
        0.1
      );
    }

    // Update state
    setActiveImage(toIndex);
  }, []);

  // Start progress bar animation
  const startProgressAnimation = useCallback(() => {
    if (progressBarRef.current) {
      if (progressTweenRef.current) progressTweenRef.current.kill();

      gsap.set(progressBarRef.current, { scaleX: 0 });
      progressTweenRef.current = gsap.to(progressBarRef.current, {
        scaleX: 1,
        duration: AUTO_ROTATE_INTERVAL / 1000,
        ease: 'none'
      });
    }
  }, []);

  // Auto-rotation logic using GSAP delayedCall for better sync
  const startAutoRotate = useCallback(() => {
    if (delayedCallRef.current) delayedCallRef.current.kill();

    startProgressAnimation();

    const tick = () => {
      setActiveImage(prev => {
        const next = (prev + 1) % features.length;
        animateTransition(prev, next);
        startProgressAnimation();

        // Schedule next tick
        delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
        return next;
      });
    };

    delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
  }, [animateTransition, startProgressAnimation, features.length]);

  const stopAutoRotate = useCallback(() => {
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
      delayedCallRef.current = null;
    }
    if (progressTweenRef.current) {
      progressTweenRef.current.pause();
    }
  }, []);

  // Handle hover interaction
  const handleFeatureHover = useCallback((index: number) => {
    setIsPaused(true);
    stopAutoRotate();
    if (index !== activeImage) {
      animateTransition(activeImage, index);
    }
  }, [activeImage, animateTransition, stopAutoRotate]);

  // Resume auto-rotate after hover ends
  const handleFeatureLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Section entrance - optimized with will-change
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 60%',
            scrub: 0.5
          }
        }
      );

      mm.add("(min-width: 768px)", () => {
        // Desktop: High-end Parallax using transforms only
        gsap.to('.identity-parallax-bg', {
          y: -150,
          opacity: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // Floating badge - use force3D for GPU acceleration
        gsap.to(badgeRef.current, {
          y: -30,
          x: 20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true
        });
      });

      // Header revelation
      gsap.fromTo('.identity-title .letter-reveal',
        {
          y: '80%',
          opacity: 0,
          rotateX: -30,
          scale: 0.9,
          filter: 'blur(8px)'
        },
        {
          scrollTrigger: {
            trigger: '.identity-title',
            start: 'top 88%',
            end: 'top 60%',
            scrub: 0.6,
            toggleActions: 'play none none reverse'
          },
          y: '0%',
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.01, // Reduced stagger for performance
          ease: 'power3.out',
          overwrite: 'auto'
        }
      );

      // Description text reveal
      gsap.fromTo('.identity-description',
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.identity-description',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Feature Items Stagger
      gsap.fromTo('.feature-item',
        { opacity: 0, x: -30, filter: 'blur(4px)' },
        {
          scrollTrigger: {
            trigger: '.feature-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out'
        }
      );

      // Image Reveal Wrapper
      gsap.fromTo('.image-reveal-wrapper',
        {
          clipPath: 'inset(10% 10% 10% 10% round 3rem)',
          opacity: 0,
          scale: 0.98
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 3rem)',
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.image-reveal-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Inner Image Scale Parallax
      gsap.to('.inner-image', {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.image-reveal-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });

      // Cleanup
      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Rotation control
  useEffect(() => {
    if (isVisible && !isPaused) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
    return () => stopAutoRotate();
  }, [isVisible, isPaused, startAutoRotate, stopAutoRotate]);

  return (
    <section
      id="who-we-are"
      ref={sectionRef}
      className="reveal-on-scroll relative z-10 py-24 md:py-48 lg:py-64 px-6 border-t border-gray-100 dark:border-gray-900/30 overflow-hidden"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="identity-parallax-bg absolute top-0 -left-10 text-[35vw] font-black text-blue-600/[0.04] dark:text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none" style={{ willChange: 'transform' }}>
        01
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center relative z-10">
        <div>
          <div className="identity-intro-badge flex items-center space-x-4 mb-8">
            <div className="h-px w-12 bg-blue-600"></div>
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.7em]">INTRO</h2>
          </div>

          <h3 className="identity-title text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-bold mb-10 leading-[0.85] text-gray-900 dark:text-white tracking-tighter">
            <SplitText text="What We" className="block" />
            <span className="text-gray-400 dark:text-gray-600 inline-block">
              <SplitText text="DO." />
            </span>
          </h3>

          <p className="identity-description text-gray-500 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-16 font-light max-w-xl">
            We build intelligent systems that deliver value to our clients and evolve with human ambition.
          </p>

          <div className="feature-list space-y-8 md:space-y-12">
            <div className="relative h-0.5 w-full max-w-xs bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
              <div
                ref={progressBarRef}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full origin-left"
                style={{ transform: 'scaleX(0)', willChange: 'transform' }}
              />
            </div>

            {features.map((item, i) => (
              <div
                key={i}
                ref={(el) => featureRefs.current[i] = el}
                className={`feature-item group flex items-start space-x-8 cursor-pointer transition-all duration-300 ${activeImage === i ? 'translate-x-2' : ''}`}
                onMouseEnter={() => handleFeatureHover(i)}
                onMouseLeave={handleFeatureLeave}
              >
                <div className={`feature-icon w-14 h-14 border rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${activeImage === i ? 'bg-blue-600 text-white border-blue-600 -rotate-12 scale-110' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-blue-600 dark:text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110'}`} style={{ willChange: 'transform, background-color' }}>
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-bold text-xl tracking-tight transition-colors duration-300 ${activeImage === i ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'}`}>{item.title}</h4>
                    {activeImage === i && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest text-blue-500 font-semibold">Active</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-child relative">
          <div className="image-reveal-wrapper relative aspect-square rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-3 bg-white/50 dark:bg-gray-950/30 backdrop-blur-md" style={{ willChange: 'clip-path, transform' }}>
            <div className="w-full h-full overflow-hidden rounded-[2.5rem] relative">
              {features.map((item, i) => (
                <img
                  key={i}
                  ref={(el) => imageRefs.current[i] = el}
                  src={item.image}
                  alt={item.title}
                  width="600"
                  height="600"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  {...(i === 0 ? { fetchpriority: 'high' } : {})}
                  decoding="async"
                  className={`inner-image absolute inset-0 w-full h-full object-cover scale-110 ${activeImage === i ? 'opacity-100' : 'opacity-0'}`}
                  style={{ willChange: 'opacity' }}
                />
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleFeatureHover(i)}
                  className={`relative w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeImage === i ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`View ${features[i].title}`}
                >
                  {activeImage === i && <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping" />}
                </button>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 h-1/4 w-full -top-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>
          </div>

          <div
            ref={badgeRef}
            className="absolute -bottom-10 -right-4 md:-right-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl z-20"
            style={{ willChange: 'transform' }}
          >
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-6xl font-black text-blue-600 mb-2 font-heading tracking-tighter">99.9%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 text-center">System Reliability</div>
              <div className="flex space-x-1 mt-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `@keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }`
      }} />
    </section>
  );
};

export default IdentitySection;