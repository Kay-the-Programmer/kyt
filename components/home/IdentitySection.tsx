import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

gsap.registerPlugin(ScrollTrigger);

const IdentitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Desktop: High-end Parallax & Hover
        gsap.to('.identity-parallax-bg', {
          y: -150,
          opacity: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // Magnetic floating badge
        gsap.to(badgeRef.current, {
          y: -30,
          x: 20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Character Reveal for Header - Optimized with fromTo for absolute state control
      gsap.fromTo('.identity-title .letter-reveal', 
        {
          y: '110%',
          opacity: 0,
          rotateX: -45,
          scale: 0.8,
          filter: 'blur(10px)'
        },
        {
          scrollTrigger: {
            trigger: '.identity-title',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          y: '0%',
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.02,
          duration: 1.2,
          ease: 'expo.out',
          overwrite: 'auto'
        }
      );

      // Feature Items Staggered Slide-in
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: '.feature-list',
          start: 'top 85%',
        },
        x: -30,
        opacity: 0,
        filter: 'blur(10px)',
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });

      // Image Reveal with Masking
      gsap.fromTo('.image-reveal-wrapper', 
        { clipPath: 'inset(10% 10% 10% 10% round 3rem)' },
        { 
          clipPath: 'inset(0% 0% 0% 0% round 3rem)',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: '.image-reveal-wrapper',
            start: 'top 80%',
          }
        }
      );

      // Inner Image Scale Parallax
      gsap.to('.inner-image', {
        scale: 1.2,
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.image-reveal-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="who-we-are" 
      ref={sectionRef}
      className="reveal-on-scroll relative z-10 py-24 md:py-48 lg:py-64 px-6 border-t border-gray-100 dark:border-gray-900/30 overflow-hidden"
    >
      {/* Dynamic Background ID */}
      <div className="identity-parallax-bg absolute top-0 -left-10 text-[35vw] font-black text-blue-600/[0.04] dark:text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
        01
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center relative z-10">
        <div className=""> {/* Handled independently to avoid conflicts */}
          <div className="reveal-child flex items-center space-x-4 mb-8">
            <div className="h-px w-12 bg-blue-600"></div>
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.7em]">WHO WE ARE</h2>
          </div>
          
          <h3 className="identity-title text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-bold mb-10 leading-[0.85] text-gray-900 dark:text-white tracking-tighter overflow-visible">
            <SplitText text="Engineering" className="block overflow-visible" />
            <span className="text-gray-400 dark:text-gray-600 inline-block overflow-visible">
              <SplitText text="Legacy." />
            </span>
          </h3>
          
          <p className="reveal-child text-gray-500 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-16 font-light max-w-xl">
            Kytriq Technologies is more than a startup; we are a specialized software boutique. We cultivate intelligent ecosystems that evolve with human ambition.
          </p>
          
          <div className="feature-list space-y-8 md:space-y-12">
            {[
              { title: 'Neural Architectures', text: 'Intelligence at the core for adaptive performance.', icon: 'fa-brain' },
              { title: 'Cognitive UX', text: 'Predictive interfaces designed for zero friction.', icon: 'fa-user-astronaut' },
              { title: 'Elite Infrastructure', text: 'Zero-failure tolerance at global scale.', icon: 'fa-server' }
            ].map((item, i) => (
              <div key={i} className="feature-item group flex items-start space-x-8">
                <div className="w-14 h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-xl tracking-tight">{item.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-child relative">
           <div className="image-reveal-wrapper relative aspect-square rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-3 bg-white/50 dark:bg-gray-950/30 backdrop-blur-md">
              <div className="w-full h-full overflow-hidden rounded-[2.5rem]">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                  alt="Engineering" 
                  className="inner-image w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" 
                />
              </div>
              
              {/* Glass Overlay scanning effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 h-1/4 w-full -top-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>
           </div>

           {/* Stats Badge */}
           <div 
             ref={badgeRef}
             className="absolute -bottom-10 -right-4 md:-right-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl z-20"
           >
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-black text-blue-600 mb-2 font-heading tracking-tighter">99.9%</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 text-center">System Reliability</div>
                
                <div className="flex space-x-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
      `}} />
    </section>
  );
};

export default IdentitySection;