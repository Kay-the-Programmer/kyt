import React, { memo, useEffect, useRef } from 'react';

/**
 * Lightweight, animated SVG replacement for the former Three.js `ServiceScene3D`.
 *
 * Renders three brand-styled scenes that clearly represent each service:
 *   - Web & Desktop  -> a desktop monitor showing a website layout
 *   - Mobile         -> a phone running an app UI (stats, chart, nav)
 *   - AI             -> an animated neural network with flowing signals
 *
 * Cross-fades between them based on `activeIndex`, preserving the carousel
 * behaviour of the old WebGL component without shipping three / @react-three/*
 * (~600KB+). All motion is pure CSS (GPU-friendly), pauses when off-screen
 * (`isVisible`), and honours `prefers-reduced-motion`.
 */

interface ServiceSceneSVGProps {
    activeIndex: number;
    isMobile?: boolean;
    isVisible?: boolean;
}

const SVG_PROPS = {
    viewBox: '0 0 400 400',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '100%',
    height: '100%',
    'aria-hidden': true as const,
    style: { display: 'block', overflow: 'visible' as const },
};

/* ----------------------------- Scene 1: Web & Desktop ----------------------------- */
const WebScene = memo(() => (
    <svg {...SVG_PROPS}>
        <defs>
            <linearGradient id="ksvg-mon-frame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="ksvg-web-screen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#152347" />
                <stop offset="100%" stopColor="#0a1020" />
            </linearGradient>
            <linearGradient id="ksvg-web-btn" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="ksvg-web-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>

        <g className="ksvg-float">
            <ellipse cx="200" cy="332" rx="150" ry="18" fill="#3b82f6" opacity="0.12" />

            {/* monitor stand */}
            <rect x="190" y="286" width="20" height="20" fill="#1e293b" />
            <rect x="158" y="304" width="84" height="10" rx="5" fill="#334155" />

            {/* monitor body + screen */}
            <rect x="44" y="62" width="312" height="216" rx="16" fill="url(#ksvg-mon-frame)" stroke="#475569" strokeWidth="1.5" />
            <rect x="56" y="74" width="288" height="192" rx="9" fill="url(#ksvg-web-screen)" />

            {/* browser chrome */}
            <path d="M56 83 a9 9 0 0 1 9 -9 h270 a9 9 0 0 1 9 9 v17 h-288 z" fill="#0b1220" />
            <circle cx="72" cy="89" r="3.5" fill="#ef4444" />
            <circle cx="84" cy="89" r="3.5" fill="#eab308" />
            <circle cx="96" cy="89" r="3.5" fill="#22c55e" />
            <rect x="120" y="84" width="150" height="11" rx="5.5" fill="#1e293b" />
            <rect x="128" y="87" width="46" height="5" rx="2.5" fill="#475569" />

            {/* sidebar */}
            <rect x="68" y="112" width="44" height="142" rx="7" fill="#13203c" />
            <circle cx="80" cy="126" r="5" fill="#3b82f6" />
            <rect x="90" y="123" width="16" height="5" rx="2.5" fill="#3b82f6" />
            <rect x="78" y="142" width="28" height="5" rx="2.5" fill="#334155" />
            <rect x="78" y="156" width="24" height="5" rx="2.5" fill="#334155" />
            <rect x="78" y="170" width="28" height="5" rx="2.5" fill="#334155" />
            <rect x="78" y="184" width="20" height="5" rx="2.5" fill="#334155" />

            {/* hero content */}
            <g filter="url(#ksvg-web-glow)">
                <rect className="ksvg-line ksvg-line-1" x="126" y="116" height="13" rx="6" fill="#60a5fa" />
            </g>
            <rect className="ksvg-line ksvg-line-2" x="126" y="138" height="7" rx="3.5" fill="#475569" />
            <rect className="ksvg-line ksvg-line-3" x="126" y="150" height="7" rx="3.5" fill="#475569" />
            {/* CTA button + cursor */}
            <rect x="126" y="166" width="60" height="18" rx="9" fill="url(#ksvg-web-btn)" />
            <rect x="135" y="172" width="34" height="6" rx="3" fill="#ffffff" opacity="0.85" />
            <g className="ksvg-cursor">
                <path d="M168 178 l0 16 l4 -4 l3 7 l3 -1.5 l-3 -7 l6 0 z" fill="#ffffff" stroke="#0b1220" strokeWidth="1" />
            </g>

            {/* card row */}
            <rect className="ksvg-card ksvg-card-a" x="126" y="200" width="62" height="44" rx="8" fill="#13203c" />
            <rect className="ksvg-card ksvg-card-b" x="196" y="200" width="62" height="44" rx="8" fill="#13203c" />
            <rect className="ksvg-card ksvg-card-c" x="266" y="200" width="62" height="44" rx="8" fill="#13203c" />
            <circle cx="138" cy="214" r="5" fill="#3b82f6" />
            <circle cx="208" cy="214" r="5" fill="#22d3ee" />
            <circle cx="278" cy="214" r="5" fill="#a78bfa" />
            <rect x="132" y="228" width="40" height="5" rx="2.5" fill="#334155" />
            <rect x="202" y="228" width="40" height="5" rx="2.5" fill="#334155" />
            <rect x="272" y="228" width="40" height="5" rx="2.5" fill="#334155" />

            {/* floating companion window (responsive) */}
            <g className="ksvg-dot-b" filter="url(#ksvg-web-glow)">
                <rect x="296" y="150" width="78" height="104" rx="12" fill="#0f1a33" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1.5" />
                <rect x="304" y="160" width="62" height="8" rx="4" fill="#3b82f6" opacity="0.8" />
                <rect x="304" y="176" width="46" height="6" rx="3" fill="#334155" />
                <rect x="304" y="188" width="54" height="6" rx="3" fill="#334155" />
                <rect x="304" y="206" width="62" height="22" rx="6" fill="#13203c" />
                <rect x="304" y="234" width="40" height="6" rx="3" fill="#22d3ee" opacity="0.7" />
            </g>

            <circle className="ksvg-dot ksvg-dot-a" cx="64" cy="92" r="4" fill="#60a5fa" />
            <circle className="ksvg-dot ksvg-dot-c" cx="40" cy="240" r="4" fill="#22d3ee" />
        </g>
    </svg>
));
WebScene.displayName = 'WebScene';

