import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EngineeringGridProps {
  desktopTween?: gsap.core.Tween | null;
}

const EngineeringGrid: React.FC<EngineeringGridProps> = ({ desktopTween }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for animation targets (more reliable than class selectors)
  const gridLayerRef = useRef<HTMLDivElement>(null);
  const elementsWrapRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<HTMLDivElement[]>([]);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  elementRefs.current = [];
  parallaxRefs.current = [];

  const addElementRef = (el: HTMLDivElement | null) => {
    if (el && !elementRefs.current.includes(el)) elementRefs.current.push(el);
  };

  const addParallaxRef = (el: HTMLDivElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) parallaxRefs.current.push(el);
  };

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const ctx = gsap.context(() => {
      const grid = gridLayerRef.current;
      const wrap = elementsWrapRef.current;

      if (!grid || !wrap) return;

      // Initial state (minimal: no heavy rotations)
      gsap.set(grid, { opacity: 0 });
      gsap.set(elementRefs.current, { opacity: 0, y: 10, scale: 0.98 });

      // Scroll entrance
      const gridTo = gsap.to(grid, { opacity: 0.18, ease: "none", paused: true });
      const elementsTo = gsap.to(elementRefs.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        ease: "power2.out",
        paused: true,
      });

      const triggerBase: ScrollTrigger.Vars = desktopTween
        ? {
            trigger: container,
            containerAnimation: desktopTween,
            start: "left 80%",
            end: "left 25%",
            scrub: 1,
          }
        : {
            trigger: container,
            start: "top 80%",
            end: "top 35%",
            scrub: true,
          };

      ScrollTrigger.create({
        ...triggerBase,
        onUpdate: (self) => {
          const p = self.progress;
          gridTo.progress(p);
          elementsTo.progress(p);
        },
      });

      // Parallax / tilt (skip on touch + reduced motion)
      if (!prefersReducedMotion && !isTouch) {
        gsap.set(wrap, { transformStyle: "preserve-3d" });

        const toRotX = gsap.quickTo(wrap, "rotateX", { duration: 0.8, ease: "power2.out" });
        const toRotY = gsap.quickTo(wrap, "rotateY", { duration: 0.8, ease: "power2.out" });

        // Batch parallax quickTo
        const px = parallaxRefs.current.map((el) =>
          gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" })
        );
        const py = parallaxRefs.current.map((el) =>
          gsap.quickTo(el, "y", { duration: 0.9, ease: "power2.out" })
        );

        const onMove = (e: MouseEvent) => {
          const r = container.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
          const ny = (e.clientY - r.top) / r.height - 0.5;

          // Smaller tilt for minimal feel
          toRotY(nx * 6);
          toRotX(-ny * 6);

          // Subtle parallax
          const dx = nx * 14;
          const dy = ny * 14;

          for (let i = 0; i < parallaxRefs.current.length; i++) {
            px[i](dx * (0.35 + i * 0.08));
            py[i](dy * (0.35 + i * 0.08));
          }
        };

        const onLeave = () => {
          toRotX(0);
          toRotY(0);
          for (let i = 0; i < parallaxRefs.current.length; i++) {
            px;
            py;
          }
        };

        container.addEventListener("mousemove", onMove);
        container.addEventListener("mouseleave", onLeave);

        return () => {
          container.removeEventListener("mousemove", onMove);
          container.removeEventListener("mouseleave", onLeave);
        };
      }

      return;
    }, containerRef);

    return () => ctx.revert();
  }, [desktopTween, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[560px] overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md"
      style={{ perspective: "1200px" }}
    >
      {/* Grid layer (minimal, softer + fewer lines by using larger size) */}
      <div
        ref={gridLayerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          transform: "rotateX(55deg) translateZ(-120px) scale(1.8)",
          maskImage: "radial-gradient(circle at 50% 45%, black 45%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 45%, transparent 72%)",
        }}
      />

      {/* Ambient wash (very subtle) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-600/6 via-transparent to-blue-600/4" />

      {/* Content */}
      <div
        ref={elementsWrapRef}
        className="relative h-full w-full flex items-center justify-center transform-gpu"
      >
        {/* Central hub (simplified) */}
        <div
          ref={addElementRef}
          className="relative flex items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.25)]"
          style={{ width: 190, height: 190, transform: "translateZ(30px)" }}
        >
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30 dark:ring-white/5" />

          {/* Inner geometry (minimal) */}
          <div className="relative w-24 h-24 rounded-2xl border border-blue-500/25 bg-blue-600/10 rotate-45" />
          <div className="absolute w-28 h-28 rounded-full border border-blue-500/20" />

          {/* Connectors (thin, clean) */}
          <span className="absolute top-[-40px] left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-t from-blue-500/30 to-transparent" />
          <span className="absolute bottom-[-40px] left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/30 to-transparent" />
          <span className="absolute left-[-40px] top-1/2 w-10 h-px -translate-y-1/2 bg-gradient-to-l from-blue-500/30 to-transparent" />
          <span className="absolute right-[-40px] top-1/2 w-10 h-px -translate-y-1/2 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </div>

        {/* Callout 1 */}
        <div
          ref={(el) => {
            addElementRef(el);
            addParallaxRef(el);
          }}
          className="absolute left-[10%] top-[14%] rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/30 backdrop-blur px-3 py-2"
          style={{ transform: "translateZ(55px)" }}
        >
          <div className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            MODULE
          </div>
          <div className="mt-1 h-px w-14 bg-blue-600/25" />
        </div>

        {/* Callout 2 */}
        <div
          ref={(el) => {
            addElementRef(el);
            addParallaxRef(el);
          }}
          className="absolute right-[10%] bottom-[18%] rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/30 backdrop-blur px-3 py-2"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            COORD
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600/35" />
            <span className="h-2 w-2 rounded-full bg-blue-600/18" />
          </div>
        </div>

        {/* Cross lines (reduced) */}
        <div ref={addElementRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blue-600/8" />
          <div className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-blue-600/8" />
        </div>
      </div>
    </div>
  );
};

export default EngineeringGrid;
