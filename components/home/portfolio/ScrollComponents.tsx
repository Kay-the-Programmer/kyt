import React from 'react';

export const CursorGlow = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    return (
        <div
            ref={ref}
            className="fixed w-[300px] h-[300px] pointer-events-none z-[60] hidden lg:block"
            style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(40px)'
            }}
        />
    );
});
CursorGlow.displayName = 'CursorGlow';

export const ScrollDirectionIndicator = () => {
    return (
        <div className="scroll-direction-indicator fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] hidden lg:flex items-center space-x-2 text-gray-400">
            <i className="fa-solid fa-arrow-right text-blue-600" />
        </div>
    );
};

export const PortfolioProgressBar = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    return (
        <div ref={ref} className="fixed bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 origin-left scale-x-0 z-[80] hidden lg:block opacity-60 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
    );
});
PortfolioProgressBar.displayName = 'PortfolioProgressBar';