/* ----------------------------- Scene 2: Mobile ----------------------------- */
const MobileScene = memo(() => (
    <svg {...SVG_PROPS}>
        <defs>
            <linearGradient id="ksvg-phone-frame" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="ksvg-phone-screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1530" />
                <stop offset="100%" stopColor="#0a0a14" />
            </linearGradient>
            <linearGradient id="ksvg-stat" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="ksvg-phone-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>

        <g className="ksvg-float">
            <ellipse cx="200" cy="346" rx="96" ry="14" fill="#8b5cf6" opacity="0.16" />

            <g>
                {/* phone body + screen */}
                <rect x="130" y="46" width="140" height="298" rx="32" fill="url(#ksvg-phone-frame)" stroke="#52525b" strokeWidth="1.5" />
                <rect x="138" y="56" width="124" height="278" rx="24" fill="url(#ksvg-phone-screen)" />
                <rect x="182" y="64" width="36" height="11" rx="5.5" fill="#000000" />

                {/* status bar */}
                <rect x="150" y="85" width="22" height="4" rx="2" fill="#71717a" />
                <rect x="232" y="85" width="6" height="4" rx="1" fill="#71717a" />
                <rect x="240" y="85" width="6" height="4" rx="1" fill="#71717a" />
                <rect x="248" y="84" width="10" height="5" rx="1.5" fill="#a1a1aa" />

                {/* app header */}
                <circle cx="160" cy="106" r="9" fill="#3f3f46" />
                <circle cx="160" cy="106" r="9" fill="#8b5cf6" opacity="0.4" />
                <rect x="176" y="100" width="48" height="6" rx="3" fill="#d4d4d8" opacity="0.6" />
                <rect x="176" y="110" width="32" height="5" rx="2.5" fill="#52525b" />
                <circle className="ksvg-blink" cx="248" cy="105" r="4.5" fill="#ec4899" />

                {/* balance / stat card with sparkline */}
                <rect x="148" y="126" width="104" height="54" rx="12" fill="url(#ksvg-stat)" />
                <rect x="158" y="135" width="36" height="5" rx="2.5" fill="#ffffff" opacity="0.7" />
                <rect x="158" y="146" width="58" height="11" rx="3" fill="#ffffff" opacity="0.95" />
                <polyline className="ksvg-spark" points="158,172 172,164 186,168 200,158 214,162 228,151 242,154"
                    fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />

                {/* mini bar chart */}
                <rect x="148" y="194" width="40" height="6" rx="3" fill="#52525b" />
                <rect className="ksvg-bar" x="152" y="210" width="12" height="22" rx="3" fill="#6366f1" />
                <rect className="ksvg-bar ksvg-bar-2" x="168" y="204" width="12" height="28" rx="3" fill="#8b5cf6" />
                <rect className="ksvg-bar ksvg-bar-3" x="184" y="214" width="12" height="18" rx="3" fill="#6366f1" />
                <rect className="ksvg-bar ksvg-bar-4" x="200" y="200" width="12" height="32" rx="3" fill="#a78bfa" />
                <rect className="ksvg-bar ksvg-bar-5" x="216" y="208" width="12" height="24" rx="3" fill="#8b5cf6" />
                <rect className="ksvg-bar ksvg-bar-3" x="232" y="212" width="12" height="20" rx="3" fill="#6366f1" />

                {/* list rows */}
                <circle cx="160" cy="250" r="7" fill="#27272a" />
                <rect x="174" y="246" width="48" height="5" rx="2.5" fill="#52525b" />
                <rect x="174" y="254" width="32" height="4" rx="2" fill="#3f3f46" />
                <circle cx="160" cy="272" r="7" fill="#27272a" />
                <rect x="174" y="268" width="54" height="5" rx="2.5" fill="#52525b" />
                <rect x="174" y="276" width="28" height="4" rx="2" fill="#3f3f46" />

                {/* bottom nav */}
                <rect x="148" y="302" width="104" height="26" rx="13" fill="#100f1c" />
                <circle cx="168" cy="315" r="9" fill="#8b5cf6" filter="url(#ksvg-phone-glow)" />
                <circle cx="196" cy="315" r="3.5" fill="#52525b" />
                <circle cx="220" cy="315" r="3.5" fill="#52525b" />
                <circle cx="242" cy="315" r="3.5" fill="#52525b" />

                {/* FAB */}
                <circle className="ksvg-pulse" cx="244" cy="288" r="13" fill="#ec4899" filter="url(#ksvg-phone-glow)" />
                <rect x="238" y="287" width="12" height="2.5" rx="1.25" fill="#ffffff" />
                <rect x="242.75" y="282" width="2.5" height="12" rx="1.25" fill="#ffffff" />
            </g>

            <circle className="ksvg-dot ksvg-dot-a" cx="102" cy="120" r="5" fill="#8b5cf6" />
            <circle className="ksvg-dot ksvg-dot-b" cx="300" cy="150" r="4" fill="#a78bfa" />
            <circle className="ksvg-dot ksvg-dot-c" cx="304" cy="250" r="5" fill="#6366f1" />
        </g>
    </svg>
));
MobileScene.displayName = 'MobileScene';

