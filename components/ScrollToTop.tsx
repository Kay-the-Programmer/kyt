import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

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

export default ScrollToTop;
