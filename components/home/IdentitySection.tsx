import React, { useLayoutEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

import webAppImg from '../../assets/web-app-dev.jpg';
import mobileAppImg from '../../assets/mobile-app-dev.jpg';
import aiIntegrationImg from '../../assets/ai-integration.jpg';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_INTERVAL = 5000;

// Memoized Feature Item with enhanced design
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
    className={`feature-item group relative flex items-start gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-500 ${isActive
      ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 shadow-lg shadow-blue-500/5 translate-x-2'
      : 'hover:bg-gray-50/50 dark:hover:bg-gray-900/30'
      }`}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={onLeave}
  >
    {/* Glow accent for active state */}
    {isActive && (
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-transparent opacity-50 blur-sm pointer-events-none" />
    )}

    <div
      className={`feature-icon relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${isActive
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 -rotate-6 scale-110'
        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 group-hover:border-blue-300 dark:group-hover:border-blue-700 group-hover:-rotate-6 group-hover:scale-105'
        }`}
    >
      <i className={`fa-solid ${item.icon} text-lg`} />
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
      )}
    </div>

    <div className="flex-1 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <h4 className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
          }`}>
          {item.title}
        </h4>
        {isActive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">Active</span>
          </div>
        )}
      </div>
      <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
        }`}>
        {item.text}
      </p>
    </div>

    {/* Arrow indicator */}
    <div className={`self-center transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
      }`}>
      <i className="fa-solid fa-chevron-right text-blue-500 text-sm" />
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

// Enhanced Indicator Dots with progress ring
interface IndicatorDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  labels: string[];
  progressRingRef: React.RefObject<SVGCircleElement | null>;
}

