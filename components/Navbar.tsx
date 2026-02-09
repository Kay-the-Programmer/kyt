
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

import logo from '../assets/logo.png';

interface NavbarProps {
  onAiToggle: () => void;
  isAiOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAiToggle, isAiOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Dock refs for macOS-style animation
  const dockRef = useRef<HTMLUListElement>(null);
  const dockItemsRef = useRef<HTMLLIElement[]>([]);

  // Memoized nav links with dock items
  const navLinks = useMemo(() => [
    {
      name: 'Home',
      path: '/',
      icon: (
        <img
          src={logo}
          alt="Home"
          className="w-full h-full object-contain"
          width="40"
          height="40"
        />
      ),
      gradient: 'from-gray-50 to-white dark:from-gray-800 dark:to-gray-900',
      isLogo: true
    },
    {
      name: 'About',
      path: '/about',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      name: 'Services',
      path: '/services',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-amber-400 to-orange-600'
    },
  ], []);

  // Dock action items
  const dockActions = useMemo(() => [
    {
      name: 'Kytriq AI',
      onClick: onAiToggle,
      icon: <i className={`fa-solid ${isAiOpen ? 'fa-xmark' : 'fa-robot'} text-lg`}></i>,
      gradient: isAiOpen ? 'from-pink-500 to-rose-600' : 'from-blue-500 to-indigo-600',
      isAction: true,
      active: isAiOpen
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/+260570135415',
      icon: <i className="fa-brands fa-whatsapp text-lg"></i>,
      gradient: 'from-green-400 to-emerald-600',
      external: true
    },
    {
      name: 'Call',
      href: 'tel:+260570135415',
      icon: <i className="fa-solid fa-phone text-sm"></i>,
      gradient: 'from-cyan-400 to-blue-600',
      external: false
    },
  ], [onAiToggle, isAiOpen]);

  // macOS Dock animation constants
  const DOCK_CONFIG = useMemo(() => ({
    minSize: 48,
    maxSize: 84,
    bound: 48 * Math.PI,
    duration: 0.2
  }), []);

