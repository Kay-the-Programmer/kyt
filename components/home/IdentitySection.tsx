import React, { useLayoutEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';
import ServiceScene3D from './ServiceScene3D';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_INTERVAL = 5000;

// Memoized Feature Item with enhanced design and accessibility
interface FeatureItemProps {
  item: { title: string; text: string; icon: string };
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
  onHover: (index: number) => void; // still useful for desktop hover
  featureRef: (el: HTMLDivElement | null) => void;
  progressRef?: React.RefObject<HTMLDivElement>;
}

const FeatureItem = memo<FeatureItemProps>(({ item, index, isActive, onClick, onHover, featureRef, progressRef }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(index);
    }
  };

  return (
    <div
      ref={featureRef}
      role="button"
      tabIndex={0}
      onClick={() => onClick(index)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover(index)}
      className={`feature-item group relative flex items-start gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-500 will-change-transform outline-none focus:ring-2 focus:ring-blue-500/50 ${isActive
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 shadow-lg shadow-blue-500/5 translate-x-2 border-l-4 border-blue-500'
        : 'hover:bg-gray-50/50 dark:hover:bg-gray-900/30 border-l-4 border-transparent'
        }`}
    >
      {/* Glow accent for active state */}
      {isActive && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-transparent opacity-50 blur-sm pointer-events-none" />
      )}

      {/* Active Progress Line (Desktop) */}
      {isActive && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-bl-2xl opacity-80 pointer-events-none overflow-hidden w-full">
          <div ref={progressRef} className="h-full bg-white/30 w-full origin-left scale-x-0" />
        </div>
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
        </div>
        <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
          }`}>
          {item.text}
        </p>
      </div>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useLayoutEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, 30); // Speed of typing
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

// Optimized Mobile Title Component
const MobileTitle = memo(({ title }: { title: string }) => {
  const elRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (elRef.current) {
      gsap.fromTo(elRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [title]);

  return (
    <h4 ref={elRef} className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
      <SplitText text={title} />
    </h4>
  );
});
MobileTitle.displayName = 'MobileTitle';

const IdentitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const activeFeatureProgressRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track last transition time to prevent rapid-fire transitions
  const lastTransitionRef = useRef(0);
  const TRANSITION_DEBOUNCE = 200;

  // Handle mobile detection safely
  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize features to prevent re-creation
  const features = useMemo(() => [
    {
      title: 'Web/Desktop Applications',
      text: 'Crafting performant web and desktop experiences that scale with your business needs.',
      icon: 'fa-globe'
    },
    {
      title: 'Mobile Applications',
      text: 'Building native and cross-platform mobile apps that users love to engage with.',
      icon: 'fa-mobile-screen'
    },
    {
      title: 'AI Integration',
      text: 'Embedding intelligent AI capabilities to automate workflows and enhance user experience.',
      icon: 'fa-microchip'
    }
  ], []);

  // Enhanced transition animation with dynamic effects
  const animateTransition = useCallback((fromIndex: number, toIndex: number) => {
    const now = performance.now();
    if (now - lastTransitionRef.current < TRANSITION_DEBOUNCE) return;
    lastTransitionRef.current = now;

    const container = sceneContainerRef.current;
    const fromFeature = featureRefs.current[fromIndex];
    const toFeature = featureRefs.current[toIndex];

    // Use context if available to track these tweens
    const addTween = <T extends gsap.core.Tween | gsap.core.Timeline>(tween: T): T => {
      if (ctxRef.current && ctxRef.current.add) {
        ctxRef.current.add(() => tween);
      }
      return tween;
    };

    const tl = addTween(gsap.timeline({
      defaults: { overwrite: 'auto' }
    }));

    // Container glow pulse and scale effect
    if (container) {
      tl.to(container, {
        scale: 0.95,
        filter: 'brightness(1.3) blur(2px)',
        duration: 0.15,
        ease: 'power2.in'
      })
        .to(container, {
          scale: 1.02,
          filter: 'brightness(1.1) blur(0px)',
          duration: 0.25,
          ease: 'elastic.out(1, 0.5)'
        })
        .to(container, {
          scale: 1,
          filter: 'brightness(1) blur(0px)',
          duration: 0.3,
          ease: 'power2.out'
        });
    }

    // Animate feature cards
    if (fromFeature) {
      tl.to(fromFeature, {
        x: 0,
        opacity: 0.7, // dim slightly
        scale: 1,
        duration: 0.3,
        borderColor: 'transparent',
        ease: 'power2.out'
      }, 0);
    }

    if (toFeature) {
      // Highlight new one immediately for responsiveness
      const icon = toFeature.querySelector('.feature-icon');
      // tl.to(toFeature, { ...opacity:1 ...}, 0) is handled by className transition mostly,
      // but we can add pop effect here
      if (icon) {
        tl.fromTo(icon,
          { scale: 0.8, rotation: -15 },
          { scale: 1.1, rotation: 0, duration: 0.3, ease: 'back.out(2)' },
          0.15
        ).to(icon, { scale: 1, duration: 0.2 }, 0.45);
      }
    }

    // Mobile Tabs Animation and Scrolling
    const mobileTabs = mobileTabRefs.current;
    if (mobileTabs[toIndex]) {
      // Scroll Active Tab into view
      mobileTabs[toIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    setActiveImage(toIndex);
  }, []);

  // Progress animation with DOM-only updates (no React state for performance)
  const startProgressAnimation = useCallback(() => {
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    // Reset progress bar (using activeFeatureProgressRef which we attach dynamically or update via query)
    const progressBar = activeFeatureProgressRef.current;
    if (progressBar) {
      gsap.set(progressBar, { scaleX: 0 });
    }

    progressTweenRef.current = gsap.to({ value: 0 }, {
      value: 1,
      duration: AUTO_ROTATE_INTERVAL / 1000,
      ease: 'none',
      onUpdate: function () {
        if (activeFeatureProgressRef.current) {
          const progress = this.targets()[0].value;
          // Invert the masking or just scale the bar
          activeFeatureProgressRef.current.style.transform = `scaleX(${progress})`;
        }
      }
    });
  }, []);

  // Auto-rotation logic with cleanup - uses stable tick pattern
  const startAutoRotate = useCallback(() => {
    if (delayedCallRef.current) delayedCallRef.current.kill();

    startProgressAnimation();

    const tick = () => {
      // Get current index outside of state setter for clarity
      const current = activeImage;
      const next = (current + 1) % features.length;

      animateTransition(current, next);
      startProgressAnimation();

      delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
    };

    delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
  }, [activeImage, animateTransition, startProgressAnimation, features.length]);

  const stopAutoRotate = useCallback(() => {
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
      delayedCallRef.current = null;
    }
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
      progressTweenRef.current = null;
    }
    // Pause progress bar visual
    if (activeFeatureProgressRef.current) {
      // Optionally freeze it or reset it. Let's keep it frozen to show pause
      // gsap.set(activeFeatureProgressRef.current, { scaleX: 0 }); 
    }
  }, []);

  // Handle manual interaction (Click or Hover)
  const handleFeatureInteraction = useCallback((index: number) => {
    setIsPaused(true);
    stopAutoRotate();
    if (index !== activeImage) {
      animateTransition(activeImage, index);
      // Reset progress bar
      if (activeFeatureProgressRef.current) {
        gsap.set(activeFeatureProgressRef.current, { scaleX: 0 });
      }
    }
  }, [activeImage, animateTransition, stopAutoRotate]);

  const handleFeatureLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Stable ref callback factory
  const setFeatureRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  }, []);

  // Main animation setup
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Use GSAP's selector utility for efficient querying scoped to this component
    const q = gsap.utils.selector(section);

    ctxRef.current = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
        isReduced: "(prefers-reduced-motion: reduce)"
      }, (context) => {
        const { isMobile, isReduced } = context.conditions as { isMobile: boolean, isReduced: boolean };
        const durationMult = isMobile ? 0.8 : 1;

        // Background Animation (Continuous Bubble Drift)
        gsap.to(q('.bg-bubble-1'), {
          y: -50, x: 30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(q('.bg-bubble-2'), {
          y: 40, x: -20, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
        });


        // Master timeline for coordinated entrance
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: isMobile ? 'top 70%' : 'top 80%', // Triggers earlier on mobile
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        });

        // 0. Set Initial states (Hardware Acceleration)
        gsap.set([q('.feature-item'), q('.image-reveal-wrapper'), badgeRef.current], {
          willChange: 'transform, opacity'
        });

        // 1. Initial Badge Pop
        masterTl.fromTo(q('.identity-intro-badge'),
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 * durationMult, ease: 'back.out(1.7)' }
        )

          // 2. Title Stagger (Letters)
          .fromTo(q('.identity-title .letter-reveal'),
            { y: '120%', opacity: 0, rotateX: -60 },
            {
              y: '0%',
              opacity: 1,
              rotateX: 0,
              stagger: isReduced ? 0 : (isMobile ? 0.015 : 0.03),
              duration: 0.8 * durationMult,
              ease: 'power3.out'
            },
            '-=0.4' // Overlap with badge
          )

          // 3. Description Fade Up
          .fromTo(q('.identity-description'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 * durationMult, ease: 'power2.out' },
            '-=0.6'
          )

          // 4. Features Stagger
          .fromTo(q('.feature-item'),
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              stagger: isReduced ? 0 : (isMobile ? 0.08 : 0.12),
              duration: 0.8 * durationMult,
              ease: 'power2.out',
              clearProps: 'transform' // Clear transform after animation to avoid conflict with hover effects
            },
            '-=0.6'
          )

          // 5. Image Reveal (Simultaneous with features)
          .fromTo(q('.image-reveal-wrapper'),
            {
              clipPath: 'inset(20% 0 20% 0 round 3rem)', // Vertical reveal feel
              opacity: 0,
              scale: 0.95,
              y: 40
            },
            {
              clipPath: 'inset(0% 0% 0% 0% round 3rem)',
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2 * durationMult,
              ease: 'expo.out'
            },
            '<+=0.2' // Start slightly after features start
          )

          // 6. Stats Badge Pop
          .fromTo(badgeRef.current,
            { opacity: 0, scale: 0.5, rotation: -10 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8 * durationMult,
              ease: 'elastic.out(1, 0.6)'
            },
            '-=0.8'
          );
      });

      // Parallax effects (separate scroll-bound triggers)
      mm.add("(min-width: 768px)", () => {
        // Background Number Parallax
        gsap.to(q('.identity-parallax-bg'), {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // Floating badge continuous hover effect (after entrance)
        if (badgeRef.current) {
          gsap.to(badgeRef.current, {
            y: -15,
            x: 5,
            rotation: 2,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2 // Wait for entrance to finish
          });
        }
      });

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
      className="relative z-10 py-12 md:py-40 lg:py-56 px-6 border-t border-gray-100 dark:border-gray-900/30 overflow-hidden bg-transparent"
    >
      {/* Background decorative elements with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="identity-parallax-bg absolute top-0 -left-10 text-[30vw] font-black text-blue-600/[0.03] dark:text-white/[0.02] select-none tracking-tighter leading-none"
        >
          01
        </div>
        <div className="bg-bubble-1 absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl opacity-60" />
        <div className="bg-bubble-2 absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-24 items-center relative z-10">

        {/* MOBILE HEADER */}
        <div className="lg:hidden w-full text-center mb-6 order-1">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">What We Do</span>
          </div>
          <h3 className="text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
            <SplitText text="Architecting" className="block" /> <br />
            <SplitText isGradient={true} text="Solutions" />
          </h3>
        </div>

        {/* MOBILE TABS */}
        <div className="lg:hidden w-full order-2 mb-8">
          <div className="flex p-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto no-scrollbar gap-1 shadow-inner scroll-smooth">
            {features.map((item, i) => (
              <button
                key={i}
                ref={(el) => { mobileTabRefs.current[i] = el; }}
                onClick={() => handleFeatureInteraction(i)}
                className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${activeImage === i
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {item.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* LEFT CONTENT - Desktop Only */}
        <div className="hidden lg:block">
          <div ref={badgeRef} className="identity-intro-badge inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">What We Do</span>
          </div>

          <h3
            className="identity-title text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-8 leading-[0.9] text-gray-900 dark:text-white tracking-tight"
            style={{ perspective: '1000px' }}
          >
            <SplitText text="Architecting" className="block" /> <br />
            <SplitText isGradient={true} text="Solutions" />
          </h3>

          <p className="identity-description text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-12 max-w-lg">
            We craft powerfully productive systems that transform ideas into impactful solutions.
          </p>

          <div role="list" aria-label="Our Services" className="feature-list space-y-4" style={{ perspective: '800px' }}>
            {features.map((item, i) => (
              <FeatureItem
                key={i}
                item={item}
                index={i}
                isActive={activeImage === i}
                onClick={handleFeatureInteraction}
                onHover={handleFeatureInteraction} // keep hover behavior on desktop
                featureRef={setFeatureRef(i)}
                progressRef={activeImage === i ? activeFeatureProgressRef : undefined}
              />
            ))}
          </div>
        </div>

        {/* RIGHT 3D SCENE */}
        <div className="relative w-full order-3 lg:order-none" style={{ perspective: '1200px' }}>
          <div
            className="image-reveal-wrapper relative aspect-square md:aspect-square lg:aspect-[4/5] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-transparent shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20"
          >
            <div
              ref={sceneContainerRef}
              className="w-full h-full overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] relative cursor-grab active:cursor-grabbing touch-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <ServiceScene3D activeIndex={activeImage} isMobile={isMobile} isVisible={isVisible} />
            </div>

            {/* Mobile Description Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white/95 via-white/90 to-transparent dark:from-gray-950/95 dark:via-gray-900/90 pt-24 lg:hidden flex flex-col items-center text-center z-10 backdrop-blur-[2px]">
              <MobileTitle title={features[activeImage].title} />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-[280px] mx-auto min-h-[3rem] font-medium">
                <TypewriterText text={features[activeImage].text} />
              </p>
              <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80"></div>
            </div>
          </div>

          {/* Decorative rings - kept as is */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square pointer-events-none">
            <div className="absolute inset-0 border border-blue-200/20 dark:border-blue-500/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-8 border border-indigo-200/15 dark:border-indigo-500/10 rounded-full animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(IdentitySection);