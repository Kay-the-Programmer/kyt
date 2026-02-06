import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SalePilotPanel from './portfolio/SalePilotPanel';
import StatsPanel from './portfolio/StatsPanel';
import VisionaryPanel from './portfolio/VisionaryPanel';
import ImpactPanel from './portfolio/ImpactPanel';
import { CursorGlow, ScrollDirectionIndicator, PortfolioProgressBar } from './portfolio/ScrollComponents';
import { useSharedMousePos, globalMousePos } from '../../hooks/useSharedMousePos';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Optimized Cursor Glow with throttled interactive check
      if (cursorGlow && !isMobile) {
        gsap.set(cursorGlow, {
          scale: 0.8,
          opacity: 0
        });

        const xTo = gsap.quickTo(cursorGlow, "left", {
          duration: 0.8,
          ease: "power2.out"
        });
        const yTo = gsap.quickTo(cursorGlow, "top", {
          duration: 0.8,
          ease: "power2.out"
        });

        // Track current scale target to avoid redundant animations
        let currentScaleTarget = 1;

        let frameCount = 0;
        const updateGlow = () => {
          frameCount++;
          // Skip every other frame for performance
          if (frameCount % 2 !== 0) return;

          if (!globalMousePos.active) {
            gsap.set(cursorGlow, { opacity: 0 });
            return;
          }

          // Enter animation on first move
          const currentOpacity = parseFloat(cursorGlow.style.opacity || '0');
          if (currentOpacity === 0) {
            gsap.to(cursorGlow, { opacity: 1, duration: 0.8 });
          }

          xTo(globalMousePos.x);
          yTo(globalMousePos.y);

          // Throttled interactive element check (every 100ms)
          const cache = interactiveCheckCache.current;
          const now = performance.now();
          const distMoved = Math.abs(globalMousePos.x - cache.x) + Math.abs(globalMousePos.y - cache.y);

          if (now - cache.time > 100 || distMoved > 50) {
            const hoverTarget = document.elementFromPoint(globalMousePos.x, globalMousePos.y);
            cache.result = !!hoverTarget?.closest('.magnetic-area, button, a');
            cache.x = globalMousePos.x;
            cache.y = globalMousePos.y;
            cache.time = now;
          }

          // Use gsap.to() for scale instead of quickTo (transform properties don't work with quickTo)
          const newScaleTarget = cache.result ? 1.2 : 1;
          if (newScaleTarget !== currentScaleTarget) {
            currentScaleTarget = newScaleTarget;
            gsap.to(cursorGlow, {
              scale: newScaleTarget,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
        };

        gsap.ticker.add(updateGlow);

        // Hide on scroll start
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          onEnter: () => gsap.set(cursorGlow, { opacity: 0 }),
          onLeaveBack: () => gsap.to(cursorGlow, { opacity: 1, duration: 0.3 })
        });
      }

      // 2. Desktop Horizontal Scroll with Optimized Effects
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');
        const scrollWidth = horizontal.scrollWidth - window.innerWidth;

        // Pre-generate all gradient colors upfront (0-100%)
        const gradientCache = Array.from({ length: 101 }, (_, i) => {
          const progress = i / 100;
          const hue = 200 + progress * 160;
          return `linear-gradient(to right, hsl(${hue}, 100%, 60%) 0%, hsl(${hue + 20}, 100%, 60%) 50%, hsl(${hue + 40}, 100%, 60%) 100%)`;
        });
        const getGradient = (progress: number) => gradientCache[Math.round(progress * 100)];

        gsap.set(progressBar, {
          transformOrigin: "0% 50%",
          scaleX: 0,
          willChange: 'transform'
        });

        // Throttled scroll update handler
        let lastProgress = 0;
        let lastVelocityUpdate = 0;

        const scrollTween = gsap.to(horizontal, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1.5,
            end: () => `+=${scrollWidth}`,
            onUpdate: (self) => {
              const now = performance.now();

              // Update progress bar (throttled to significant changes)
              if (Math.abs(self.progress - lastProgress) > 0.005) {
                gsap.set(progressBar, {
                  scaleX: self.progress,
                  background: getGradient(self.progress)
                });
                lastProgress = self.progress;
              }

              // Velocity-based effects (throttled to 60fps)
              if (now - lastVelocityUpdate > 16) {
                const velocity = Math.min(Math.abs(self.getVelocity()), 1000);
                if (velocity > 50) { // Only apply if moving significantly
                  const skew = gsap.utils.clamp(-8, 8, velocity / 250);
                  const rotation = gsap.utils.clamp(-2, 2, velocity / 500);

                  gsap.to(horizontal, {
                    skewX: skew,
                    rotationY: rotation,
                    duration: 0.6,
                    ease: 'power2.out',
                    overwrite: 'auto'
                  });
                }
                lastVelocityUpdate = now;
              }
            },
            onEnter: () => {
              gsap.fromTo(progressBar,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
              );
            }
          }
        });

        // 3. Simplified Background Parallax
        const bgElements = [
          { ref: gridLayer1Ref.current, depth: 0.1 },
          { ref: gridLayer2Ref.current, depth: 0.25 },
          { ref: gridLayer3Ref.current, depth: 0.45 },
          { ref: glowRef.current, depth: 0.3 }
        ];

        bgElements.forEach(item => {
          if (item.ref) {
            gsap.set(item.ref, { willChange: 'transform' });
            gsap.to(item.ref, {
              x: -scrollWidth * item.depth,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                scrub: true,
                start: 'top top',
                end: () => `+=${scrollWidth}`
              }
            });
          }
        });

        // 4. Optimized Panel Entrances - batch similar operations
        const panelsToAnimate = panels.slice(1); // Skip first panel

        // Set initial state for all panels at once
        gsap.set(panelsToAnimate, {
          scale: 0.9,
          rotationY: 30,
          x: 200,
          filter: 'brightness(0.4) blur(15px)',
          autoAlpha: 0,
          transformPerspective: 2000,
          willChange: 'transform, opacity, filter'
        });

        panels.forEach((panel, i) => {
          gsap.to(panel, {
            scale: 1,
            rotationY: 0,
            x: 0,
            filter: 'brightness(1) blur(0px)',
            autoAlpha: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left center+=400',
              end: 'left center-=200',
              scrub: 1
            }
          });
        });

        // 5. Batch internal element animations
        panels.forEach((panel, panelIndex) => {
          const textTargets = panel.querySelectorAll('.split-text-char, .split-text-word');
          if (textTargets.length > 0) {
            gsap.from(textTargets, {
              y: 100,
              rotationX: 45,
              opacity: 0,
              stagger: {
                each: 0.03,
                from: panelIndex % 2 === 0 ? 'start' : 'end'
              },
              duration: 1.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left center+=300',
                toggleActions: 'play none none reverse'
              }
            });
          }

          const regularTargets = panel.querySelectorAll('.reveal-target');
          if (regularTargets.length > 0) {
            gsap.from(regularTargets, {
              y: 80,
              opacity: 0,
              scale: 0.8,
              stagger: 0.1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left center+=200',
                toggleActions: 'play none none reverse'
              }
            });
          }

          const images = panel.querySelectorAll('img');
          if (images.length > 0) {
            gsap.from(images, {
              scale: 1.3,
              opacity: 0,
              stagger: 0.2,
              duration: 1.5,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left center+=250',
                toggleActions: 'play none none reverse'
              }
            });
          }
        });

        // 6. Pre-create connection lines (moved outside scroll callback)
        connectionLinesRef.current = [];
        for (let i = 0; i < panels.length - 1; i++) {
          const line = document.createElement('div');
          line.className = 'panel-connection-line';
          line.style.cssText = `
            position: absolute;
            top: 50%;
            left: ${100 * (i + 1)}%;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, rgba(59,130,246,0.8), transparent);
            transform: translateY(-50%);
            z-index: 10;
            opacity: 0;
            will-change: opacity, transform;
          `;
          container.appendChild(line);
          connectionLinesRef.current.push(line);

          gsap.to(line, {
            opacity: 0.6,
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panels[i],
              containerAnimation: scrollTween,
              start: 'right center',
              end: 'right center+=100',
              scrub: true
            }
          });
        }
      });

      // 7. Enhanced Mobile Animations - Made MORE DRAMATIC for visibility
      mm.add("(max-width: 1023px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');

        // More dramatic initial state for noticeable entrance
        gsap.set(panels, {
          y: 100,          // Larger offset - more noticeable slide up
          opacity: 0,
          scale: 0.92,     // More scale difference for visual impact
          rotationX: 8,    // Slight 3D tilt for depth
          transformOrigin: 'center top',
          transformPerspective: 1000,
          willChange: 'transform, opacity'
        });

        panels.forEach((panel) => {
          // Dramatic panel entrance with bounce
          gsap.to(panel, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.2,           // Longer duration - more noticeable
            ease: 'back.out(1.4)',   // Bouncy overshoot for impact
            scrollTrigger: {
              trigger: panel,
              start: 'top 92%',      // Trigger when panel enters viewport
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // Mobile progress indicator
        if (!mobileProgressRef.current) {
          const mobileProgress = document.createElement('div');
          mobileProgress.className = 'mobile-progress-indicator';
          mobileProgress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 9999;
            width: 0%;
            will-change: width;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          `;
          document.body.appendChild(mobileProgress);
          mobileProgressRef.current = mobileProgress;
        }

        let lastMobileProgress = 0;
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            // Smooth update with threshold
            if (Math.abs(self.progress - lastMobileProgress) > 0.008) {
              gsap.to(mobileProgressRef.current, {
                width: `${self.progress * 100}%`,
                duration: 0.2,
                ease: 'none',
                overwrite: true
              });
              lastMobileProgress = self.progress;
            }
          }
        });
      });

    }, container);

    return () => {
      ctx.revert();
      // Clean up mobile progress indicator
      if (mobileProgressRef.current) {
        mobileProgressRef.current.remove();
        mobileProgressRef.current = null;
      }
      // Clean up connection lines
      connectionLinesRef.current.forEach(line => line.remove());
      connectionLinesRef.current = [];
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
        <StatsPanel
          gridLayer1Ref={gridLayer1Ref}
          gridLayer2Ref={gridLayer2Ref}
          gridLayer3Ref={gridLayer3Ref}
          glowRef={glowRef}
          vignetteRef={vignetteRef}
          registerMagneticArea={registerMagneticArea}
        />
        <VisionaryPanel registerMagneticArea={registerMagneticArea} />
        <ImpactPanel registerMagneticArea={registerMagneticArea} />
      </div>
    </div>
  );
});

PortfolioScroll.displayName = 'PortfolioScroll';

export default PortfolioScroll;