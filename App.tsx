
import React, { useEffect, useState, useRef, useLayoutEffect, Suspense } from 'react';
import { TransitionContext } from './TransitionContext';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AiAssistant from './components/AiAssistant';
import ScrollToTopButton from './components/ScrollToTopButton';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Lazy load all page components for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Services = React.lazy(() => import('./pages/Services'));
const Contact = React.lazy(() => import('./pages/Contact'));
const SalePilotDetail = React.lazy(() => import('./pages/SalePilotDetail'));

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
const TransitionOverlay = ({ isPageTransition }: { isPageTransition: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (!isPageTransition) return;

    const panels = containerRef.current?.querySelectorAll('.transition-panel');
    if (!panels) return;

    const tl = gsap.timeline();

    // Simplified, faster transition - reduces animation overhead
    tl.set(containerRef.current, { autoAlpha: 1 })
      .fromTo(panels,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 0.2,
          stagger: 0.02,
          ease: 'power2.inOut'
        }
      )
      .to(panels, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.2,
        stagger: 0.02,
        ease: 'power2.inOut'
      })
      .set(containerRef.current, { autoAlpha: 0 });

  }, [location.pathname, isPageTransition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none invisible flex"
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="transition-panel relative flex-grow bg-blue-600 dark:bg-blue-700 h-full overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Accent line for digital feel */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10" />

          {/* Reduced data stream - only 3 elements per panel */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[8px] text-white/10 select-none">
            {[...Array(3)].map((_, j) => (
              <DataFlicker key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DataFlicker = React.memo(() => {
  const [val, setVal] = useState(() => Math.random().toString(16).substring(2, 10).toUpperCase());

  useEffect(() => {
    // Slower update rate to reduce re-renders during transitions
    const interval = setInterval(() => {
      setVal(Math.random().toString(16).substring(2, 10).toUpperCase());
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return <div className="opacity-50">{val}</div>;
});

import { useSharedMousePos, globalMousePos } from './hooks/useSharedMousePos';

const AppContent: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const [isPageTransition, setIsPageTransition] = useState(false);
  const firstPath = useRef(location.pathname);
  useSharedMousePos();

  // Track if we are in a page transition (navigation) vs initial load
  useEffect(() => {
    if (location.pathname !== firstPath.current) {
      setIsPageTransition(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const isMobile = window.innerWidth < 768;

    const updateCursor = () => {
      if (isMobile || !globalMousePos.active) return;
      gsap.to(cursor, { x: globalMousePos.x, y: globalMousePos.y, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(follower, { x: globalMousePos.x - 16, y: globalMousePos.y - 16, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
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

    gsap.ticker.add(updateCursor);
    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);



    return () => {
      gsap.ticker.remove(updateCursor);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  // UseLayoutEffect ensures we start the animation state before the browser paints the new route content
  useLayoutEffect(() => {
    // Only animate the container if it's a page transition (not initial load)
    if (mainRef.current && isPageTransition) {
      // Create a timeline to manage the fade-in of the new page
      const tl = gsap.timeline();

      tl.fromTo(mainRef.current,
        { opacity: 0, y: 15, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          delay: 0.2, // Quick sync with faster TransitionOverlay
          ease: 'expo.out',
          clearProps: 'all'
        }
      );
    }
  }, [location.pathname, isPageTransition]);

  return (
    <>
      <div className="transition-colors duration-300">
        <ScrollToTop />
        <TransitionOverlay isPageTransition={isPageTransition} />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main ref={mainRef} className="flex-grow">
            <TransitionContext.Provider value={isPageTransition}>
              <Suspense fallback={
                <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/salepilot" element={<SalePilotDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </TransitionContext.Provider>
          </main>
          <AiAssistant />
          <ScrollToTopButton />
        </div>
      </div>
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