/* ----------------------------- Scene 3: AI (neural network) ----------------------------- */
const AI_LAYERS = [
    { x: -98, ys: [-78, -26, 26, 78] },
    { x: 0, ys: [-104, -52, 0, 52, 104] },
    { x: 98, ys: [-58, 0, 58] },
];

// All connections between consecutive layers (drawn faintly).
const AI_EDGES: { x1: number; y1: number; x2: number; y2: number }[] = [];
for (let li = 0; li < AI_LAYERS.length - 1; li++) {
    for (const y1 of AI_LAYERS[li].ys) {
        for (const y2 of AI_LAYERS[li + 1].ys) {
            AI_EDGES.push({ x1: AI_LAYERS[li].x, y1, x2: AI_LAYERS[li + 1].x, y2 });
        }
    }
}

// Highlighted "signal" paths running through the central node.
const AI_ACTIVE = [
    ...AI_LAYERS[0].ys.map((y1) => ({ x1: -98, y1, x2: 0, y2: 0 })),
    ...AI_LAYERS[2].ys.map((y2) => ({ x1: 0, y1: 0, x2: 98, y2 })),
];

const AI_NODES = AI_LAYERS.flatMap((l) =>
    l.ys.map((y) => ({ x: l.x, y, core: l.x === 0 && y === 0 })),
);

