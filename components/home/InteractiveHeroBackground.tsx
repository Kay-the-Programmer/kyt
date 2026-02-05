import React, { useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useSharedMousePos, globalMousePos } from '../../hooks/useSharedMousePos';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  type: 'circle' | 'square' | 'ring' | 'dot' | 'line' | 'hexagon' | 'triangle';
  color: string;
  opacity: number;
  depth: number;
  rotation: number;
  vRotation: number;
  scale: number;
}

// Pre-calculated constants
const PI2 = Math.PI * 2;
const PI_DIV_3 = Math.PI / 3;
const FRAME_INTERVAL = 1000 / 30; // Target 30fps for performance

// Throttle utility
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

const InteractiveHeroBackground: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useSharedMousePos();

  // Memoized colors array
  const colors = useMemo(() => [
    'rgba(59, 130, 246, ',  // blue
    'rgba(147, 51, 234, ',  // purple
    'rgba(6, 182, 212, ',   // cyan
    'rgba(236, 72, 153, ',  // pink
    'rgba(34, 197, 94, ',   // green
  ], []);

  // Particle types constant
  const types: Particle['type'][] = useMemo(() =>
    ['circle', 'square', 'ring', 'dot', 'line', 'hexagon', 'triangle'],
    []);

  const createParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const isTablet = width < 1024;
    // Reduced particle counts for better performance
    const count = isMobile ? 15 : isTablet ? 25 : 40;

    const newParticles: Particle[] = [];
    const colorsLength = colors.length;
    const typesLength = types.length;

    for (let i = 0; i < count; i++) {
      const depth = Math.random() * 0.8 + 0.2;
      const baseSize = isMobile ? 10 : 20;
      const sizeRange = isMobile ? 40 : 60;
      const size = baseSize + Math.random() * sizeRange;
      const colorBase = colors[Math.floor(Math.random() * colorsLength)];

      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: 0,
        targetY: 0,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size,
        type: types[Math.floor(Math.random() * typesLength)],
        color: colorBase,
        opacity: depth * 0.4,
        depth,
        rotation: Math.random() * PI2,
        vRotation: (Math.random() - 0.5) * 0.008,
        scale: 1
      });
    }
    particlesRef.current = newParticles;
  }, [colors, types]);

  // Optimized shape drawing - avoid creating gradients for performance
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);
    ctx.globalAlpha = p.opacity;

    const color = `${p.color}${p.opacity})`;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;

    const halfSize = p.size * 0.5;

    switch (p.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, PI2);
        ctx.fill();
        break;
      case 'square':
        ctx.strokeRect(-halfSize, -halfSize, p.size, p.size);
        break;
      case 'ring':
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, PI2);
        ctx.stroke();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(2, p.size * 0.1), 0, PI2);
        ctx.fill();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(p.size, 0);
        ctx.stroke();
        break;
      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = i * PI_DIV_3;
          const x = halfSize * Math.cos(angle);
          const y = halfSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * PI2) / 3 - Math.PI * 0.5;
          const x = halfSize * Math.cos(angle);
          const y = halfSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;
    }
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // Get device pixel ratio for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = throttle(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set actual size in memory (scaled for retina)
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale context to match
      ctx.scale(dpr, dpr);

      dimensionsRef.current = { width, height };
      createParticles(width, height);
    }, 200);

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Intersection Observer to pause animation when not visible
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observerRef.current.observe(canvas);

    const animate = (time: number) => {
      // Skip if not visible
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Frame throttling to ~30fps
      const elapsed = time - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = time - (elapsed % FRAME_INTERVAL);

      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const particles = particlesRef.current;
      const particleCount = particles.length;
      const connectionDist = isMobile ? 80 : 150;
      const connectionDistSq = connectionDist * connectionDist;
      const mouseDist = isMobile ? 120 : 200;
      const mouseDistSq = mouseDist * mouseDist;
      const mouseActive = globalMousePos.active;
      const mouseX = globalMousePos.x;
      const mouseY = globalMousePos.y;

      // Pre-calculate lerp factor
      const lerpFactor = 0.08;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Update base position
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap around edges
        if (p.baseX < 0) p.baseX = width;
        else if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        else if (p.baseY > height) p.baseY = 0;

        // Mouse interaction
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        const distSq = dx * dx + dy * dy;

        if (mouseActive && distSq < mouseDistSq) {
          const dist = Math.sqrt(distSq);
          const force = (mouseDist - dist) / mouseDist;
          const forceDepth = force * 0.5 * p.depth;
          p.targetX = p.baseX - dx * forceDepth;
          p.targetY = p.baseY - dy * forceDepth;
          p.scale = 1 + force * 0.25;
        } else {
          p.targetX = p.baseX;
          p.targetY = p.baseY;
          p.scale = 1;
        }

        // Smooth movement
        p.x += (p.targetX - p.x) * lerpFactor;
        p.y += (p.targetY - p.y) * lerpFactor;
        p.rotation += p.vRotation;

        // Draw particle
        drawShape(ctx, p);

        // Connection lines (only check every other particle for performance)
        if (i % 2 === 0) {
          for (let j = i + 2; j < particleCount; j += 2) {
            const p2 = particles[j];
            const dxC = p.x - p2.x;
            const dyC = p.y - p2.y;
            const distCSq = dxC * dxC + dyC * dyC;

            if (distCSq < connectionDistSq) {
              const distC = Math.sqrt(distCSq);
              const opacity = (1 - distC / connectionDist) * 0.12 * Math.min(p.depth, p2.depth);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Mouse connection lines (less frequent)
        if (mouseActive && distSq < mouseDistSq && i % 3 === 0) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / mouseDist) * 0.25 * p.depth;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Touch handlers
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        globalMousePos.x = e.touches[0].clientX;
        globalMousePos.y = e.touches[0].clientY;
        globalMousePos.active = true;
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        globalMousePos.active = false;
      }, 500);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      observerRef.current?.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [createParticles, drawShape]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb-1 absolute w-[100vw] h-[100vw] rounded-full blur-[120px] opacity-20 dark:opacity-10 bg-blue-600/10 top-[-20%] right-[-10%]" />
        <div className="orb-2 absolute w-[100vw] h-[100vw] rounded-full blur-[150px] opacity-20 dark:opacity-10 bg-purple-600/10 bottom-[-30%] left-[-10%]" />
      </div>
      <style>{`
        .orb-1 {
          animation: orb-float-1 20s ease-in-out infinite;
          will-change: transform;
        }
        .orb-2 {
          animation: orb-float-2 25s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes orb-float-1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-30px, 50px, 0) scale(1.1); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1.1); }
          50% { transform: translate3d(40px, -30px, 0) scale(1); }
        }
      `}</style>
    </>
  );
});

InteractiveHeroBackground.displayName = 'InteractiveHeroBackground';

export default InteractiveHeroBackground;