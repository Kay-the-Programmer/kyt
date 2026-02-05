import React, { useEffect, useRef, useCallback } from 'react';
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

const InteractiveHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef(0);
  useSharedMousePos();

  const colors = [
    'rgba(59, 130, 246, ', // blue
    'rgba(147, 51, 234, ', // purple
    'rgba(6, 182, 212, ',  // cyan
    'rgba(236, 72, 153, ', // pink
    'rgba(34, 197, 94, ',  // green
  ];

  const createParticles = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const count = isMobile ? 20 : isTablet ? 35 : 50;

    const types: Particle['type'][] = ['circle', 'square', 'ring', 'dot', 'line', 'hexagon', 'triangle'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const depth = Math.random() * 0.8 + 0.2;
      const size = (isMobile ? 10 : 20) + Math.random() * (isMobile ? 40 : 60);
      const colorBase = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        targetX: 0,
        targetY: 0,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
        type: types[Math.floor(Math.random() * types.length)],
        color: colorBase,
        opacity: depth * 0.4,
        depth,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.01,
        scale: 1
      });
    }
    particlesRef.current = newParticles;
  }, []);

  const drawShape = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);
    ctx.globalAlpha = p.opacity;

    const color = `${p.color}${p.opacity})`;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    switch (p.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(-p.size * 0.1, -p.size * 0.1, 0, 0, 0, p.size / 2);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
        break;
      case 'square':
        ctx.beginPath();
        ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.stroke();
        break;
      case 'ring':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(2, p.size * 0.1), 0, Math.PI * 2);
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
          const angle = (i * Math.PI) / 3;
          const x = (p.size / 2) * Math.cos(angle);
          const y = (p.size / 2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const x = (p.size / 2) * Math.cos(angle);
          const y = (p.size / 2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 768;
      const particles = particlesRef.current;
      const connectionDist = isMobile ? 100 : 180;
      const mouseDist = isMobile ? 150 : 250;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX < 0) p.baseX = canvas.width;
        if (p.baseX > canvas.width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = canvas.height;
        if (p.baseY > canvas.height) p.baseY = 0;

        let dx = globalMousePos.x - p.baseX;
        let dy = globalMousePos.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (globalMousePos.active && dist < mouseDist) {
          const force = (mouseDist - dist) / mouseDist;
          p.targetX = p.baseX - dx * force * 0.5 * p.depth;
          p.targetY = p.baseY - dy * force * 0.5 * p.depth;
          p.scale = 1 + force * 0.3;
        } else {
          p.targetX = p.baseX;
          p.targetY = p.baseY;
          p.scale = 1;
        }

        p.x += (p.targetX - p.x) * 0.1;
        p.y += (p.targetY - p.y) * 0.1;
        p.rotation += p.vRotation;

        drawShape(ctx, p);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dxC = p.x - p2.x;
          const dyC = p.y - p2.y;
          const distC = Math.sqrt(dxC * dxC + dyC * dyC);

          if (distC < connectionDist) {
            const opacity = (1 - distC / connectionDist) * 0.15 * Math.min(p.depth, p2.depth);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (globalMousePos.active && dist < mouseDist) {
          const opacity = (1 - dist / mouseDist) * 0.3 * p.depth;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(globalMousePos.x, globalMousePos.y);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        globalMousePos.x = e.touches[0].clientX;
        globalMousePos.y = e.touches[0].clientY;
        globalMousePos.active = true;
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', () => { setTimeout(() => globalMousePos.active = false, 500); });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(rafRef.current!);
    };
  }, [createParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[100vw] h-[100vw] rounded-full blur-[120px] opacity-20 dark:opacity-10 bg-blue-600/10 top-[-20%] right-[-10%] animate-orb-1" />
        <div className="absolute w-[100vw] h-[100vw] rounded-full blur-[150px] opacity-20 dark:opacity-10 bg-purple-600/10 bottom-[-30%] left-[-10%] animate-orb-2" />
      </div>
      <style>{`
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 50px) scale(1.1); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(40px, -30px) scale(1); }
        }
        .animate-orb-1 { animation: orb-1 20s ease-in-out infinite; }
        .animate-orb-2 { animation: orb-2 25s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default InteractiveHeroBackground;