const AIScene = memo(() => (
    <svg {...SVG_PROPS}>
        <defs>
            <radialGradient id="ksvg-ai-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="55%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
            </radialGradient>
            <radialGradient id="ksvg-ai-node" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#3b82f6" />
            </radialGradient>
            <filter id="ksvg-ai-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>

        <g className="ksvg-float">
            <ellipse cx="200" cy="332" rx="120" ry="16" fill="#38bdf8" opacity="0.12" />

            <g transform="translate(200 196)">
                {/* faint full mesh */}
                <g stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.16">
                    {AI_EDGES.map((e, i) => (
                        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                    ))}
                </g>

                {/* active signal paths */}
                <g stroke="#7dd3fc" strokeWidth="1.4" strokeOpacity="0.85" filter="url(#ksvg-ai-glow)">
                    {AI_ACTIVE.map((e, i) => (
                        <line
                            key={i}
                            className="ksvg-flow"
                            x1={e.x1}
                            y1={e.y1}
                            x2={e.x2}
                            y2={e.y2}
                            style={{ animationDelay: `${(i % 4) * 0.35}s` }}
                        />
                    ))}
                </g>

                {/* nodes */}
                {AI_NODES.map((n, i) =>
                    n.core ? null : (
                        <circle
                            key={i}
                            className="ksvg-blink"
                            cx={n.x}
                            cy={n.y}
                            r="6"
                            fill="url(#ksvg-ai-node)"
                            filter="url(#ksvg-ai-glow)"
                            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
                        />
                    ),
                )}

                {/* central core */}
                <circle className="ksvg-pulse-ring" r="34" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <g filter="url(#ksvg-ai-glow)">
                    <circle className="ksvg-core" r="22" fill="url(#ksvg-ai-core)" />
                    <circle r="9" fill="#ffffff" opacity="0.55" />
                </g>
            </g>

            <circle className="ksvg-dot ksvg-dot-a" cx="92" cy="116" r="4" fill="#38bdf8" />
            <circle className="ksvg-dot ksvg-dot-b" cx="312" cy="140" r="5" fill="#60a5fa" />
            <circle className="ksvg-dot ksvg-dot-c" cx="300" cy="280" r="4" fill="#7dd3fc" />
        </g>
    </svg>
));
AIScene.displayName = 'AIScene';

const SCENES = [WebScene, MobileScene, AIScene];

