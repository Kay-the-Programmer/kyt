import React, { useEffect, useRef, useState, memo } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Shape {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'circle' | 'square';
  color: string;
  mass: number;
  depth: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1.0 to 0.0
  color: string;
  size: number;
}

const Footer: React.FC = memo(() => {
  const footerRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [renderedShapes, setRenderedShapes] = useState<Shape[]>([]);
  const shapesRef = useRef<Shape[]>([]);

  const shapeElementsRef = useRef<{ [key: number]: HTMLDivElement }>({});
  const particlesRef = useRef<Particle[]>([]);
  const draggedShapeId = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  useEffect(() => {
    const arena = arenaRef.current;
    const canvas = canvasRef.current;
    if (!arena || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = arena.clientWidth * dpr;
        canvas.height = arena.clientHeight * dpr;
        ctx.scale(dpr, dpr);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const isMobile = window.innerWidth < 768;
    // const brandText = "KYTRIQ TECHNOLOGIES"; // Removed
    const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#7c3aed']; // Blues & Purples

    // Initialize shapes (Random Abstract)
    if (shapesRef.current.length === 0) {
      let currentId = 0;
      const width = arena.clientWidth || window.innerWidth;
      const height = arena.clientHeight || 300;
      const count = isMobile ? 8 : 16;

      const initialShapes: Shape[] = Array.from({ length: count }).map((_, i) => {
        const radius = isMobile ? 20 + Math.random() * 20 : 30 + Math.random() * 30;
        return {
          id: currentId++,
          x: Math.random() * (width - radius * 2) + radius,
          y: Math.random() * (height - radius * 2) + radius,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          radius,
          type: Math.random() > 0.4 ? 'circle' : 'square',
          color: colors[Math.floor(Math.random() * colors.length)],
          mass: radius / 10,
          depth: Math.random() * 0.8 + 0.2
        };
      });

      shapesRef.current = initialShapes;
      setRenderedShapes(initialShapes);
    }

    const st = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      }
    });

    const physicsUpdate = () => {
      const shapes = shapesRef.current;
      const particles = particlesRef.current;
      const width = arena.clientWidth;
      const height = arena.clientHeight;

      // Update mouse velocity
      mouseVelocity.current = {
        x: mousePos.current.x - lastMousePos.current.x,
        y: mousePos.current.y - lastMousePos.current.y
      };
      lastMousePos.current = { ...mousePos.current };

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.96;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life * 0.4;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Adjust particle Y based on scroll for parallax effect consistency
        ctx.arc(p.x, p.y + (scrollProgress.current - 0.5) * 100 * 0.5, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];

        if (draggedShapeId.current === s.id) {
          s.x = mousePos.current.x;
          s.y = mousePos.current.y;
          s.vx = mouseVelocity.current.x;
          s.vy = mouseVelocity.current.y;
        } else {
          s.x += s.vx;
          s.y += s.vy;

          if (s.x - s.radius < 0) { s.x = s.radius; s.vx *= -0.8; }
          if (s.x + s.radius > width) { s.x = width - s.radius; s.vx *= -0.8; }
          if (s.y - s.radius < 0) { s.y = s.radius; s.vy *= -0.8; }
          if (s.y + s.radius > height) { s.y = height - s.radius; s.vy *= -0.8; }

          s.vx *= 0.985;
          s.vy *= 0.985;
        }

        // Spawn particles if moving fast or dragged
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed > 2 || draggedShapeId.current === s.id) {
          const spawnCount = draggedShapeId.current === s.id ? 2 : Math.min(3, Math.floor(speed / 4));
          // Limit spawn rate slightly
          if (Math.random() < 0.3) {
            for (let k = 0; k < spawnCount; k++) {
              particles.push({
                x: s.x + (Math.random() - 0.5) * s.radius,
                y: s.y + (Math.random() - 0.5) * s.radius,
                vx: s.vx * -0.2 + (Math.random() - 0.5) * 1,
                vy: s.vy * -0.2 + (Math.random() - 0.5) * 1,
                life: 1.0,
                color: s.color,
                size: Math.random() * 4 + 2
              });
            }
          }
        }

        // Shape collisions
        for (let j = i + 1; j < shapes.length; j++) {
          const s2 = shapes[j];
          const dx = s2.x - s.x;
          const dy = s2.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = s.radius + s2.radius;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const vx1 = s.vx * cos + s.vy * sin;
            const vy1 = s.vy * cos - s.vx * sin;
            const vx2 = s2.vx * cos + s2.vy * sin;
            const vy2 = s2.vy * cos - s2.vx * sin;

            const vTotal = vx1 - vx2;
            const vx1Final = ((s.mass - s2.mass) * vx1 + 2 * s2.mass * vx2) / (s.mass + s2.mass);
            const vx2Final = vTotal + vx1Final;

            s.vx = vx1Final * cos - vy1 * sin;
            s.vy = vy1 * cos + vx1Final * sin;
            s2.vx = vx2Final * cos - vy2 * sin;
            s2.vy = vy2 * cos + vx2Final * sin;

            const overlap = minDist - dist;
            const cx = (overlap * cos) / 2;
            const cy = (overlap * sin) / 2;

            if (draggedShapeId.current !== s.id) {
              s.x -= cx;
              s.y -= cy;
            }
            if (draggedShapeId.current !== s2.id) {
              s2.x += cx;
              s2.y += cy;
            }
          }
        }

        // Apply transform to cached DOM element
        const el = shapeElementsRef.current[s.id];
        if (el) {
          const parallaxY = (scrollProgress.current - 0.5) * 100 * s.depth;
          el.style.transform = `translate3d(${s.x - s.radius}px, ${s.y - s.radius + parallaxY}px, 0) rotate(${s.x + s.y}deg)`;
        }
      }
    };

    gsap.ticker.add(physicsUpdate);

    const ctxScroll = gsap.context(() => {
      // Physics Arena Entrance
      gsap.from(arenaRef.current, {
        scrollTrigger: {
          trigger: arenaRef.current,
          start: 'top 85%',
        },
        scale: 0.9,
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'elastic.out(1, 0.7)'
      });

      gsap.from('.footer-identity', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
      });
    });

    return () => {
      gsap.ticker.remove(physicsUpdate);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      st.kill();
      ctxScroll.revert();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    draggedShapeId.current = id;
    updateMousePosition(e);

    const shape = shapesRef.current.find(s => s.id === id);
    if (shape) {
      shape.vx = (Math.random() - 0.5) * 20;
      shape.vy = (Math.random() - 0.5) * 20;
    }
  };

  const handleGlobalMouseUp = () => {
    draggedShapeId.current = null;
  };

  const updateMousePosition = (e: React.MouseEvent | React.TouchEvent) => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    mousePos.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  return (
    <footer
      ref={footerRef}
      onMouseUp={handleGlobalMouseUp}
      onTouchEnd={handleGlobalMouseUp}
      onMouseMove={updateMousePosition}
      onTouchMove={updateMousePosition}
      className="relative bg-gray-50 dark:bg-brand-dark border-t border-gray-100 dark:border-gray-900 pt-0 pb-16 px-6 transition-colors duration-300 overflow-hidden"
    >

      {/* INTERACTIVE PHYSICS ARENA */}
      <div className="max-w-7xl mx-auto my-16 md:my-24">
        <div className="flex items-center space-x-4 mb-10">
          <div className="h-px w-10 bg-blue-600"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600">Interact</span>
        </div>

        <div
          ref={arenaRef}
          className="relative w-full h-[400px] md:h-[500px] rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/30 overflow-hidden group cursor-crosshair backdrop-blur-sm shadow-2xl shadow-blue-900/5"
        >
          {/* TRAIL CANVAS */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none select-none">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[1em] text-blue-600">Grab & Toss Objects</span>
          </div>

          {renderedShapes.map((s) => (
            <div
              key={s.id}
              ref={(el) => { if (el) shapeElementsRef.current[s.id] = el; }}
              onMouseDown={(e) => handleMouseDown(e, s.id)}
              onTouchStart={(e) => handleMouseDown(e, s.id)}
              className={`absolute pointer-events-auto z-10 transition-shadow duration-300 active:scale-110 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] ${s.type === 'circle' ? 'rounded-full' : 'rounded-2xl'}`}
              style={{
                width: s.radius * 2,
                height: s.radius * 2,
                backgroundColor: s.color,
                opacity: 0.9,
                border: '1px solid rgba(255,255,255,0.2)',
                willChange: 'transform',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className={`w-1/2 h-1/2 border border-white ${s.type === 'circle' ? 'rounded-full' : 'rounded-lg'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIMPLIFIED BRAND & SOCIAL SECTION */}
      <div className="footer-identity max-w-7xl mx-auto mt-16 md:mt-24 text-center">
        <Link to="/" className="inline-flex items-center mb-8 group">
          <img
            src={logo}
            alt="Kytriq Logo"
            className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 font-light">
          Bringing digital ideas to life through intelligent systems and premium software engineering. Architects of the future, today.
        </p>
        <div className="flex items-center justify-center space-x-8 md:space-x-12">
          {[
            { icon: 'fa-linkedin-in', href: '#', label: 'LinkedIn' },
            { icon: 'fa-x-twitter', href: '#', label: 'Twitter' },
            { icon: 'fa-github', href: '#', label: 'GitHub' },
            { icon: 'fa-instagram', href: '#', label: 'Instagram' }
          ].map((social, i) => (
            <a
              key={i}
              href={social.href}
              onClick={(e) => social.href === '#' && e.preventDefault()}
              className="group flex flex-col items-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:border-blue-600 group-hover:text-blue-600 dark:group-hover:border-blue-500 dark:group-hover:text-blue-500 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                <i className={`fa-brands ${social.icon} text-lg`}></i>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{social.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] space-y-6 md:space-y-0">
        <p>&copy; 2024 Kytriq Technologies. All Rights Reserved.</p>
        <div className="flex space-x-10 text-gray-500/50 dark:text-gray-400/30">
          <span>Tech Hub Central // Palo Alto // CA</span>
        </div>
      </div>
    </footer>
  );
});

export default Footer;