
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { useSEO } from '../hooks/useSEO';

const Contact: React.FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Contact Us | Kytriq Technologies',
    description: 'Get in touch with Kytriq Technologies. Reach out to us via email, phone, or WhatsApp.',
    keywords: 'contact Kytriq, software inquiry, AI consultation, Kytriq phone, Kytriq email',
  });

  const headerRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const chars = headerRef.current.querySelectorAll('.letter-reveal');
      gsap.set(chars, { y: 100, opacity: 0, rotate: 10 });
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1,
        stagger: 0.03,
        delay: 1.2,
        ease: 'power4.out'
      });
    }

    gsap.set(infoRef.current, { opacity: 0, y: 40 });
    gsap.to(infoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 1.4,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden relative">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/5 rounded-full blur-[80px] animate-pulse [animation-delay:2s]"></div>

      <div className="max-w-7xl mx-auto relative z-10 mb-20 px-6 text-center">
        <header className="mb-16 md:mb-20">
          <h1 ref={headerRef} className="text-5xl md:text-[6rem] font-heading font-extrabold mb-6 md:mb-8 tracking-tighter text-gray-900 dark:text-white leading-none">
            <SplitText text="Let's " /> <SplitText text="Talk." isGradient={true} className="inline-block" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have a specific project in mind or just want to explore how AI can help your business, we're here to help. Reach out through any of our channels.
          </p>
        </header>

        <div ref={infoRef} className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-sm backdrop-blur-sm">
          <div className="space-y-10 md:space-y-12">
            <div>
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">Contact Details</h3>
              <div className="space-y-6 text-left">
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-location-dot text-sm"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-blue-600 transition-colors">Lusaka, Zambia</p>
                </div>
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-envelope text-sm"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-blue-600 transition-colors">info@kytriq.com</p>
                </div>
                <a href="tel:+260570135415" className="flex items-center space-x-4 group cursor-pointer text-left">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-blue-600 transition-colors">+260 570 135 415</p>
                </a>
                <a href="https://wa.me/260570135415" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group cursor-pointer text-left">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-green-600 dark:text-green-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-green-600 transition-colors">Chat on WhatsApp</p>
                </a>
              </div>
            </div>

            <div className="flex justify-center space-x-6 pt-12 border-t border-gray-100 dark:border-gray-800">
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
