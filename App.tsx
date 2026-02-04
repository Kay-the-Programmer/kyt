
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AiAssistant from './components/AiAssistant';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SalePilotDetail from './pages/SalePilotDetail';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins for global use
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!hash) {
      // Basic page navigation - jump to top
      window.scrollTo(0, 0);
    } else {
      // Anchor link navigation
      const id = hash.replace('#', '');
      const element = document.getElementById(id);

      if (element) {
        // We delay the scroll to wait for the TransitionOverlay and route animations
        const delay = isFirstRender.current ? 0.1 : 0.8;

        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: element,
            offsetY: 100 // Leave space for the sticky navbar
          },
          ease: 'power4.inOut',
          delay: delay,
          overwrite: 'auto'
        });
      }
    }
    isFirstRender.current = false;
  }, [pathname, hash]);

  return null;
};

/**
 * TransitionOverlay handles the visual wipe between pages.
 */
const TransitionOverlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const tl = gsap.timeline();

    // Smooth futuristic curtain sweep that acts as the "fade out" mask
    tl.set(overlayRef.current, { xPercent: -100, autoAlpha: 1 })
      .to(overlayRef.current, {
        xPercent: 0,
        duration: 0.5,
        ease: 'power4.in'
      })
      .to(overlayRef.current, {
        xPercent: 100,
        duration: 0.5,
        ease: 'power4.out',
        delay: 0
      })
      .set(overlayRef.current, { autoAlpha: 0 });

  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-blue-600 z-[9999] pointer-events-none invisible opacity-0 flex items-center justify-center"
      style={{ willChange: 'transform' }}
    >
      <div className="w-24 h-24 border-t-2 border-white rounded-full animate-spin opacity-20"></div>
    </div>
  );
};

const Preloader = () => (
  <div id="preloader" className="fixed inset-0 bg-brand-dark z-[10000] flex flex-col items-center justify-center overflow-hidden">
    <div className="relative flex flex-col items-center">
      <div className="preloader-circle w-48 h-48 border border-blue-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="preloader-circle-inner w-32 h-32 border border-blue-500/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="preloader-text-wrap overflow-hidden h-16 flex items-center justify-center">
        <div className="preloader-text flex font-heading text-4xl md:text-5xl font-black tracking-tighter text-white">
          {"KYTRIQ".split("").map((char, i) => (
            <span key={i} className="preloader-char inline-block">{char}</span>
          ))}
        </div>
      </div>

      <div className="relative w-64 h-1.5 bg-white/5 mt-8 rounded-full overflow-hidden">
        <div className="preloader-progress h-full bg-blue-600 w-0 relative">
          <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/50 blur-sm"></div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden h-4">
        <span className="preloader-status text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 block">Initializing Systems</span>
      </div>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const isMobile = window.innerWidth < 768;

    const moveCursor = (e: MouseEvent) => {
      if (isMobile) return;
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      gsap.to(follower, { x: e.clientX - 16, y: e.clientY - 16, duration: 0.4, ease: 'power3.out' });
    };

    const handleHover = (e: MouseEvent) => {
      if (isMobile) return;
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, input, textarea, [role="button"], .magnetic-area');

      if (isHoverable) {
        gsap.to(cursor, { scale: 3, backgroundColor: 'transparent', border: '1px solid #2563eb', duration: 0.3 });
        gsap.to(follower, { scale: 0.5, opacity: 0.1, duration: 0.3 });
      } else {
        gsap.to(cursor, { scale: 1, backgroundColor: '#2563eb', border: 'none', duration: 0.3 });
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    const handleMouseDown = () => {
      if (isMobile) return;
      gsap.to(cursor, { scale: 0.8, duration: 0.2 });
      gsap.to(follower, { scale: 1.5, duration: 0.2 });
    };

    const handleMouseUp = () => {
      if (isMobile) return;
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false)
    });

    tl.set('.preloader-char', { y: 100, opacity: 0 })
      .to('.preloader-char', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out'
      })
      .to('.preloader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=0.5')
      .to('#preloader', {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.2,
        ease: 'expo.inOut'
      });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // UseLayoutEffect ensures we start the animation state before the browser paints the new route content
  useLayoutEffect(() => {
    if (!isLoading && mainRef.current) {
      // Create a timeline to manage the fade-in of the new page
      const tl = gsap.timeline();

      tl.fromTo(mainRef.current,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          delay: 0.5, // Sync with the TransitionOverlay curtain wipe (0.5s in)
          ease: 'expo.out',
          clearProps: 'all'
        }
      );
    }
  }, [location.pathname, isLoading]);

  return (
    <>
      <Preloader />
      {!isLoading && (
        <div className="transition-colors duration-300">
          <ScrollToTop />
          <TransitionOverlay />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main ref={mainRef} className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/salepilot" element={<SalePilotDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <AiAssistant />
            <ScrollToTopButton />
          </div>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
