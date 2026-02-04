import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="reveal-on-scroll py-32 md:py-64 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-7xl font-heading font-bold mb-12 text-gray-900 dark:text-white tracking-tighter">
          Ready to <span className="gradient-text">Evolve?</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light mb-16 leading-relaxed">
          The future belongs to those who build it. Let's collaborate to create something that defines your industry.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-10">
          <Link to="/services" className="w-full sm:w-auto px-12 py-5 border border-gray-200 dark:border-gray-800 rounded-full font-bold text-gray-900 dark:text-white hover:border-blue-600 transition-colors">
            Explore Services
          </Link>
          <Link to="/projects" className="w-full sm:w-auto px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:scale-105 transition-transform">
            View Our Work
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;