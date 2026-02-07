
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // SEO Configuration
  useSEO({
    title: 'About Us | Kytriq Technologies',
    description: 'Learn about Kytriq Technologies - a software development company with the heart of a pioneer and precision of a master engineer. We architect digital life.',
    keywords: 'about Kytriq, software company, AI solutions, digital innovation, tech startup',
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0.01 : 1;
    const staggerDuration = prefersReducedMotion ? 0 : 0.12;

    const ctx = gsap.context(() => {
      // Cache DOM queries for performance
      const headerItems = containerRef.current!.querySelectorAll('.about-header > *');
      const imgRevealItems = containerRef.current!.querySelectorAll<HTMLElement>('.img-reveal');
      const revealItems = containerRef.current!.querySelectorAll<HTMLElement>('.reveal-item');
      const statNumbers = containerRef.current!.querySelectorAll<HTMLElement>('.stat-number');
      const cardItems = containerRef.current!.querySelectorAll<HTMLElement>('.card-item');
      const splitTexts = containerRef.current!.querySelectorAll<HTMLElement>('.split-text');

      // Batch set initial states for performance (avoids layout thrashing)
      gsap.set(headerItems, { y: 80, opacity: 0 });
      gsap.set(imgRevealItems, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1 });
      gsap.set(revealItems, { y: 50, opacity: 0 });
      gsap.set(cardItems, { y: 60, opacity: 0, rotateX: 15 });
      gsap.set(splitTexts, { y: 40, opacity: 0, filter: 'blur(8px)' });

      // Entrance animation with cascading effect
      gsap.to(headerItems, {
        y: 0,
        opacity: 1,
        duration: duration * 1.4,
        stagger: staggerDuration * 1.5,
        ease: 'power4.out',
        force3D: 'auto',
        clearProps: 'transform',
      });

      // Clip Path Reveal for images with scale
      imgRevealItems.forEach((img) => {
        gsap.to(img, {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: duration * 1.8,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: img,
            start: 'top 80%',
            once: true,
          },
        });
      });

      // Scroll reveals with smooth entrance
      revealItems.forEach((item) => {
        gsap.to(item, {
          y: 0,
          opacity: 1,
          duration: duration * 1.2,
          ease: 'power3.out',
          force3D: 'auto',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Card items with 3D perspective effect
      cardItems.forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: duration * 1.2,
          delay: index * staggerDuration,
          ease: 'power3.out',
          force3D: 'auto',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // Split text blur reveal
      splitTexts.forEach((text, index) => {
        gsap.to(text, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: duration * 1.3,
          delay: index * staggerDuration * 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Stats counter animation
      statNumbers.forEach((stat) => {
        const value = parseInt(stat.getAttribute('data-value') || '0', 10);
        gsap.fromTo(stat,
          { innerText: 0 },
          {
            innerText: value,
            duration: prefersReducedMotion ? 0.1 : 2.5,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              once: true,
            },
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
        <header className="about-header mb-24 md:mb-40 max-w-5xl">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6 md:mb-8">
            01 // Who We Are
          </h2>
          <h1 className="text-5xl md:text-[7rem] lg:text-[9rem] font-heading font-extrabold leading-[0.9] tracking-tighter mb-10 md:mb-14 text-gray-900 dark:text-white">
            ARCHITECTING <br /> <span className="gradient-text">DIGITAL LIFE.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-3xl">
            Kytriq Technologies was founded on a simple premise: <strong className="text-gray-900 dark:text-white">Digital ideas deserve to live.</strong> We are a startup with the heart of a pioneer and the precision of a master engineer.
          </p>
        </header>

        {/* Mission & Vision Section */}
        <section className="mb-24 md:mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            {/* Mission Card */}
            <div className="card-item group relative">
              <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 lg:p-16 h-full min-h-[400px] md:min-h-[480px]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-[0.4em]">Our Mission</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                    Empowering Businesses Through Intelligent Software
                  </h3>

                  <p className="text-blue-100/90 text-base md:text-lg leading-relaxed mt-auto">
                    We exist to transform bold ideas into powerful digital realities. By combining cutting-edge AI with human-centered design, we build software that doesn't just work—it thinks, adapts, and grows with your business.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="card-item group relative">
              <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-8 md:p-12 lg:p-16 h-full min-h-[400px] md:min-h-[480px]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Our Vision</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    A World Where Every Business Has Access to Intelligent Technology
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mt-auto">
                    We envision a future where advanced AI and seamless digital experiences are not exclusive to tech giants. Every entrepreneur, every small business, and every dreamer deserves tools that amplify their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-24 md:mb-40">
          <div className="img-reveal order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-900/20">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000"
                alt="Innovation"
                loading="lazy"
                className="w-full h-full object-cover rounded-[2.2rem] md:rounded-[3.5rem] grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[60px] md:blur-[80px] -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -z-10"></div>
          </div>

          <div className="reveal-item order-1 lg:order-2 space-y-10 md:space-y-12">
            <div>
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6">02 // Philosophy</h2>
              <h3 className="text-3xl md:text-5xl font-heading font-bold mb-8 text-gray-900 dark:text-white leading-tight">
                Software That <span className="gradient-text">Feels Alive</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-10">
                We believe that software is a living entity. It shouldn't just function; it should evolve. At Kytriq, we bridge the gap between human ambition and technological reality by building systems that feel human and act intelligent.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Intelligence Driven', desc: 'Every line of code is infused with purpose and predictive logic.', icon: '🧠' },
                  { title: 'Zero Friction', desc: 'We design for the human experience first, technology second.', icon: '✨' },
                  { title: 'Global Scale', desc: 'Our architectures are built to handle the demands of tomorrow.', icon: '🌍' },
                  { title: 'Radical Trust', desc: 'Security and transparency are baked into our DNA.', icon: '🔐' }
                ].map((item, i) => (
                  <div key={i} className="split-text group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                    <span className="text-2xl mb-4 block">{item.icon}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="reveal-item py-16 md:py-28 border-t border-b border-gray-100 dark:border-gray-800/50 mb-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-4">03 // By The Numbers</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Our Impact</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
            {[
              { label: 'Active Systems', value: 12, suffix: '+' },
              { label: 'Success Rate', value: 99, suffix: '%' },
              { label: 'Lines of Code', value: 250, suffix: 'k+' },
              { label: 'Uptime Core', value: 99, suffix: '.9%' }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-center text-4xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300">
                  <span className="stat-number" data-value={stat.value}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-500 font-bold uppercase tracking-[0.3em]">{stat.label}</p>
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
