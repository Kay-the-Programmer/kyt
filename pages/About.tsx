
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.about-header > *', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });

      // Clip Path Reveal for images
      gsap.utils.toArray<HTMLElement>('.img-reveal').forEach((img) => {
        gsap.fromTo(img, 
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { 
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: img,
              start: 'top 80%'
            }
          }
        );
      });

      // Scroll reveals with subtle scale
      gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          scale: 0.98,
          duration: 1,
          ease: 'power3.out',
        });
      });

      // Stats counter animation
      gsap.utils.toArray<HTMLElement>('.stat-number').forEach((stat) => {
        const value = parseInt(stat.getAttribute('data-value') || '0');
        gsap.fromTo(stat, 
          { innerText: 0 },
          { 
            innerText: value, 
            duration: 2, 
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-40 pb-20 md:pb-32 px-6 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="about-header mb-20 md:mb-32 max-w-4xl">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6 md:mb-8">01 // The Origin</h2>
          <h1 className="text-5xl md:text-[8rem] font-heading font-extrabold leading-[0.9] tracking-tighter mb-10 md:mb-12 text-gray-900 dark:text-white">
            ARCHITECTING <br /> <span className="gradient-text">DIGITAL LIFE.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-2xl font-light leading-relaxed">
            Kytriq Technologies was founded on a simple premise: Digital ideas deserve to live. We are a startup with the heart of a pioneer and the precision of a master engineer.
          </p>
        </header>

        {/* Vision/Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-24 md:mb-40">
          <div className="img-reveal order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-900/20">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" 
                alt="Innovation" 
                className="w-full h-full object-cover rounded-[2.2rem] md:rounded-[3.5rem] grayscale hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[60px] md:blur-[80px] -z-10"></div>
          </div>
          <div className="reveal-item order-1 lg:order-2 space-y-10 md:space-y-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6 md:mb-8 text-gray-900 dark:text-white underline decoration-blue-500/30 underline-offset-8">Our Core Philosophy</h3>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                We believe that software is a living entity. It shouldn't just function; it should evolve. At Kytriq, we bridge the gap between human ambition and technological reality by building systems that feel human and act intelligent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {[
                  { title: 'Intelligence Driven', desc: 'Every line of code is infused with purpose and predictive logic.' },
                  { title: 'Zero Friction', desc: 'We design for the human experience first, technology second.' },
                  { title: 'Global Scale', desc: 'Our architectures are built to handle the demands of tomorrow.' },
                  { title: 'Radical Trust', desc: 'Security and transparency are baked into our DNA.' }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="reveal-item py-16 md:py-24 border-t border-gray-100 dark:border-gray-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
            {[
              { label: 'Active Systems', value: 12, suffix: '+' },
              { label: 'Success Rate', value: 99, suffix: '%' },
              { label: 'Lines of Code', value: 250, suffix: 'k+' },
              { label: 'Uptime Core', value: 99, suffix: '.9%' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex items-center justify-center text-4xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4">
                  <span className="stat-number" data-value={stat.value}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-500 font-bold uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Journey */}
        <section className="reveal-item py-24 md:py-40">
           <div className="text-center mb-16 md:mb-24">
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6">02 // The Roadmap</h2>
              <h3 className="text-4xl md:text-7xl font-heading font-bold text-gray-900 dark:text-white">Our Evolution.</h3>
           </div>
           
           <div className="space-y-20 md:space-y-32 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800 hidden md:block"></div>
              
              {[
                { year: '2022', title: 'The Spark', desc: 'Kytriq was born from a vision to simplify AI integration for small businesses.' },
                { year: '2023', title: 'SalePilot Launch', desc: 'Deployment of our flagship AI-powered POS system to its first 50 enterprise clients.' },
                { year: '2024', title: 'The Scaling', desc: 'Expanding our specialized boutique services to global systems integration.' }
              ].map((item, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-10 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 w-full text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} px-0 md:px-8`}>
                      <h4 className="text-5xl md:text-6xl font-heading font-black text-gray-200 dark:text-gray-900 mb-4">{item.year}</h4>
                      <h5 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h5>
                      <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto md:mx-0 md:ml-auto">{item.desc}</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold relative z-10 shadow-2xl shadow-blue-500/40 shrink-0">
                    <i className="fa-solid fa-circle-check text-sm md:text-base"></i>
                  </div>
                  <div className="hidden md:block flex-1"></div>
                </div>
              ))}
           </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
