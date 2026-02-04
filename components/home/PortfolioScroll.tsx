
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SplitText from '../SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const PortfolioScroll = React.forwardRef<HTMLDivElement>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const gridLayer1Ref = useRef<HTMLDivElement>(null);
  const gridLayer2Ref = useRef<HTMLDivElement>(null);
  const gridLayer3Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    // Force a refresh after a short delay to account for lazy-loaded layouts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);

    // Additional refresh on load complete
    const handleLoad = () => {
      ScrollTrigger.refresh(true);
    };
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    const grid1 = gridLayer1Ref.current;
    const grid2 = gridLayer2Ref.current;
    const grid3 = gridLayer3Ref.current;
    const glow = glowRef.current;
    const vignette = vignetteRef.current;
    const panel = panelRef.current;
    const container = innerRef.current;
    const horizontal = horizontalRef.current;
    const progressBar = progressBarRef.current;
    const cursorGlow = cursorGlowRef.current;

    if (!grid1 || !grid2 || !grid3 || !glow || !panel || !vignette || !container || !horizontal || !progressBar) return;

    // Set initial states before animations begin
    gsap.set('.horizontal-panel', {
      scale: 1,
      rotateY: 0,
      filter: 'brightness(1) blur(0px)',
      clearProps: 'skewX'
    });

    const ctx = gsap.context(() => {
      // 1. Horizontal Scroll with Enhanced Animations (Desktop Only)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel', container);
        const totalWidth = 100 * (panels.length - 1);

        // Advanced: Skew-on-scroll logic with reduced sensitivity
        const skewSetter = gsap.quickTo(panels, "skewX", { duration: 0.6, ease: "power2.out" });
        const scaleSetter = gsap.quickTo(panels, "scale", { duration: 0.6, ease: "power2.out" });

        // Main Horizontal Pinned Scroll - Smoother scrub value
        const horizontalTween = gsap.to(panels, {
          xPercent: -totalWidth,
          ease: "none",
          scrollTrigger: {
            id: 'main-horizontal-scroll',
            trigger: container,
            pin: true,
            scrub: 3, // Increased for smoother scrolling
            start: 'top top',
            end: () => `+=${window.innerHeight * 12}`,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            refreshPriority: 1, // Higher priority for main scroll
            onUpdate: (self) => {
              gsap.set(progressBar, { scaleX: self.progress, overwrite: true });

              // Calculate velocity-based skew with reduced intensity
              const velocity = self.getVelocity() / 400; // Reduced sensitivity
              const skew = gsap.utils.clamp(-10, 10, velocity); // Reduced max skew
              const scale = 1 - Math.abs(velocity) * 0.005; // Reduced scale effect

              skewSetter(skew);
              scaleSetter(Math.max(0.95, scale)); // Minimum scale limit

              // Dynamic background color shift based on scroll progress
              const hue = 220 + self.progress * 30;
              gsap.set(container, {
                '--scroll-hue': hue
              });
            },
            onToggle: (self) => {
              if (!self.isActive) {
                skewSetter(0);
                scaleSetter(1);
              }
            }
          }
        });

        // Enhanced panel animations with parallax and 3D effects
        panels.forEach((p, i) => {
          const isFirst = i === 0;
          const isLast = i === panels.length - 1;

          // Set first panel to active state immediately
          if (isFirst) {
            gsap.set(p, {
              scale: 1,
              rotateY: 0,
              filter: 'brightness(1) blur(0px)',
              immediateRender: true
            });
          }

          ScrollTrigger.create({
            trigger: p,
            containerAnimation: horizontalTween,
            start: isFirst ? 'left left' : 'left center',
            end: 'right center',
            refreshPriority: -1 - i, // Ensure proper order
            onToggle: (self) => {
              if (self.isActive) {
                setActivePanel(i);

                // Panel activation animation - Lens Zoom Effect
                gsap.to(p, {
                  scale: 1,
                  rotateY: 0,
                  filter: 'brightness(1) blur(0px)',
                  duration: 0.6,
                  ease: 'power2.out',
                  overwrite: 'auto'
                });
              } else {
                // Inactive panel dimming with perspective
                gsap.to(p, {
                  scale: 0.96,
                  rotateY: self.direction === 1 ? -3 : 3,
                  filter: 'brightness(0.85) blur(1.5px)',
                  duration: 0.6,
                  ease: 'power2.out',
                  overwrite: 'auto'
                });
              }
            }
          });

          // Staggered letter reveal with elastic bounce
          const letters = p.querySelectorAll('.letter-reveal');

          // First panel letters should be visible immediately
          if (isFirst) {
            gsap.set(letters, {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationX: 0,
              filter: 'blur(0px)'
            });
          } else {
            gsap.set(letters, {
              y: 80,
              opacity: 0,
              scale: 0.85,
              rotationX: -30,
              filter: 'blur(8px)'
            });
          }

          gsap.to(letters,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationX: 0,
              filter: 'blur(0px)',
              stagger: 0.02,
              duration: 1,
              ease: 'back.out(1.4)',
              immediateRender: false,
              overwrite: 'auto',
              scrollTrigger: {
                trigger: p,
                containerAnimation: horizontalTween,
                start: isFirst ? 'left left' : 'left 90%',
                toggleActions: isFirst ? 'none none none none' : 'play none none reverse'
              }
            }
          );

          // Content reveal with depth effect
          const content = p.querySelectorAll('.reveal-target');

          // First panel content should be visible immediately
          if (isFirst) {
            gsap.set(content, {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              transformPerspective: 1000
            });
          } else {
            gsap.set(content, {
              y: 40,
              opacity: 0,
              scale: 0.96,
              rotationY: 8,
              transformPerspective: 1000
            });
          }

          gsap.to(content,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              stagger: 0.1,
              ease: 'expo.out',
              immediateRender: false,
              overwrite: 'auto',
              scrollTrigger: {
                trigger: p,
                containerAnimation: horizontalTween,
                start: isFirst ? 'left left' : 'left 85%',
                toggleActions: isFirst ? 'none none none none' : 'play none none reverse'
              }
            }
          );

          // Parallax effect for images within panels
          const images = p.querySelectorAll('img');
          images.forEach((img) => {
            // First panel images should have minimal initial transform
            const initialScale = isFirst ? 1.1 : 1.25;
            const initialX = isFirst ? 30 : 80;
            
            gsap.fromTo(img,
              { scale: initialScale, x: initialX },
              {
                scale: 1,
                x: 0,
                ease: 'none',
                immediateRender: isFirst,
                scrollTrigger: {
                  trigger: p,
                  containerAnimation: horizontalTween,
                  start: isFirst ? 'left left' : 'left right',
                  end: 'right left',
                  scrub: 1.5 // Smoother parallax
                }
              }
            );
          });

          // Floating elements within panels
          const floatingElements = p.querySelectorAll('.floating-card, [class*="rounded-[4rem]"], [class*="rounded-[6rem]"]');
          
          // First panel floating elements visible immediately
          if (isFirst) {
            gsap.set(floatingElements, {
              y: 0,
              rotation: 0,
              opacity: 1
            });
          } else {
            gsap.set(floatingElements, {
              y: 50,
              rotation: -3,
              opacity: 0
            });
          }

          gsap.to(floatingElements,
            {
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 1.4,
              stagger: 0.08,
              ease: 'elastic.out(1, 0.6)',
              immediateRender: false,
              overwrite: 'auto',
              scrollTrigger: {
                trigger: p,
                containerAnimation: horizontalTween,
                start: isFirst ? 'left left' : 'left 80%',
                toggleActions: isFirst ? 'none none none none' : 'play none none reverse'
              }
            }
          );

          // Counter/stats animation
          const statValues = p.querySelectorAll('.text-4xl, .text-5xl');
          
          if (isFirst) {
            gsap.set(statValues, { scale: 1, opacity: 1, y: 0 });
          } else {
            gsap.set(statValues, { scale: 0.6, opacity: 0, y: 25 });
          }

          gsap.to(statValues,
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: 'elastic.out(1, 0.7)',
              immediateRender: false,
              overwrite: 'auto',
              scrollTrigger: {
                trigger: p,
                containerAnimation: horizontalTween,
                start: isFirst ? 'left left' : 'left 75%',
                toggleActions: isFirst ? 'none none none none' : 'play none none reverse'
              }
            }
          );
        });

        // Horizontal direction indicator animation
        const directionIndicator = document.querySelector('.scroll-direction-indicator');
        if (directionIndicator) {
          gsap.to(directionIndicator, {
            x: 20,
            opacity: 0.5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        }
      });

      // 2. Mobile Reveal Logic (Enhanced)
      mm.add("(max-width: 1023px)", () => {
        const targets = gsap.utils.toArray<HTMLElement>('.reveal-target');
        gsap.set(targets, { opacity: 0, y: 50, scale: 0.95 });

        ScrollTrigger.batch(targets, {
          start: 'top 88%',
          onEnter: (batch) => gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 1,
            ease: 'expo.out',
            overwrite: true
          }),
          onLeaveBack: (batch) => gsap.to(batch, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            stagger: 0.05,
            duration: 0.6,
            ease: 'power2.in'
          })
        });

        // Enhanced letter reveals for mobile
        const letters = gsap.utils.toArray<HTMLElement>('.letter-reveal');
        if (letters.length) {
          gsap.set(letters, { opacity: 0, y: 40, scale: 0.8, filter: 'blur(6px)' });
          ScrollTrigger.batch(letters, {
            start: 'top 90%',
            onEnter: (batch) => gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              stagger: 0.015,
              duration: 0.8,
              ease: 'back.out(1.4)',
              overwrite: true
            })
          });
        }

        // Mobile card hover/tap animations
        const cards = gsap.utils.toArray<HTMLElement>('.horizontal-panel');
        cards.forEach((card) => {
          card.addEventListener('touchstart', () => {
            gsap.to(card, { scale: 0.98, duration: 0.2 });
          });
          card.addEventListener('touchend', () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
          });
        });
      });

      // 3. Interactive Grid with 3D Depth Effect
      const rX1To = gsap.quickTo(grid1, "rotateX", { duration: 2, ease: "power3.out" });
      const rY1To = gsap.quickTo(grid1, "rotateY", { duration: 2, ease: "power3.out" });
      const rX2To = gsap.quickTo(grid2, "rotateX", { duration: 2.5, ease: "power3.out" });
      const rY2To = gsap.quickTo(grid2, "rotateY", { duration: 2.5, ease: "power3.out" });
      const rX3To = gsap.quickTo(grid3, "rotateX", { duration: 3, ease: "power3.out" });
      const rY3To = gsap.quickTo(grid3, "rotateY", { duration: 3, ease: "power3.out" });

      const x1To = gsap.quickTo(grid1, "x", { duration: 2.5, ease: "power3.out" });
      const y1To = gsap.quickTo(grid1, "y", { duration: 2.5, ease: "power3.out" });
      const x2To = gsap.quickTo(grid2, "x", { duration: 3, ease: "power3.out" });
      const y2To = gsap.quickTo(grid2, "y", { duration: 3, ease: "power3.out" });

      const glowXTo = gsap.quickTo(glow, "xPercent", { duration: 1.2, ease: "power4.out" });
      const glowYTo = gsap.quickTo(glow, "yPercent", { duration: 1.2, ease: "power4.out" });
      const glowScaleTo = gsap.quickTo(glow, "scale", { duration: 1.5, ease: "power2.out" });

      // Cursor glow follower
      const cursorXTo = cursorGlow ? gsap.quickTo(cursorGlow, "left", { duration: 0.3, ease: "power2.out" }) : null;
      const cursorYTo = cursorGlow ? gsap.quickTo(cursorGlow, "top", { duration: 0.3, ease: "power2.out" }) : null;

      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1024) return;
        const rect = panel.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        // Update cursor glow position
        if (cursorXTo && cursorYTo) {
          cursorXTo(e.clientX);
          cursorYTo(e.clientY);
        }

        if (relX >= -rect.width * 0.5 && relX <= rect.width * 1.5) {
          const xPct = (relX / rect.width) - 0.5;
          const yPct = (relY / rect.height) - 0.5;

          // Multi-layer parallax grid movement
          rY1To(xPct * 8); rX1To(-yPct * 8); x1To(xPct * 30); y1To(yPct * 30);
          rY2To(xPct * 5); rX2To(-yPct * 5); x2To(xPct * 20); y2To(yPct * 20);
          rY3To(xPct * 3); rX3To(-yPct * 3);

          // Dynamic glow following cursor
          glowXTo(xPct * 60);
          glowYTo(yPct * 60);
          glowScaleTo(1 + Math.abs(xPct) * 0.3);

          gsap.to([glow, vignette], { opacity: 0.7, duration: 1 });

          // Grid intensity based on cursor position
          const intensity = Math.sqrt(xPct * xPct + yPct * yPct);
          gsap.to(grid1, { opacity: 0.08 + intensity * 0.1, duration: 0.5 });
          gsap.to(grid2, { opacity: 0.04 + intensity * 0.06, duration: 0.5 });
          gsap.to(grid3, { opacity: 0.02 + intensity * 0.03, duration: 0.5 });
        } else {
          gsap.to([glow, vignette], { opacity: 0.15, duration: 1.5 });
          gsap.to([grid1, grid2, grid3], { opacity: 0.02, duration: 1 });
        }
      };

      // Ambient grid animation when idle
      let idleTimeout: NodeJS.Timeout;
      const startIdleAnimation = () => {
        gsap.to(grid1, {
          rotateX: 'random(-3, 3)',
          rotateY: 'random(-3, 3)',
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to(glow, {
          scale: 'random(0.9, 1.2)',
          xPercent: 'random(-20, 20)',
          yPercent: 'random(-20, 20)',
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      };

      const handleMouseEnter = () => {
        clearTimeout(idleTimeout);
        gsap.killTweensOf([grid1, glow]);
      };

      const handleMouseLeave = () => {
        // Reset grids
        gsap.to([grid1, grid2, grid3], {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        });
        gsap.to(glow, {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out'
        });

        idleTimeout = setTimeout(startIdleAnimation, 2000);
      };

      window.addEventListener('mousemove', handleMouseMove);
      panel.addEventListener('mouseenter', handleMouseEnter);
      panel.addEventListener('mouseleave', handleMouseLeave);

      // Start idle animation initially
      idleTimeout = setTimeout(startIdleAnimation, 3000);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        panel.removeEventListener('mouseenter', handleMouseEnter);
        panel.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(idleTimeout);
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={innerRef} className="portfolio-scroll-wrapper relative">
      {/* Cursor glow effect */}
      <div
        ref={cursorGlowRef}
        className="fixed w-[300px] h-[300px] pointer-events-none z-[60] hidden lg:block"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)'
        }}
      />



      {/* Scroll direction indicator */}
      <div className="scroll-direction-indicator fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] hidden lg:flex items-center space-x-2 text-gray-400">
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <i className="fa-solid fa-arrow-right text-blue-600" />
      </div>

      <section className="relative z-10 bg-gray-50 dark:bg-brand-dark transition-colors duration-500 overflow-hidden lg:overflow-visible">
        {/* Progress Bar (Global) */}
        <div ref={progressBarRef} className="fixed bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 origin-left scale-x-0 z-[80] hidden lg:block opacity-60 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

        <div ref={horizontalRef} className="flex flex-col lg:flex-row lg:w-[400vw] lg:h-screen">

          {/* Panel 1: SalePilot */}
          <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden shrink-0 z-[1] will-change-transform">
            <div className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="salepilot-title relative z-10">
                <div className="flex items-center space-x-3 mb-8 reveal-target">
                  <span className="w-10 h-[1.5px] bg-blue-600"></span>
                  <span className="text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase">Our Work</span>
                </div>
                <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-heading font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.85]">
                  <SplitText text="Sale" className="inline-block" />
                  <span className="text-blue-600 inline-block ml-3"><SplitText text="Pilot." /></span>
                </h2>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-200 mb-8 tracking-tight reveal-target">
                  Centralizing Retail Intelligence.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-12 reveal-target">
                  Moving beyond traditional POS by integrating automation and AI-driven insights into everyday operations. Scalable, usability-first, and resilient.
                </p>
                <div className="grid grid-cols-2 gap-8 mb-12 reveal-target">
                  {[{ label: 'Automation', val: 'Low Overhead' }, { label: 'Reliability', val: 'Offline Core' }].map((f, i) => (
                    <div key={i} className="border-l border-blue-600/20 pl-6 py-2 hover:border-blue-600 transition-colors duration-500">
                      <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">{f.label}</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{f.val}</div>
                    </div>
                  ))}
                </div>
                <div className="reveal-target">
                  <Link to="/projects/salepilot" className="magnetic-area inline-flex items-center space-x-6 group">
                    <div className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl shadow-blue-600/20 group-hover:bg-blue-700 group-hover:shadow-blue-600/40 transition-all duration-500 group-hover:scale-105">Explore Case Study</div>
                    <div className="w-14 h-14 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600/5 transition-all duration-500">
                      <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform duration-500 dark:text-white"></i>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="relative reveal-target" style={{ perspective: '2000px' }}>
                <div className="relative z-10 aspect-[4/3] bg-white dark:bg-gray-900 rounded-[3.5rem] lg:rounded-[5.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl p-5 hover:shadow-blue-600/10 transition-shadow duration-700">
                  <div className="w-full h-full overflow-hidden rounded-[2.5rem] lg:rounded-[4.5rem] bg-gray-50 dark:bg-gray-800 relative">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 hover:grayscale-0 hover:scale-105" alt="SalePilot Hub" />
                  </div>
                </div>
                <div className="floating-card absolute -bottom-10 -right-4 lg:-bottom-16 lg:-right-16 w-52 h-52 lg:w-72 lg:h-72 bg-gray-900 dark:bg-white rounded-[4rem] lg:rounded-[6rem] flex flex-col items-center justify-center p-8 lg:p-12 shadow-3xl z-20 group hover:-rotate-6 hover:scale-105 transition-all duration-700">
                  <i className="fa-solid fa-brain text-blue-500 text-4xl lg:text-5xl mb-6 group-hover:scale-110 transition-transform"></i>
                  <span className="text-[9px] lg:text-xs font-black uppercase tracking-[0.4em] text-center text-white dark:text-gray-900 leading-relaxed">Cognitive <br />Insights Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Stats Grid */}
          <div ref={panelRef} className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white dark:bg-gray-950 overflow-visible lg:overflow-hidden relative shrink-0 z-[2] will-change-transform">
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '3000px' }}>
              <div ref={gridLayer3Ref} className="absolute inset-[-20%] opacity-[0.01] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#2563eb 2px, transparent 2px), linear-gradient(90deg, #2563eb 2px, transparent 2px)', backgroundSize: '240px 240px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
              <div ref={gridLayer2Ref} className="absolute inset-[-15%] opacity-[0.02] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '120px 120px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
              <div ref={gridLayer1Ref} className="absolute inset-[-10%] opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#2563eb 0.5px, transparent 0.5px), linear-gradient(90deg, #2563eb 0.5px, transparent 0.5px)', backgroundSize: '60px 60px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
              <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(147,51,234,0.1) 30%, transparent 70%)', transition: 'all 0.3s' }}></div>
              <div ref={vignetteRef} className="absolute inset-[-10%] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(3,7,18,0.5) 100%)' }}></div>
            </div>
            <div className="max-w-7xl w-full text-center relative z-10 stats-container">
              <div className="flex flex-col items-center justify-center mb-16 md:mb-24">
                <div className="w-14 h-px bg-blue-600 mb-8"></div>
                <h2 className="text-5xl md:text-7xl lg:text-[8.5rem] font-heading font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                  <SplitText text="Architecting" className="inline-block" /> <br />
                  <span className="text-blue-600 inline-block"><SplitText text="Absolute Trust." /></span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-8">
                {[
                  { label: 'Security', value: 'Zero-Trust', icon: 'fa-fingerprint', desc: 'Enterprise-grade encryption for every single transaction.' },
                  { label: 'Latency', value: '0.04s', icon: 'fa-gauge-high', desc: 'Edge-optimized processing for high-frequency retail environments.' },
                  { label: 'Integration', value: 'Omni-Sync', icon: 'fa-network-wired', desc: 'Fluid data exchange across hardware, cloud, and local hubs.' }
                ].map((stat, i) => (
                  <div key={i} className="reveal-target group relative p-10 md:p-14 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-[4rem] transition-all duration-700 hover:bg-white dark:hover:bg-white/[0.03] hover:shadow-3xl hover:shadow-blue-600/5 z-20 active:scale-95 touch-none hover:-translate-y-2">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-10 mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-600/20">
                      <i className={`fa-solid ${stat.icon} text-3xl`}></i>
                    </div>
                    <div className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter font-heading">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">{stat.label}</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 3: Visionary */}
          <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 relative overflow-hidden shrink-0 z-[3] will-change-transform">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-[45vw] font-black text-blue-600/[0.02] dark:text-white/[0.01] tracking-tighter leading-none pointer-events-none uppercase animate-pulse">Kytriq</span>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl">
              <div className="text-left">
                <h2 className="text-7xl md:text-9xl font-heading font-black text-gray-900 dark:text-white mb-12 tracking-tighter leading-[0.85]">
                  <SplitText text="Visionary" className="block" />
                  <span className="gradient-text"><SplitText text="Engineering." /></span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 max-w-lg reveal-target">
                  We don't just build applications. We architect digital organisms that adapt, learn, and grow alongside your evolving business mission.
                </p>
              </div>
              <div className="relative hidden lg:block reveal-target">
                <div className="w-[550px] h-[550px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[5rem] rotate-6 relative overflow-hidden group shadow-2xl hover:rotate-3 hover:scale-105 transition-all duration-700 shadow-blue-600/20">
                  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 -rotate-6" alt="The Workshop" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: Impact/CTA */}
          <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 bg-gray-950 relative overflow-hidden shrink-0 z-[4] shadow-[-50px_0_100px_rgba(0,0,0,0.5)] will-change-transform">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-blue-600/10 rounded-full blur-[180px] animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="relative z-10 text-center text-white max-w-5xl px-6">
              <h2 className="text-6xl md:text-8xl lg:text-[11rem] font-heading font-bold mb-16 tracking-tighter leading-[0.85]">
                <SplitText text="Let's Build" className="block" />
                <SplitText text="Your Idea" isGradient={true} className="block" />
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-14 reveal-target">
                <Link to="/contact" className="magnetic-area group px-16 py-8 bg-blue-600 text-white rounded-full font-black text-2xl hover:bg-blue-700 transition-all duration-500 shadow-3xl shadow-blue-600/30 active:scale-95 hover:scale-105 hover:shadow-blue-600/50">Contact us</Link>
                <Link to="/services" className="text-lg font-bold tracking-widest uppercase border-b-2 border-white/20 hover:border-blue-600 pb-2 transition-all group">View Services <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-3 transition-transform duration-500"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .reveal-target {
          will-change: transform, opacity;
        }
        .portfolio-scroll-wrapper {
          overflow-x: hidden;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 8s ease infinite;
        }
      `}} />
    </div>
  );
});

PortfolioScroll.displayName = 'PortfolioScroll';

export default PortfolioScroll;
