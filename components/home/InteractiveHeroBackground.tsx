import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InteractiveHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodeCount = window.innerWidth < 768 ? 8 : 12;
    const nodes: {
      el: HTMLDivElement,
      xTo: Function,
      yTo: Function,
      baseX: number,
      baseY: number,
      depth: number
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      const size = Math.random() * 50 + 15;
      const isSquare = Math.random() > 0.7;
      const depth = Math.random() * 0.9 + 0.1;

      node.className = `absolute border border-blue-500/10 dark:border-white/5 pointer-events-none transition-opacity duration-1000 will-change-transform`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.borderRadius = isSquare ? '15%' : '50%';
      node.style.opacity = (depth * 0.3).toString();
      node.style.filter = `blur(${Math.max(0, (1 - depth) * 5)}px)`;

      node.style.left = `${Math.random() * 100}%`;
      node.style.top = `${Math.random() * 100}%`;

      container.appendChild(node);

      const xTo = gsap.quickTo(node, "x", { duration: 1.2, ease: "power2.out" });
      const yTo = gsap.quickTo(node, "y", { duration: 1.2, ease: "power2.out" });

      nodes.push({ el: node, xTo, yTo, baseX: 0, baseY: 0, depth });

      gsap.to(node, {
        x: '+=30',
        y: '+=30',
        rotation: 360,
        duration: 10 + Math.random() * 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    const updateNodes = (x: number, y: number) => {
      nodes.forEach((node) => {
        const rect = node.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const radius = window.innerWidth < 768 ? 250 : 450;

        if (distance < radius) {
          const force = (radius - distance) / radius;
          const moveX = -deltaX * force * 0.5 * node.depth;
          const moveY = -deltaY * force * 0.5 * node.depth;
          node.xTo(moveX);
          node.yTo(moveY);
        } else {
          node.xTo(0);
          node.yTo(0);
        }
      });
    };

    const onMouseMove = (e: MouseEvent) => updateNodes(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateNodes(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      nodes.forEach(n => n.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />;
};

export default InteractiveHeroBackground;