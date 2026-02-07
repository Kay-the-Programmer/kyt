
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      // Threshold for "past hero section"
      if (window.pageYOffset > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      if (isVisible) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          display: 'flex',
        });
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          scale: 0.5,
          y: 20,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            if (buttonRef.current) buttonRef.current.style.display = 'none';
          }
        });
      }
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-28 right-8 md:bottom-8 md:right-28 z-[90] w-14 h-14 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-2xl transition-all hover:border-blue-500 hover:scale-110 active:scale-95 group hidden opacity-0 scale-50 translate-y-5"
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-arrow-up text-lg group-hover:-translate-y-1 transition-transform duration-300"></i>
      {/* Subtle indicator ring */}
      <div className="absolute inset-0 rounded-full border border-blue-600/10 group-hover:border-blue-600/30 transition-colors"></div>
    </button>
  );
};

export default ScrollToTopButton;