  // Dock magnification effect with smooth easing - refined using actual offsetLeft
  const updateDockIcons = useCallback((pointer: number) => {
    const items = dockItemsRef.current;
    const { minSize, maxSize, bound, duration } = DOCK_CONFIG;

    items.forEach((item) => {
      if (!item) return;

      const itemCenterX = item.offsetLeft + item.offsetWidth / 2;
      const distance = itemCenterX - pointer;
      let x = 0;
      let scale = 1;

      if (-bound < distance && distance < bound) {
        const rad = Math.PI * (distance / bound) * 0.5;
        scale = 1 + (maxSize / minSize - 1) * Math.cos(rad);
        x = 2.0 * (maxSize - minSize) * Math.sin(rad);
      } else {
        x = (distance > 0 ? 1 : -1) * (maxSize - minSize);
      }

      gsap.to(item, {
        duration,
        x,
        scale,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  }, [DOCK_CONFIG]);

  const resetDockIcons = useCallback(() => {
    dockItemsRef.current.forEach((item) => {
      if (!item) return;
      gsap.to(item, {
        duration: 0.4,
        scale: 1,
        x: 0,
        ease: 'elastic.out(1, 0.75)',
        overwrite: 'auto'
      });
    });
  }, []);

  // Set up dock event listeners
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Magnification only on desktop
    if (window.innerWidth < 768) return;

    const firstItem = dockItemsRef.current[0];
    if (!firstItem) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = dock.getBoundingClientRect();
      const pointer = event.clientX - rect.left - (firstItem.offsetLeft || 0);
      updateDockIcons(pointer);
    };

    const handleMouseLeave = () => {
      resetDockIcons();
    };

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup with refined transform origin
    gsap.set(dockItemsRef.current.filter(Boolean), {
      transformOrigin: '50% 100%',
      height: DOCK_CONFIG.minSize
    });

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateDockIcons, resetDockIcons, DOCK_CONFIG.minSize]);

  // Hide dock on scroll (optional for cleaner experience)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
            setIsVisible(false);
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
  }, []);

  // Animate dock visibility
  useEffect(() => {
    const container = dockRef.current?.parentElement;
    if (container) {
      gsap.to(container, {
        y: isVisible ? 0 : 120,
        opacity: isVisible ? 1 : 0,
        duration: 0.5,
        ease: 'power4.out'
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    setIsDark(currentIsDark);
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
        height: '100dvh',
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
          if (menu) gsap.set(menu, { display: 'none', visibility: 'hidden' });
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
    } else {
      setIsDark(newThemeIsDark);
      document.documentElement.classList.toggle('dark', newThemeIsDark);
      localStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Helper to set dock item refs
  const setDockItemRef = (el: HTMLLIElement | null, index: number) => {
    if (el) dockItemsRef.current[index] = el;
  };

  return (
    <>
      {/* Unified Floating Dock - Desktop & Tablet */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all flex items-end justify-center pointer-events-none w-auto">
        <ul
          ref={dockRef}
          className="dock-container flex items-end gap-3 px-4 py-3 rounded-[2.5rem] bg-white/30 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/40 dark:border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] pointer-events-auto transition-colors duration-500"
          style={{
            height: '74px',
          }}
        >
          {/* Navigation Links including Logo */}
          {navLinks.map((link, index) => (
            <li
              key={link.name}
              ref={(el) => setDockItemRef(el, index)}
              className="dock-item relative"
              style={{ width: '48px', height: '48px' }}
            >
              <Link
                to={link.path}
                className={`dock-link group relative flex items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${isActive(link.path)
                  ? `bg-gradient-to-br ${link.gradient} shadow-lg ring-2 ring-white/20`
                  : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white/90 dark:hover:bg-gray-700/80'
                  } ${link.isLogo ? 'overflow-hidden p-1.5' : ''}`}
                aria-label={link.name}
              >
                <span className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 group-active:scale-90 ${isActive(link.path) && !link.isLogo ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {link.icon}
                </span>

                {/* Tooltip */}
                <span className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-md text-white text-[0.8rem] font-semibold whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
                  {link.name}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/90 dark:border-t-gray-800/95"></span>
                </span>

                {/* Active Indicator dot inside dock */}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                )}
              </Link>
            </li>
          ))}

          {/* Separator - Sophisticated Vertical Line */}
          <li className="w-[1.5px] h-10 bg-gradient-to-b from-transparent via-gray-400/40 dark:via-gray-600/40 to-transparent mx-1 self-center rounded-full shrink-0"></li>

          {/* Action Items */}
          {dockActions.map((action, index) => (
            <li
              key={action.name}
              ref={(el) => setDockItemRef(el, navLinks.length + index)}
              className="dock-item relative"
              style={{ width: '48px', height: '48px' }}
            >
              {action.isAction ? (
                <button
                  onClick={action.onClick}
                  className={`dock-link group relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group-active:scale-95`}
                  aria-label={action.name}
                >
                  {action.icon}
                  {/* Tooltip */}
                  <span className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-md text-white text-[0.8rem] font-semibold whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
                    {action.name}
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/90 dark:border-t-gray-800/95"></span>
                  </span>
                </button>
              ) : (
                <a
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                  className={`dock-link group relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group-active:scale-95`}
                  aria-label={action.name}
                >
                  {action.icon}

                  {/* Tooltip */}
                  <span className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-md text-white text-[0.8rem] font-semibold whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
                    {action.name}
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/90 dark:border-t-gray-800/95"></span>
                  </span>
                </a>
              )}
            </li>
          ))}

          {/* Theme Toggle */}
          <li
            ref={(el) => setDockItemRef(el, navLinks.length + dockActions.length)}
            className="dock-item relative"
            style={{ width: '48px', height: '48px' }}
          >
            <button
              ref={themeBtnRef}
              onClick={toggleTheme}
              className="dock-link group relative flex items-center justify-center w-full h-full rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/95 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-lg transition-transform duration-500 group-hover:rotate-12`}></i>

              {/* Tooltip */}
              <span className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-md text-white text-[0.8rem] font-semibold whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
                {isDark ? 'Light Mode' : 'Dark Mode'}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/90 dark:border-t-gray-800/95"></span>
              </span>
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile-only subtle Logo indicator at top left? No, let's keep it purely in dock for minimalism */}

      {/* Visual background cleanup for dock positioning */}
      <style>{`
        .dock-container {
          transition: background-color 0.5s ease;
        }
        @media (max-width: 767px) {
          .dock-container {
            width: calc(100vw - 32px);
            justify-content: space-between;
            overflow-x: auto;
            scrollbar-width: none;
            border-radius: 2rem;
          }
          .dock-container::-webkit-scrollbar {
            display: none;
          }
          .dock-item {
            flex-shrink: 0;
          }
        }
      `}</style>

      {/* Mobile Toggle (remains at top right for mobile menu) */}
      <div className="fixed top-0 right-0 p-4 z-[60] md:hidden">
        <div className="flex items-center space-x-3">
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
        className="md:hidden fixed inset-x-0 top-0 h-[100dvh] flex flex-col z-[999] bg-white dark:bg-gray-950 overflow-hidden"
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

        {/* Main Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-y-auto relative z-10 pt-4 pb-10">
          {/* Menu Links */}
          <div className="flex-1 flex flex-col justify-center px-8 mb-8">
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
                  <span className={`flex items-center justify-center w-10 h-10 p-2 rounded-xl bg-gradient-to-br ${link.gradient} text-white`} aria-hidden="true">{link.icon}</span>
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
          <div className="mobile-contact-section px-8">

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

          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
