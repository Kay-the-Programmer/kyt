import React from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../../SplitText';

const ImpactPanel = () => {
    return (
        <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 bg-gray-950 relative overflow-hidden shrink-0 z-[4] shadow-[-50px_0_100px_rgba(0,0,0,0.5)] will-change-transform">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-blue-600/10 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="relative z-10 text-center text-white max-w-5xl px-6">
                <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] font-heading font-bold mb-10 sm:mb-16 tracking-tighter leading-[0.85]">
                    <SplitText text="Let's Build" className="block" />
                    <SplitText text="Your Idea" isGradient={true} className="block" />
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-14 reveal-target">
                    <Link to="/contact" className="magnetic-area group px-10 sm:px-16 py-6 sm:py-8 bg-blue-600 text-white rounded-full font-black text-xl sm:text-2xl hover:bg-blue-700 transition-all duration-500 shadow-3xl shadow-blue-600/30 active:scale-95 hover:scale-105 hover:shadow-blue-600/50">Contact us</Link>
                    <Link to="/services" className="text-lg font-bold tracking-widest uppercase border-b-2 border-white/20 hover:border-blue-600 pb-2 transition-all group">View Services <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-3 transition-transform duration-500"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default ImpactPanel;
