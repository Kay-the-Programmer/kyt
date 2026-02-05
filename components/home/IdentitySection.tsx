import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

import webAppImg from '../../assets/web-app-dev.jpg';
import mobileAppImg from '../../assets/mobile-app-dev.jpg';
import aiIntegrationImg from '../../assets/ai-integration.jpg';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_INTERVAL = 4000;

// Memoized Feature Item component to prevent unnecessary re-renders
interface FeatureItemProps {
  item: { title: string; text: string; icon: string; image: string };
  index: number;
  isActive: boolean;
  onHover: (index: number) => void;
  onLeave: () => void;
  featureRef: (el: HTMLDivElement | null) => void;
}

const FeatureItem = memo<FeatureItemProps>(({ item, index, isActive, onHover, onLeave, featureRef }) => (
  <div
    ref={featureRef}
    className={`feature-item group flex items-start space-x-8 cursor-pointer transition-transform duration-300 ${isActive ? 'translate-x-2' : ''}`}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={onLeave}
  >
    <div
      className={`feature-icon w-14 h-14 border rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${isActive
          ? 'bg-blue-600 text-white border-blue-600 -rotate-12 scale-110'
          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-blue-600 dark:text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110'
        }`}
    >
      <i className={`fa-solid ${item.icon} text-lg`} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h4 className={`font-bold text-xl tracking-tight transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'}`}>
          {item.title}
        </h4>
        {isActive && (
          <div className="flex items-center gap-1">
            <span className="active-pulse w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-semibold">Active</span>
          </div>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">{item.text}</p>
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

// Memoized Indicator Dots
interface IndicatorDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  labels: string[];
}

const IndicatorDots = memo<IndicatorDotsProps>(({ count, activeIndex, onSelect, labels }) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className={`indicator-dot relative w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeIndex === i ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white/80'
          }`}
        aria-label={`View ${labels[i]}`}
      >
        {activeIndex === i && <span className="ping-indicator absolute inset-0 rounded-full bg-blue-400" />}
      </button>
    ))}
  </div>
));

IndicatorDots.displayName = 'IndicatorDots';

const IdentitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const pulseDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Track last transition time to prevent rapid-fire transitions
  const lastTransitionRef = useRef(0);
  const TRANSITION_DEBOUNCE = 150;

  // Memoize features to prevent re-creation
  const features = useMemo(() => [
    { title: 'Web applications', text: 'We build responsive and user-friendly web applications.', icon: 'fa-brain', image: webAppImg },
    { title: 'Mobile applications', text: 'We build responsive and user-friendly mobile applications.', icon: 'fa-user-astronaut', image: mobileAppImg },
    { title: 'AI Integration', text: 'We can integrate AI into your applications to make them more intelligent and user-friendly.', icon: 'fa-server', image: aiIntegrationImg }
  ], []);

  // Feature labels for accessibility
  const featureLabels = useMemo(() => features.map(f => f.title), [features]);

  // Optimized transition animation with debouncing
  const animateTransition = useCallback((fromIndex: number, toIndex: number) => {
    const now = performance.now();
    if (now - lastTransitionRef.current < TRANSITION_DEBOUNCE) return;
    lastTransitionRef.current = now;

    const fromFeature = featureRefs.current[fromIndex];
    const toFeature = featureRefs.current[toIndex];
    const fromImage = imageRefs.current[fromIndex];
    const toImage = imageRefs.current[toIndex];

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // Animate out current feature highlight
    if (fromFeature) {
      const fromIcon = fromFeature.querySelector('.feature-icon');
      if (fromIcon) {
        tl.to(fromIcon, {
          scale: 1,
          rotate: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, 0);
      }
    }

    // Animate in new feature highlight with enhanced 3D effect
    if (toFeature) {
      const toIcon = toFeature.querySelector('.feature-icon');
      if (toIcon) {
        tl.to(toIcon, {
          scale: 1.1,
          rotate: -12,
          duration: 0.4,
          ease: 'back.out(1.5)'
        }, 0.1);
      }

      // Add subtle glow pulse to active feature
      tl.fromTo(toFeature,
        { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
        {
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
          duration: 0.6,
          ease: 'power2.out'
        },
        0
      );
    }

    // Image crossfade with enhanced scale and blur effect
    if (fromImage && toImage) {
      tl.to(fromImage, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(4px)',
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0);

      tl.fromTo(toImage,
        { opacity: 0, scale: 1.2, filter: 'blur(8px)' },
        {
          opacity: 1,
          scale: 1.1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out'
        },
        0.15
      );
    }

    setActiveImage(toIndex);
  }, []);

  // Optimized progress animation using quickSetter
  const startProgressAnimation = useCallback(() => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    gsap.set(progressBar, { scaleX: 0 });
    progressTweenRef.current = gsap.to(progressBar, {
      scaleX: 1,
      duration: AUTO_ROTATE_INTERVAL / 1000,
      ease: 'none'
    });
  }, []);

  // Auto-rotation logic with cleanup
  const startAutoRotate = useCallback(() => {
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    startProgressAnimation();

    const tick = () => {
      setActiveImage(prev => {
        const next = (prev + 1) % features.length;
        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
          animateTransition(prev, next);
          startProgressAnimation();
        });

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

  // Handle hover interaction with debouncing
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

  // Store ref callbacks
  const setFeatureRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  }, []);

  // Main animation setup
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Section entrance with optimized scrub
      gsap.fromTo(section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 0.8
          }
        }
      );

      mm.add("(min-width: 768px)", () => {
        // Desktop: Optimized parallax
        gsap.to('.identity-parallax-bg', {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // Floating badge with GPU acceleration
        if (badgeRef.current) {
          gsap.to(badgeRef.current, {
            y: -25,
            x: 15,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            force3D: true
          });
        }

        // Animate pulse dots with GSAP instead of CSS
        pulseDotRefs.current.forEach((dot, i) => {
          if (dot) {
            gsap.to(dot, {
              opacity: 0.3,
              scale: 1.2,
              duration: 0.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: i * 0.15
            });
          }
        });
      });

      // Header revelation with enhanced 3D
      const letterReveals = section.querySelectorAll('.identity-title .letter-reveal');
      if (letterReveals.length > 0) {
        gsap.fromTo(letterReveals,
          {
            y: '100%',
            opacity: 0,
            rotateX: -45,
            scale: 0.85
          },
          {
            scrollTrigger: {
              trigger: '.identity-title',
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.8,
              toggleActions: 'play none none reverse'
            },
            y: '0%',
            opacity: 1,
            rotateX: 0,
            scale: 1,
            stagger: 0.015,
            ease: 'power4.out'
          }
        );
      }

      // Description with smooth reveal
      gsap.fromTo('.identity-description',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.identity-description',
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Feature Items with enhanced stagger animation
      const featureItems = section.querySelectorAll('.feature-item');
      if (featureItems.length > 0) {
        gsap.fromTo(featureItems,
          {
            opacity: 0,
            x: -40,
            rotateY: -15
          },
          {
            scrollTrigger: {
              trigger: '.feature-list',
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            opacity: 1,
            x: 0,
            rotateY: 0,
            stagger: {
              each: 0.12,
              ease: 'power2.out'
            },
            duration: 0.8,
            ease: 'power3.out'
          }
        );
      }

      // Image Reveal with enhanced clip-path animation
      gsap.fromTo('.image-reveal-wrapper',
        {
          clipPath: 'inset(15% 15% 15% 15% round 3rem)',
          opacity: 0,
          scale: 0.95,
          rotateY: 10
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 3rem)',
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.image-reveal-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Inner Image Parallax
      gsap.to('.inner-image', {
        y: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.image-reveal-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      // Scan line animation with GSAP instead of CSS
      if (scanLineRef.current) {
        gsap.to(scanLineRef.current, {
          top: '100%',
          duration: 4,
          repeat: -1,
          ease: 'none'
        });
      }

      // Badge entrance animation
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: badgeRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      return () => {
        mm.revert();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(section);
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
    >
      <div
        className="identity-parallax-bg absolute top-0 -left-10 text-[35vw] font-black text-blue-600/[0.04] dark:text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none"
        style={{ willChange: 'transform' }}
      >
        01
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center relative z-10">
        <div>
          <div className="identity-intro-badge flex items-center space-x-4 mb-8">
            <div className="h-px w-12 bg-blue-600" />
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.7em]">INTRO</h2>
          </div>

          <h3 className="identity-title text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-bold mb-10 leading-[0.85] text-gray-900 dark:text-white tracking-tighter" style={{ perspective: '1000px' }}>
            <SplitText text="What We" className="block" />
            <span className="text-gray-400 dark:text-gray-600 inline-block">
              <SplitText text="DO." />
            </span>
          </h3>

          <p className="identity-description text-gray-500 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-16 font-light max-w-xl">
            We build intelligent systems that deliver value to our clients and evolve with human ambition.
          </p>

          <div className="feature-list space-y-8 md:space-y-12" style={{ perspective: '800px' }}>
            <div className="relative h-0.5 w-full max-w-xs bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
              <div
                ref={progressBarRef}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full origin-left"
                style={{ transform: 'scaleX(0)', willChange: 'transform' }}
              />
            </div>

            {features.map((item, i) => (
              <FeatureItem
                key={i}
                item={item}
                index={i}
                isActive={activeImage === i}
                onHover={handleFeatureHover}
                onLeave={handleFeatureLeave}
                featureRef={setFeatureRef(i)}
              />
            ))}
          </div>
        </div>

        <div className="reveal-child relative" style={{ perspective: '1200px' }}>
          <div
            className="image-reveal-wrapper relative aspect-square rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-3 bg-white/50 dark:bg-gray-950/30 backdrop-blur-md"
            style={{ willChange: 'clip-path, transform', transformStyle: 'preserve-3d' }}
          >
            <div className="w-full h-full overflow-hidden rounded-[2.5rem] relative">
              {features.map((item, i) => (
                <img
                  key={i}
                  ref={(el) => { imageRefs.current[i] = el; }}
                  src={item.image}
                  alt={item.title}
                  width="600"
                  height="600"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className={`inner-image absolute inset-0 w-full h-full object-cover ${activeImage === i ? '' : 'pointer-events-none'}`}
                  style={{
                    willChange: 'transform, opacity, filter',
                    opacity: activeImage === i ? 1 : 0,
                    transform: 'scale(1.1)'
                  }}
                />
              ))}
            </div>

            <IndicatorDots
              count={features.length}
              activeIndex={activeImage}
              onSelect={handleFeatureHover}
              labels={featureLabels}
            />

            <div
              ref={scanLineRef}
              className="absolute inset-x-0 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 h-1/4 pointer-events-none"
              style={{ top: '-25%' }}
            />
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
                  <div
                    key={i}
                    ref={el => { pulseDotRefs.current[i] = el; }}
                    className="w-1.5 h-1.5 rounded-full bg-blue-600/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdentitySection;