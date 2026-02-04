
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioScroll from '../components/home/PortfolioScroll';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const gridSectionRef = useRef<HTMLElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Header entrance
      gsap.from('.services-header > *', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });

      // Service cards reveal
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 90%',
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Mobile Viewport "Focus" Effect (Replaces hover)
      if (isMobile) {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
            },
            scale: 1.02,
            borderColor: 'rgba(37, 99, 235, 0.4)',
            backgroundColor: 'rgba(249, 250, 251, 1)',
            duration: 0.5,
          });
        });
      }

      // Interactive Grid Background depth effect (Desktop only)
      const bgGrid = bgGridRef.current;
      const gridSection = gridSectionRef.current;
      if (bgGrid && gridSection && !isMobile) {
        const xTo = gsap.quickTo(bgGrid, "x", { duration: 1.5, ease: "power2.out" });
        const yTo = gsap.quickTo(bgGrid, "y", { duration: 1.5, ease: "power2.out" });
        const rXTo = gsap.quickTo(bgGrid, "rotateX", { duration: 1, ease: "power3.out" });
        const rYTo = gsap.quickTo(bgGrid, "rotateY", { duration: 1, ease: "power3.out" });

        const handleGridMove = (e: MouseEvent) => {
          const { left, top, width, height } = gridSection.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          xTo(x * 60);
          yTo(y * 60);
          rXTo(-y * 15);
          rYTo(x * 15);
        };

        window.addEventListener('mousemove', handleGridMove);
      }

      // Enhanced Interactive 3D Tilt for cards (Mouse only)
      cardsRef.current.forEach((card) => {
        if (!card || isMobile) return;
        
        const glow = card.querySelector('.card-glow') as HTMLElement;
        const icon = card.querySelector('.service-icon') as HTMLElement;
        const bgIcon = card.querySelector('.card-bg-icon') as HTMLElement;
        const glare = card.querySelector('.card-glare') as HTMLElement;
        const parallaxBg = card.querySelector('.card-parallax-bg') as HTMLElement;

        const handleMove = (e: MouseEvent) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          gsap.to(card, {
            rotateY: x * 15,
            rotateX: -y * 15,
            scale: 1.04,
            duration: 0.6,
            ease: 'power2.out',
            transformPerspective: 1200,
            boxShadow: '0 45px 100px -20px rgba(0, 0, 0, 0.45)'
          });
          
          if (glow) {
            gsap.to(glow, {
              x: (e.clientX - left) - (glow.offsetWidth / 2),
              y: (e.clientY - top) - (glow.offsetHeight / 2),
              opacity: 1,
              duration: 0.4
            });
          }

          if (glare) {
            gsap.to(glare, {
              x: -(x * 100),
              y: -(y * 100),
              opacity: 0.4,
              duration: 0.4
            });
          }

          gsap.to(icon, {
            x: x * 45,
            y: y * 45,
            z: 80,
            rotateZ: x * 8,
            duration: 0.6,
            ease: 'power2.out'
          });

          if (parallaxBg) {
            gsap.to(parallaxBg, {
              x: -x * 50,
              y: -y * 50,
              duration: 0.8,
              ease: 'power2.out'
            });
          }

          if (bgIcon) {
            gsap.to(bgIcon, {
              x: -x * 60,
              y: -y * 60,
              scale: 1.15,
              opacity: 0.08,
              duration: 0.7,
              ease: 'power2.out'
            });
          }
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)',
            boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)'
          });
          
          gsap.to(glow, { opacity: 0, duration: 0.6 });
          gsap.to(glare, { opacity: 0, duration: 0.6 });

          gsap.to(icon, {
            x: 0,
            y: 0,
            z: 0,
            rotateZ: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)'
          });

          if (parallaxBg) {
            gsap.to(parallaxBg, {
              x: 0,
              y: 0,
              duration: 1.2,
              ease: 'elastic.out(1, 0.6)'
            });
          }

          if (bgIcon) {
            gsap.to(bgIcon, {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 0.03,
              duration: 1.2,
              ease: 'elastic.out(1, 0.6)'
            });
          }
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      id: 'ai-engineering',
      icon: 'fa-brain',
      title: 'AI Engineering',
      description: 'Implementing custom machine learning models and neural agents that integrate directly into your workflow.',
      features: ['Predictive Logic', 'LLM Fine-tuning', 'Computer Vision'],
      bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9457?auto=format&fit=crop&q=60&w=800'
    },
    {
      id: 'scalable-systems',
      icon: 'fa-code-branch',
      title: 'Scalable Systems',
      description: 'Architecting distributed backends capable of handling millions of concurrent requests with zero downtime.',
      features: ['Microservices', 'Event-Driven Architecture', 'Cloud-Native'],
      bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=60&w=800'
    },
    {
      id: 'unified-ecosystems',
      icon: 'fa-layer-group',
      title: 'Unified Ecosystems',
      description: 'Bridging the gap between legacy hardware and modern software through robust, high-speed API layers.',
      features: ['Hardware Integrations', 'Real-time Sync', 'Legacy Migration'],
      bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=800'
    },
    {
      id: 'strategic-design',
      icon: 'fa-compass-drafting',
      title: 'Strategic Design',
      description: 'Minimalistic, high-end UI/UX that prioritizes user intuition and brand trustworthiness.',
      features: ['Prototyping', 'Design Systems', 'Behavioral UX'],
      bgImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=60&w=800'
    },
    {
      id: 'native-performance',
      icon: 'fa-terminal',
      title: 'Native Performance',
      description: 'Building ultra-fast desktop and mobile experiences that utilize the full potential of local hardware.',
      features: ['Multi-platform', 'Low Latency', 'Offline-First'],
      bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=60&w=800'
    },
    {
      id: 'security-core',
      icon: 'fa-shield-halved',
      title: 'Security Core',
      description: 'Fortifying your digital assets with cutting-edge encryption and biometric authentication protocols.',
      features: ['Zero Trust', 'End-to-End Encryption', 'Audit Ready'],
      bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=60&w=800'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="services-header mb-12 sm:mb-20 md:mb-32 max-w-4xl">
          <h2 className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-4 sm:mb-6 md:mb-8">Capabilities</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[9.5rem] font-heading font-extrabold leading-[0.9] sm:leading-[0.8] tracking-tighter mb-6 sm:mb-8 md:mb-12 text-gray-900 dark:text-white">
            ELITE <br /> <span className="gradient-text">SOLUTIONS.</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl">
            We don't offer generic services. We provide the technical backbone for industry leaders who refuse to settle for the ordinary.
          </p>
        </header>

        <section ref={gridSectionRef} className="relative py-12 sm:py-20 px-0 sm:px-6 overflow-hidden">
          {/* INTERACTIVE GRID BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none" style={{ perspective: '1500px' }}>
            <div 
              ref={bgGridRef}
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" 
              style={{ 
                backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', 
                backgroundSize: '80px 80px',
                transformStyle: 'preserve-3d',
                scale: '1.4'
              }}
            ></div>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                id={service.id}
                ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                className="service-card group p-6 sm:p-8 md:p-10 lg:p-12 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/5 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-500 flex flex-col min-h-[320px] sm:min-h-[420px] md:h-[500px] relative overflow-hidden cursor-pointer backdrop-blur-sm shadow-sm"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Parallax Image */}
                <div 
                  className="card-parallax-bg absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12] transition-opacity duration-700 -z-10"
                  style={{ 
                    backgroundImage: `url(${service.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1.2)' 
                  }}
                ></div>

                {/* Spotlight Glow */}
                <div className="card-glow absolute pointer-events-none w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-0 transition-opacity duration-300 -z-10"></div>
                
                {/* Glass Glare Overlay */}
                <div className="card-glare absolute inset-[-50%] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-0 rotate-[25deg] -z-10"></div>

                {/* Parallax Ghost Icon */}
                <div className="card-bg-icon absolute -top-10 -right-10 text-[8rem] sm:text-[12rem] text-blue-600/[0.03] dark:text-white/[0.02] pointer-events-none select-none transition-transform duration-500 -z-20">
                   <i className={`fa-solid ${service.icon}`}></i>
                </div>

                <div className="service-icon w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-600 rounded-[1.2rem] sm:rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 md:mb-10 shadow-xl shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all shrink-0" style={{ transformStyle: 'preserve-3d' }}>
                  <i className={`fa-solid ${service.icon} text-xl sm:text-2xl md:text-3xl text-white`}></i>
                </div>
                
                <h3 className="service-title text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-3 sm:mb-4 md:mb-6 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 md:mb-10 flex-grow">
                  {service.description}
                </p>
                
                <div className="space-y-2 sm:space-y-3">
                  {service.features.map(feature => (
                    <div key={feature} className="flex items-center space-x-3 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-blue-600"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Interactive Portfolio Scroller */}
        <div className="mt-20 sm:mt-32 md:mt-48 mb-16 sm:mb-24">
          <div className="flex items-center space-x-4 mb-8 sm:mb-12">
            <div className="h-px w-8 sm:w-12 bg-blue-600"></div>
            <h2 className="text-[9px] sm:text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.7em]">Featured Ecosystem</h2>
          </div>
          <PortfolioScroll />
        </div>

        <section className="mt-16 sm:mt-24 md:mt-48 p-8 sm:p-12 md:p-20 bg-blue-600 dark:bg-blue-600 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] text-center relative overflow-hidden group mb-16 sm:mb-24">
           <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
           <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4 sm:mb-6 md:mb-8 text-white">Let's Architect the Future.</h2>
              <p className="text-blue-100 mb-6 sm:mb-8 md:mb-12 text-base sm:text-lg md:text-xl font-light">Your ambition deserves the highest level of technical precision. Let's build something legacy-worthy.</p>
              <button className="magnetic-area px-8 sm:px-10 md:px-16 py-3 sm:py-4 md:py-6 bg-white text-blue-600 rounded-full font-bold text-sm sm:text-base md:text-lg hover:shadow-2xl transition-all">
                Schedule Strategy Session
              </button>
           </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
