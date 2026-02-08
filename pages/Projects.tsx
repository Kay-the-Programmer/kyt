import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { useSEO } from '../hooks/useSEO';

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
    description: 'SalePilot synchronizes inventory states and sales data with precision.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
    tags: ['RETAIL MANAGEMENT'],
    specs: [
      { label: 'STATUS', value: 'ACTIVE', isBadge: true },
      { label: 'WEB', value: 'https://salepilot.space' },
    ],
    slug: 'salepilot',
  },
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useSEO({
    title: 'Projects | Kytriq Technologies',
    description:
      'Explore our selected work and flagship intelligent systems. We specialize in software designed for absolute stability and sub-millisecond precision.',
    keywords: 'software projects, case studies, SalePilot, POS system, portfolio',
  });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Global defaults
      gsap.defaults({ ease: 'power3.out', duration: 0.9 });

      // Avoid heavy motion if user prefers reduced
      if (prefersReducedMotion) {
        return;
      }

      // ---------- Header sequence ----------
      const headerTl = gsap.timeline({ delay: 0.05 });

      headerTl
        .from('.project-header .letter-reveal', {
          opacity: 0,
          yPercent: 120,
          rotateX: -70,
          transformOrigin: '50% 100%',
          filter: 'blur(10px)',
          stagger: 0.018,
          duration: 1.05,
          ease: 'expo.out',
        })
        .to(
          '.project-header .letter-reveal',
          {
            filter: 'blur(0px)',
            rotateX: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.55'
        )
        .from(
          '.project-header-badge',
          { opacity: 0, x: -18, duration: 0.6, ease: 'power2.out' },
          '-=0.7'
        )
        .from(
          '.project-header-desc',
          { opacity: 0, y: 20, duration: 0.9, ease: 'power2.out' },
          '-=0.55'
        );

      // ---------- Background nodes (lighter) ----------
      gsap.to('.bg-node', {
        y: 'random(-40, 40)',
        x: 'random(-40, 40)',
        scale: 'random(0.9, 1.15)',
        duration: 'random(5, 9)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ---------- Card entrance: batch for performance ----------
      ScrollTrigger.batch('.project-card', {
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50, scale: 0.985 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.95, ease: 'power3.out' }
          );
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, { opacity: 0, y: 40, scale: 0.985, stagger: 0.08, duration: 0.5, ease: 'power2.inOut' });
        },
      });

      // ---------- Per-card timeline: image reveal + content ----------
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        const imageWrapper = card.querySelector('.showcase-image-wrapper');
        const img = card.querySelector('img');
        const content = card.querySelector('.content-layer');
        const revealItems = card.querySelectorAll('.reveal-item');
        const telemetry = card.querySelector('.telemetry-panel');
        const hudElements = card.querySelectorAll('.hud-element');
        const sweep = card.querySelector('.light-sweep') as HTMLElement | null;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
          },
        });

        tl.from(imageWrapper, {
          clipPath: 'inset(0% 0% 100% 0%)',
          scale: 1.08,
          duration: 1.15,
          ease: 'expo.inOut',
        })
          .from(
            img,
            {
              scale: 1.18,
              filter: 'grayscale(1)',
              opacity: 0.35,
              duration: 1.25,
              ease: 'power2.out',
            },
            '-=1.0'
          )
          .to(
            img,
            {
              filter: 'grayscale(0)',
              opacity: 0.9,
              duration: 0.9,
              ease: 'power2.out',
            },
            '-=0.8'
          )
          .from(
            hudElements,
            {
              opacity: 0,
              scale: 0.6,
              stagger: 0.06,
              duration: 0.55,
              ease: 'back.out(1.9)',
            },
            '-=0.85'
          )
          .from(
            revealItems,
            {
              opacity: 0,
              y: 22,
              stagger: 0.06,
              duration: 0.75,
              ease: 'power3.out',
            },
            '-=0.65'
          )
          .from(
            telemetry,
            {
              opacity: 0,
              x: 24,
              duration: 0.9,
              ease: 'power3.out',
            },
            '-=0.7'
          );

        // Desktop-only tilt / parallax: matchMedia + quickTo
        mm.add('(min-width: 1024px)', () => {
          if (!img || !content) return;

          const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.7, ease: 'power3.out' });
          const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.7, ease: 'power3.out' });

          const imgX = gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power2.out' });
          const imgY = gsap.quickTo(img, 'y', { duration: 0.9, ease: 'power2.out' });
          const imgS = gsap.quickTo(img, 'scale', { duration: 0.9, ease: 'power2.out' });

          const cX = gsap.quickTo(content, 'x', { duration: 0.9, ease: 'power2.out' });
          const cY = gsap.quickTo(content, 'y', { duration: 0.9, ease: 'power2.out' });

          const tX = telemetry ? gsap.quickTo(telemetry, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
          const tY = telemetry ? gsap.quickTo(telemetry, 'y', { duration: 1.0, ease: 'power2.out' }) : null;
          const tRY = telemetry ? gsap.quickTo(telemetry, 'rotateY', { duration: 1.0, ease: 'power2.out' }) : null;

          const sL = sweep ? gsap.quickTo(sweep, 'left', { duration: 0.35, ease: 'power2.out' }) : null;
          const sT = sweep ? gsap.quickTo(sweep, 'top', { duration: 0.35, ease: 'power2.out' }) : null;
          const sO = sweep ? gsap.quickTo(sweep, 'opacity', { duration: 0.35, ease: 'power2.out' }) : null;

          const handleMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;

            rotY(x * 10);
            rotX(-y * 8);

            imgX(x * 26);
            imgY(y * 18);
            imgS(1.08);

            cX(x * 14);
            cY(y * 10);

            if (telemetry && tX && tY && tRY) {
              tX(x * -10);
              tY(y * -8);
              tRY(x * -8);
            }

            if (sweep && sL && sT && sO) {
              sL((x + 0.5) * r.width);
              sT((y + 0.5) * r.height);
              sO(0.35);
            }
          };

          const handleLeave = () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.0, ease: 'elastic.out(1, 0.7)' });
            gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' });
            gsap.to(content, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' });
            if (telemetry) gsap.to(telemetry, { x: 0, y: 0, rotateY: 0, duration: 1.0, ease: 'power3.out' });
            if (sweep) gsap.to(sweep, { opacity: 0, duration: 0.6, ease: 'power2.out' });
          };

          card.addEventListener('mousemove', handleMove);
          card.addEventListener('mouseleave', handleLeave);

          return () => {
            card.removeEventListener('mousemove', handleMove);
            card.removeEventListener('mouseleave', handleLeave);
          };
        });

        // Mobile-only: subtle parallax on scroll (no mousemove)
        mm.add('(max-width: 1023px)', () => {
          if (!img) return;

          gsap.to(img, {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });

          if (sweep) {
            gsap.set(sweep, { opacity: 0.12 });
            gsap.to(sweep, {
              xPercent: 30,
              yPercent: -20,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            });
          }
        });
      });

      // CTA entrance
      gsap.from('.cta-block', {
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-block', start: 'top 85%' },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen pt-24 sm:pt-28 md:pt-44 pb-24 md:pb-32 px-5 sm:px-6 bg-white dark:bg-[#020202] transition-colors duration-500 overflow-x-hidden relative text-gray-900 dark:text-white"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.22] -z-10 overflow-hidden">
        <div className="bg-node absolute top-[8%] left-[2%] w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] border border-emerald-500/20 rounded-full blur-[110px] mix-blend-screen" />
        <div className="bg-node absolute bottom-[12%] right-[2%] w-[26rem] h-[26rem] sm:w-[38rem] sm:h-[38rem] border border-emerald-500/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="project-header mb-16 md:mb-32 max-w-5xl">
          <h2 className="project-header-badge text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.28em] md:tracking-[0.5em] mb-4 md:mb-8">
            02 // Selected Work
          </h2>

          {/* Better responsive type scale */}
          <h1 className="font-heading font-black leading-[0.9] tracking-tighter mb-8 md:mb-10 text-gray-900 dark:text-white
                         text-[3.2rem] sm:text-[4.4rem] md:text-[6.5rem] lg:text-[9rem]">
            <SplitText text="SELECTED" className="block" />
            <br />
            <SplitText isGradient={true} text="WORK." />
          </h1>

          <p className="project-header-desc text-base sm:text-lg md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-4xl border-l-2 md:border-l-4 border-emerald-500/25 pl-5 md:pl-10">
            We specialize in software designed for absolute stability.
          </p>
        </header>

        <div className="space-y-20 sm:space-y-24 md:space-y-44">
          {PROJECTS_DATA.map((project) => (
            <section key={project.id} className="relative group/card project-card">
              {/* HUD Decorative Corners */}
              <div className="hud-element absolute -top-3 -left-3 md:-top-4 md:-left-4 w-10 h-10 md:w-12 md:h-12 border-t-2 border-l-2 border-emerald-500/35 rounded-tl-2xl pointer-events-none z-10" />
              <div className="hud-element absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 border-t-2 border-r-2 border-emerald-500/35 rounded-tr-2xl pointer-events-none z-10" />
              <div className="hud-element absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-10 h-10 md:w-12 md:h-12 border-b-2 border-l-2 border-emerald-500/35 rounded-bl-2xl pointer-events-none z-10" />
              <div className="hud-element absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 border-b-2 border-r-2 border-emerald-500/35 rounded-br-2xl pointer-events-none z-10" />

              <div
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="relative flex flex-col w-full
                           h-[560px] sm:h-[620px] md:h-[820px] lg:h-[920px]
                           bg-gray-50 dark:bg-zinc-950/40
                           border border-gray-200 dark:border-white/5
                           rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[4rem] lg:rounded-[6rem]
                           overflow-hidden transition-all duration-700 cursor-pointer
                           shadow-[0_40px_90px_-25px_rgba(0,0,0,0.55)]
                           backdrop-blur-xl"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* Light Sweep */}
                <div className="light-sweep absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] bg-emerald-500/20 blur-[110px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-10" />

                <div className="showcase-image-wrapper absolute inset-0 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 grayscale
                               group-hover/card:grayscale-0 group-hover/card:opacity-95
                               transition-[transform,filter,opacity] duration-[1200ms] ease-out"
                    style={{ willChange: 'transform' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                  {/* Technical Grid Overlay (softer) */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

                  <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/18 to-transparent -translate-y-full animate-[scan_7s_linear_infinite] pointer-events-none" />
                </div>

                <div
                  className="content-layer relative h-full flex flex-col justify-end
                             p-6 sm:p-8 md:p-14 lg:p-20 text-white z-20"
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                  {/* Big ID: smaller on mobile to reduce clutter */}
                  <div className="reveal-item absolute top-4 left-5 sm:top-6 sm:left-8 md:top-10 md:left-14
                                  text-[5.5rem] sm:text-[7rem] md:text-[13rem] lg:text-[18rem]
                                  font-black opacity-[0.06] font-heading tracking-tighter pointer-events-none select-none text-emerald-500">
                    {project.id}
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 md:gap-14">
                    <div className="max-w-3xl">
                      <div className="reveal-item mb-5 md:mb-7">
                        <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-[0.28em] uppercase text-emerald-300/90">
                          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                          {project.category}
                        </span>
                      </div>

                      <h3 className="reveal-item font-heading font-black leading-[0.92] tracking-tighter
                                     text-[2.3rem] sm:text-[3rem] md:text-[5.5rem] lg:text-[7rem]
                                     mb-5 md:mb-8">
                        {project.title}
                      </h3>

                      <p className="reveal-item text-gray-300/90 text-base sm:text-lg md:text-2xl mb-8 md:mb-10 leading-relaxed font-light max-w-3xl border-l border-emerald-500/20 pl-4 md:pl-6">
                        {project.description}
                      </p>

                      <div className="reveal-item flex flex-wrap gap-2.5 sm:gap-3 mb-8 md:mb-10">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-5 sm:px-6 py-2 sm:py-2.5 bg-emerald-500/8 backdrop-blur-3xl rounded-full
                                       text-[10px] sm:text-xs text-emerald-200 border border-emerald-500/12 uppercase font-black tracking-[0.22em]
                                       hover:bg-emerald-500/18 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="reveal-item flex items-center group/btn pointer-events-auto">
                        <div
                          className="px-7 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-emerald-600 text-white rounded-full font-black
                                     text-base sm:text-lg md:text-xl shadow-[0_18px_40px_-12px_rgba(5,150,105,0.45)]
                                     group-hover/btn:bg-emerald-500 group-hover/btn:scale-[1.03]
                                     transition-all duration-300 flex items-center gap-4 md:gap-6"
                        >
                          <span className="tracking-[0.18em] sm:tracking-[0.22em]">VIEW PROJECT</span>
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                            <i className="fa-solid fa-arrow-right-long text-sm text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="telemetry-panel hidden lg:grid grid-cols-1 gap-7 p-10
                                 bg-black/60 backdrop-blur-[40px] rounded-[3.5rem] border border-emerald-500/10
                                 min-w-[360px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)]
                                 overflow-hidden relative"
                      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/6 to-transparent pointer-events-none" />

                      {project.specs.map((spec, i) => (
                        <div key={i} className="spec-item relative border-b border-emerald-500/7 pb-5 last:border-0 last:pb-0">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{spec.label}</div>
                          <div className={`text-xl font-heading font-black tracking-tight ${spec.isBadge ? 'text-emerald-400' : 'text-white'}`}>
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Edge fade */}
                <div className="absolute inset-0 ring-1 ring-white/5 pointer-events-none" />
              </div>
            </section>
          ))}
        </div>

        <section className="cta-block text-center py-20 md:py-40 flex flex-col items-center">
          <div className="w-px h-24 md:h-32 bg-gradient-to-b from-emerald-600 to-transparent mb-10 md:mb-16" />
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black mb-10 md:mb-14 tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
            Let&apos;s Architect <br /> <span className="gradient-text">Your Vision.</span>
          </h2>
          <button
            onClick={() => navigate('/contact')}
            className="magnetic-area px-10 sm:px-14 md:px-20 py-4 sm:py-5 md:py-7 bg-emerald-600 text-white rounded-full font-black
                       text-base sm:text-lg md:text-2xl shadow-[0_25px_60px_-20px_rgba(5,150,105,0.55)]
                       hover:scale-[1.03] transition-all active:scale-95"
          >
            LET&apos;S WORK TOGETHER
          </button>
        </section>
      </div>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            15% { opacity: 0.7; }
            85% { opacity: 0.7; }
            100% { transform: translateY(520%); opacity: 0; }
          }
          .gradient-text {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            filter: drop-shadow(0 0 18px rgba(16,185,129,0.25));
          }

          /* Small UX win: smoother scroll-triggered transforms */
          .project-card, .content-layer, .telemetry-panel, .showcase-image-wrapper img {
            backface-visibility: hidden;
            transform: translateZ(0);
          }
        `,
        }}
      />
    </div>
  );
};

export default Projects;
