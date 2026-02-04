import React from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../SplitText';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section relative z-10 min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
      <div className="hero-section-content max-w-[95rem] w-full text-center">
        <div className="hero-badge inline-flex items-center space-x-2 px-6 py-2 bg-white/5 dark:bg-blue-500/5 border border-gray-200/50 dark:border-blue-500/10 rounded-full mb-8 md:mb-12 mx-auto backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">KYTRIQ TECHNOLOGIES</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-heading font-extrabold tracking-tighter leading-[0.95] text-gray-900 dark:text-white select-none overflow-visible flex flex-col items-center">
          <SplitText text="Bringing Digital Ideas" className="block mb-2 md:mb-4" />
          <SplitText text="To Life." className="block" isGradient={true} />
        </h1>
        
        <p className="hero-desc text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-500 max-w-3xl mx-auto mt-8 md:mt-12 lg:mt-16 font-light leading-relaxed tracking-tight">
          Engineering high-performance digital organisms. <br className="hidden md:block" /> Creating visionary architectures with absolute precision.
        </p>
        
        <div className="hero-btns mt-10 md:mt-12 lg:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-12">
          <Link to="/contact" className="magnetic-area group relative overflow-hidden inline-block w-full sm:w-auto px-10 md:px-16 py-4 md:py-5 bg-blue-600 text-white rounded-full font-bold transition-all duration-700 text-center shadow-xl shadow-blue-500/20">
            <span className="relative z-10 text-lg">Initiate Inquiry</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </Link>
          <a href="#who-we-are" className="group flex items-center space-x-4 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-white transition-all duration-500">
            <span className="font-black tracking-[0.3em] text-[10px] uppercase">The Vision</span>
            <div className="w-10 h-10 md:w-12 md:h-12 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-500 transition-all">
              <i className="fa-solid fa-arrow-down-long group-hover:translate-y-1 transition-transform"></i>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;