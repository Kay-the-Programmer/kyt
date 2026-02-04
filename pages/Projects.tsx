
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';

gsap.registerPlugin(ScrollTrigger);

interface ProjectSpec {
  label: string;
  value: string;
  isBadge?: boolean;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  specs: ProjectSpec[];
  slug: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: '01',
    title: 'SalePilot POS',
    category: 'FLAGSHIP // CORE RETAIL MANAGEMENT',
    description: 'SalePilot synchronizes  inventory states and sales data with precision.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
    tags: ['RETAIL MANAGEMENT'],
    specs: [
      { label: 'STATUS', value: 'ACTIVE', isBadge: true },
      { label: 'WEB', value: 'https://salepilot.space' },
    ],
    slug: 'salepilot'
  },
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Glitch Sequence
      const headerTl = gsap.timeline();

      headerTl.from('.project-header .letter-reveal', {
        opacity: 0,
        x: () => (Math.random() - 0.5) * 50,
        y: () => (Math.random() - 0.5) * 30,
        filter: 'blur(10px)',
        stagger: {
          each: 0.02,
          from: "random"
        },
        duration: 0.8,
        ease: 'power4.inOut'
      })
        .to('.project-header .letter-reveal', {
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'back.out(2)'
        }, '-=0.2')
        .from('.project-header-badge', {
          x: -20,
          opacity: 0,
          duration: 1,
          ease: 'expo.out'
        }, '-=0.8')
        .from('.project-header-desc', {
          opacity: 0,
          x: 30,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.8');

      // 2. Project Card Sequences (Bidirectional)
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        const imageWrapper = card.querySelector('.showcase-image-wrapper');
        const img = card.querySelector('img');
        const content = card.querySelector('.content-layer');
        const revealItems = card.querySelectorAll('.reveal-item');
        const telemetry = card.querySelector('.telemetry-panel');
        const hudElements = card.querySelectorAll('.hud-element');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse'
          }
        });

        cardTl.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.98,
          duration: 1.2,
          ease: 'power3.out'
        })
          .from(imageWrapper, {
            clipPath: 'inset(100% 0% 0% 0%)',
            scale: 1.2,
            duration: 1.5,
            ease: 'expo.inOut'
          }, '-=1.0')
          .from(hudElements, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.7)'
          }, '-=1.0')
          .from(revealItems, {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: 'power4.out'
          }, '-=0.8')
          .from(telemetry, {
            x: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
          }, '-=0.8');

        if (window.innerWidth > 1024) {
          const handleMove = (e: MouseEvent) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(card, {
              rotateY: x * 12,
              rotateX: -y * 12,
              transformPerspective: 2000,
              duration: 1,
              ease: 'power3.out'
            });

            if (img) {
              gsap.to(img, {
                x: x * 50,
                y: y * 50,
                scale: 1.15,
                duration: 1.5,
                ease: 'power2.out'
              });
            }

            if (content) {
              gsap.to(content, {
                x: x * 30,
                y: y * 30,
                z: 60,
                duration: 1.2,
                ease: 'power2.out'
              });
            }

            if (telemetry) {
              gsap.to(telemetry, {
                x: x * -25,
                y: y * -25,
                z: 100,
                rotateY: x * -10,
                duration: 1.4,
                ease: 'power2.out'
              });
            }

            const sweep = card.querySelector('.light-sweep') as HTMLElement;
            if (sweep) {
              gsap.to(sweep, {
                left: `${(x + 0.5) * 100}%`,
                top: `${(y + 0.5) * 100}%`,
                opacity: 0.4,
                duration: 0.5
              });
            }
          };

          const handleLeave = () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 1.5, ease: 'elastic.out(1, 0.75)' });
            gsap.to([img, content, telemetry], { x: 0, y: 0, z: 0, rotateY: 0, scale: 1, duration: 1.5, ease: 'power4.out' });

            const sweep = card.querySelector('.light-sweep') as HTMLElement;
            if (sweep) gsap.to(sweep, { opacity: 0, duration: 0.8 });
          };

          card.addEventListener('mousemove', handleMove);
          card.addEventListener('mouseleave', handleLeave);
        }
      });

      gsap.to('.bg-node', {
        y: 'random(-60, 60)',
        x: 'random(-60, 60)',
        scale: 'random(0.8, 1.2)',
        duration: 'random(4, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-48 pb-32 px-6 bg-white dark:bg-[#020202] transition-colors duration-500 overflow-x-hidden relative text-gray-900 dark:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.25] -z-10 overflow-hidden">
        <div className="bg-node absolute top-[10%] left-[5%] w-[30rem] h-[30rem] border border-emerald-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="bg-node absolute bottom-[15%] right-[5%] w-[40rem] h-[40rem] border border-emerald-500/20 rounded-full blur-[160px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="project-header mb-24 md:mb-40 max-w-5xl">
          <div className="project-header-badge inline-flex items-center space-x-3 px-6 py-2 bg-emerald-600/10 dark:bg-emerald-500/10 border border-emerald-600/20 dark:border-emerald-500/30 rounded-full mb-10 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.7em] text-emerald-600 dark:text-emerald-400">Featured Core Systems</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-heading font-black leading-[0.85] tracking-tighter mb-12 text-gray-900 dark:text-white">
            <SplitText text="SELECTED" className="block" />
            <SplitText isGradient={true} text="WORK." />
          </h1>
          <p className="project-header-desc text-xl md:text-3xl text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-4xl border-l-4 border-emerald-500/30 pl-10">
            Architecting high-frequency intelligent systems. We specialize in software designed for absolute stability and sub-millisecond precision.
          </p>
        </header>

        <div className="space-y-32 md:space-y-64">
          {PROJECTS_DATA.map((project) => (
            <section key={project.id} className="relative group/card project-card">
              {/* HUD Decorative Corners */}
              <div className="hud-element absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-xl pointer-events-none z-10"></div>
              <div className="hud-element absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-500/40 rounded-tr-xl pointer-events-none z-10"></div>
              <div className="hud-element absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-500/40 rounded-bl-xl pointer-events-none z-10"></div>
              <div className="hud-element absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-500/40 rounded-br-xl pointer-events-none z-10"></div>

              <div
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="relative flex flex-col w-full h-[650px] md:h-[850px] lg:h-[950px] bg-gray-50 dark:bg-zinc-950/40 border border-gray-200 dark:border-white/5 rounded-[4rem] lg:rounded-[8rem] overflow-hidden transition-all duration-1000 cursor-pointer shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Light Sweep Follower */}
                <div className="light-sweep absolute w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-10"></div>
                <div className="showcase-image-wrapper absolute inset-0 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* Technical Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                  <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-transparent -translate-y-full animate-[scan_6s_linear_infinite] pointer-events-none"></div>
                </div>

                <div className="content-layer relative h-full flex flex-col justify-end p-12 md:p-20 lg:p-32 text-white z-20" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="reveal-item absolute top-12 left-12 md:top-20 md:left-32 text-[12rem] md:text-[24rem] font-black opacity-[0.05] font-heading tracking-tighter pointer-events-none select-none text-emerald-500">
                    {project.id}
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16">
                    <div className="max-w-3xl">
                      <h3 className="reveal-item text-7xl md:text-[10rem] font-heading font-black mb-14 leading-none tracking-tighter">
                        {project.title}
                      </h3>
                      <p className="reveal-item text-gray-400 text-xl md:text-3xl mb-16 leading-relaxed font-light max-w-3xl border-l-2 border-emerald-500/20 pl-8">
                        {project.description}
                      </p>

                      <div className="reveal-item flex flex-wrap gap-4 mb-16">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-10 py-3 bg-emerald-500/5 backdrop-blur-3xl rounded-full text-[10px] md:text-xs text-emerald-300 border border-emerald-500/10 uppercase font-black tracking-[0.3em] hover:bg-emerald-500/20 transition-colors">{tag}</span>
                        ))}
                      </div>

                      <div className="reveal-item flex items-center group/btn pointer-events-auto">
                        <div className="px-20 py-8 bg-emerald-600 text-white rounded-full font-black text-2xl shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] group-hover/btn:bg-emerald-500 group-hover/btn:scale-105 group-hover/btn:shadow-[0_25px_50px_-10px_rgba(5,150,105,0.6)] transition-all duration-500 flex items-center space-x-8">
                          <span className="tracking-widest">VIEW PROJECT</span>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                            <i className="fa-solid fa-arrow-right-long text-md text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="telemetry-panel hidden lg:grid grid-cols-1 gap-10 p-16 bg-black/60 backdrop-blur-[40px] rounded-[5rem] border border-emerald-500/10 min-w-[380px] shadow-3xl overflow-hidden relative" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                      
                      {project.specs.map((spec, i) => (
                        <div key={i} className="spec-item relative border-b border-emerald-500/5 pb-8 last:border-0 last:pb-0">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">{spec.label}</div>
                          <div className={`text-3xl font-heading font-black tracking-tight ${spec.isBadge ? 'text-emerald-400' : 'text-white'}`}>
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="reveal-item text-center py-24 md:py-48 flex flex-col items-center">
          <div className="w-px h-32 bg-gradient-to-b from-emerald-600 to-transparent mb-16"></div>
          <h2 className="text-5xl md:text-8xl font-heading font-black mb-16 tracking-tighter text-gray-900 dark:text-white leading-[0.85]">
            Let's Architect <br /> <span className="gradient-text">Your Vision.</span>
          </h2>
          <button
            onClick={() => navigate('/contact')}
            className="magnetic-area px-24 py-10 bg-emerald-600 text-white rounded-full font-black text-2xl shadow-3xl shadow-emerald-600/40 hover:scale-105 transition-all inline-block active:scale-95"
          >
            INITIATE DEPLOYMENT
          </button>
        </section>
      </div>
      <Footer />
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          filter: drop-shadow(0 0 20px rgba(16,185,129,0.3));
        }
      `}} />
    </div>
  );
};

export default Projects;
