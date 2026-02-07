
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Memoized nav links to prevent re-renders
  const navLinks = useMemo(() => [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'About', path: '/about', icon: '👤' },
    { name: 'Projects', path: '/projects', icon: '🚀' },
    { name: 'Services', path: '/services', icon: '⚡' },
  ], []);

  // Optimized scroll handler with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
            if (isOpen) setIsOpen(false);
          } else {
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0,
      duration: 0.4,
      ease: 'power3.out'
    });
  }, [isVisible]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 1.5
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    setIsDark(currentIsDark);

    // Only set up magnetic effects on desktop
    if (window.innerWidth < 1024) return;

    const magnets = document.querySelectorAll('.magnetic-area');
    const cleanups: (() => void)[] = [];

    magnets.forEach((magnet) => {
      const m = magnet as HTMLElement;
      const xTo = gsap.quickTo(m, "x", { duration: 0.3, ease: "power3" });
      const yTo = gsap.quickTo(m, "y", { duration: 0.3, ease: "power3" });

      const handleMove = (e: MouseEvent) => {
        const { left, top, width, height } = m.getBoundingClientRect();
        const x = e.clientX - (left + width / 2);
        const y = e.clientY - (top + height / 2);
        xTo(x * 0.35);
        yTo(y * 0.35);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      m.addEventListener("mousemove", handleMove);
      m.addEventListener("mouseleave", handleLeave);

      cleanups.push(() => {
        m.removeEventListener("mousemove", handleMove);
        m.removeEventListener("mouseleave", handleLeave);
      });
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, []);

  // Performance-optimized Mobile Menu Animation
  const animateMobileMenu = useCallback((open: boolean) => {
    const menu = mobileMenuRef.current;
    const hamburger = hamburgerRef.current;
    if (!menu) return;

    // Kill existing animations
    menuTimelineRef.current?.kill();

    // Cache DOM queries once
    const menuItems = menu.querySelectorAll('.mobile-nav-link');
    const contactSection = menu.querySelector('.mobile-contact-section');
    const hamburgerLines = hamburger?.querySelectorAll('.hamburger-line');

    if (open) {
      // Prepare for animation
      gsap.set(menu, {
        display: 'flex',
        visibility: 'visible',
        opacity: 0,
        top: 0,
        height: '100vh',
        zIndex: 999
      });
      gsap.set([menuItems, contactSection], { willChange: 'transform, opacity' });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          gsap.set([menuItems, contactSection], { willChange: 'auto' });
        }
      });

      // Fade in menu container (solid background)
      tl.to(menu, { opacity: 1, duration: 0.25 });

      // Menu items stagger in
      tl.fromTo(menuItems,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
        '-=0.1'
      );

      // Contact section
      tl.fromTo(contactSection,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        '-=0.25'
      );

      menuTimelineRef.current = tl;

      // Animate hamburger to X
      if (hamburgerLines) {
        gsap.to(hamburgerLines[0], { rotation: 45, y: 8, duration: 0.25 });
        gsap.to(hamburgerLines[1], { opacity: 0, duration: 0.15 });
        gsap.to(hamburgerLines[2], { rotation: -45, y: -8, duration: 0.25 });
      }
    } else {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: () => {
          gsap.set(menu, { display: 'none', visibility: 'hidden' });
        }
      });

      // Fast unified fade out
      tl.to([menuItems, contactSection], {
        opacity: 0,
        y: -15,
        duration: 0.2,
        stagger: 0.02
      });

      // Fade out menu container
      tl.to(menu, {
        opacity: 0,
        duration: 0.15
      }, '-=0.1');

      menuTimelineRef.current = tl;

      // Animate hamburger back
      if (hamburgerLines) {
        gsap.to(hamburgerLines[0], { rotation: 0, y: 0, duration: 0.25 });
        gsap.to(hamburgerLines[1], { opacity: 1, duration: 0.15, delay: 0.1 });
        gsap.to(hamburgerLines[2], { rotation: 0, y: 0, duration: 0.25 });
      }
    }
  }, []);

  useEffect(() => {
    animateMobileMenu(isOpen);
  }, [isOpen, animateMobileMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleTheme = useCallback(() => {
    const newThemeIsDark = !isDark;
    const btn = themeBtnRef.current;
    if (btn) {
      gsap.to(btn, {
        rotate: '+=180',
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsDark(newThemeIsDark);
          document.documentElement.classList.toggle('dark', newThemeIsDark);
          localStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light');
          gsap.to(btn, { scale: 1, duration: 0.3, ease: 'back.out' });
        }
      });
    }
  }, [isDark]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-nav transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group magnetic-area nav-item relative z-[60]">
          <img
            src={logo}
            alt="Kytriq Logo"
            width="112"
            height="48"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-item text-sm font-medium tracking-wide transition-colors ${isActive(link.path) ? 'text-blue-600 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Contact Icons - Desktop */}
          <span className="nav-item flex items-center space-x-2 mr-2">
            <a
              href="https://wa.me/+260570135415"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-area w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-green-500 hover:text-green-500 transition-all"
              aria-label="Contact via WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
            <a
              href="tel:+260570135415"
              className="magnetic-area w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all"
              aria-label="Call Us"
            >
              <i className="fa-solid fa-phone text-sm"></i>
            </a>
          </span>

          <span className="nav-item">
            <button
              ref={themeBtnRef}
              onClick={toggleTheme}
              className="magnetic-area w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all"
              aria-label="Toggle Theme"
            >
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </span>
          <span className="nav-item">
            <Link
              to="/contact"
              className="magnetic-area bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 block"
            >
              Get Started
            </Link>
          </span>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-3 md:hidden relative z-[60]">
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 w-11 h-11 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            ref={hamburgerRef}
            className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm"
            onClick={handleMenuToggle}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className="hamburger-line block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 origin-center"></span>
            <span className="hamburger-line block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 origin-center"></span>
            <span className="hamburger-line block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 origin-center"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Opaque Overlay */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed inset-x-0 top-0 h-screen flex flex-col z-[999] bg-white dark:bg-gray-950 overflow-hidden"
        style={{ display: 'none', visibility: 'hidden' }}
      >
        {/* Solid Background decorations - Fully Opaque Mesh */}
        <div className="menu-bg-overlay absolute inset-0 pointer-events-none">
          {/* Base Mesh Gradients - Increased Opacity */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/80 via-white to-purple-100/80 dark:from-blue-900 via-gray-950 to-purple-900"></div>

          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/20 dark:bg-blue-600/30 blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 dark:bg-purple-600/30 blur-[100px]"></div>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-400/10 dark:bg-pink-600/15 blur-[80px]"></div>

          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        {/* Header Area in Full Screen - Opaque Logo & Close */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0 relative z-20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50">
          <Link to="/" onClick={handleLinkClick} className="flex items-center">
            <img src={logo} alt="Kytriq Logo" width="112" height="48" className="h-10 w-auto object-contain" />
          </Link>
          <button
            onClick={handleMenuToggle}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Menu Content Area */}
        <div className="flex-1 flex flex-col justify-center px-8 relative z-10 overflow-y-auto">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleLinkClick}
                className={`mobile-nav-link flex items-center gap-4 py-5 px-6 rounded-2xl backdrop-blur-sm transition-colors ${isActive(link.path)
                  ? 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10'
                  : 'text-gray-800 dark:text-gray-100 bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
              >
                <span className="text-2xl" role="img" aria-hidden="true">{link.icon}</span>
                <span className="text-xl font-heading font-bold tracking-tight">{link.name}</span>
                {isActive(link.path) && (
                  <span className="ml-auto w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mobile-contact-section px-8 pb-10 relative z-10">
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400/30 dark:via-gray-600/30 to-transparent mb-6"></div>

          {/* Contact Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://wa.me/+260570135415"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 active:scale-95 transition-transform"
              aria-label="Contact via WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
            <a
              href="tel:+260570135415"
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
              aria-label="Call Us"
            >
              <i className="fa-solid fa-phone text-xl"></i>
            </a>
            <a
              href="mailto:hello@kytriq.com"
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 active:scale-95 transition-transform"
              aria-label="Email Us"
            >
              <i className="fa-solid fa-envelope text-xl"></i>
            </a>
          </div>

          {/* CTA Button */}
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="mobile-cta-button block w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-transform"
          >
            <span className="flex items-center justify-center gap-2">
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

