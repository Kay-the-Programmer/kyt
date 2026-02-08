
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { useSEO } from '../hooks/useSEO';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSharedMousePos, globalMousePos } from '../hooks/useSharedMousePos';

const ContactCard: React.FC<{
  icon: string;
  title?: string;
  value: string;
  href?: string;
  colorClass: string;
}> = ({ icon, title, value, href, colorClass }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useMagnetic(cardRef);

  const content = (
    <div
      ref={cardRef}
      className="contact-card relative p-8 md:p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 cursor-pointer overflow-hidden"
    >
      {/* HUD Decorative Elements */}
      <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500">
        <svg viewBox="0 0 100 100" className={`w-full h-full stroke-current ${colorClass} fill-none stroke-2`}>
          <path d="M10,30 L10,10 L30,10" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 w-10 h-10 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500 rotate-180">
        <svg viewBox="0 0 100 100" className={`w-full h-full stroke-current ${colorClass} fill-none stroke-2`}>
          <path d="M10,30 L10,10 L30,10" />
        </svg>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${colorClass.replace('text-', 'bg-').replace('600', '600/10').replace('500', '500/10')} text-2xl md:text-3xl border border-gray-100 dark:border-gray-800 mb-6 group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
          <i className={`${icon}`}></i>
        </div>
        {title && <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">{title}</h4>}
        <p className="text-xl md:text-2xl font-heading font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="block w-full">
      {content}
    </a>
  ) : (
    <div className="w-full">{content}</div>
  );
};

const Contact: React.FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Contact Us | Kytriq Technologies',
    description: 'Get in touch with Kytriq Technologies. Reach out to us via email, phone, or WhatsApp.',
    keywords: 'contact Kytriq, software inquiry, AI consultation, Kytriq phone, Kytriq email',
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const glowXTo = useRef<gsap.QuickToFunc | null>(null);
  const glowYTo = useRef<gsap.QuickToFunc | null>(null);

  useSharedMousePos();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Glow Interactive Setup
      const glows = document.querySelectorAll('.contact-bg-glow');
      if (glows.length > 0) {
        glowXTo.current = gsap.quickTo(glows, "x", { duration: 3, ease: "power2.out" });
        glowYTo.current = gsap.quickTo(glows, "y", { duration: 3, ease: "power2.out" });
      }

      // Entrance Animations
      const tl = gsap.timeline({ delay: 0.2 });

      if (headerRef.current) {
        const chars = headerRef.current.querySelectorAll('.letter-reveal');
        tl.fromTo(chars,
          { y: 100, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.03, ease: 'expo.out' }
        );
      }

      tl.fromTo('.header-paragraph',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.8"
      );

      tl.fromTo('.contact-card',
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.2)' },
        "-=0.6"
      );

      tl.fromTo('.social-link',
        { opacity: 0, scale: 0.5, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(2)' },
        "-=0.4"
      );

      // Background Ambient Floating
      glows.forEach((glow, i) => {
        gsap.to(glow, {
          y: i === 0 ? '+=30' : '-=20',
          x: i === 0 ? '-=20' : '+=15',
          duration: 8 + i * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateGlow = () => {
      if (!globalMousePos.active) return;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const xPos = (globalMousePos.x / winW - 0.5) * 60;
      const yPos = (globalMousePos.y / winH - 0.5) * 60;

      glowXTo.current?.(xPos);
      glowYTo.current?.(yPos);
    };

    gsap.ticker.add(updateGlow);
    return () => gsap.ticker.remove(updateGlow);
  }, []);

  return (
    <div ref={sectionRef} className="min-h-screen pt-32 md:pt-48 pb-20 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden relative">
      {/* Interactive Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="contact-bg-glow absolute top-1/4 -right-[10%] w-[60vw] h-[60vw] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="contact-bg-glow absolute bottom-1/4 -left-[10%] w-[50vw] h-[50vw] bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6">
        <header className="mb-20 md:mb-32 text-center">
          <h1 ref={headerRef} className="text-6xl md:text-[8rem] font-heading font-black mb-8 tracking-tighter text-gray-900 dark:text-white leading-[0.85] perspective-1000">
            <SplitText text="Let's " className="inline-block" />
            <SplitText text="Connect." isGradient={true} className="inline-block" />
          </h1>
          <p className="header-paragraph text-gray-500 dark:text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Whether you're ready to start a project or just want to explore possibilities, our team is here to engineer your next digital breakthrough.
          </p>
        </header>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20 md:mb-32">
          <ContactCard
            icon="fa-brands fa-whatsapp"
            title="Instant Chat"
            value="WhatsApp"
            href="https://wa.me/260570135415"
            colorClass="text-green-600"
          />
          <ContactCard
            icon="fa-solid fa-envelope"
            title="Email Inquiry"
            value="info@kytriq.com"
            href="mailto:info@kytriq.com"
            colorClass="text-blue-600"
          />
          <ContactCard
            icon="fa-solid fa-phone"
            title="Voice Call"
            value="+260 570 135 415"
            href="tel:+260570135415"
            colorClass="text-indigo-600"
          />
        </div>

        <div className="text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-10">Follow the Journey</h3>
          <div ref={socialRef} className="flex justify-center space-x-10 md:space-x-16">
            {[
              { icon: 'fa-linkedin', href: '#', color: 'hover:text-blue-600' },
              { icon: 'fa-x-twitter', href: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
              { icon: 'fa-github', href: '#', color: 'hover:text-purple-600' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className={`social-link text-3xl md:text-4xl text-gray-400/60 transition-all duration-300 ${social.color} hover:scale-125`}
              >
                <i className={`fa-brands ${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
