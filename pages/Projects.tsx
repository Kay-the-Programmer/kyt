
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Sequence - Using .from() for safety
      const headerTl = gsap.timeline();
      headerTl.from('.project-header .letter-reveal', {
        y: '100%',
        opacity: 0,
        scale: 0.8,
        filter: 'blur(15px)',
        stagger: 0.015,
        duration: 1.5,
        ease: 'expo.out'
      })
      .from('.project-header-badge', { 
        y: 20, 
        opacity: 0, 
        duration: 1,
        ease: 'power4.out' 
      }, '-=1.2')
      .from('.project-header-desc', { 
        opacity: 0, 
        y: 30, 
        duration: 1.2,
        ease: 'power3.out' 
      }, '-=1.0');

      // 2. Showcase Entrance - Cinematic Clip Path
      const showcaseTl = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 85%',
        }
      });

      showcaseTl.from(cardRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.95,
        duration: 1.8,
        ease: 'expo.out'
      })
      .from('.showcase-image-wrapper', {
        clipPath: 'inset(100% 0% 0% 0%)',
        scale: 1.3,
        duration: 2,
        ease: 'expo.inOut'
      }, '-=1.4')
      .from('.reveal-item', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out'
      }, '-=1.2')
      .from(telemetryRef.current, {
        x: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
      }, '-=1.0');

      // 3. Interactive 3D Parallax (Desktop Only)
      if (cardRef.current && window.innerWidth > 1024) {
        const handleMove = (e: MouseEvent) => {
          const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          gsap.to(cardRef.current, {
            rotateY: x * 10,
            rotateX: -y * 10,
            transformPerspective: 2000,
            duration: 0.8,
            ease: 'power2.out'
          });

          gsap.to(imageRef.current, {
            x: x * 40,
            y: y * 40,
            scale: 1.1,
            duration: 1.2,
            ease: 'power2.out'
          });
          
          gsap.to(contentRef.current, {
            x: x * 20,
            y: y * 20,
            z: 50,
            duration: 1,
            ease: 'power2.out'
          });

          gsap.to(telemetryRef.current, {
            x: x * -15,
            y: y * -15,
            z: 80,
            duration: 1.2,
            ease: 'power2.out'
          });
        };

        const handleLeave = () => {
          gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 1.5, ease: 'elastic.out(1, 0.6)' });
          gsap.to([imageRef.current, contentRef.current, telemetryRef.current], { x: 0, y: 0, z: 0, scale: 1, duration: 1.5, ease: 'power4.out' });
        };

        cardRef.current.addEventListener('mousemove', handleMove);
        cardRef.current.addEventListener('mouseleave', handleLeave);
      }

      // 4. Background Node Animation
      gsap.to('.bg-node', {
        y: 'random(-40, 40)',
        x: 'random(-40, 40)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const project = {
    id: '01',
    title: 'SalePilot AI',
    category: 'FLAGSHIP // CORE RETAIL ENGINE',
    description: 'Transforming legacy retail environments into intelligent ecosystems. SalePilot synchronizes global inventory states with sub-millisecond precision.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
    tags: ['NEURAL CORE', 'LOW LATENCY', 'POSTGRES', 'K8S'],
    specs: [
      { label: 'ENGINE_STATUS', value: 'ACTIVE_OPTIMIZED', isBadge: true },
      { label: 'SYNC_RATE', value: '38ms' },
      { label: 'INTELLIGENCE', value: 'PREDICTIVE_V4' }
    ]
  };

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-48 pb-32 px-6 bg-white dark:bg-brand-dark transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] -z-10 overflow-hidden">
        <div className="bg-node absolute top-1/4 left-10 w-96 h-96 border border-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="bg-node absolute bottom-1/4 right-10 w-[40rem] h-[40rem] border border-purple-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="project-header mb-24 md:mb-40 max-w-5xl">
          <div className="project-header-badge inline-flex items-center space-x-3 px-6 py-2 bg-blue-600/5 dark:bg-blue-500/10 border border-blue-600/10 dark:border-blue-500/20 rounded-full mb-10">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">Featured Systems</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-heading font-black leading-[0.85] tracking-tighter mb-12 text-gray-900 dark:text-white">
            <SplitText text="SELECTED" className="block" />
            <span className="gradient-text"><SplitText text="WORK." /></span>
          </h1>
          <p className="project-header-desc text-xl md:text-3xl text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-4xl border-l-2 border-blue-600/20 pl-8">
            Architecting the future of intelligent systems. We specialize in software that isn't just used—it's relied upon for absolute stability.
          </p>
        </header>

        {/* Cinematic Card Showcase */}
        <section ref={showcaseRef} className="relative mb-64 group/card">
          <div 
            ref={cardRef}
            onClick={() => navigate('/projects/salepilot')}
            className="relative flex flex-col w-full h-[650px] md:h-[850px] lg:h-[950px] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[4rem] lg:rounded-[8rem] overflow-hidden transition-all duration-1000 cursor-pointer shadow-3xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Visual HUD Image Layer */}
            <div className="showcase-image-wrapper absolute inset-0 overflow-hidden">
               <img 
                  ref={imageRef}
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-1000" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent"></div>
               
               {/* Scanning HUD Effect */}
               <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-transparent -translate-y-full animate-[scan_6s_linear_infinite] pointer-events-none"></div>
            </div>
            
            {/* HUD Technical Overlays */}
            <div className="absolute top-12 right-12 md:top-20 md:right-20 pointer-events-none">
              <div className="text-[10px] font-mono text-blue-400 opacity-40 uppercase tracking-widest text-right">
                AUTH_ENCRYPTION: 256_AES<br/>
                LOCATION_SYNC: US_EAST_01<br/>
                CORE_TEMP: OPTIMAL
              </div>
            </div>

            {/* Content Layer */}
            <div ref={contentRef} className="relative h-full flex flex-col justify-end p-12 md:p-20 lg:p-24 text-white" style={{ transformStyle: 'preserve-3d' }}>
               <div className="reveal-item absolute top-12 left-12 md:top-20 md:left-20 text-[10rem] md:text-[20rem] font-black opacity-[0.04] font-heading tracking-tighter pointer-events-none select-none">
                  {project.id}
               </div>
               
               <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16">
                 <div className="max-w-3xl">
                    <span className="reveal-item text-[11px] font-bold text-blue-400 tracking-[0.6em] mb-6 block uppercase">System Portfolio v1.0.2</span>
                    <h3 className="reveal-item text-6xl md:text-9xl font-heading font-black mb-12 leading-none tracking-tighter">
                      {project.title}
                    </h3>
                    <p className="reveal-item text-gray-300 text-lg md:text-2xl mb-16 leading-relaxed font-light max-w-2xl">
                      {project.description}
                    </p>
                    
                    <div className="reveal-item flex flex-wrap gap-4 mb-16">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-8 py-2 bg-white/5 backdrop-blur-3xl rounded-full text-[10px] md:text-xs text-white border border-white/10 uppercase font-black tracking-[0.2em]">{tag}</span>
                      ))}
                    </div>

                    <div className="reveal-item flex items-center space-x-8 group/btn">
                        <div className="px-16 py-6 bg-blue-600 text-white rounded-full font-black text-xl shadow-2xl shadow-blue-600/40 group-hover/btn:bg-blue-700 group-hover/btn:scale-110 transition-all flex items-center space-x-6">
                          <span>SYSTEM OVERVIEW</span>
                          <i className="fa-solid fa-chevron-right text-xs"></i>
                        </div>
                    </div>
                 </div>

                 {/* Real-time Telemetry Overlay */}
                 <div ref={telemetryRef} className="hidden lg:grid grid-cols-1 gap-8 p-12 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 min-w-[340px] shadow-3xl">
                    <div className="flex items-center justify-between mb-2">
                       <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Link</div>
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                    {project.specs.map((spec, i) => (
                      <div key={i} className="spec-item border-b border-white/5 pb-6 last:border-0 last:pb-0">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{spec.label}</div>
                        <div className={`text-2xl font-heading font-black tracking-tight ${spec.isBadge ? 'text-blue-400' : 'text-white'}`}>
                          {spec.value}
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Architectural Footer */}
        <section className="reveal-item text-center py-24 md:py-48 flex flex-col items-center">
           <div className="w-px h-32 bg-gradient-to-b from-blue-600 to-transparent mb-16"></div>
           <h2 className="text-5xl md:text-8xl font-heading font-black mb-16 tracking-tighter text-gray-900 dark:text-white leading-[0.85]">
              Let's Architect <br /> <span className="gradient-text">Your Vision.</span>
           </h2>
           <button 
             onClick={() => navigate('/contact')}
             className="magnetic-area px-24 py-10 bg-blue-600 text-white rounded-full font-black text-2xl shadow-3xl shadow-blue-600/40 hover:scale-105 transition-all inline-block active:scale-95"
           >
              INITIATE DEPLOYMENT
           </button>
        </section>

      </div>
      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(500%); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Projects;
