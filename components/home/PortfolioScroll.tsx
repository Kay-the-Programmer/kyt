import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SalePilotPanel from './portfolio/SalePilotPanel';
import { CursorGlow, ScrollDirectionIndicator, PortfolioProgressBar } from './portfolio/ScrollComponents';
import { useSharedMousePos, globalMousePos } from '../../hooks/useSharedMousePos';

// Lazy load non-initial panels for viewport-based rendering
const StatsPanel = React.lazy(() => import('./portfolio/StatsPanel'));
const VisionaryPanel = React.lazy(() => import('./portfolio/VisionaryPanel'));
const ImpactPanel = React.lazy(() => import('./portfolio/ImpactPanel'));

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Context to share scroll progress with lazy panels
const ScrollProgressContext = createContext<number>(0);

// Scroll-progress-based lazy panel wrapper for horizontal scroll
// Uses render prop pattern to defer React.lazy evaluation until needed
interface LazyPanelProps {
  render: () => React.ReactNode; // Render function - only called when ready
  progressThreshold: number; // 0-1, when this panel should start rendering
  isMobile: boolean;
}

const LazyPanel: React.FC<LazyPanelProps> = ({ render, progressThreshold, isMobile }) => {
  const scrollProgress = useContext(ScrollProgressContext);
  const [hasRendered, setHasRendered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // For mobile, use IntersectionObserver; for desktop, use scroll progress
  useEffect(() => {
    if (isMobile) {
      const element = ref.current;
      if (!element || hasRendered) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasRendered(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [isMobile, hasRendered]);

  // For desktop horizontal scroll, trigger based on scroll progress
  useEffect(() => {
    if (!isMobile && scrollProgress >= progressThreshold && !hasRendered) {
      setHasRendered(true);
    }
  }, [scrollProgress, progressThreshold, isMobile, hasRendered]);

  return (
    <div ref={ref}>
      {hasRendered ? (
        <Suspense fallback={
          <div className="horizontal-panel w-screen lg:w-[100vw] h-auto lg:h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        }>
          {render()}
        </Suspense>
      ) : (
        <div className="horizontal-panel w-screen lg:w-[100vw] h-auto lg:h-screen flex items-center justify-center bg-transparent">
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin opacity-20" />
        </div>
      )}
    </div>
  );
};


// Throttle utility for performance
const throttle = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
};

const PortfolioScroll = React.forwardRef<HTMLDivElement>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const gridLayer1Ref = useRef<HTMLDivElement>(null);
  const gridLayer2Ref = useRef<HTMLDivElement>(null);
  const gridLayer3Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const magneticAreasRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileProgressRef = useRef<HTMLDivElement | null>(null);
  const connectionLinesRef = useRef<HTMLDivElement[]>([]);

  // Cache for interactive element check
  const interactiveCheckCache = useRef<{ x: number; y: number; result: boolean; time: number }>({
    x: 0, y: 0, result: false, time: 0
  });

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  // Track scroll progress to trigger lazy panel rendering
  const [scrollProgress, setScrollProgress] = useState(0);

  // Store the desktop horizontal scroll tween for panel animations
  const [desktopTween, setDesktopTween] = useState<gsap.core.Tween | null>(null);

  useSharedMousePos();

  // Memoized throttled resize handler
  const checkMobile = useMemo(() =>
    throttle(() => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(prev => prev !== mobile ? mobile : prev);
    }, 150),
    []);

  // Detect mobile/desktop with throttled resize
  useEffect(() => {
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  useEffect(() => {
    // Refresh scroll triggers after mount to ensure correct dimensions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Initialize magnetic hover effects with proper cleanup
  useEffect(() => {
    if (isMobile) return;

    const magneticAreas = magneticAreasRef.current.filter(Boolean) as HTMLDivElement[];
    const eventHandlers = new Map<HTMLDivElement, { move: (e: MouseEvent) => void; leave: () => void }>();

    magneticAreas.forEach((areaEl) => {
      // Cache bounding rect and recalculate on resize
      let bounding = areaEl.getBoundingClientRect();

      const handleMove = throttle((e: MouseEvent) => {
        const x = e.clientX - bounding.left;
        const y = e.clientY - bounding.top;
        const xPercent = (x / bounding.width - 0.5) * 2;
        const yPercent = (y / bounding.height - 0.5) * 2;

        gsap.to(areaEl, {
          x: xPercent * 15,
          y: yPercent * 15,
          rotateY: xPercent * 5,
          rotateX: -yPercent * 5,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, 16); // ~60fps

      const handleLeave = () => {
        gsap.to(areaEl, {
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        });
      };

      // Update bounding on resize
      const updateBounding = throttle(() => {
        bounding = areaEl.getBoundingClientRect();
      }, 100);

      eventHandlers.set(areaEl, { move: handleMove, leave: handleLeave });

      areaEl.addEventListener('mousemove', handleMove, { passive: true });
      areaEl.addEventListener('mouseleave', handleLeave, { passive: true });
      window.addEventListener('resize', updateBounding, { passive: true });
    });

    return () => {
      magneticAreas.forEach((areaEl) => {
        const handlers = eventHandlers.get(areaEl);
        if (handlers) {
          areaEl.removeEventListener('mousemove', handlers.move);
          areaEl.removeEventListener('mouseleave', handlers.leave);
        }
      });
      eventHandlers.clear();
    };
  }, [isMobile]);

  useEffect(() => {
    const container = innerRef.current;
    const horizontal = horizontalRef.current;
    const progressBar = progressBarRef.current;
    const cursorGlow = cursorGlowRef.current;

    if (!container || !horizontal || !progressBar) return;

    // Define ticker callback at top level of effect for scope visibility
    const updateGlowPos = () => {
      if (!cursorGlow) return;

      if (!globalMousePos.active) {
        gsap.to(cursorGlow, { opacity: 0, scale: 0, duration: 0.3, overwrite: 'auto' });
        return;
      }

      const currentOpacity = parseFloat(cursorGlow.style.opacity || '0');
      if (currentOpacity < 0.1) {
        gsap.to(cursorGlow, { opacity: 1, scale: 1, duration: 0.4, overwrite: 'auto' });
      }

      // Use quickTo if available, otherwise direct set (fallback handled in setup)
      if ((cursorGlow as any)._gsap?.xTo) {
        (cursorGlow as any)._gsap.xTo(globalMousePos.x);
        (cursorGlow as any)._gsap.yTo(globalMousePos.y);
      } else {
        // Fallback if quickTo hasn't initialized yet (rare)
        gsap.set(cursorGlow, { left: globalMousePos.x, top: globalMousePos.y });
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Optimized Cursor Glow
      if (cursorGlow && cursorGlow instanceof HTMLElement && !isMobile) {
        gsap.set(cursorGlow, { scale: 0, opacity: 0 });

        // Initialize quickTo and store on element property for easy access
        const xTo = gsap.quickTo(cursorGlow, "left", { duration: 0.6, ease: "power2.out" });
        const yTo = gsap.quickTo(cursorGlow, "top", { duration: 0.6, ease: "power2.out" });

        // Safely assign to _gsap without overwriting
        const el = cursorGlow as any;
        if (!el._gsap) el._gsap = {};
        Object.assign(el._gsap, { xTo, yTo });

        gsap.ticker.add(updateGlowPos);
      }

      // 2. Desktop Horizontal Scroll
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');
        const scrollWidth = horizontal.scrollWidth - window.innerWidth;

        // Progress Bar
        gsap.set(progressBar, { scaleX: 0, transformOrigin: "0% 50%" });

        const scrollTween = gsap.to(horizontal, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1, // Smooth scrub
            end: () => `+=${scrollWidth}`,
            onUpdate: (self) => {
              gsap.set(progressBar, { scaleX: self.progress });
              setScrollProgress(self.progress);
            }
          }
        });

        // Store tween for panel animations
        setDesktopTween(scrollTween);

        // Background Parallax (optimized)
        const bgLayers = [
          { ref: gridLayer3Ref.current, x: -scrollWidth * 0.5 },
          { ref: gridLayer2Ref.current, x: -scrollWidth * 0.25 },
          { ref: gridLayer1Ref.current, x: -scrollWidth * 0.1 },
          { ref: glowRef.current, x: -scrollWidth * 0.3 }
        ];

        bgLayers.forEach(layer => {
          if (layer.ref) {
            gsap.to(layer.ref, {
              x: layer.x,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: () => `+=${scrollWidth}`,
                scrub: true
              }
            });
          }
        });

        // Centralized Panel Animations
        panels.forEach((panel, i) => {
          const q = gsap.utils.selector(panel);

          // Special handling for First Panel (SalePilot)
          if (i === 0) {
            // 1. Initial Entrance - NOW TRIGGERED BY VIEWPORT 
            // Only play when the Portfolio section actually enters the view
            const chars = q('.letter-reveal');
            const reveals = q('.reveal-target');
            const images = q('img, .floating-card');

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: container,
                start: "top 60%", // Triggers when top of container is 60% down viewport
                toggleActions: "play none none reverse"
              }
            });

            if (chars.length) {
              // Dramatic Flip In
              tl.fromTo(chars,
                {
                  opacity: 0,
                  rotateX: -90,
                  y: 50,
                  transformOrigin: "50% 50% -50px",
                  scaleY: 0.5
                },
                {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  scaleY: 1,
                  stagger: 0.04,
                  duration: 0.8,
                  ease: 'back.out(1.7)'
                },
                0
              );
            }

            if (reveals.length) {
              tl.fromTo(reveals,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
                0.2
              );
            }

            if (images.length) {
              tl.fromTo(images,
                { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
                0.3
              );
            }

            // 2. Scroll Exit / Re-entry (Backward Support)
            // As we scroll right (away), animate out.
            gsap.to(panel, {
              opacity: 0,
              scale: 0.95,
              filter: 'blur(5px)',
              x: -100,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left left', // When panel left edge hits viewport left
                end: 'right left', // When panel right edge hits viewport left
                scrub: true,
                invalidateOnRefresh: true
              }
            });

            return;
          }

          // Other Panels - Scroll Scrubbed Entrance

          // Trigger points:
          // start: "left 75%" -> Starts animating when the panel's left edge is at 75% of viewport width (entering from right)
          // end: "left 25%" -> Finishes animating when left edge is at 25% of viewport (fully visible)

          // Panel Container Entrance
          gsap.fromTo(panel,
            {
              opacity: 0,
              scale: 0.92,
              filter: 'blur(8px)',
              x: window.innerWidth * 0.1
            },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              x: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left 70%",
                end: "left 40%",
                scrub: 1,
                invalidateOnRefresh: true
              }
            }
          );

          // Content Animations inside Panels
          const chars = q('.letter-reveal');
          // Title Flip Animation (Split/Flip)
          if (chars.length) {
            gsap.fromTo(chars,
              {
                opacity: 0,
                rotateX: -90,
                y: 50,
                transformOrigin: "50% 50% -50px",
                scaleY: 0.5
              },
              {
                opacity: 1,
                rotateX: 0,
                y: 0,
                scaleY: 1,
                stagger: 0.04,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left 60%",
                  end: "left 25%",
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              }
            );
          }

          const reveals = q('.reveal-target');
          if (reveals.length) {
            gsap.fromTo(reveals,
              { opacity: 0, y: 50 },
              {
                opacity: 1, y: 0,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left 60%",
                  end: "left 25%",
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              }
            );
          }

          const images = q('img, .floating-card');
          if (images.length) {
            gsap.fromTo(images,
              { opacity: 0, scale: 0.85, rotate: 8, filter: 'blur(5px)' },
              {
                opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)',
                stagger: 0.15,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left 55%",
                  end: "left 20%",
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              }
            );
          }

          const bgText = q('[class*="text-[30vw]"], [class*="text-[45vw]"]');
          if (bgText.length) {
            gsap.fromTo(bgText,
              { x: window.innerWidth * 0.2, opacity: 0 },
              {
                x: -window.innerWidth * 0.2, opacity: 0.05,
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: 'left right', // Standard parallax spanning full intersection
                  end: 'right left',
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
          }
        });



        // Connection Lines (Draw between panels)
        // Re-implement if desired, or simplify. 
        // A simple line drawing from right of one panel to left of next
        panels.forEach((panel, i) => {
          if (i === panels.length - 1) return;
          // logic for lines if needed... omitting for cleaner UI as per modern trend
        });

      });

      // 3. Mobile Animations (Vertical)
      mm.add("(max-width: 1023px)", () => {
        // Mobile Progress Bar
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            gsap.set(progressBar, { scaleX: self.progress });
          }
        });

        // Panels simple fade in up is handled by child components (Stats, etc.)
        // We can add a global coordinate here if we want enforced consistency
      });

    }, container);

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateGlowPos); // Ensure ticker is removed
    };
  }, [isMobile]);

  // Memoized register function
  const registerMagneticArea = useCallback((el: HTMLDivElement | null) => {
    if (el && !magneticAreasRef.current.includes(el)) {
      magneticAreasRef.current.push(el);
    }
  }, []);

  // Memoized style object
  const horizontalStyle = useMemo(() => ({
    transformStyle: 'preserve-3d' as const,
    perspective: '2000px',
    backfaceVisibility: 'hidden' as const
  }), []);

  return (
    <ScrollProgressContext.Provider value={scrollProgress}>
      <div ref={innerRef} className="portfolio-scroll-container relative w-full overflow-hidden lg:overflow-visible">
        <PortfolioProgressBar ref={progressBarRef} />
        {!isMobile && <CursorGlow ref={cursorGlowRef} />}
        <ScrollDirectionIndicator />

        <div
          ref={horizontalRef}
          className="horizontal-scroller flex flex-col lg:flex-row w-full lg:w-auto h-auto lg:h-screen relative will-change-transform"
          style={horizontalStyle}
        >
          <SalePilotPanel registerMagneticArea={registerMagneticArea} />
          <LazyPanel progressThreshold={0.15} isMobile={isMobile} render={() => (
            <StatsPanel
              gridLayer1Ref={gridLayer1Ref}
              gridLayer2Ref={gridLayer2Ref}
              gridLayer3Ref={gridLayer3Ref}
              glowRef={glowRef}
              vignetteRef={vignetteRef}
              registerMagneticArea={registerMagneticArea}
              desktopTween={desktopTween}
            />
          )} />
          <LazyPanel progressThreshold={0.40} isMobile={isMobile} render={() => (
            <VisionaryPanel registerMagneticArea={registerMagneticArea} desktopTween={desktopTween} />
          )} />
          <LazyPanel progressThreshold={0.65} isMobile={isMobile} render={() => (
            <ImpactPanel registerMagneticArea={registerMagneticArea} desktopTween={desktopTween} />
          )} />
        </div>
      </div>
    </ScrollProgressContext.Provider>
  );
});

PortfolioScroll.displayName = 'PortfolioScroll';

export default PortfolioScroll;