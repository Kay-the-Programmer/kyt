import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface Particle {
  el: HTMLDivElement;
  xTo: gsap.QuickToFunc;
  yTo: gsap.QuickToFunc;
  scaleTo: gsap.QuickToFunc;
  opacityTo: gsap.QuickToFunc;
  baseX: number;
  baseY: number;
  depth: number;
  size: number;
  type: 'circle' | 'square' | 'ring' | 'dot' | 'line' | 'hexagon' | 'triangle';
  color: string;
}

const InteractiveHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, active: false });
  const rafRef = useRef<number>();
  const lastFrameRef = useRef(0);
  const frameCountRef = useRef(0);
  const cachedPositionsRef = useRef<{ x: number; y: number }[]>([]);

  // Color palette
  const colors = [
    'rgba(59, 130, 246, VAR)', // blue
    'rgba(147, 51, 234, VAR)', // purple
    'rgba(6, 182, 212, VAR)',  // cyan
    'rgba(236, 72, 153, VAR)', // pink
    'rgba(34, 197, 94, VAR)',  // green
  ];

  const getColor = (opacity: number) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color.replace('VAR', opacity.toString());
  };

  const createParticle = useCallback((index: number, total: number): Particle => {
    const container = containerRef.current!;
    const isMobile = window.innerWidth < 768;

    const types: Array<Particle['type']> = ['circle', 'square', 'ring', 'dot', 'line', 'hexagon', 'triangle'];
    const type = types[Math.floor(Math.random() * types.length)];
    const depth = Math.random() * 0.8 + 0.2;

    const baseSize = isMobile ? 10 : 20;
    const maxSize = isMobile ? 60 : 100;
    const size = Math.random() * (maxSize - baseSize) + baseSize;
    const colorOpacity = depth * 0.3;
    const color = getColor(colorOpacity);

    const particle = document.createElement('div');
    particle.className = 'hero-particle absolute pointer-events-none';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.willChange = 'transform, opacity';
    particle.style.transformOrigin = 'center center';

    const inner = document.createElement('div');
    inner.className = 'particle-inner';
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.transition = 'all 0.5s ease-out';

    switch (type) {
      case 'circle':
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        inner.style.borderRadius = '50%';
        inner.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`;
        inner.style.boxShadow = `0 0 ${size}px ${color}, inset 0 0 ${size * 0.3}px ${color}`;
        break;
      case 'square':
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        inner.style.borderRadius = '20%';
        inner.style.border = `2px solid ${color}`;
        inner.style.backdropFilter = 'blur(2px)';
        inner.style.boxShadow = `0 0 ${size * 0.5}px ${color}`;
        break;
      case 'ring':
        const ringSize = size * 1.5;
        particle.style.width = `${ringSize}px`;
        particle.style.height = `${ringSize}px`;
        inner.style.borderRadius = '50%';
        inner.style.border = `${Math.max(2, size * 0.08)}px solid ${color}`;
        inner.style.boxShadow = `0 0 ${size * 0.5}px ${color}, inset 0 0 ${size * 0.3}px ${color}`;
        break;
      case 'dot':
        const dotSize = Math.max(4, size * 0.2);
        particle.style.width = `${dotSize}px`;
        particle.style.height = `${dotSize}px`;
        inner.style.borderRadius = '50%';
        inner.style.background = color.replace(String(colorOpacity), String(depth * 0.8));
        inner.style.boxShadow = `0 0 ${dotSize * 3}px ${color}, 0 0 ${dotSize * 6}px ${color}`;
        break;
      case 'line':
        particle.style.width = `${size * 2.5}px`;
        particle.style.height = '2px';
        inner.style.background = `linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`;
        inner.style.boxShadow = `0 0 ${size * 0.3}px ${color}`;
        break;
      case 'hexagon':
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 0.866}px`;
        inner.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        inner.style.background = `linear-gradient(135deg, ${color} 0%, transparent 60%)`;
        inner.style.border = `1px solid ${color}`;
        break;
      case 'triangle':
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 0.866}px`;
        inner.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
        inner.style.background = `linear-gradient(180deg, ${color} 0%, transparent 80%)`;
        break;
    }

    particle.appendChild(inner);
    particle.style.opacity = (depth * 0.5).toString();
    container.appendChild(particle);

    const xTo = gsap.quickTo(particle, "x", { duration: 1.2 + depth * 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(particle, "y", { duration: 1.2 + depth * 0.5, ease: "power3.out" });
    const scaleTo = gsap.quickTo(particle, "scale", { duration: 0.4, ease: "power2.out" });
    const opacityTo = gsap.quickTo(particle, "opacity", { duration: 0.4, ease: "power2.out" });

    const baseX = parseFloat(particle.style.left);
    const baseY = parseFloat(particle.style.top);

    return { el: particle, xTo, yTo, scaleTo, opacityTo, baseX, baseY, depth, size, type, color };
  }, []);

  // Optimized draw connections - uses cached positions to avoid layout thrashing
  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const connectionDistance = isMobile ? 120 : 200;
    const mouseDistance = isMobile ? 180 : 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const { x: mouseX, y: mouseY, active } = mouseRef.current;
    const positions = cachedPositionsRef.current;

    for (let i = 0; i < particles.length; i++) {
      const pos1 = positions[i];
      if (!pos1) continue;

      const x1 = pos1.x;
      const y1 = pos1.y;

      for (let j = i + 1; j < particles.length; j++) {
        const pos2 = positions[j];
        if (!pos2) continue;

        const x2 = pos2.x;
        const y2 = pos2.y;

        const distanceSq = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        if (distanceSq < connectionDistance * connectionDistance) {
          const distance = Math.sqrt(distanceSq);
          const opacity = (1 - distance / connectionDistance) * 0.12 * Math.min(particles[i].depth, particles[j].depth);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (active) {
        const dMouseSq = Math.pow(mouseX - x1, 2) + Math.pow(mouseY - y1, 2);
        if (dMouseSq < mouseDistance * mouseDistance) {
          const dMouse = Math.sqrt(dMouseSq);
          const opacity = (1 - dMouse / mouseDistance) * 0.25 * particles[i].depth;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const particleCount = isMobile ? 18 : isTablet ? 30 : 45;

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(i, particleCount));
    }

    const entranceTl = gsap.timeline();
    particlesRef.current.forEach((p, i) => {
      const startAngle = Math.random() * Math.PI * 2;
      const startRadius = window.innerWidth * 0.8;

      gsap.set(p.el, {
        x: Math.cos(startAngle) * startRadius,
        y: Math.sin(startAngle) * startRadius,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360
      });

      entranceTl.to(p.el, {
        x: 0,
        y: 0,
        opacity: p.depth * 0.5,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "power2.out"
      }, 0.015 * i);
    });

    particlesRef.current.forEach((p) => {
      const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
      const duration = 8 + Math.random() * 8;
      const xMove = (30 + Math.random() * 40) * (Math.random() > 0.5 ? 1 : -1);
      const yMove = (20 + Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1);

      floatTl.to(p.el, {
        x: `+=${xMove}`,
        y: `+=${yMove}`,
        rotation: `+=${p.type === 'line' ? 90 : 180}`,
        duration,
        ease: "sine.inOut"
      });
    });

    const updateCachedPositions = () => {
      cachedPositionsRef.current = particlesRef.current.map(p => {
        const rect = p.el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };
    setTimeout(updateCachedPositions, 200);

    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(updateCachedPositions);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimized Animation loop
    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < 32) { // Target ~30fps for background elements
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameRef.current = timestamp;
      frameCountRef.current++;

      const { x, y, active } = mouseRef.current;
      const isMobileDevice = window.innerWidth < 768;
      const interactionRadius = isMobileDevice ? 200 : 400;

      // Update position cache occasionally to account for floating animations
      if (frameCountRef.current % 10 === 0) {
        updateCachedPositions();
      }

      particlesRef.current.forEach((p, i) => {
        const cached = cachedPositionsRef.current[i];
        if (!cached) return;

        const deltaX = x - cached.x;
        const deltaY = y - cached.y;
        const distSq = deltaX * deltaX + deltaY * deltaY;

        if (active && distSq < interactionRadius * interactionRadius) {
          const force = 1 - Math.sqrt(distSq) / interactionRadius;
          p.xTo(-deltaX * force * 0.8 * p.depth);
          p.yTo(-deltaY * force * 0.8 * p.depth);
          p.scaleTo(1 + force * 0.4);
          p.opacityTo(Math.min(1, p.depth * 0.5 + force * 0.4));
        } else {
          p.xTo(0);
          p.yTo(0);
          p.scaleTo(1);
          p.opacityTo(p.depth * 0.5);
        }
      });

      if (frameCountRef.current % 2 === 0) {
        drawConnections();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY, active: true }; };
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    const handleTouchMove = (e: TouchEvent) => { if (e.touches.length > 0) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true }; };
    const handleTouchEnd = () => { setTimeout(() => { mouseRef.current.active = false; }, 500); };

    // Efficient click burst
    const handleClick = (e: MouseEvent) => {
      const { clientX: clickX, clientY: clickY } = e;
      particlesRef.current.forEach((p, i) => {
        const cached = cachedPositionsRef.current[i];
        if (!cached) return;
        const dx = cached.x - clickX;
        const dy = cached.y - clickY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 400 * 400) {
          const force = 1 - Math.sqrt(distSq) / 400;
          gsap.to(p.el, {
            x: `+=${dx * force * 0.5}`,
            y: `+=${dy * force * 0.5}`,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => gsap.to(p.el, { x: 0, y: 0, duration: 1, ease: "power2.inOut" })
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafRef.current!);
      particlesRef.current.forEach(p => p.el.remove());
      particlesRef.current = [];
    };
  }, [createParticle, drawConnections]);

  return (
    <>
      {/* Connection lines canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Particle container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Primary orb */}
        <div
          className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full"
          style={{
            top: '-30%',
            right: '-20%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 30%, transparent 60%)',
            filter: 'blur(80px)',
            animation: 'orb-dance-1 25s ease-in-out infinite'
          }}
        />

        {/* Secondary orb */}
        <div
          className="absolute w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full"
          style={{
            bottom: '-20%',
            left: '-15%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.06) 40%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'orb-dance-2 30s ease-in-out infinite'
          }}
        />

        {/* Accent orb */}
        <div
          className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
            filter: 'blur(50px)',
            animation: 'pulse-breathe 8s ease-in-out infinite'
          }}
        />

        {/* Floating accent spots */}
        <div
          className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full"
          style={{
            top: '20%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
            filter: 'blur(40px)',
            animation: 'float-spot 12s ease-in-out infinite'
          }}
        />

        <div
          className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] rounded-full"
          style={{
            bottom: '30%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 60%)',
            filter: 'blur(35px)',
            animation: 'float-spot 15s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes orb-dance-1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(50px, -30px) scale(1.1) rotate(5deg); }
          50% { transform: translate(-30px, 50px) scale(0.9) rotate(-3deg); }
          75% { transform: translate(-60px, -20px) scale(1.05) rotate(2deg); }
        }
        
        @keyframes orb-dance-2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-40px, 40px) scale(1.08) rotate(-4deg); }
          66% { transform: translate(60px, -30px) scale(0.95) rotate(6deg); }
        }
        
        @keyframes pulse-breathe {
          0%, 100% { 
            opacity: 0.6; 
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes float-spot {
          0%, 100% { transform: translate(0, 0); opacity: 0.8; }
          25% { transform: translate(20px, -15px); opacity: 1; }
          50% { transform: translate(-10px, 25px); opacity: 0.6; }
          75% { transform: translate(-25px, 5px); opacity: 0.9; }
        }
        
        .hero-particle {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .particle-inner {
          transform-style: preserve-3d;
        }
      `}</style>
    </>
  );
};

export default InteractiveHeroBackground;