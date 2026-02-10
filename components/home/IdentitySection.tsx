import React, { useLayoutEffect, useRef, useState, useCallback, useMemo, memo, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';
import ServiceScene3D from './ServiceScene3D';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_INTERVAL = 5000;

// Premium Feature Card with glass morphism
interface FeatureItemProps {
  item: { title: string; text: string; icon: string };
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
  onHover: (index: number) => void;
  featureRef: (el: HTMLDivElement | null) => void;
  progressRef?: React.RefObject<HTMLDivElement>;
}

const FeatureItem = memo<FeatureItemProps>(({ item, index, isActive, onClick, onHover, featureRef, progressRef }) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = innerRef.current;
    if (!card || window.innerWidth < 1024) return;

    const xTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
    const yTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;

      xTo(xPercent * 5); // Subtle 5deg tilt
      yTo(-yPercent * 5);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(card, { rotateX: 0, rotateY: 0 });
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(index);
    }
  };

  return (
    <div
      ref={(el) => {
        (innerRef as any).current = el;
        featureRef(el);
      }}
      role="button"
      tabIndex={0}
      onClick={() => onClick(index)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover(index)}
      className={`feature-item group relative flex items-start gap-5 p-6 rounded-2xl cursor-pointer transition-all duration-300 will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${isActive
        ? 'bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-50/40 dark:from-gray-800/80 dark:via-blue-950/40 dark:to-indigo-950/30 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5 scale-[1.02] border border-blue-200/50 dark:border-blue-700/30'
        : 'bg-white/40 dark:bg-gray-800/20 hover:bg-white/70 dark:hover:bg-gray-800/40 border border-gray-100/50 dark:border-gray-700/20 hover:border-gray-200/70 dark:hover:border-gray-600/30 hover:shadow-lg hover:shadow-gray-500/5'
        }`}
      style={{ backdropFilter: 'blur(12px)', transformStyle: 'preserve-3d' }}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/10 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
      )}

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700/50 rounded-b-2xl overflow-hidden">
          <div ref={progressRef} className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left scale-x-0" />
        </div>
      )}

      <div
        className={`feature-icon relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
          ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 rotate-3'
          : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-300 group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-blue-900/30 dark:group-hover:to-indigo-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:rotate-3'
          }`}
      >
        <i className={`fa-solid ${item.icon} text-xl`} />
        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping opacity-30" style={{ animationDuration: '2s' }} />
        )}
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <h4 className={`font-semibold text-lg tracking-tight transition-colors duration-200 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
            }`}>
            {item.title}
          </h4>
          {isActive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              Active
            </span>
          )}
        </div>
        <p className={`text-sm leading-relaxed transition-colors duration-200 ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
          }`}>
          {item.text}
        </p>
      </div>

      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500'
        }`}>
        <i className={`fa-solid fa-arrow-right text-xs transition-transform duration-300 ${isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
      </div>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

// GSAP Typewriter with erasure and precise cursor
const TypewriterText = ({ text, onErasureComplete }: { text: string; onErasureComplete?: () => void }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const lastTextRef = useRef("");
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    const textEl = textRef.current;
    const cursorEl = cursorRef.current;
    if (!textEl || !cursorEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (lastTextRef.current && lastTextRef.current !== text) {
        const prevText = lastTextRef.current;
        const eraseObj = { count: prevText.length };
        tl.to(eraseObj, {
          count: 0,
          duration: Math.min(prevText.length * 0.008, 0.3),
          ease: "none",
          onUpdate: () => {
            if (textEl) textEl.innerText = prevText.slice(0, Math.floor(eraseObj.count));
          }
        });

        tl.call(() => {
          onErasureComplete?.();
        });

        tl.to({}, { duration: 0.1 });
      } else if (isInitialMount.current) {
        isInitialMount.current = false;
        onErasureComplete?.();
      }

      const typeObj = { count: 0 };
      tl.to(typeObj, {
        count: text.length,
        duration: Math.min(text.length * 0.015, 0.8),
        ease: "none",
        onUpdate: () => {
          if (textEl) textEl.innerText = text.slice(0, Math.ceil(typeObj.count));
        },
        onComplete: () => {
          lastTextRef.current = text;
        }
      });

      gsap.to(cursorEl, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)"
      });
    });

    return () => ctx.revert();
  }, [text, onErasureComplete]);

  return (
    <span className="relative inline">
      <span ref={textRef} className="whitespace-pre-wrap" />
      <span
        ref={cursorRef}
        className="inline-block w-[2px] h-[1.2em] bg-blue-500 ml-0.5 align-middle translate-y-[-1px] relative"
        aria-hidden="true"
      />
    </span>
  );
};

