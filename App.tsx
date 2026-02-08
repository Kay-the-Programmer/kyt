
import React, { useEffect, useState, useRef, useLayoutEffect, Suspense } from 'react';
import { TransitionContext, TransitionProvider, useTransition } from './TransitionContext';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AiAssistant from './components/AiAssistant';
import ScrollToTopButton from './components/ScrollToTopButton';
import TransitionOverlay from './components/TransitionOverlay';
import ScrollToTop from './components/ScrollToTop';
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

const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./pages/TermsConditions'));

// Register plugins for global use
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


import { useSharedMousePos, globalMousePos } from './hooks/useSharedMousePos';

const AppContent: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isPageTransition = useTransition();
  const [isAiOpen, setIsAiOpen] = useState(false);
  useSharedMousePos();

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const isMobile = window.innerWidth < 768;

    if (isMobile || !cursor || !follower) return;

    // Use quickTo for high-frequency updates
    const cursorXTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: 'power2.out' });
    const cursorYTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: 'power2.out' });
    const followerXTo = gsap.quickTo(follower, "x", { duration: 0.4, ease: 'power3.out' });
    const followerYTo = gsap.quickTo(follower, "y", { duration: 0.4, ease: 'power3.out' });

    const updateCursor = () => {
      if (!globalMousePos.active) return;
      cursorXTo(globalMousePos.x);
      cursorYTo(globalMousePos.y);
      followerXTo(globalMousePos.x - 16);
      followerYTo(globalMousePos.y - 16);
    };

    // Use a simpler throttled hover check to avoid deep closest() calls on every move
    let lastHoverCheck = 0;
    const handleHover = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return; // Limit to 20fps check
      lastHoverCheck = now;

      const target = e.target as HTMLElement;
      if (!target) return;

      const isHoverable = target.closest('a, button, input, textarea, [role="button"], .magnetic-area');

      if (isHoverable) {
        gsap.to(cursor, { scale: 3, backgroundColor: 'transparent', border: '1px solid #2563eb', duration: 0.3, overwrite: 'auto' });
        gsap.to(follower, { scale: 0.5, opacity: 0.1, duration: 0.3, overwrite: 'auto' });
      } else {
        gsap.to(cursor, { scale: 1, backgroundColor: '#2563eb', border: 'none', duration: 0.3, overwrite: 'auto' });
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3, overwrite: 'auto' });
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.2, overwrite: 'auto' });
      gsap.to(follower, { scale: 1.5, duration: 0.2, overwrite: 'auto' });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: 'auto' });
      gsap.to(follower, { scale: 1, duration: 0.2, overwrite: 'auto' });
    };

    gsap.ticker.add(updateCursor);
    window.addEventListener('mouseover', handleHover, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

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
        <TransitionOverlay />
        <div className="flex flex-col min-h-screen">
          <Navbar onAiToggle={() => setIsAiOpen(!isAiOpen)} isAiOpen={isAiOpen} />
          <main ref={mainRef} className="flex-grow">
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
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
              </Routes>
            </Suspense>
          </main>
          <AiAssistant isOpen={isAiOpen} onToggle={() => setIsAiOpen(false)} />
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <TransitionProvider>
        <AppContent />
      </TransitionProvider>
    </Router>
  );
};

export default App;
