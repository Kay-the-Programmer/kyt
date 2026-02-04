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
  char: string;
  color: string;
  mass: number;
  depth: number;
  // Target positions for assembly
  targetX: number;
  targetY: number;
  visible: boolean;
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

type AnimationState = 'SCATTERED' | 'ASSEMBLING' | 'ASSEMBLED' | 'DISSOLVING';

const Footer: React.FC = memo(() => {
  const footerRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [renderedShapes, setRenderedShapes] = useState<Shape[]>([]);
  const shapesRef = useRef<Shape[]>([]);
  const animationStateRef = useRef<AnimationState>('SCATTERED');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    const brandText = "KYTRIQ TECHNOLOGIES";
    const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#7c3aed'];

    // Initialize shapes and cycle
    if (shapesRef.current.length === 0) {
      let currentId = 0;
      // We want to verify layout
      const width = arena.clientWidth || window.innerWidth;
      const height = arena.clientHeight || 300;

      const letters = brandText.split('').filter(c => c.trim() !== '');

      // Calculate Targets
      // We'll split "KYTRIQ" and "TECHNOLOGIES" into two lines if needed, or one line
      // "KYTRIQ TECHNOLOGIES" is long. Two lines feels better for the sphere pack.
      const line1 = "KYTRIQ";
      const line2 = "TECHNOLOGIES";

      const radius = isMobile ? 14 : 24; // Slightly smaller for dense packing
      const spacing = radius * 2.2;

      // Line 1 centering
      const line1Width = line1.length * spacing;
      const line1StartX = (width - line1Width) / 2 + radius;
      const line1Y = height / 2 - radius * 1.5;

      // Line 2 centering
      const line2Width = line2.length * spacing;
      const line2StartX = (width - line2Width) / 2 + radius;
      const line2Y = height / 2 + radius * 1.5;

      const initialShapes: Shape[] = [];
      let charIndex = 0;

      // Create shapes for Line 1
      for (let i = 0; i < line1.length; i++) {
        initialShapes.push(createShape(currentId++, line1[i],
          line1StartX + i * spacing, line1Y, width, height, radius, colors, charIndex++));
      }

      // Create shapes for Line 2
      for (let i = 0; i < line2.length; i++) {
        initialShapes.push(createShape(currentId++, line2[i],
          line2StartX + i * spacing, line2Y, width, height, radius, colors, charIndex++));
      }

      shapesRef.current = initialShapes;
      setRenderedShapes(initialShapes);

      // Start Animation Cycle
      startAnimationCycle();
    }

    function createShape(id: number, char: string, tx: number, ty: number, w: number, h: number, r: number, cols: string[], idx: number): Shape {
      return {
        id,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: r,
        char,
        color: cols[idx % cols.length],
        mass: 1,
        depth: Math.random() * 0.4 + 0.6,
        targetX: tx,
        targetY: ty,
        visible: true
      };
    }

    function startAnimationCycle() {
      // SCATTERED -> (3s) -> ASSEMBLING -> (4s) -> ASSEMBLED -> (3s) -> DISSOLVING -> (1s) -> SCATTERED

      const nextPhase = () => {
        const current = animationStateRef.current;

        if (current === 'SCATTERED') {
          animationStateRef.current = 'ASSEMBLING';
          timerRef.current = setTimeout(nextPhase, 5000); // Give it time to settle
        }
        else if (current === 'ASSEMBLING') {
          animationStateRef.current = 'ASSEMBLED'; // Strict hold
          shapesRef.current.forEach(s => { s.vx = 0; s.vy = 0; }); // Verify stop
          timerRef.current = setTimeout(nextPhase, 3000); // Hold for 3s
        }
        else if (current === 'ASSEMBLED') {
          animationStateRef.current = 'DISSOLVING';
          // Trigger explosion immediately in update loop
          timerRef.current = setTimeout(nextPhase, 1500); // Wait for dissolve
        }
        else if (current === 'DISSOLVING') {
          // Reset
          resetShapes();
          animationStateRef.current = 'SCATTERED';
          timerRef.current = setTimeout(nextPhase, 2000); // Stay scattered briefly
        }
      };

      timerRef.current = setTimeout(nextPhase, 2000); // Initial delay
    }

    function resetShapes() {
      const w = arena.clientWidth;
      const h = arena.clientHeight;
      shapesRef.current.forEach(s => {
        s.visible = true;
        s.x = Math.random() * w;
        s.y = Math.random() * h;
        s.vx = (Math.random() - 0.5) * 15; // Fast re-entry
        s.vy = (Math.random() - 0.5) * 15;

        // Update DOM visibility immediately
        const el = shapeElementsRef.current[s.id];
        if (el) {
          el.style.opacity = '1';
          el.style.transform = `scale(0)`; // Grow in
          gsap.to(el, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }
      });
    }

    // ScrollTrigger
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
      const state = animationStateRef.current;

      // Update mouse velocity
      mouseVelocity.current = {
        x: mousePos.current.x - lastMousePos.current.x,
        y: mousePos.current.y - lastMousePos.current.y
      };
      lastMousePos.current = { ...mousePos.current };

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Handle Dissolve Trigger
      if (state === 'DISSOLVING') {
        // If visible, explode and hide
        shapes.forEach(s => {
          if (s.visible) {
            s.visible = false;
            // Spawn particles
            for (let k = 0; k < 12; k++) {
              particles.push({
                x: s.x + (Math.random() - 0.5) * s.radius,
                y: s.y + (Math.random() - 0.5) * s.radius,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1.0,
                color: s.color,
                size: Math.random() * 4 + 2
              });
            }
            // Hide DOM
            const el = shapeElementsRef.current[s.id];
            if (el) el.style.opacity = '0';
          }
        });
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.94;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Update Shapes
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        if (!s.visible) continue;

        if (draggedShapeId.current === s.id) {
          s.x = mousePos.current.x;
          s.y = mousePos.current.y;
          s.vx = mouseVelocity.current.x;
          s.vy = mouseVelocity.current.y;
        } else {

          if (state === 'ASSEMBLING' || state === 'ASSEMBLED') {
            // Magnetic pull to target
            const k = state === 'ASSEMBLED' ? 0.1 : 0.03; // Stiffer when assembled
            const damp = 0.85;

            const ax = (s.targetX - s.x) * k;
            const ay = (s.targetY - s.y) * k;

            s.vx += ax;
            s.vy += ay;
            s.vx *= damp;
            s.vy *= damp;
          } else {
            // Scattered Physics
            s.x += s.vx;
            s.y += s.vy;

            // Bounce off walls
            if (s.x - s.radius < 0) { s.x = s.radius; s.vx *= -0.7; }
            if (s.x + s.radius > width) { s.x = width - s.radius; s.vx *= -0.7; }
            if (s.y - s.radius < 0) { s.y = s.radius; s.vy *= -0.7; }
            if (s.y + s.radius > height) { s.y = height - s.radius; s.vy *= -0.7; }

            s.vx *= 0.99;
            s.vy *= 0.99;
          }
        }

        // Move position (integrated)
        if (state !== 'SCATTERED') {
          s.x += s.vx;
          s.y += s.vy;
        }

        // Collisions (Always active so they don't overlap even when assembling)
        for (let j = i + 1; j < shapes.length; j++) {
          const s2 = shapes[j];
          if (!s2.visible) continue;

          const dx = s2.x - s.x;
          const dy = s2.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = s.radius + s2.radius;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            const overlap = minDist - dist;

            // Push apart proportional to overlap
            const force = overlap * 0.05; // Soft collision

            const fx = force * cos;
            const fy = force * sin;

            if (draggedShapeId.current !== s.id) {
              s.vx -= fx;
              s.vy -= fy;
            }
            if (draggedShapeId.current !== s2.id) {
              s2.vx += fx;
              s2.vy += fy;
            }
          }
        }

        // Apply transform to DOM
        const el = shapeElementsRef.current[s.id];
        if (el) {
          const parallaxY = (scrollProgress.current - 0.5) * 50 * s.depth;
          // Less rotation when assembled
          const rot = (state === 'ASSEMBLED' || state === 'ASSEMBLING') ? s.vx * 1 : s.vx * 2;
          el.style.transform = `translate3d(${s.x - s.radius}px, ${s.y - s.radius + parallaxY}px, 0) rotate(${rot}deg)`;
        }
      }
    };

    gsap.ticker.add(physicsUpdate);

    const ctxScroll = gsap.context(() => {
      // Entrance
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
      if (timerRef.current) clearTimeout(timerRef.current);
      st.kill();
      ctxScroll.revert();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    draggedShapeId.current = id;
    updateMousePosition(e);

    const shape = shapesRef.current.find(s => s.id === id);
    if (shape) {
      shape.vx = 0;
      shape.vy = 0;
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
          className="relative w-full h-[400px] md:h-[600px] rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/30 overflow-hidden group cursor-crosshair backdrop-blur-sm shadow-2xl shadow-blue-900/5 transition-all duration-300"
        >
          {/* TRAIL CANVAS */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
          />

          <div className="absolute inset-x-0 bottom-10 flex items-center justify-center opacity-40 pointer-events-none select-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-blue-400">Watch & Play</span>
          </div>

          {renderedShapes.map((s) => (
            <div
              key={s.id}
              ref={(el) => { if (el) shapeElementsRef.current[s.id] = el; }}
              onMouseDown={(e) => handleMouseDown(e, s.id)}
              onTouchStart={(e) => handleMouseDown(e, s.id)}
              className="absolute pointer-events-auto z-10 transition-shadow duration-300 active:scale-110 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] rounded-full flex items-center justify-center select-none"
              style={{
                width: s.radius * 2,
                height: s.radius * 2,
                backgroundColor: s.color,
                color: '#ffffff',
                border: '2px solid rgba(255,255,255,0.3)',
                willChange: 'transform',
                boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.3), 0 5px 15px rgba(0,0,0,0.1)',
                fontSize: s.radius * 1.0 + 'px',
                fontWeight: 900,
                fontFamily: 'var(--font-heading, sans-serif)',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {s.char}
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