// Mobile title with animation
const MobileTitle = memo(({ title }: { title: string }) => {
  const elRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (elRef.current) {
      gsap.fromTo(elRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [title]);

  return (
    <h4 ref={elRef} className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
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
  const mobileTabContainerRef = useRef<HTMLDivElement>(null);
  const mobileTabIndicatorRef = useRef<HTMLDivElement>(null);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const activeFeatureProgressRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState(0);
  const activeImageRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lastTransitionRef = useRef(0);
  const TRANSITION_DEBOUNCE = 150;

  const features = useMemo(() => [
    {
      title: 'Web & Desktop Solutions',
      text: 'We build high-performance web and desktop applications built to scale with your business.',
      icon: 'fa-laptop-code'
    },
    {
      title: 'Mobile Solutions',
      text: 'We build Native and cross-platform mobile applications designed for engagement and retention.',
      icon: 'fa-mobile-screen-button'
    },
    {
      title: 'AI Solutions',
      text: 'We integrate AI into your existing systems to enhance efficiency and decision-making.',
      icon: 'fa-brain'
    }
  ], []);

  const movePill = useCallback((toIndex: number) => {
    const mobileTabs = mobileTabRefs.current;
    const tabContainer = mobileTabContainerRef.current;
    const indicator = mobileTabIndicatorRef.current;

    if (tabContainer && mobileTabs[toIndex]) {
      const tab = mobileTabs[toIndex];
      const scrollLeft = tab.offsetLeft - (tabContainer.offsetWidth / 2) + (tab.offsetWidth / 2);

      gsap.to(tabContainer, {
        scrollLeft: scrollLeft,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (indicator) {
        gsap.to(indicator, {
          x: tab.offsetLeft,
          width: tab.offsetWidth,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      mobileTabs.forEach((tabEl, i) => {
        if (tabEl) {
          gsap.to(tabEl, {
            scale: i === toIndex ? 1 : 0.95,
            opacity: i === toIndex ? 1 : 0.4,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    }
  }, []);

  const animateTransition = useCallback((fromIndex: number, toIndex: number) => {
    const now = performance.now();
    if (now - lastTransitionRef.current < TRANSITION_DEBOUNCE) return;
    lastTransitionRef.current = now;

    const container = sceneContainerRef.current;
    const toFeature = featureRefs.current[toIndex];

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    if (ctxRef.current) ctxRef.current.add(() => tl);

    if (container) {
      tl.to(container, { scale: 0.98, duration: 0.08, ease: 'power2.in' })
        .to(container, { scale: 1, duration: 0.12, ease: 'power2.out' });
    }

    if (toFeature) {
      const icon = toFeature.querySelector('.feature-icon');
      if (icon) {
        tl.fromTo(icon,
          { scale: 0.85, rotation: -10 },
          { scale: 1, rotation: 3, duration: 0.25, ease: 'back.out(1.5)' },
          0.1
        );
      }
    }

    activeImageRef.current = toIndex;
    setActiveImage(toIndex);
  }, []);

  const handleErasureComplete = useCallback(() => {
    movePill(activeImageRef.current);
  }, [movePill]);

  const startProgressAnimation = useCallback(() => {
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    const progressBar = activeFeatureProgressRef.current;
    if (progressBar) {
      gsap.set(progressBar, { scaleX: 0 });
    }

    const target = { value: 0 };
    progressTweenRef.current = gsap.to(target, {
      value: 1,
      duration: AUTO_ROTATE_INTERVAL / 1000,
      ease: 'none',
      onUpdate: () => {
        if (activeFeatureProgressRef.current) {
          activeFeatureProgressRef.current.style.transform = `scaleX(${target.value})`;
        }
      }
    });

  }, []);

  const startAutoRotate = useCallback(() => {
    if (delayedCallRef.current) delayedCallRef.current.kill();

    startProgressAnimation();

    const tick = () => {
      const current = activeImageRef.current;
      const next = (current + 1) % features.length;

      animateTransition(current, next);
      startProgressAnimation();

      delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
    };

    delayedCallRef.current = gsap.delayedCall(AUTO_ROTATE_INTERVAL / 1000, tick);
  }, [animateTransition, startProgressAnimation, features.length]);

  const stopAutoRotate = useCallback(() => {
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
      delayedCallRef.current = null;
    }
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
      progressTweenRef.current = null;
    }
  }, []);

  const handleFeatureInteraction = useCallback((index: number) => {
    setIsPaused(true);
    stopAutoRotate();
    if (index !== activeImageRef.current) {
      animateTransition(activeImageRef.current, index);
      if (activeFeatureProgressRef.current) {
        gsap.set(activeFeatureProgressRef.current, { scaleX: 0 });
      }
    }
  }, [animateTransition, stopAutoRotate]);

  const handleFeatureLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  const setFeatureRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  }, []);

  // Resume auto-rotate after interaction
  useEffect(() => {
    let timeout: any;
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
      }, 8000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPaused]);

  // Effects
  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useLayoutEffect(() => {
    const indicator = mobileTabIndicatorRef.current;
    const tab = mobileTabRefs.current[activeImage];
    if (indicator && tab) {
      movePill(activeImage);
    }
  }, [activeImage, isMobile, movePill]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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

        gsap.to(q('.bg-orb-1'), {
          y: -60, x: 40, rotation: 10, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(q('.bg-orb-2'), {
          y: 50, x: -30, rotation: -5, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2
        });
        gsap.to(q('.bg-orb-3'), {
          y: -40, x: 25, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
        });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: isMobile ? 'top 75%' : 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        });

        gsap.set([q('.feature-item'), q('.scene-container'), badgeRef.current], {
          willChange: 'transform, opacity'
        });

        masterTl.fromTo(q('.section-badge'),
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 * durationMult, ease: 'back.out(1.5)' }
        )
          .fromTo(q('.section-title .letter-reveal'),
            { y: '100%', opacity: 0, rotateX: -45 },
            {
              y: '0%',
              opacity: 1,
              rotateX: 0,
              stagger: isReduced ? 0 : (isMobile ? 0.012 : 0.025),
              duration: 0.7 * durationMult,
              ease: 'power3.out'
            },
            '-=0.3'
          )
          .fromTo(q('.section-description'),
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6 * durationMult, ease: 'power2.out' },
            '-=0.5'
          )
          .fromTo(q('.feature-item'),
            { opacity: 0, x: -30, y: 10 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              stagger: isReduced ? 0 : (isMobile ? 0.06 : 0.1),
              duration: 0.6 * durationMult,
              ease: 'power2.out',
              clearProps: 'transform'
            },
            '-=0.4'
          )
          .fromTo(q('.scene-container'),
            {
              clipPath: 'inset(15% 0 15% 0 round 2rem)',
              opacity: 0,
              scale: 0.96,
              y: 30
            },
            {
              clipPath: 'inset(0% 0% 0% 0% round 2rem)',
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1 * durationMult,
              ease: 'expo.out'
            },
            '<+=0.15'
          );
      });

      mm.add("(min-width: 768px)", () => {
        gsap.to(q('.parallax-text'), {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

    }, section);

    return () => ctxRef.current?.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
      className="relative z-10 py-16 md:py-32 lg:py-40 px-6 overflow-hidden bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-900/50 dark:via-gray-950 dark:to-gray-900/30"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="parallax-text absolute -top-20 -left-10 text-[25vw] font-black text-gray-900/[0.02] dark:text-white/[0.015] select-none tracking-tighter leading-none">
          01
        </div>
        <div className="bg-orb-1 absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-purple-400/10 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-purple-500/10" />
        <div className="bg-orb-2 absolute bottom-1/3 left-[5%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-35 bg-gradient-to-tr from-indigo-400/25 via-purple-400/15 to-pink-400/10 dark:from-indigo-500/15 dark:via-purple-500/10 dark:to-pink-500/5" />
        <div className="bg-orb-3 absolute top-2/3 right-1/4 w-[300px] h-[300px] rounded-full blur-[60px] opacity-30 bg-gradient-to-bl from-cyan-400/20 to-blue-400/15 dark:from-cyan-500/10 dark:to-blue-500/10" />
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
        <div className="lg:hidden w-full text-center mb-4 order-1">
          <div className="section-badge inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">What we do</span>
          </div>
          <h3 className="section-title text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight" style={{ perspective: '800px' }}>
            <SplitText text="Architecting" className="block" /> <br />
            <SplitText isGradient={true} text="Digital Solutions" />
          </h3>
        </div>

        <div className="lg:hidden w-full order-2 mb-0">
          <div
            ref={mobileTabContainerRef}
            className="relative flex p-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto no-scrollbar gap-1.5 shadow-lg shadow-gray-500/5 scroll-px-4"
          >
            <div
              ref={mobileTabIndicatorRef}
              className="absolute top-1.5 bottom-1.5 left-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-500/25 pointer-events-none z-0"
              style={{ width: 0 }}
            />
            {features.map((item, i) => (
              <button
                key={i}
                ref={(el) => { mobileTabRefs.current[i] = el; }}
                onClick={() => handleFeatureInteraction(i)}
                className={`relative flex-none py-3 px-6 rounded-xl text-xs font-semibold whitespace-nowrap outline-none transition-colors duration-300 z-10 ${activeImage === i
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                  }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div ref={badgeRef} className="section-badge inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Our Services</span>
          </div>

          <h3
            className="section-title text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-[0.95] text-gray-900 dark:text-white tracking-tight"
            style={{ perspective: '1000px' }}
          >
            <SplitText text="Architecting" className="block" /> <br />
            <SplitText isGradient={true} text="Digital Solutions" />
          </h3>

          <p className="section-description text-gray-500 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
            We transform ambitious ideas into powerful digital products that drive growth and delight users.
          </p>

          <div role="list" aria-label="Our Services" className="feature-list space-y-3">
            {features.map((item, i) => (
              <FeatureItem
                key={i}
                item={item}
                index={i}
                isActive={activeImage === i}
                onClick={handleFeatureInteraction}
                onHover={handleFeatureInteraction}
                featureRef={setFeatureRef(i)}
                progressRef={activeImage === i ? activeFeatureProgressRef : undefined}
              />
            ))}
          </div>
        </div>

        <div className="relative w-full order-3 lg:order-none">
          <div className="scene-container relative aspect-square md:aspect-[4/4] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100/50 to-gray-50/30 dark:from-gray-800/50 dark:to-gray-900/30 shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-200/30 dark:border-gray-700/20">
            <div
              ref={sceneContainerRef}
              className="w-full h-full overflow-hidden rounded-3xl relative cursor-grab active:cursor-grabbing touch-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <ServiceScene3D activeIndex={activeImage} isMobile={isMobile} isVisible={isVisible} />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-950 dark:via-gray-950/95 pt-20 lg:hidden flex flex-col items-center text-center z-10">
              <MobileTitle title={features[activeImage].title} />
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[260px] mx-auto min-h-[2.5rem]">
                <TypewriterText text={features[activeImage].text} onErasureComplete={handleErasureComplete} />
              </p>
              <div className="mt-5 flex gap-2">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFeatureInteraction(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === i
                      ? 'w-6 bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] aspect-square pointer-events-none">
            <div className="absolute inset-0 border border-gray-200/30 dark:border-gray-700/20 rounded-full" />
            <div className="absolute inset-6 border border-gray-200/20 dark:border-gray-700/15 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(IdentitySection);