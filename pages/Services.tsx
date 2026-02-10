
import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioScroll from '../components/home/PortfolioScroll';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Memoized Floating Orb Component for performance
const FloatingOrb = memo<{ delay: number; size: number; color: string; position: { x: string; y: string } }>(
  ({ delay, size, color, position }) => (
    <div
      className="floating-orb absolute rounded-full pointer-events-none blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: position.x,
        top: position.y,
        opacity: 0.4,
        animationDelay: `${delay}s`,
        willChange: 'transform, opacity',
      }}
    />
  )
);
FloatingOrb.displayName = 'FloatingOrb';

// Memoized Cursor Glow Component (Desktop only)
const CursorGlow = memo<{ glowRef: React.RefObject<HTMLDivElement | null> }>(({ glowRef }) => (
  <div
    ref={glowRef}
    className="cursor-glow fixed w-64 h-64 rounded-full pointer-events-none z-50 mix-blend-screen hidden lg:block"
    style={{
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      transform: 'translate(-50%, -50%)',
      willChange: 'left, top',
    }}
  />
));
CursorGlow.displayName = 'CursorGlow';

// Memoized Service Card for performance
const ServiceCard = memo<{
  service: typeof services[number];
  idx: number;
  activeCard: number | null;
  cardRef: (el: HTMLDivElement | null) => void;
  isMobile: boolean;
}>(({ service, idx, activeCard, cardRef, isMobile }) => (
  <div
    id={service.id}
    ref={cardRef}
    className={`service-card group p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/50 dark:border-white/5 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] flex flex-col min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:h-[520px] relative overflow-hidden cursor-pointer backdrop-blur-xl shadow-lg ${activeCard === idx ? 'z-20' : 'z-10'}`}
    style={{
      transformStyle: 'preserve-3d',
      willChange: isMobile ? 'auto' : 'transform, box-shadow',
      contain: 'layout style paint',
    }}
  >
    {/* Animated Border Glow */}
    <div
      className="card-border-glow absolute inset-0 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] pointer-events-none opacity-0 transition-opacity duration-500"
      style={{
        background: `linear-gradient(135deg, ${service.accent.includes('violet') ? 'rgba(139, 92, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)'} 0%, transparent 50%)`,
        padding: '2px',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      }}
    />

    {/* Background Parallax Image - Lazy loaded */}
    <div
      className="card-parallax-bg absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-700 -z-10"
      style={{
        backgroundImage: `url(${service.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'scale(1.2)',
      }}
    />

    {/* Spotlight Glow - Hidden on mobile for performance */}
    {!isMobile && (
      <div className="card-glow absolute pointer-events-none w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl opacity-0 transition-opacity duration-300 -z-10" />
    )}

    {/* Glass Glare Overlay - Desktop only */}
    {!isMobile && (
      <div className="card-glare absolute inset-[-100%] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none opacity-0 rotate-[25deg] -z-10" />
    )}

    {/* Parallax Ghost Icon */}
    <div className="card-bg-icon absolute -top-6 sm:-top-10 -right-6 sm:-right-10 text-[6rem] sm:text-[10rem] md:text-[14rem] text-blue-600/[0.03] dark:text-white/[0.02] pointer-events-none select-none -z-20">
      <i className={`fa-solid ${service.icon}`} />
    </div>

    {/* Icon with gradient background */}
    <div
      className={`service-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${service.accent} rounded-xl sm:rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all shrink-0`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <i className={`fa-solid ${service.icon} text-lg sm:text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg`} />
    </div>

    <h3 className="service-title text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold mb-2 sm:mb-3 md:mb-4 text-gray-900 dark:text-white transition-transform duration-300">
      {service.title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 md:mb-8 flex-grow line-clamp-3 sm:line-clamp-none">
      {service.description}
    </p>

    {/* Feature Pills */}
    <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
      {service.features.map(feature => (
        <div key={feature} className="feature-pill flex items-center space-x-2 sm:space-x-3 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          <div className={`w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full bg-gradient-to-r ${service.accent}`} />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  </div>
));
ServiceCard.displayName = 'ServiceCard';

// Services data (moved outside component to prevent re-creation)
const services = [
  {
    id: 'ai-engineering',
    icon: 'fa-brain',
    title: 'AI Integration',
    description: 'Implementing AI features in your existing products or creating custom AI solutions.',
    features: ['Predictive Logic', 'LLM Fine-tuning', 'Computer Vision'],
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9457?auto=format&fit=crop&q=60&w=800',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    id: 'scalable-systems',
    icon: 'fa-code-branch',
    title: 'Web & Mobile Apps',
    description: 'Creating seamless and intuitive user experiences across web and mobile platforms.',
    features: ['Cross-Platform', 'Responsive Design', 'User-Centric'],
    bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=60&w=800',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'unified-ecosystems',
    icon: 'fa-layer-group',
    title: 'Software Development',
    description: 'Building robust, scalable software solutions tailored to your business needs.',
    features: ['Enterprise Grade', 'Microservices', 'Cloud Native'],
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=800',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'strategic-design',
    icon: 'fa-compass-drafting',
    title: 'Strategic Design',
    description: 'Minimalistic, high-end UI/UX that prioritizes user intuition and brand trustworthiness.',
    features: ['Prototyping', 'Design Systems', 'Behavioral UX'],
    bgImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=60&w=800',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    id: 'native-performance',
    icon: 'fa-terminal',
    title: 'Native Performance',
    description: 'Building ultra-fast desktop and mobile experiences that utilize full hardware potential.',
    features: ['Multi-platform', 'Low Latency', 'Offline-First'],
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=60&w=800',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    id: 'security-core',
    icon: 'fa-shield-halved',
    title: 'Security Core',
    description: 'Fortifying your digital assets with cutting-edge encryption and biometric authentication.',
    features: ['Zero Trust', 'End-to-End Encryption', 'Audit Ready'],
    bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=60&w=800',
    accent: 'from-red-500 to-rose-600',
  }
] as const;

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const gridSectionRef = useRef<HTMLElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const orbsContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // SEO Configuration
  const { HelmetElement } = useSEO({
    title: 'Services | Kytriq Technologies',
    description: 'Explore our elite software services: AI Integration, Web & Mobile Apps, Software Development, Strategic Design, Native Performance, and Security Core.',
    keywords: 'software services, AI integration, web development, mobile apps, UI/UX design, cybersecurity',
    url: 'https://kytriq.com/services'
  });

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoized floating orbs - reduced on mobile for performance
  const floatingOrbs = useMemo(() => {
    const allOrbs = [
      { delay: 0, size: 300, color: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)', position: { x: '10%', y: '20%' } },
      { delay: 2, size: 250, color: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', position: { x: '80%', y: '30%' } },
      { delay: 4, size: 280, color: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', position: { x: '60%', y: '70%' } },
      { delay: 6, size: 200, color: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)', position: { x: '20%', y: '80%' } },
    ];
    // Reduce orbs on mobile for better performance
    return isMobile ? allOrbs.slice(0, 2) : allOrbs;
  }, [isMobile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // ========================================
      // 1. CURSOR GLOW EFFECT (Desktop only)
      // ========================================
      if (!isMobile && cursorGlowRef.current) {
        const cursorGlow = cursorGlowRef.current;
        const xTo = gsap.quickTo(cursorGlow, "left", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(cursorGlow, "top", { duration: 0.4, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
      }

      // ========================================
      // 2. FLOATING ORBS AMBIENT ANIMATION (Reduced on mobile)
      // ========================================
      if (!isMobile) {
        const orbs = document.querySelectorAll('.floating-orb');
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            x: `random(-80, 80)`,
            y: `random(-60, 60)`,
            scale: `random(0.9, 1.2)`,
            opacity: `random(0.2, 0.4)`,
            duration: `random(10, 18)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.8,
          });
        });
      }

      // ========================================
      // 3. CINEMATIC HEADER ENTRANCE
      // ========================================
      const headerTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Subtitle entrance with elastic bounce
      headerTL.fromTo('.services-subtitle',
        { y: 40, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 1 }
      );

      // Main title with split effect
      headerTL.fromTo('.services-title-word',
        { y: 120, autoAlpha: 0, rotationX: -45, transformOrigin: 'top center' },
        { y: 0, autoAlpha: 1, rotationX: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out' },
        '-=0.6'
      );

      // Gradient text shimmer
      headerTL.fromTo('.gradient-text-animated',
        { backgroundPosition: '200% 50%' },
        { backgroundPosition: '0% 50%', duration: 2, ease: 'power2.inOut' },
        '-=1'
      );

      // Description fade in with blur
      headerTL.fromTo('.services-description',
        { y: 30, autoAlpha: 0, filter: 'blur(10px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.2 },
        '-=1.2'
      );

      // ========================================
      // 4. MULTI-LAYER PARALLAX GRID
      // ========================================
      const bgGrid = bgGridRef.current;
      const gridSection = gridSectionRef.current;

      if (bgGrid && gridSection && !isMobile) {
        // Create additional grid layers for depth
        gsap.set(bgGrid, { transformStyle: 'preserve-3d' });

        const xTo = gsap.quickTo(bgGrid, "x", { duration: 2, ease: "power3.out" });
        const yTo = gsap.quickTo(bgGrid, "y", { duration: 2, ease: "power3.out" });
        const rXTo = gsap.quickTo(bgGrid, "rotateX", { duration: 1.5, ease: "power3.out" });
        const rYTo = gsap.quickTo(bgGrid, "rotateY", { duration: 1.5, ease: "power3.out" });
        const scaleTo = gsap.quickTo(bgGrid, "scale", { duration: 2, ease: "power3.out" });

        const handleGridMove = (e: MouseEvent) => {
          const { left, top, width, height } = gridSection.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          xTo(x * 80);
          yTo(y * 80);
          rXTo(-y * 20);
          rYTo(x * 20);
          scaleTo(1.4 + Math.abs(x * y) * 0.2);
        };

        // Idle breathing animation
        const idleAnimation = gsap.to(bgGrid, {
          rotateX: 5,
          rotateY: 5,
          scale: 1.45,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: true,
        });

        const handleMouseEnter = () => idleAnimation.pause();
        const handleMouseLeave = () => {
          gsap.to(bgGrid, {
            x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1.4,
            duration: 1.5, ease: 'elastic.out(1, 0.5)',
            onComplete: () => idleAnimation.play()
          });
        };

        idleAnimation.play();
        gridSection.addEventListener('mousemove', handleGridMove);
        gridSection.addEventListener('mouseenter', handleMouseEnter);
        gridSection.addEventListener('mouseleave', handleMouseLeave);
      }

      // ========================================
      // 5. SERVICE CARDS STAGGERED 3D REVEAL
      // ========================================
      const cards = gsap.utils.toArray<HTMLElement>('.service-card');

      cards.forEach((card, idx) => {
        const direction = idx % 3; // 0: left, 1: bottom, 2: right
        const fromVars: gsap.TweenVars = {
          autoAlpha: 0,
          scale: 0.85,
          rotateY: direction === 0 ? -25 : direction === 2 ? 25 : 0,
          rotateX: direction === 1 ? 25 : 0,
          y: direction === 1 ? 100 : 60,
          x: direction === 0 ? -80 : direction === 2 ? 80 : 0,
          filter: 'blur(8px)',
        };

        gsap.fromTo(card, fromVars, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.5,
          },
          autoAlpha: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
        });

        // Card breathing/idle animation
        gsap.to(card, {
          y: `random(-8, 8)`,
          rotateZ: `random(-0.5, 0.5)`,
          duration: `random(4, 6)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: idx * 0.3,
        });
      });

      // ========================================
      // 6. FEATURE PILLS TYPEWRITER REVEAL
      // ========================================
      cards.forEach((card) => {
        const features = card.querySelectorAll('.feature-pill');
        gsap.fromTo(features,
          { autoAlpha: 0, x: -20, scale: 0.8 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
            },
            autoAlpha: 1,
            x: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          }
        );
      });

      // ========================================
      // 7. ENHANCED CARD HOVER INTERACTIONS
      // ========================================
      cardsRef.current.forEach((card, idx) => {
        if (!card || isMobile) return;

        const glow = card.querySelector('.card-glow') as HTMLElement;
        const icon = card.querySelector('.service-icon') as HTMLElement;
        const bgIcon = card.querySelector('.card-bg-icon') as HTMLElement;
        const glare = card.querySelector('.card-glare') as HTMLElement;
        const parallaxBg = card.querySelector('.card-parallax-bg') as HTMLElement;
        const borderGlow = card.querySelector('.card-border-glow') as HTMLElement;
        const title = card.querySelector('.service-title') as HTMLElement;

        const handleMove = (e: MouseEvent) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          gsap.to(card, {
            rotateY: x * 20,
            rotateX: -y * 20,
            scale: 1.05,
            z: 50,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1200,
            boxShadow: `0 50px 100px -20px rgba(59, 130, 246, 0.3), 
                        ${x * 20}px ${y * 20}px 60px -30px rgba(0, 0, 0, 0.4)`
          });

          if (glow) {
            gsap.to(glow, {
              x: (e.clientX - left) - (glow.offsetWidth / 2),
              y: (e.clientY - top) - (glow.offsetHeight / 2),
              opacity: 1,
              scale: 1.2,
              duration: 0.3
            });
          }

          if (glare) {
            gsap.to(glare, {
              x: -(x * 150),
              y: -(y * 150),
              opacity: 0.6,
              duration: 0.3
            });
          }

          if (icon) {
            gsap.to(icon, {
              x: x * 50,
              y: y * 50,
              z: 100,
              rotateZ: x * 12,
              scale: 1.15,
              duration: 0.5,
              ease: 'power2.out'
            });
          }

          if (parallaxBg) {
            gsap.to(parallaxBg, {
              x: -x * 60,
              y: -y * 60,
              scale: 1.3,
              opacity: 0.15,
              duration: 0.6,
              ease: 'power2.out'
            });
          }

          if (bgIcon) {
            gsap.to(bgIcon, {
              x: -x * 80,
              y: -y * 80,
              scale: 1.3,
              opacity: 0.1,
              rotateZ: x * 15,
              duration: 0.6,
              ease: 'power2.out'
            });
          }

          if (borderGlow) {
            gsap.to(borderGlow, {
              opacity: 1,
              duration: 0.3,
            });
          }

          if (title) {
            gsap.to(title, {
              x: x * 10,
              y: y * 10,
              duration: 0.4,
              ease: 'power2.out'
            });
          }

          setActiveCard(idx);
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            z: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.1)'
          });

          if (glow) gsap.to(glow, { opacity: 0, scale: 1, duration: 0.5 });
          if (glare) gsap.to(glare, { opacity: 0, duration: 0.5 });
          if (borderGlow) gsap.to(borderGlow, { opacity: 0, duration: 0.5 });

          if (icon) {
            gsap.to(icon, {
              x: 0, y: 0, z: 0, rotateZ: 0, scale: 1,
              duration: 1, ease: 'elastic.out(1, 0.5)'
            });
          }

          if (parallaxBg) {
            gsap.to(parallaxBg, {
              x: 0, y: 0, scale: 1.2, opacity: 0,
              duration: 1, ease: 'elastic.out(1, 0.5)'
            });
          }

          if (bgIcon) {
            gsap.to(bgIcon, {
              x: 0, y: 0, scale: 1, opacity: 0.03, rotateZ: 0,
              duration: 1, ease: 'elastic.out(1, 0.5)'
            });
          }

          if (title) {
            gsap.to(title, { x: 0, y: 0, duration: 0.6 });
          }

          setActiveCard(null);
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
      });

      // ========================================
      // 8. MOBILE FOCUS EFFECT
      // ========================================
      if (isMobile || isTablet) {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const borderGlow = card.querySelector('.card-border-glow') as HTMLElement;

          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
              onEnter: () => {
                gsap.to(card, {
                  scale: 1.02,
                  boxShadow: '0 25px 60px -15px rgba(59, 130, 246, 0.25)',
                  duration: 0.5,
                });
                if (borderGlow) gsap.to(borderGlow, { opacity: 0.5, duration: 0.5 });
              },
              onLeave: () => {
                gsap.to(card, {
                  scale: 1,
                  boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)',
                  duration: 0.5,
                });
                if (borderGlow) gsap.to(borderGlow, { opacity: 0, duration: 0.5 });
              },
              onEnterBack: () => {
                gsap.to(card, {
                  scale: 1.02,
                  boxShadow: '0 25px 60px -15px rgba(59, 130, 246, 0.25)',
                  duration: 0.5,
                });
                if (borderGlow) gsap.to(borderGlow, { opacity: 0.5, duration: 0.5 });
              },
              onLeaveBack: () => {
                gsap.to(card, {
                  scale: 1,
                  boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)',
                  duration: 0.5,
                });
                if (borderGlow) gsap.to(borderGlow, { opacity: 0, duration: 0.5 });
              },
            },
          });
        });
      }

      // ========================================
      // 9. CTA SECTION ANIMATIONS
      // ========================================
      const cta = ctaRef.current;
      if (cta) {
        // Entrance animation
        gsap.fromTo(cta,
          { autoAlpha: 0, y: 100, scale: 0.95 },
          {
            scrollTrigger: {
              trigger: cta,
              start: 'top 85%',
            },
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
          }
        );

        // Floating decorative orbs in CTA
        const ctaOrbs = cta.querySelectorAll('.cta-orb');
        ctaOrbs.forEach((orb, i) => {
          gsap.to(orb, {
            x: `random(-50, 50)`,
            y: `random(-30, 30)`,
            scale: `random(0.8, 1.4)`,
            duration: `random(6, 10)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5,
          });
        });

        // Magnetic button effect
        const button = cta.querySelector('.magnetic-button') as HTMLElement;
        if (button && !isMobile) {
          const xTo = gsap.quickTo(button, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
          const yTo = gsap.quickTo(button, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });

          button.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = button.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.3;
            const y = (e.clientY - top - height / 2) * 0.3;
            xTo(x);
            yTo(y);
          });

          button.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
          });
        }
      }

      // ========================================
      // 10. SCROLL PROGRESS COLOR SHIFT
      // ========================================
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const hue = 220 + self.progress * 40;
          document.documentElement.style.setProperty('--services-accent-hue', `${hue}`);
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={containerRef} className="services-page min-h-screen pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 bg-white dark:bg-brand-dark transition-colors duration-500 overflow-x-hidden relative">
      {HelmetElement}
      {/* Cursor Glow */}
      <CursorGlow glowRef={cursorGlowRef} />

      {/* Floating Orbs Background */}
      <div ref={orbsContainerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingOrbs.map((orb, i) => (
          <FloatingOrb key={i} {...orb} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER SECTION */}
        <header ref={headerRef} className="services-header mb-12 sm:mb-20 md:mb-32 max-w-5xl">
          <h2 className="services-subtitle text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] mb-4 sm:mb-6 md:mb-8">
            Capabilities
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[9.5rem] font-heading font-extrabold leading-[0.9] sm:leading-[0.8] tracking-tighter mb-6 sm:mb-8 md:mb-12 text-gray-900 dark:text-white overflow-hidden">
            <span className="services-title-word inline-block">ELITE</span>
            <br />
            <span className="services-title-word inline-block gradient-text-animated">SOLUTIONS.</span>
          </h1>
          <p className="services-description text-gray-500 dark:text-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl">
            We don't offer generic services. We provide the technical backbone for industry leaders who refuse to settle for the ordinary.
          </p>
        </header>

        {/* SERVICES GRID SECTION */}
        <section ref={gridSectionRef} className="relative py-12 sm:py-20 px-0 sm:px-6 overflow-hidden">
          {/* INTERACTIVE GRID BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none" style={{ perspective: '2000px' }}>
            <div
              ref={bgGridRef}
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.1]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                transformStyle: 'preserve-3d',
                scale: '1.4',
                willChange: 'transform',
              }}
            />
          </div>

          {/* SERVICES CARDS */}
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10">
            {services.map((service, idx) => (
              <div
                key={service.id}
                id={service.id}
                ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                className={`service-card group p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/50 dark:border-white/5 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] flex flex-col min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:h-[500px] relative overflow-hidden cursor-pointer backdrop-blur-xl shadow-lg ${activeCard === idx ? 'z-20' : 'z-10'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: isMobile ? 'auto' : 'transform, box-shadow',
                  contain: 'layout style paint',
                }}
              >
                {/* Animated Border Glow */}
                <div className="card-border-glow absolute inset-0 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] pointer-events-none opacity-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${service.accent.includes('violet') ? 'rgba(139, 92, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)'} 0%, transparent 50%)`,
                    padding: '2px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Background Parallax Image - Desktop only for performance */}
                {!isMobile && (
                  <div
                    className="card-parallax-bg absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-700 -z-10"
                    style={{
                      backgroundImage: `url(${service.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'scale(1.2)'
                    }}
                  />
                )}

                {/* Spotlight Glow - Desktop only */}
                {!isMobile && (
                  <div className="card-glow absolute pointer-events-none w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl opacity-0 transition-opacity duration-300 -z-10" />
                )}

                {/* Glass Glare Overlay - Desktop only */}
                {!isMobile && (
                  <div className="card-glare absolute inset-[-100%] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none opacity-0 rotate-[25deg] -z-10" />
                )}

                {/* Parallax Ghost Icon */}
                <div className="card-bg-icon absolute -top-6 sm:-top-10 -right-6 sm:-right-10 text-[5rem] sm:text-[10rem] md:text-[12rem] text-blue-600/[0.03] dark:text-white/[0.02] pointer-events-none select-none -z-20">
                  <i className={`fa-solid ${service.icon}`} />
                </div>

                {/* Icon with gradient background */}
                <div
                  className={`service-icon w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-gradient-to-br ${service.accent} rounded-xl sm:rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow shrink-0`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <i className={`fa-solid ${service.icon} text-base sm:text-xl md:text-2xl text-white drop-shadow-lg`} />
                </div>

                <h3 className="service-title text-base sm:text-xl md:text-2xl font-heading font-bold mb-2 sm:mb-3 md:mb-4 text-gray-900 dark:text-white transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 md:mb-8 flex-grow line-clamp-3 sm:line-clamp-none">
                  {service.description}
                </p>

                {/* Feature Pills */}
                <div className="space-y-1 sm:space-y-2 md:space-y-2.5">
                  {service.features.map(feature => (
                    <div key={feature} className="feature-pill flex items-center space-x-2 text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      <div className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${service.accent}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section ref={ctaRef} className="cta-section mt-16 sm:mt-24 md:mt-48 p-8 sm:p-12 md:p-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] text-center relative overflow-hidden group mb-16 sm:mb-24">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />

          {/* Floating CTA orbs */}
          <div className="cta-orb absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="cta-orb absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="cta-orb absolute top-1/2 left-1/4 w-40 h-40 bg-cyan-400/15 rounded-full blur-2xl" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4 sm:mb-6 md:mb-8 text-white">
              Let's Architect the Future.
            </h2>
            <p className="text-blue-100/90 mb-6 sm:mb-8 md:mb-12 text-base sm:text-lg md:text-xl font-light">
              Your ambition deserves the highest level of technical precision. Let's build something legacy-worthy.
            </p>
            <Link to="/contact">
              <button className="magnetic-button relative px-8 sm:px-10 md:px-16 py-3 sm:py-4 md:py-6 bg-white text-blue-600 rounded-full font-bold text-sm sm:text-base md:text-lg hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden group/btn">
                <span className="relative z-10">Schedule Strategy Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />

      {/* Custom Styles - Mobile Optimized */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --services-accent-hue: 220;
          }
          
          .gradient-text-animated {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientFlow 6s ease infinite;
          }
          
          @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .service-card {
            transition: transform 0.15s ease-out, box-shadow 0.3s ease;
          }
          
          .services-page {
            --accent-color: hsl(var(--services-accent-hue), 80%, 55%);
          }
          
          .floating-orb {
            animation: floatOrb 20s ease-in-out infinite;
          }
          
          @keyframes floatOrb {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -40px) scale(1.1); }
            50% { transform: translate(-20px, 30px) scale(0.95); }
            75% { transform: translate(40px, 20px) scale(1.05); }
          }
          
          .cursor-glow {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .services-page:hover .cursor-glow {
            opacity: 1;
          }
          
          /* Mobile-specific optimizations */
          @media (max-width: 767px) {
            .service-card {
              transition: transform 0.2s ease-out, box-shadow 0.2s ease;
            }
            
            .floating-orb {
              animation-duration: 30s;
            }
            
            .gradient-text-animated {
              animation-duration: 8s;
            }
          }
          
          /* Reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
            .floating-orb,
            .gradient-text-animated {
              animation: none;
            }
            
            .service-card {
              transition: none;
            }
          }
        `
      }} />
    </div>
  );
};

export default Services;