const ServiceSceneSVG: React.FC<ServiceSceneSVGProps> = ({ activeIndex, isMobile = false, isVisible = true }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef(0);

    // Subtle pointer parallax on desktop (cheap: single transform on the wrapper).
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || isMobile) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let tx = 0, ty = 0;
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            tx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
            ty = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    el.style.transform = `perspective(900px) rotateY(${tx}deg) rotateX(${-ty}deg)`;
                    rafRef.current = 0;
                });
            }
        };
        const onLeave = () => {
            el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
        };

        el.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isMobile]);

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{ minHeight: isMobile ? 280 : 450 }}
            role="img"
            aria-label="Animated illustration of Kytriq's web, mobile and AI solutions"
        >
            <div
                ref={wrapRef}
                className={`ksvg-stage relative w-full h-full max-w-[460px] aspect-square ${isVisible ? '' : 'ksvg-paused'}`}
                style={{ transition: 'transform 0.5s ease-out', transformStyle: 'preserve-3d' }}
            >
                {SCENES.map((Scene, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 transition-all duration-500 ease-out"
                        style={{
                            opacity: i === activeIndex ? 1 : 0,
                            transform: i === activeIndex ? 'scale(1)' : 'scale(0.9)',
                            pointerEvents: 'none',
                            visibility: i === activeIndex ? 'visible' : 'hidden',
                        }}
                    >
                        <Scene />
                    </div>
                ))}
            </div>

            <style>{`
                .ksvg-stage [class^="ksvg-"] { transform-box: fill-box; transform-origin: center; }
                .ksvg-float { animation: ksvg-float 6s ease-in-out infinite; }
                @keyframes ksvg-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

                .ksvg-core { animation: ksvg-corepulse 2.4s ease-in-out infinite; }
                @keyframes ksvg-corepulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                .ksvg-pulse-ring { animation: ksvg-ring 2.8s ease-out infinite; }
                @keyframes ksvg-ring { 0% { transform: scale(0.65); opacity: 0.6; } 100% { transform: scale(1.7); opacity: 0; } }
                .ksvg-pulse { animation: ksvg-pulse 2.6s ease-in-out infinite; }
                @keyframes ksvg-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.7; } }

                .ksvg-flow { stroke-dasharray: 5 11; animation: ksvg-flow 1.5s linear infinite; }
                @keyframes ksvg-flow { to { stroke-dashoffset: -16; } }

                .ksvg-blink { animation: ksvg-blink 2.6s ease-in-out infinite; }
                @keyframes ksvg-blink { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }

                .ksvg-line { animation: ksvg-line 3.4s ease-in-out infinite; }
                .ksvg-line-1 { width: 132px; }
                .ksvg-line-2 { width: 92px; animation-delay: 0.4s; }
                .ksvg-line-3 { width: 74px; animation-delay: 0.8s; }
                @keyframes ksvg-line { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

                .ksvg-card { animation: ksvg-card 4s ease-in-out infinite; }
                .ksvg-card-b { animation-delay: 0.5s; }
                .ksvg-card-c { animation-delay: 1s; }
                @keyframes ksvg-card { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }

                .ksvg-bar { transform-origin: bottom; animation: ksvg-bar 3.2s ease-in-out infinite; }
                .ksvg-bar-2 { animation-delay: 0.2s; }
                .ksvg-bar-3 { animation-delay: 0.4s; }
                .ksvg-bar-4 { animation-delay: 0.6s; }
                .ksvg-bar-5 { animation-delay: 0.8s; }
                @keyframes ksvg-bar { 0%,100% { transform: scaleY(0.55); } 50% { transform: scaleY(1); } }

                .ksvg-spark { animation: ksvg-line 3s ease-in-out infinite; }
                .ksvg-cursor { animation: ksvg-cursor 4.5s ease-in-out infinite; }
                @keyframes ksvg-cursor { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-6px,-4px); } }

                .ksvg-dot { animation: ksvg-drift 5s ease-in-out infinite; }
                .ksvg-dot-b { animation-delay: 1s; animation-duration: 6.5s; }
                .ksvg-dot-c { animation-delay: 2s; animation-duration: 7s; }
                @keyframes ksvg-drift { 0%,100% { transform: translate(0,0); opacity: 0.5; } 50% { transform: translate(6px,-10px); opacity: 0.9; } }

                .ksvg-paused * { animation-play-state: paused !important; }

                @media (prefers-reduced-motion: reduce) {
                    .ksvg-stage * { animation: none !important; }
                }
            `}</style>
        </div>
    );
};

export default memo(ServiceSceneSVG);
