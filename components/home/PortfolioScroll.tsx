import React, { useEffect, useRef, useState } from 'react';
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

const PortfolioScroll = React.forwardRef<HTMLDivElement>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const gridLayer1Ref = useRef<HTMLDivElement>(null);
  const gridLayer2Ref = useRef<HTMLDivElement>(null);
  const gridLayer3Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  useSharedMousePos();

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);
    const handleLoad = () => ScrollTrigger.refresh(true);
    window.addEventListener('load', handleLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    const grid1 = gridLayer1Ref.current;
    const grid2 = gridLayer2Ref.current;
    const grid3 = gridLayer3Ref.current;
    const glow = glowRef.current;
    const vignette = vignetteRef.current;
    const panel = panelRef.current;
    const container = innerRef.current;
    const horizontal = horizontalRef.current;
    const progressBar = progressBarRef.current;
    const cursorGlow = cursorGlowRef.current;

    if (!grid1 || !grid2 || !grid3 || !glow || !panel || !vignette || !container || !horizontal || !progressBar) return;

    gsap.set('.horizontal-panel', {
      scale: 1,
      rotateY: 0,
      filter: 'brightness(1) blur(0px)',
      clearProps: 'skewX'
    });

    const ctx = gsap.context(() => {
      const sectionEl = container.closest('section') || container;
      gsap.fromTo(sectionEl,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'top 40%',
            scrub: 0.8
          }
        }
      );

      gsap.fromTo('.salepilot-title',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.6
          }
        }
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel', container);
        const totalWidth = 100 * (panels.length - 1);
        const skewSetter = gsap.quickTo(panels, "skewX", { duration: 0.6, ease: "power2.out" });
        const scaleSetter = gsap.quickTo(panels, "scale", { duration: 0.6, ease: "power2.out" });

        const horizontalTween = gsap.to(panels, {
          xPercent: -totalWidth,
          ease: "none",
          scrollTrigger: {
            id: 'main-horizontal-scroll',
            trigger: container,
            pin: true,
            scrub: 1, // Reduced from 3 to 1 for more responsive scrolling
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.3, max: 0.6 },
              delay: 0.1,
              ease: "power2.inOut"
            },
            start: 'top top',
            end: () => `+=${window.innerHeight * 12}`,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              gsap.set(progressBar, { scaleX: self.progress, overwrite: true });
              const velocity = self.getVelocity() / 400;
              const skew = gsap.utils.clamp(-10, 10, velocity);
              const scale = 1 - Math.abs(velocity) * 0.005;
              skewSetter(skew);
              scaleSetter(Math.max(0.95, scale));
            },
            onToggle: (self) => {
              if (!self.isActive) {
                skewSetter(0);
                scaleSetter(1);
              }
            }
          }
        });

        panels.forEach((p, i) => {
          const isFirst = i === 0;
          if (isFirst) {
            gsap.set(p, { scale: 1, rotateY: 0, filter: 'brightness(1) blur(0px)', immediateRender: true });
          }
          ScrollTrigger.create({
            trigger: p,
            containerAnimation: horizontalTween,
            start: isFirst ? 'left left' : 'left center',
            end: 'right center',
            refreshPriority: -1 - i,
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to(p, { scale: 1, rotateY: 0, filter: 'brightness(1) blur(0px)', duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
              } else {
                gsap.to(p, { scale: 0.96, rotateY: self.direction === 1 ? -2 : 2, filter: 'brightness(0.95) blur(0px)', duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
              }
            }
          });

          const letters = p.querySelectorAll('.letter-reveal');
          gsap.set(letters, { y: 60, opacity: 0, scale: 0.9, rotationX: -20, filter: 'blur(6px)' });
          if (isFirst) {
            gsap.to(letters, { y: 0, opacity: 1, scale: 1, rotationX: 0, filter: 'blur(0px)', stagger: 0.03, duration: 1, delay: 0.2, ease: 'back.out(1.4)', overwrite: 'auto' });
          } else {
            gsap.to(letters, {
              y: 0, opacity: 1, scale: 1, rotationX: 0, filter: 'blur(0px)', stagger: 0.02, duration: 0.9, ease: 'back.out(1.4)', immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: p, containerAnimation: horizontalTween, start: 'left 85%', toggleActions: 'play none none reverse' }
            });
          }

          const content = p.querySelectorAll('.reveal-target');
          gsap.set(content, { y: 35, opacity: 0, scale: 0.97, rotationY: 6, transformPerspective: 1000 });
          if (isFirst) {
            gsap.to(content, { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.1, delay: 0.35, stagger: 0.12, ease: 'expo.out', overwrite: 'auto' });
          } else {
            gsap.to(content, {
              y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1, stagger: 0.1, ease: 'expo.out', immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: p, containerAnimation: horizontalTween, start: 'left 80%', toggleActions: 'play none none reverse' }
            });
          }

          const images = p.querySelectorAll('img');
          images.forEach((img) => {
            const initialScale = isFirst ? 1.1 : 1.25;
            const initialX = isFirst ? 30 : 80;
            gsap.fromTo(img,
              { scale: initialScale, x: initialX },
              {
                scale: 1, x: 0, ease: 'none', immediateRender: isFirst,
                scrollTrigger: { trigger: p, containerAnimation: horizontalTween, start: isFirst ? 'left left' : 'left right', end: 'right left', scrub: 1.5 }
              }
            );
          });

          const floatingElements = p.querySelectorAll('.floating-card, [class*="rounded-[4rem]"], [class*="rounded-[6rem]"]');
          gsap.set(floatingElements, { y: 45, rotation: -3, opacity: 0 });
          if (isFirst) {
            gsap.to(floatingElements, { y: 0, rotation: 0, opacity: 1, duration: 1.3, delay: 0.5, stagger: 0.1, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
          } else {
            gsap.to(floatingElements, {
              y: 0, rotation: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'elastic.out(1, 0.6)', immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: p, containerAnimation: horizontalTween, start: 'left 75%', toggleActions: 'play none none reverse' }
            });
          }

          const statValues = p.querySelectorAll('.text-4xl, .text-5xl');
          gsap.set(statValues, { scale: 0.7, opacity: 0, y: 20 });
          if (isFirst) {
            gsap.to(statValues, { scale: 1, opacity: 1, y: 0, duration: 0.85, delay: 0.6, stagger: 0.1, ease: 'elastic.out(1, 0.7)', overwrite: 'auto' });
          } else {
            gsap.to(statValues, {
              scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'elastic.out(1, 0.7)', immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: p, containerAnimation: horizontalTween, start: 'left 70%', toggleActions: 'play none none reverse' }
            });
          }
        });

        const directionIndicator = document.querySelector('.scroll-direction-indicator');
        if (directionIndicator) {
          gsap.to(directionIndicator, { x: 20, opacity: 0.5, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' });
        }
      });

      const mmMobile = gsap.matchMedia();
      mmMobile.add("(max-width: 1023px)", () => {
        const targets = gsap.utils.toArray<HTMLElement>('.reveal-target');
        gsap.set(targets, { opacity: 0, y: 50, scale: 0.95 });
        ScrollTrigger.batch(targets, {
          start: 'top 88%',
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 1, ease: 'expo.out', overwrite: true }),
          onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 30, scale: 0.95, stagger: 0.05, duration: 0.6, ease: 'power2.in' })
        });
        const letters = gsap.utils.toArray<HTMLElement>('.letter-reveal');
        if (letters.length) {
          gsap.set(letters, { opacity: 0, y: 40, scale: 0.8, filter: 'blur(6px)' });
          ScrollTrigger.batch(letters, {
            start: 'top 90%',
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', stagger: 0.015, duration: 0.8, ease: 'back.out(1.4)', overwrite: true })
          });
        }
        const cards = gsap.utils.toArray<HTMLElement>('.horizontal-panel');
        cards.forEach((card) => {
          card.addEventListener('touchstart', () => gsap.to(card, { scale: 0.98, duration: 0.2 }));
          card.addEventListener('touchend', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }));
        });
      });

      const rX1To = gsap.quickTo(grid1, "rotateX", { duration: 2, ease: "power3.out" });
      const rY1To = gsap.quickTo(grid1, "rotateY", { duration: 2, ease: "power3.out" });
      const rX2To = gsap.quickTo(grid2, "rotateX", { duration: 2.5, ease: "power3.out" });
      const rY2To = gsap.quickTo(grid2, "rotateY", { duration: 2.5, ease: "power3.out" });
      const rX3To = gsap.quickTo(grid3, "rotateX", { duration: 3, ease: "power3.out" });
      const rY3To = gsap.quickTo(grid3, "rotateY", { duration: 3, ease: "power3.out" });
      const x1To = gsap.quickTo(grid1, "x", { duration: 2.5, ease: "power3.out" });
      const y1To = gsap.quickTo(grid1, "y", { duration: 2.5, ease: "power3.out" });
      const x2To = gsap.quickTo(grid2, "x", { duration: 3, ease: "power3.out" });
      const y2To = gsap.quickTo(grid2, "y", { duration: 3, ease: "power3.out" });
      const glowXTo = gsap.quickTo(glow, "xPercent", { duration: 1.2, ease: "power4.out" });
      const glowYTo = gsap.quickTo(glow, "yPercent", { duration: 1.2, ease: "power4.out" });
      const glowScaleTo = gsap.quickTo(glow, "scale", { duration: 1.5, ease: "power2.out" });
      const cursorXTo = cursorGlow ? gsap.quickTo(cursorGlow, "left", { duration: 0.3, ease: "power2.out" }) : null;
      const cursorYTo = cursorGlow ? gsap.quickTo(cursorGlow, "top", { duration: 0.3, ease: "power2.out" }) : null;

      let cachedRect: DOMRect | null = null;
      let lastUpdateRect = 0;

      const getRect = () => {
        const now = Date.now();
        if (!cachedRect || now - lastUpdateRect > 1000) {
          cachedRect = panel.getBoundingClientRect();
          lastUpdateRect = now;
        }
        return cachedRect;
      };

      let isInsidePanel = false;
      const updateInteractiveGrid = () => {
        if (!globalMousePos.active) return;
        if (cursorXTo && cursorYTo) {
          cursorXTo(globalMousePos.x);
          cursorYTo(globalMousePos.y);
        }
        if (window.innerWidth < 1024) return;

        const rect = getRect();
        const relX = globalMousePos.x - rect.left;
        const relY = globalMousePos.y - rect.top;

        if (relX >= -rect.width * 0.5 && relX <= rect.width * 1.5) {
          const xPct = (relX / rect.width) - 0.5;
          const yPct = (relY / rect.height) - 0.5;
          rY1To(xPct * 8); rX1To(-yPct * 8); x1To(xPct * 30); y1To(yPct * 30);
          rY2To(xPct * 5); rX2To(-yPct * 5); x2To(xPct * 20); y2To(yPct * 20);
          rY3To(xPct * 3); rX3To(-yPct * 3);
          glowXTo(xPct * 60); glowYTo(yPct * 60); glowScaleTo(1 + Math.abs(xPct) * 0.3);
          if (!isInsidePanel) {
            gsap.to([glow, vignette], { opacity: 0.7, duration: 1 });
            isInsidePanel = true;
          }
          const intensity = Math.sqrt(xPct * xPct + yPct * yPct);
          gsap.set(grid1, { opacity: 0.08 + intensity * 0.1 });
          gsap.set(grid2, { opacity: 0.04 + intensity * 0.06 });
          gsap.set(grid3, { opacity: 0.02 + intensity * 0.03 });
        } else if (isInsidePanel) {
          gsap.to([glow, vignette], { opacity: 0.15, duration: 1.5 });
          gsap.to([grid1, grid2, grid3], { opacity: 0.02, duration: 1 });
          isInsidePanel = false;
        }
      };
      gsap.ticker.add(updateInteractiveGrid);

      let idleTimeout: NodeJS.Timeout;
      const startIdleAnimation = () => {
        gsap.to(grid1, { rotateX: 'random(-3, 3)', rotateY: 'random(-3, 3)', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(glow, { scale: 'random(0.9, 1.2)', xPercent: 'random(-20, 20)', yPercent: 'random(-20, 20)', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      };
      const handleMouseEnter = () => { clearTimeout(idleTimeout); gsap.killTweensOf([grid1, glow]); };
      const handleMouseLeave = () => {
        gsap.to([grid1, grid2, grid3], { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' });
        gsap.to(glow, { xPercent: 0, yPercent: 0, scale: 1, duration: 1.5, ease: 'power2.out' });
        idleTimeout = setTimeout(startIdleAnimation, 2000);
      };
      panel.addEventListener('mouseenter', handleMouseEnter);
      panel.addEventListener('mouseleave', handleMouseLeave);
      idleTimeout = setTimeout(startIdleAnimation, 3000);
      return () => {
        gsap.ticker.remove(updateInteractiveGrid);
        panel.removeEventListener('mouseenter', handleMouseEnter);
        panel.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(idleTimeout);
      };
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={innerRef} className="portfolio-scroll-wrapper relative">
      <CursorGlow ref={cursorGlowRef} />
      <ScrollDirectionIndicator />
      <section className="portfolio-entrance relative z-10 bg-gray-50 dark:bg-brand-dark transition-colors duration-500 overflow-hidden lg:overflow-visible" style={{ willChange: 'transform, opacity' }}>
        <PortfolioProgressBar ref={progressBarRef} />
        <div ref={horizontalRef} className="flex flex-col lg:flex-row lg:w-[400vw] lg:h-screen">
          <SalePilotPanel />
          <StatsPanel
            ref={panelRef}
            gridLayer1Ref={gridLayer1Ref}
            gridLayer2Ref={gridLayer2Ref}
            gridLayer3Ref={gridLayer3Ref}
            glowRef={glowRef}
            vignetteRef={vignetteRef}
          />
          <VisionaryPanel />
          <ImpactPanel />
        </div>
      </section>
      <style dangerouslySetInnerHTML={{
        __html: `
        .reveal-target { will-change: transform, opacity; }
        .portfolio-scroll-wrapper { overflow-x: hidden; }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: gradientShift 8s ease infinite; }
      `}} />
    </div>
  );
});

PortfolioScroll.displayName = 'PortfolioScroll';
export default PortfolioScroll;
