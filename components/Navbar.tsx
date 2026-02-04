
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      // Initial Entrance for Desktop - Using .from() for safety
      gsap.from('.nav-item', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 1.5 // Synced with Hero Entrance (starts after preloader + small gap)
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Initial sync of theme state
    const currentIsDark = document.documentElement.classList.contains('dark');
    setIsDark(currentIsDark);

    // Magnetic interaction
    const magnets = document.querySelectorAll('.magnetic-area');
    magnets.forEach((magnet) => {
      const m = magnet as HTMLElement;
      if (window.innerWidth < 1024) return;

      const xTo = gsap.quickTo(m, "x", { duration: 0.3, ease: "power3" }),
        yTo = gsap.quickTo(m, "y", { duration: 0.3, ease: "power3" });

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
    });
  }, []);

  const toggleTheme = () => {
    const newThemeIsDark = !isDark;
    if (themeBtnRef.current) {
      gsap.to(themeBtnRef.current, {
        rotate: '+=180',
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsDark(newThemeIsDark);
          if (newThemeIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
          gsap.to(themeBtnRef.current, { scale: 1, duration: 0.3, ease: 'back.out' });
        }
      });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-nav transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group magnetic-area nav-item">
          <img
            src={logo}
            alt="Kytriq Logo"
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
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400 w-12 h-12 flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            className="text-gray-500 dark:text-gray-400 w-12 h-12 flex items-center justify-center relative z-50 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 p-8 flex flex-col space-y-6 shadow-2xl transition-all duration-300 ease-out ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
          }`}
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
          display: isOpen ? 'flex' : 'none'
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`mobile-nav-item text-2xl font-heading font-bold transition-all ${isActive(link.path) ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            {link.name}
          </Link>
        ))}
        <div className="mobile-nav-item pt-4">
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
