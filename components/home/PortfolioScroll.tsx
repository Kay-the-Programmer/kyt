
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
  
  const [activePanel, setActivePanel] = useState(0);

  const scrollToPanel = (index: number) => {
    const st = ScrollTrigger.getById('main-horizontal-scroll');
    if (!st) return;

    const start = st.start;
    const end = st.end;
    const totalPanels = 4;
    // Calculate precise target based on panel index
    const targetScroll = start + (index / (totalPanels - 1)) * (end - start);

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 1.8,
      ease: 'expo.inOut',
      overwrite: 'auto'
    });
  };

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
    
    if (!grid1 || !grid2 || !grid3 || !glow || !panel || !vignette || !container || !horizontal || !progressBar) return;

    const ctx = gsap.context(() => {
      // 1. Horizontal Scroll Logic (Desktop Only)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel', container);
        const totalWidth = 100 * (panels.length - 1);

        // Main Horizontal Pinned Scroll
        const horizontalTween = gsap.to(panels, {
          xPercent: -totalWidth,
          ease: "none",
          scrollTrigger: {
            id: 'main-horizontal-scroll',
            trigger: container,
            pin: true,
            scrub: 1.5, // Refined scrub for premium "weighted" feel
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.8 },
              delay: 0.1,
              ease: "power2.inOut"
            },
            start: 'top top',
            end: () => `+=${window.innerHeight * (panels.length)}`, // Precise scroll distance
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(progressBar, { scaleX: self.progress });
            }
          }
        });

        // Sync panel active states and content reveals
        panels.forEach((p, i) => {
          ScrollTrigger.create({
            trigger: p,
            containerAnimation: horizontalTween,
            start: 'left center',
            end: 'right center',
            onToggle: (self) => {
              if (self.isActive) setActivePanel(i);
            }
          });

          // Enhanced Content Reveal
          const letters = p.querySelectorAll('.letter-reveal');
          const content = p.querySelectorAll('.reveal-target');
          
          gsap.to(letters, {
            y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
            stagger: 0.015, duration: 1, ease: 'expo.out',
            scrollTrigger: {
              trigger: p,
              containerAnimation: horizontalTween,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });

          gsap.fromTo(content, 
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1, duration: 1.4, stagger: 0.1, ease: 'power4.out',
              scrollTrigger: {
                trigger: p,
                containerAnimation: horizontalTween,
                start: 'left 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      });

      // 2. Mobile Reveal Logic
      mm.add("(max-width: 1023px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel', container);
        panels.forEach((p) => {
          gsap.to(p.querySelectorAll('.letter-reveal'), {
            scrollTrigger: { trigger: p, start: 'top 85%' },
            y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
            stagger: 0.02, duration: 0.8, ease: 'power3.out'
          });
          gsap.from(p.querySelectorAll('.reveal-target'), {
            scrollTrigger: { trigger: p, start: 'top 85%' },
            y: 30, opacity: 0, duration: 1, stagger: 0.05, ease: 'power2.out'
          });
        });
      });

      // 3. Interactive Grid Mouse Logic (Ultra-Subtle)
      const rX1To = gsap.quickTo(grid1, "rotateX", { duration: 2.5, ease: "power3.out" });
      const rY1To = gsap.quickTo(grid1, "rotateY", { duration: 2.5, ease: "power3.out" });
      const x1To = gsap.quickTo(grid1, "x", { duration: 2.8, ease: "power3.out" });
      const y1To = gsap.quickTo(grid1, "y", { duration: 2.8, ease: "power3.out" });
      
      const glowXTo = gsap.quickTo(glow, "xPercent", { duration: 1.5, ease: "power4.out" });
      const glowYTo = gsap.quickTo(glow, "yPercent", { duration: 1.5, ease: "power4.out" });

      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1024) return;
        const rect = panel.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        if (relX >= -rect.width * 0.5 && relX <= rect.width * 1.5) {
          const xPct = (relX / rect.width) - 0.5;
          const yPct = (relY / rect.height) - 0.5;
          rY1To(xPct * 3); rX1To(-yPct * 3); x1To(xPct * 15); y1To(yPct * 15);
          glowXTo(xPct * 40); glowYTo(yPct * 40);
          gsap.to([glow, vignette], { opacity: 0.6, duration: 1.5 });
        } else {
          gsap.to([glow, vignette], { opacity: 0.1, duration: 2 });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={innerRef} className="portfolio-scroll-wrapper relative">
      {/* Premium Pagination Dots */}
      <div className="fixed right-8 md:right-12 top-1/2 -translate-y-1/2 z-[70] hidden lg:flex flex-col space-y-8">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => scrollToPanel(idx)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to section ${idx + 1}`}
          >
            <span className={`absolute right-8 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-500 whitespace-nowrap pointer-events-none ${
              activePanel === idx ? 'opacity-100 translate-x-0 text-blue-600' : 'opacity-0 translate-x-4 text-gray-400'
            }`}>
              {['SalePilot Hub', 'System Mastery', 'Vision Logic', 'Absolute Impact'][idx]}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 border ${
              activePanel === idx 
              ? 'bg-blue-600 border-blue-600 scale-150 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
              : 'bg-transparent border-gray-300 dark:border-gray-700 group-hover:border-blue-400 group-hover:scale-125'
            }`}></div>
          </button>
        ))}
      </div>

      <section className="relative z-10 bg-gray-50 dark:bg-brand-dark transition-colors duration-500 overflow-hidden lg:overflow-visible">
        {/* Progress Bar (Global) */}
        <div ref={progressBarRef} className="fixed bottom-0 left-0 h-1 w-full bg-blue-600 origin-left scale-x-0 z-[80] hidden lg:block opacity-40"></div>
        
        <div ref={horizontalRef} className="flex flex-col lg:flex-row lg:w-[400vw] lg:h-screen">
          
          {/* Panel 1: SalePilot */}
          <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden shrink-0 z-[1] will-change-transform">
            <div className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="salepilot-title relative z-10">
                <div className="flex items-center space-x-3 mb-8 reveal-target">
                  <span className="w-10 h-[1.5px] bg-blue-600"></span>
                  <span className="text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase">Intelligent Commerce</span>
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
                    <div key={i} className="border-l border-blue-600/20 pl-6 py-2">
                      <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">{f.label}</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{f.val}</div>
                    </div>
                  ))}
                </div>
                <div className="reveal-target">
                  <Link to="/projects/salepilot" className="magnetic-area inline-flex items-center space-x-6 group">
                     <div className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl shadow-blue-600/20 group-hover:bg-blue-700 transition-all">Explore Case Study</div>
                     <div className="w-14 h-14 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-600 transition-all">
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform dark:text-white"></i>
                     </div>
                  </Link>
                </div>
              </div>
              <div className="relative reveal-target" style={{ perspective: '2000px' }}>
                <div className="relative z-10 aspect-[4/3] bg-white dark:bg-gray-900 rounded-[3.5rem] lg:rounded-[5.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl p-5">
                  <div className="w-full h-full overflow-hidden rounded-[2.5rem] lg:rounded-[4.5rem] bg-gray-50 dark:bg-gray-800 relative">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0" alt="SalePilot Hub" />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-4 lg:-bottom-16 lg:-right-16 w-52 h-52 lg:w-72 lg:h-72 bg-gray-900 dark:bg-white rounded-[4rem] lg:rounded-[6rem] flex flex-col items-center justify-center p-8 lg:p-12 shadow-3xl z-20 group hover:-rotate-6 transition-transform duration-700">
                   <i className="fa-solid fa-brain text-blue-500 text-4xl lg:text-5xl mb-6"></i>
                   <span className="text-[9px] lg:text-xs font-black uppercase tracking-[0.4em] text-center text-white dark:text-gray-900 leading-relaxed">Cognitive <br/> Insights Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Stats Grid */}
          <div ref={panelRef} className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white dark:bg-gray-950 overflow-visible lg:overflow-hidden relative shrink-0 z-[2] will-change-transform">
             <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '3000px' }}>
                <div ref={gridLayer3Ref} className="absolute inset-[-20%] opacity-[0.01] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#2563eb 2px, transparent 2px), linear-gradient(90deg, #2563eb 2px, transparent 2px)', backgroundSize: '240px 240px', transformStyle: 'preserve-3d' }}></div>
                <div ref={gridLayer2Ref} className="absolute inset-[-15%] opacity-[0.02] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '120px 120px', transformStyle: 'preserve-3d' }}></div>
                <div ref={gridLayer1Ref} className="absolute inset-[-10%] opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#2563eb 0.5px, transparent 0.5px), linear-gradient(90deg, #2563eb 0.5px, transparent 0.5px)', backgroundSize: '60px 60px', transformStyle: 'preserve-3d' }}></div>
                <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }}></div>
                <div ref={vignetteRef} className="absolute inset-[-10%] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(3,7,18,0.5) 100%)' }}></div>
             </div>
             <div className="max-w-7xl w-full text-center relative z-10 stats-container">
                <div className="flex flex-col items-center justify-center mb-16 md:mb-24">
                  <div className="w-14 h-px bg-blue-600 mb-8"></div>
                  <h2 className="text-5xl md:text-7xl lg:text-[8.5rem] font-heading font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                    <SplitText text="Architecting" className="inline-block" /> <br/> 
                    <span className="text-blue-600 inline-block"><SplitText text="Absolute Trust." /></span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-8" style={{ transformStyle: 'preserve-3d' }}>
                   {[
                     { label: 'Security', value: 'Zero-Trust', icon: 'fa-fingerprint', desc: 'Enterprise-grade encryption for every single transaction.' },
                     { label: 'Latency', value: '0.04s', icon: 'fa-gauge-high', desc: 'Edge-optimized processing for high-frequency retail environments.' },
                     { label: 'Integration', value: 'Omni-Sync', icon: 'fa-network-wired', desc: 'Fluid data exchange across hardware, cloud, and local hubs.' }
                   ].map((stat, i) => (
                     <div key={i} className="reveal-target group relative p-10 md:p-14 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-[4rem] transition-all duration-700 hover:bg-white dark:hover:bg-white/[0.03] hover:shadow-3xl z-20 active:scale-95 touch-none">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-10 mx-auto group-hover:rotate-6 transition-transform">
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
                <span className="text-[45vw] font-black text-blue-600/[0.02] dark:text-white/[0.01] tracking-tighter leading-none pointer-events-none uppercase">Kytriq</span>
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
                   <div className="w-[550px] h-[550px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[5rem] rotate-6 relative overflow-hidden group shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 -rotate-6" alt="The Workshop" />
                   </div>
                </div>
             </div>
          </div>

          {/* Panel 4: Impact/CTA */}
          <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 bg-gray-950 relative overflow-hidden shrink-0 z-[4] shadow-[-50px_0_100px_rgba(0,0,0,0.5)] will-change-transform">
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-blue-600/10 rounded-full blur-[180px]"></div>
             </div>
             <div className="relative z-10 text-center text-white max-w-5xl px-6">
                <h2 className="text-6xl md:text-8xl lg:text-[11rem] font-heading font-bold mb-16 tracking-tighter leading-[0.85]">
                  <SplitText text="Let's Build" className="block" />
                  <span className="gradient-text"><SplitText text="Impact." /></span>
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-14 reveal-target">
                  <Link to="/contact" className="magnetic-area group px-16 py-8 bg-blue-600 text-white rounded-full font-black text-2xl hover:bg-blue-700 transition-all shadow-3xl shadow-blue-600/20 active:scale-95">Contact us</Link>
                  <Link to="/services" className="text-lg font-bold tracking-widest uppercase border-b-2 border-white/20 hover:border-blue-600 pb-2 transition-all group">View Services <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i></Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .reveal-target {
          will-change: transform, opacity;
        }
        .portfolio-scroll-wrapper {
          overflow-x: hidden;
        }
      `}} />
    </div>
  );
});

PortfolioScroll.displayName = 'PortfolioScroll';

export default PortfolioScroll;