const IndicatorDots = memo<IndicatorDotsProps>(({ count, activeIndex, onSelect, labels, progressRingRef }) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className="relative group"
        aria-label={`View ${labels[i]}`}
      >
        {/* Progress ring for active dot */}
        {activeIndex === i && (
          <svg className="absolute -inset-1 w-5 h-5 -rotate-90" viewBox="0 0 20 20">
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />
            <circle
              ref={progressRingRef}
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="rgba(96,165,250,1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="0 50.26"
              className="transition-none"
            />
          </svg>
        )}
        <span
          className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i
            ? 'bg-blue-400 scale-110'
            : 'bg-white/40 hover:bg-white/70 group-hover:scale-110'
            }`}
        />
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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const progressRingRef = useRef<SVGCircleElement | null>(null);

  // Track last transition time to prevent rapid-fire transitions
  const lastTransitionRef = useRef(0);
  const TRANSITION_DEBOUNCE = 200;

  // Memoize features to prevent re-creation
  const features = useMemo(() => [
    {
      title: 'Web Applications',
      text: 'Crafting responsive, performant web experiences that scale with your business needs.',
      icon: 'fa-globe',
      image: webAppImg
    },
    {
      title: 'Mobile Applications',
      text: 'Building native and cross-platform mobile apps that users love to engage with.',
      icon: 'fa-mobile-screen',
      image: mobileAppImg
    },
    {
      title: 'AI Integration',
      text: 'Embedding intelligent AI capabilities to automate workflows and enhance user experience.',
      icon: 'fa-microchip',
      image: aiIntegrationImg
    }
  ], []);

  // Feature labels for accessibility
  const featureLabels = useMemo(() => features.map(f => f.title), [features]);

  // Optimized transition animation with morphing clip-path
  const animateTransition = useCallback((fromIndex: number, toIndex: number) => {
    const now = performance.now();
    if (now - lastTransitionRef.current < TRANSITION_DEBOUNCE) return;
    lastTransitionRef.current = now;

    const fromImage = imageRefs.current[fromIndex];
    const toImage = imageRefs.current[toIndex];
    const container = imageContainerRef.current;

    if (!container) return;

    // Single consolidated timeline
    const tl = gsap.timeline({
      defaults: { overwrite: 'auto', ease: 'power3.inOut' }
    });

    // Image morphing transition
    if (fromImage && toImage) {
      // Prepare next image
      gsap.set(toImage, {
        opacity: 0,
        scale: 1.15,
        filter: 'blur(6px) brightness(1.1)'
      });

      // Animate out current image
      tl.to(fromImage, {
        opacity: 0,
        scale: 1.02,
        filter: 'blur(3px) brightness(0.9)',
        duration: 0.5
      }, 0);

      // Animate in new image with slight delay
      tl.to(toImage, {
        opacity: 1,
        scale: 1.08,
        filter: 'blur(0px) brightness(1)',
        duration: 0.7
      }, 0.1);

      // Container morph effect
      tl.fromTo(container,
        {
          clipPath: 'inset(0% 0% 0% 0% round 2.5rem)',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)'
        },
        {
          clipPath: 'inset(2% 2% 2% 2% round 2.5rem)',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
          duration: 0.3,
          ease: 'power2.in'
        },
        0
      ).to(container, {
        clipPath: 'inset(0% 0% 0% 0% round 2.5rem)',
        boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)',
        duration: 0.4,
        ease: 'power2.out'
      }, 0.3);
    }

    setActiveImage(toIndex);
  }, []);

  // Progress animation with DOM-only updates (no React state for performance)
  const startProgressAnimation = useCallback(() => {
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    // Reset progress ring immediately
    if (progressRingRef.current) {
      progressRingRef.current.setAttribute('stroke-dasharray', '0 50.26');
    }

    progressTweenRef.current = gsap.to({ value: 0 }, {
      value: 1,
      duration: AUTO_ROTATE_INTERVAL / 1000,
      ease: 'none',
      onUpdate: function () {
        // Direct DOM update bypasses React re-renders
        if (progressRingRef.current) {
          const progress = this.targets()[0].value;
          progressRingRef.current.setAttribute('stroke-dasharray', `${progress * 50.26} 50.26`);
        }
      }
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

  // Handle hover interaction
  const handleFeatureHover = useCallback((index: number) => {
    setIsPaused(true);
    stopAutoRotate();
    if (index !== activeImage) {
      animateTransition(activeImage, index);
      // Reset progress ring via DOM
      if (progressRingRef.current) {
        progressRingRef.current.setAttribute('stroke-dasharray', '0 50.26');
      }
    }
  }, [activeImage, animateTransition, stopAutoRotate]);

  // Resume auto-rotate after hover ends
  const handleFeatureLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Stable ref callback factory
  const setFeatureRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  }, []);

  // Main animation setup - useLayoutEffect for synchronous setup
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ctxRef.current = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Entrance animation
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 0.6
        }
      });

      entranceTl.fromTo(section,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out' }
      );

      mm.add("(min-width: 768px)", () => {
        // Parallax background number
        gsap.to('.identity-parallax-bg', {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // Floating badge animation
        if (badgeRef.current) {
          gsap.to(badgeRef.current, {
            y: -20,
            x: 10,
            rotation: 2,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            force3D: true
          });
        }
      });

      // Title letters animation
      const letterReveals = section.querySelectorAll('.identity-title .letter-reveal');
      if (letterReveals.length > 0) {
        gsap.fromTo(letterReveals,
          {
            y: '120%',
            opacity: 0,
            rotateX: -60
          },
          {
            scrollTrigger: {
              trigger: '.identity-title',
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.6
            },
            y: '0%',
            opacity: 1,
            rotateX: 0,
            stagger: 0.02,
            ease: 'power3.out'
          }
        );
      }

      // Description fade
      gsap.fromTo('.identity-description',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.identity-description',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Feature items stagger
      gsap.fromTo('.feature-item',
        { opacity: 0, x: -30 },
        {
          scrollTrigger: {
            trigger: '.feature-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      // Image wrapper reveal
      gsap.fromTo('.image-reveal-wrapper',
        {
          clipPath: 'inset(10% 10% 10% 10% round 3rem)',
          opacity: 0,
          scale: 0.92
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 3rem)',
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.image-reveal-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Badge entrance
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: badgeRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, section);

    return () => ctxRef.current?.revert();
  }, []);

  // Intersection Observer for visibility
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '50px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Rotation control effect
  useLayoutEffect(() => {
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
      className="reveal-on-scroll relative z-10 py-24 md:py-40 lg:py-56 px-6 border-t border-gray-100 dark:border-gray-900/30 overflow-hidden bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="identity-parallax-bg absolute top-0 -left-10 text-[30vw] font-black text-blue-600/[0.03] dark:text-white/[0.02] select-none tracking-tighter leading-none"
        >
          01
        </div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
        {/* Left content */}
        <div>
          <div className="identity-intro-badge inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">What We Do</span>
          </div>

          <h3
            className="identity-title text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-8 leading-[0.9] text-gray-900 dark:text-white tracking-tight"
            style={{ perspective: '1000px' }}
          >
            <SplitText text="Architecting" className="block" />
            <SplitText isGradient={true} text="Solutions" />
          </h3>

          <p className="identity-description text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-12 max-w-lg">
            We craft intelligent systems that transform ideas into impactful solutions, driving innovation at every step.
          </p>

          <div className="feature-list space-y-4" style={{ perspective: '800px' }}>
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

        {/* Right image section */}
        <div className="reveal-child relative" style={{ perspective: '1200px' }}>
          <div
            className="image-reveal-wrapper relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 shadow-2xl shadow-gray-900/10 dark:shadow-black/30"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />

            <div
              ref={imageContainerRef}
              className="w-full h-full overflow-hidden rounded-[2.5rem] relative shadow-inner"
            >
              {features.map((item, i) => (
                <img
                  key={i}
                  ref={(el) => { imageRefs.current[i] = el; }}
                  src={item.image}
                  alt={item.title}
                  width="600"
                  height="750"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className={`inner-image absolute inset-0 w-full h-full object-cover ${activeImage === i ? '' : 'pointer-events-none'
                    }`}
                  style={{
                    opacity: activeImage === i ? 1 : 0,
                    transform: 'scale(1.08)'
                  }}
                />
              ))}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <IndicatorDots
              count={features.length}
              activeIndex={activeImage}
              onSelect={handleFeatureHover}
              labels={featureLabels}
              progressRingRef={progressRingRef}
            />

            {/* Floating label */}
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {features[activeImage].title}
              </span>
            </div>
          </div>

          {/* Stats badge */}
          <div
            ref={badgeRef}
            className="absolute -bottom-8 -right-4 md:-right-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-2xl shadow-gray-900/10 dark:shadow-black/40 backdrop-blur-xl z-20"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-heading tracking-tight">99.9</span>
                <span className="text-xl font-bold text-blue-600">%</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Uptime
              </div>
              <div className="flex gap-1.5 mt-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{
                      opacity: 0.4 + (i * 0.15),
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Decorative rings */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square">
            <div className="absolute inset-0 border border-blue-200/20 dark:border-blue-500/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-8 border border-indigo-200/15 dark:border-indigo-500/10 rounded-full animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(IdentitySection);