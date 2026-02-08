import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTransition } from '../TransitionContext';

/**
 * TransitionOverlay handles the visual wipe between pages.
 */
const TransitionOverlay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isPageTransition = useTransition();

  useLayoutEffect(() => {
    if (!isPageTransition) return;

    const panels = containerRef.current?.querySelectorAll('.transition-panel');
    if (!panels) return;

    const tl = gsap.timeline();

    // Simplified, faster transition - reduces animation overhead
    tl.set(containerRef.current, { autoAlpha: 1 })
      .fromTo(panels,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 0.2,
          stagger: 0.02,
          ease: 'power2.inOut'
        }
      )
      .to(panels, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.2,
        stagger: 0.02,
        ease: 'power2.inOut'
      })
      .set(containerRef.current, { autoAlpha: 0 });

  }, [location.pathname, isPageTransition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none invisible flex"
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="transition-panel relative flex-grow bg-blue-600 dark:bg-blue-700 h-full overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Accent line for digital feel */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10" />

          {/* Reduced data stream - only 3 elements per panel */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[8px] text-white/10 select-none">
            {[...Array(3)].map((_, j) => (
              <DataFlicker key={j} active={isPageTransition} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DataFlicker = React.memo(({ active }: { active: boolean }) => {
  const [val, setVal] = useState(() => Math.random().toString(16).substring(2, 10).toUpperCase());

  useEffect(() => {
    if (!active) return;

    // Slower update rate to reduce re-renders during transitions
    const interval = setInterval(() => {
      setVal(Math.random().toString(16).substring(2, 10).toUpperCase());
    }, 300);
    return () => clearInterval(interval);
  }, [active]);

  return <div className="opacity-50">{val}</div>;
});

export default TransitionOverlay;
