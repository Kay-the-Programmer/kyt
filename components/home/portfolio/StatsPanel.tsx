import React, { ForwardedRef } from 'react';
import SplitText from '../../SplitText';

interface StatsPanelProps {
    gridLayer1Ref: React.RefObject<HTMLDivElement>;
    gridLayer2Ref: React.RefObject<HTMLDivElement>;
    gridLayer3Ref: React.RefObject<HTMLDivElement>;
    glowRef: React.RefObject<HTMLDivElement>;
    vignetteRef: React.RefObject<HTMLDivElement>;
}

const StatsPanel = React.forwardRef<HTMLDivElement, StatsPanelProps>(({
    gridLayer1Ref,
    gridLayer2Ref,
    gridLayer3Ref,
    glowRef,
    vignetteRef
}, ref) => {
    return (
        <div ref={ref} className="horizontal-panel w-full lg:w-screen min-h-screen lg:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white dark:bg-gray-950 overflow-visible lg:overflow-hidden relative shrink-0 z-[2] will-change-transform">
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '3000px' }}>
                <div ref={gridLayer3Ref} className="absolute inset-[-20%] opacity-[0.01] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#2563eb 2px, transparent 2px), linear-gradient(90deg, #2563eb 2px, transparent 2px)', backgroundSize: '240px 240px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
                <div ref={gridLayer2Ref} className="absolute inset-[-15%] opacity-[0.02] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '120px 120px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
                <div ref={gridLayer1Ref} className="absolute inset-[-10%] opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#2563eb 0.5px, transparent 0.5px), linear-gradient(90deg, #2563eb 0.5px, transparent 0.5px)', backgroundSize: '60px 60px', transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}></div>
                <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(147,51,234,0.1) 30%, transparent 70%)', transition: 'all 0.3s' }}></div>
                <div ref={vignetteRef} className="absolute inset-[-10%] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(3,7,18,0.5) 100%)' }}></div>
            </div>
            <div className="max-w-7xl w-full text-center relative z-10 stats-container">
                <div className="flex flex-col items-center justify-center mb-16 md:mb-24">
                    <div className="w-14 h-px bg-blue-600 mb-8"></div>
                    <h2 className="text-5xl md:text-7xl lg:text-[8.5rem] font-heading font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                        <SplitText text="Architecting" className="inline-block" /> <br />
                        <span className="text-blue-600 inline-block"><SplitText text="Absolute Trust." /></span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-8">
                    {[
                        { label: 'Security', value: 'Zero-Trust', icon: 'fa-fingerprint', desc: 'Enterprise-grade encryption for every single transaction.' },
                        { label: 'Latency', value: '0.04s', icon: 'fa-gauge-high', desc: 'Edge-optimized processing for high-frequency retail environments.' },
                        { label: 'Integration', value: 'Omni-Sync', icon: 'fa-network-wired', desc: 'Fluid data exchange across hardware, cloud, and local hubs.' }
                    ].map((stat, i) => (
                        <div key={i} className="reveal-target group relative p-10 md:p-14 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-[4rem] transition-all duration-700 hover:bg-white dark:hover:bg-white/[0.03] hover:shadow-3xl hover:shadow-blue-600/5 z-20 active:scale-95 touch-none hover:-translate-y-2">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-10 mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-600/20">
                                <i className={`fa-solid ${stat.icon} text-3xl`}></i>
                            </div>
                            <div className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter font-heading">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">{stat.label}</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;
