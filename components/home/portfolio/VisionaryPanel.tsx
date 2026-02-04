import React from 'react';
import SplitText from '../../SplitText';

const VisionaryPanel = () => {
    return (
        <div className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-24 relative overflow-hidden shrink-0 z-[3] will-change-transform">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[45vw] font-black text-blue-600/[0.02] dark:text-white/[0.01] tracking-tighter leading-none pointer-events-none uppercase animate-pulse">Kytriq</span>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl">
                <div className="text-left">
                    <h2 className="text-7xl md:text-9xl font-heading font-black text-gray-900 dark:text-white mb-12 tracking-tighter leading-[0.85]">
                        <SplitText text="Visionary" className="block" />
                        <span className="gradient-text"><SplitText text="Engineering." /></span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 max-w-lg reveal-target">
                        We don't just build applications. We architect digital organisms that adapt, learn, and grow alongside your evolving business mission.
                    </p>
                </div>
                <div className="relative hidden lg:block reveal-target">
                    <div className="w-[550px] h-[550px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[5rem] rotate-6 relative overflow-hidden group shadow-2xl hover:rotate-3 hover:scale-105 transition-all duration-700 shadow-blue-600/20">
                        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 -rotate-6" alt="The Workshop" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionaryPanel;
