
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuTl = useRef<gsap.core.Timeline | null>(null);

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
      // Setup Mobile Menu
      mobileMenuTl.current = gsap.timeline({ paused: true })
        .fromTo(mobileMenuRef.current,
          {
            autoAlpha: 0,
            y: -20,
            clipPath: 'inset(0% 0% 100% 0%)'
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.6,
            ease: 'expo.out'
          }
        )
        .from('.mobile-nav-item', {
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power3.out'
        }, "-=0.4");

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
    if (isOpen) {
      mobileMenuTl.current?.play();
    } else {
      mobileMenuTl.current?.reverse();
    }
  }, [isOpen]);

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
          <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 w-10 h-10 flex items-center justify-center">
            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
          </button>
          <button
            className="text-gray-500 dark:text-gray-400 w-10 h-10 flex items-center justify-center relative z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 p-8 flex flex-col space-y-6 shadow-2xl"
        style={{ pointerEvents: isOpen ? 'auto' : 'none', visibility: 'hidden', opacity: 0 }}
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
