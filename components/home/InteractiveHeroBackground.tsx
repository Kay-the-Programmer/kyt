import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface Particle {
  el: HTMLDivElement;
  xTo: gsap.QuickToFunc;
  yTo: gsap.QuickToFunc;
  baseX: number;
  baseY: number;
  depth: number;
  size: number;
  type: 'circle' | 'square' | 'ring' | 'dot' | 'line';
}

const InteractiveHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const createParticle = useCallback((index: number, total: number): Particle => {
    const container = containerRef.current!;
    const isMobile = window.innerWidth < 768;

    const types: Array<'circle' | 'square' | 'ring' | 'dot' | 'line'> = ['circle', 'square', 'ring', 'dot', 'line'];
    const type = types[Math.floor(Math.random() * types.length)];
    const depth = Math.random() * 0.8 + 0.2;

    // Scale sizes based on device
    const baseSize = isMobile ? 8 : 15;
    const maxSize = isMobile ? 40 : 80;
    const size = Math.random() * (maxSize - baseSize) + baseSize;

    const particle = document.createElement('div');
    particle.className = 'absolute pointer-events-none';

    // Position particles more organically across the viewport
    const angle = (index / total) * Math.PI * 2;
    const radius = Math.random() * 40 + 10;
    const baseX = 50 + Math.cos(angle) * radius;
    const baseY = 50 + Math.sin(angle) * radius;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.willChange = 'transform, opacity';

    // Style based on particle type
    switch (type) {
      case 'circle':
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.background = `radial-gradient(circle at 30% 30%, rgba(59, 130, 246, ${depth * 0.15}), rgba(59, 130, 246, ${depth * 0.05}))`;
        particle.style.boxShadow = `0 0 ${size * 0.5}px rgba(59, 130, 246, ${depth * 0.1})`;
        break;
      case 'square':
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '15%';
        particle.style.border = `1px solid rgba(59, 130, 246, ${depth * 0.2})`;
        particle.style.backdropFilter = 'blur(1px)';
        break;
      case 'ring':
        particle.style.width = `${size * 1.5}px`;
        particle.style.height = `${size * 1.5}px`;
        particle.style.borderRadius = '50%';
        particle.style.border = `${Math.max(1, size * 0.05)}px solid rgba(147, 51, 234, ${depth * 0.15})`;
        break;
      case 'dot':
        const dotSize = Math.max(3, size * 0.15);
        particle.style.width = `${dotSize}px`;
        particle.style.height = `${dotSize}px`;
        particle.style.borderRadius = '50%';
        particle.style.background = `rgba(59, 130, 246, ${depth * 0.6})`;
        particle.style.boxShadow = `0 0 ${dotSize * 2}px rgba(59, 130, 246, ${depth * 0.4})`;
        break;
      case 'line':
        particle.style.width = `${size * 2}px`;
        particle.style.height = '1px';
        particle.style.background = `linear-gradient(90deg, transparent, rgba(59, 130, 246, ${depth * 0.3}), transparent)`;
        break;
    }

    particle.style.opacity = (depth * 0.4).toString();
    container.appendChild(particle);

    const xTo = gsap.quickTo(particle, "x", { duration: 1.5 + depth, ease: "power2.out" });
    const yTo = gsap.quickTo(particle, "y", { duration: 1.5 + depth, ease: "power2.out" });

    return { el: particle, xTo, yTo, baseX, baseY, depth, size, type };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const particleCount = isMobile ? 15 : isTablet ? 25 : 35;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(i, particleCount));
    }

    // Entrance animation - particles fade and float in
    particlesRef.current.forEach((p, i) => {
      gsap.fromTo(p.el,
        {
          opacity: 0,
          scale: 0,
          rotation: Math.random() * 180 - 90
        },
        {
          opacity: p.depth * 0.4,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          delay: 0.5 + i * 0.03,
          ease: "elastic.out(1, 0.5)"
        }
      );
    });

    // Ambient floating animation for each particle
    particlesRef.current.forEach((p) => {
      const duration = 8 + Math.random() * 12;
      const xMove = (30 + Math.random() * 40) * (Math.random() > 0.5 ? 1 : -1);
      const yMove = (20 + Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1);
      const rotateAmount = p.type === 'line' ? 180 : p.type === 'square' ? 90 : 360;

      gsap.to(p.el, {
        x: `+=${xMove}`,
        y: `+=${yMove}`,
        rotation: `+=${rotateAmount}`,
        duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Subtle pulsing effect
      if (p.type === 'dot' || p.type === 'circle') {
        gsap.to(p.el, {
          scale: 1 + Math.random() * 0.3,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });

    // Interactive: particles react to mouse/touch
    const updateParticles = () => {
      const { x, y } = mouseRef.current;
      const isMobileDevice = window.innerWidth < 768;
      const interactionRadius = isMobileDevice ? 200 : 400;
      const maxForce = isMobileDevice ? 0.6 : 0.8;

      particlesRef.current.forEach((p) => {
        const rect = p.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < interactionRadius) {
          const force = Math.pow((interactionRadius - distance) / interactionRadius, 2);
          const moveX = -deltaX * force * maxForce * p.depth;
          const moveY = -deltaY * force * maxForce * p.depth;

          p.xTo(moveX);
          p.yTo(moveY);

          // Scale up particles close to cursor
          gsap.to(p.el, {
            scale: 1 + force * 0.5,
            duration: 0.3,
            overwrite: 'auto'
          });
        } else {
          p.xTo(0);
          p.yTo(0);

          gsap.to(p.el, {
            scale: 1,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });

      rafRef.current = requestAnimationFrame(updateParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      // Gradually return to center when touch ends
      mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    rafRef.current = requestAnimationFrame(updateParticles);

    // Periodic "pulse" effect that ripples through particles
    const pulseInterval = setInterval(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      particlesRef.current.forEach((p, i) => {
        const rect = p.el.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(rect.left - centerX, 2) + Math.pow(rect.top - centerY, 2)
        );
        const delay = distance / 800;

        gsap.to(p.el, {
          scale: 1.3,
          opacity: p.depth * 0.8,
          duration: 0.4,
          delay,
          ease: "power2.out"
        });

        gsap.to(p.el, {
          scale: 1,
          opacity: p.depth * 0.4,
          duration: 0.6,
          delay: delay + 0.4,
          ease: "power2.inOut"
        });
      });
    }, 8000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(rafRef.current!);
      clearInterval(pulseInterval);
      gsap.killTweensOf(particlesRef.current.map(p => p.el));
      particlesRef.current.forEach(p => p.el.remove());
      particlesRef.current = [];
    };
  }, [createParticle]);

  return (
    <>
      {/* Main particle container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* Gradient orbs for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="gradient-orb absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-30"
          style={{
            top: '-20%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float-orb 20s ease-in-out infinite'
          }}
        />
        <div
          className="gradient-orb absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full opacity-20"
          style={{
            bottom: '-15%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(147, 51, 234, 0.04) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float-orb 25s ease-in-out infinite reverse'
          }}
        />
        <div
          className="gradient-orb absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-15"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
            filter: 'blur(40px)',
            animation: 'pulse-glow 6s ease-in-out infinite'
          }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(-30px, -10px) scale(1.02); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.25; transform: translateX(-50%) scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default InteractiveHeroBackground;