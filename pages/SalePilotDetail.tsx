
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';

gsap.registerPlugin(ScrollTrigger);

const SalePilotDetail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const uiNodesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Sequence (Refactored to FROM for safety)
      const tl = gsap.timeline();
      tl.from('.detail-header .letter-reveal', {
        y: '100%',
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)',
        stagger: 0.01,
        duration: 1.2,
        ease: 'expo.out',
      })
      .from('.header-badge', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.0')
      .from('.header-desc', { opacity: 0, y: 30, duration: 1.2, ease: 'power4.out' }, '-=0.8')
      .from('.back-btn', { x: -30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.2');

      // 2. Hero Section Parallax & Floating UI Elements
      if (heroImgRef.current) {
        gsap.fromTo(heroImgRef.current.querySelector('img'), 
          { scale: 1.3 },
          { 
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: heroImgRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );

        // Floating UI Elements over hero
        uiNodesRef.current.forEach((node, i) => {
          gsap.from(node, {
            scrollTrigger: {
              trigger: heroImgRef.current,
              start: 'top 70%',
            },
            y: 50,
            opacity: 0,
            duration: 1.5,
            delay: 0.5 + (i * 0.2),
            ease: 'expo.out'
          });

          // Floating movement
          gsap.to(node, {
            y: '-=15',
            x: '+=10',
            duration: 2 + (i * 0.5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }

      // 3. Multi-stage Scroll Reveals
      gsap.utils.toArray<HTMLElement>('.case-section').forEach((section) => {
        const title = section.querySelector('.section-title');
        const contents = section.querySelectorAll('.section-content-reveal');
        
        const sectionTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        sectionTl.from(section, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        });

        if (title) {
          sectionTl.from(title.querySelectorAll('.letter-reveal'), {
            y: '100%',
            opacity: 0,
            scale: 0.9,
            filter: 'blur(10px)',
            stagger: 0.015,
            duration: 0.8,
            ease: 'expo.out'
          }, '-=1.0');
        }

        if (contents.length) {
          sectionTl.from(contents, {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out'
          }, '-=0.6');
        }
      });

      // 4. Enhanced Impact Stats
      gsap.utils.toArray<HTMLElement>('.impact-stat').forEach((stat) => {
        const value = parseInt(stat.getAttribute('data-value') || '0');
        gsap.fromTo(stat, 
          { innerText: 0 },
          { 
            innerText: value, 
            duration: 2.5, 
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
            }
          }
        );
      });

      // 5. Liquid Circle Rotation & Pulse
      gsap.to('.liquid-circle', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-48 bg-white dark:bg-brand-dark transition-colors duration-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Link */}
        <Link to="/projects" className="back-btn group inline-flex items-center space-x-3 text-gray-400 hover:text-blue-600 mb-16 transition-all">
          <div className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-600 group-hover:-translate-x-2 transition-all">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em]">Back to Projects</span>
        </Link>

        {/* Header */}
        <header className="detail-header mb-24 lg:mb-40">
          <div className="header-badge inline-flex items-center space-x-2 px-6 py-2 bg-blue-600/5 dark:bg-blue-500/10 border border-blue-600/10 dark:border-blue-500/20 rounded-full mb-10">
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">Flagship Intelligent System</span>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-heading font-black tracking-tighter leading-[0.85] text-gray-900 dark:text-white mb-14">
            <SplitText text="SalePilot" className="block" />
            <span className="gradient-text"><SplitText text="Future POS." /></span>
          </h1>
          <p className="header-desc text-2xl md:text-4xl text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-5xl">
            Designing a central nervous system for retail. SalePilot bridges the gap between hardware precision and neural business intelligence.
          </p>
        </header>

        {/* Hero Section with Floating UI */}
        <section ref={heroImgRef} className="case-section mb-40 relative group">
          <div className="aspect-[21/9] rounded-[4rem] lg:rounded-[6rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-3xl relative">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-1000" 
              alt="SalePilot Terminal" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent"></div>
            
            {/* Floating UI Elements */}
            <div 
              ref={el => { if (el) uiNodesRef.current[0] = el; }} 
              className="absolute top-10 right-10 md:top-20 md:right-20 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hidden lg:block"
            >
              <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Live Throughput</div>
              <div className="text-3xl font-heading font-bold text-white">4.2k <span className="text-xs opacity-50">tx/m</span></div>
            </div>

            <div 
              ref={el => { if (el) uiNodesRef.current[1] = el; }} 
              className="absolute bottom-40 right-40 p-6 bg-blue-600/20 backdrop-blur-xl border border-blue-400/20 rounded-3xl hidden lg:block"
            >
              <div className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-2">Neural Prediction</div>
              <div className="text-xl font-heading font-bold text-white">Inventory: +12% Efficiency</div>
            </div>

            <div className="absolute bottom-16 left-16 text-white">
              <div className="text-[11px] font-black uppercase tracking-[0.7em] mb-6 opacity-60">System Core v2.4 // Cognitive Core</div>
              <div className="text-4xl md:text-6xl font-bold font-heading tracking-tighter">SalePilot Engine.</div>
            </div>
          </div>
        </section>

        {/* Grid: Overview & Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 mb-48">
          <section className="case-section">
            <div className="flex items-center space-x-5 mb-10">
              <div className="h-px w-16 bg-blue-600"></div>
              <h2 className="section-title text-[11px] font-black text-blue-600 uppercase tracking-[0.6em]">
                <SplitText text="THE MISSION" />
              </h2>
            </div>
            <p className="section-content-reveal text-2xl md:text-3xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              SalePilot was conceived to solve the disconnect between physical transactions and digital foresight. We engineered a system that doesn't just record sales but anticipates them.
            </p>
          </section>

          <section className="case-section">
            <div className="flex items-center space-x-5 mb-10">
              <div className="h-px w-16 bg-pink-500"></div>
              <h2 className="section-title text-[11px] font-black text-pink-500 uppercase tracking-[0.6em]">
                <SplitText text="THE FRICTION" />
              </h2>
            </div>
            <ul className="problem-list space-y-10">
              {[
                'Legacy lag during peak high-frequency transactions',
                'Disconnected inventory data across global storefronts',
                'Zero predictive capability for seasonal fluctuations',
                'Complex user onboarding for non-technical staff'
              ].map((item, i) => (
                <li key={i} className="section-content-reveal flex items-start space-x-6 text-gray-500 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0 mt-1">
                    <i className="fa-solid fa-bolt-lightning text-pink-500 text-sm"></i>
                  </div>
                  <span className="text-xl md:text-2xl font-light">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Architecture Section */}
        <section className="case-section mb-48 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5 rounded-[5rem] lg:rounded-[7rem] p-16 lg:p-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <i className="fa-solid fa-microchip text-[40rem] text-blue-600"></i>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-16">
              <div className="h-px w-20 bg-blue-600"></div>
              <h2 className="section-title text-[11px] font-black text-blue-600 uppercase tracking-[0.8em]">
                <SplitText text="INTELLIGENT LAYERS" />
              </h2>
            </div>
            <h3 className="section-content-reveal text-5xl md:text-8xl font-heading font-black text-gray-900 dark:text-white mb-24 tracking-tighter max-w-5xl leading-[0.9]">
              Built for <br /> <span className="gradient-text">Absolute Scale.</span>
            </h3>
            
            <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
              {[
                { title: 'Neural POS', icon: 'fa-brain', text: 'Active learning agents that optimize checkout paths.' },
                { title: 'Global Sync', icon: 'fa-globe', text: 'Zero-latency inventory state management across continents.' },
                { title: 'Predictive analytics', icon: 'fa-chart-line', text: 'Real-time sales forecasting with 92% accuracy.' },
                { title: 'Security Core', icon: 'fa-shield-halved', text: 'Biometric transaction authorization and end-to-end encryption.' },
                { title: 'Offline-First', icon: 'fa-database', text: 'Robust local-state synchronization for intermittent networks.' },
                { title: 'Custom UI', icon: 'fa-wand-magic-sparkles', text: 'Minimalistic interfaces designed for muscle memory.' }
              ].map((feat, i) => (
                <div key={i} className="feature-card group p-12 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[3.5rem] shadow-sm hover:shadow-3xl transition-all duration-700 hover:-translate-y-5">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30 group-hover:rotate-12 transition-transform">
                    <i className={`fa-solid ${feat.icon} text-3xl`}></i>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">{feat.title}</h4>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">{feat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcome & Impact */}
        <section className="case-section mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 lg:gap-48 items-center">
            <div>
              <div className="flex items-center space-x-6 mb-12">
                <div className="h-px w-16 bg-green-500"></div>
                <h2 className="section-title text-[11px] font-black text-green-500 uppercase tracking-[0.6em]">
                   <SplitText text="THE IMPACT" />
                </h2>
              </div>
              <h3 className="section-content-reveal text-5xl md:text-7xl font-heading font-black text-gray-900 dark:text-white mb-12 tracking-tighter leading-[0.9]">
                Zero Lag. <br /> <span className="text-green-500">Infinite Trust.</span>
              </h3>
              <p className="section-content-reveal text-gray-500 dark:text-gray-400 text-2xl leading-relaxed font-light mb-20 max-w-xl">
                The Result? A 40% increase in checkout throughput and a complete elimination of inventory discrepancies within 6 months of deployment.
              </p>
              <div className="grid grid-cols-2 gap-20">
                <div>
                   <div className="text-7xl md:text-8xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter font-heading">
                      <span className="impact-stat inline-block" data-value="40">0</span>%
                   </div>
                   <div className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400">Throughput Increase</div>
                </div>
                <div>
                   <div className="text-7xl md:text-8xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter font-heading">
                      <span className="impact-stat inline-block" data-value="100">0</span>%
                   </div>
                   <div className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400">Inventory Accuracy</div>
                </div>
              </div>
            </div>
            <div className="section-content-reveal relative">
              <div className="aspect-square bg-blue-600 rounded-[6rem] lg:rounded-[8rem] flex items-center justify-center p-20 md:p-24 text-center text-white relative overflow-hidden group shadow-3xl">
                 <div className="relative z-10">
                   <h4 className="text-4xl font-bold mb-8 tracking-tight">Kytriq Reflection</h4>
                   <p className="text-blue-100 font-light text-xl leading-relaxed">
                     SalePilot represents our dedication to building software that behaves like a living organism—constantly observing, learning, and protecting.
                   </p>
                 </div>
                 {/* Rotating Liquid Effect */}
                 <div className="liquid-circle absolute inset-0 bg-white/5 -z-0 scale-[2.5] blur-[80px] pointer-events-none border-[40px] border-blue-400/20 rounded-full"></div>
                 <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="case-section mb-48 text-center">
           <h2 className="text-6xl md:text-[9rem] font-heading font-black mb-16 tracking-tighter text-gray-900 dark:text-white leading-[0.85]">
              Let's Build your <br /> <span className="gradient-text">Masterpiece.</span>
           </h2>
           <Link to="/contact" className="magnetic-area px-20 py-8 bg-blue-600 text-white rounded-full font-bold text-2xl shadow-3xl shadow-blue-600/30 hover:scale-105 transition-all inline-block active:scale-95">
              Send Inquiry
           </Link>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default SalePilotDetail;
