import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries - created once, reused
const particleGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.01);
const particleMaterial = new THREE.MeshStandardMaterial({
    color: '#60a5fa',
    emissive: '#3b82f6',
    emissiveIntensity: 0.5
});

// Optimized particle with shared geometry/material
const CodeParticle = memo<{ position: [number, number, number]; delay: number }>(({ position, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const baseY = useRef(position[1]);
    const baseX = useRef(position[0]);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip - update every 2nd frame for particles
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (ref.current) {
            const t = clock.getElapsedTime() + delay;
            ref.current.position.y = baseY.current + Math.sin(t * 0.8) * 0.3;
            ref.current.position.x = baseX.current + Math.cos(t * 0.5) * 0.1;
            ref.current.rotation.z = Math.sin(t * 0.3) * 0.2;
        }
    });

    return (
        <mesh ref={ref} position={position} geometry={particleGeometry} material={particleMaterial} />
    );
});

CodeParticle.displayName = 'CodeParticle';

// Memoized code line colors
const codeLineColors = [
    { color: '#60a5fa', emissive: '#3b82f6' },
    { color: '#a78bfa', emissive: '#8b5cf6' },
    { color: '#34d399', emissive: '#10b981' },
];

// Pre-compute line widths to avoid recalculating on each render
const lineWidths = [1.2, 0.9, 1.1, 0.8, 1.0];

// Browser window - memoized to prevent re-renders
const BrowserWindow = memo(() => {
    const groupRef = useRef<THREE.Group>(null);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip for subtle animation
        frameCount++;
        if (frameCount % 3 !== 0) return;

        if (groupRef.current) {
            const t = clock.getElapsedTime();
            groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
            groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.05;
        }
    });

    // Memoize button data
    const buttons = useMemo(() => [
        { pos: [-0.95, 0.65, 0.06] as [number, number, number], color: '#ef4444' },
        { pos: [-0.85, 0.65, 0.06] as [number, number, number], color: '#eab308' },
        { pos: [-0.75, 0.65, 0.06] as [number, number, number], color: '#22c55e' },
    ], []);

    // Memoize code lines
    const codeLines = useMemo(() => [0.3, 0.1, -0.1, -0.3, -0.5].map((y, i) => ({
        position: [-0.3 + (i % 2) * 0.2, y, 0.05] as [number, number, number],
        width: lineWidths[i],
        colorIndex: i % 3,
    })), []);

    // Shared geometry for buttons - lower poly
    const buttonGeometry = useMemo(() => new THREE.SphereGeometry(0.025, 8, 8), []);

    return (
        <group ref={groupRef}>
            {/* Browser frame */}
            <RoundedBox args={[2.4, 1.6, 0.08]} radius={0.06} smoothness={2}>
                <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[2.2, 1.3, 0.02]} radius={0.04} smoothness={2} position={[0, -0.05, 0.04]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.1} />
            </RoundedBox>

            {/* Top bar */}
            <mesh position={[0, 0.65, 0.05]}>
                <boxGeometry args={[2.2, 0.12, 0.01]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Window buttons - shared geometry */}
            {buttons.map((btn, i) => (
                <mesh key={i} position={btn.pos} geometry={buttonGeometry}>
                    <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* Code lines on screen */}
            {codeLines.map((line, i) => (
                <mesh key={i} position={line.position}>
                    <boxGeometry args={[line.width, 0.04, 0.01]} />
                    <meshStandardMaterial
                        color={codeLineColors[line.colorIndex].color}
                        emissive={codeLineColors[line.colorIndex].emissive}
                        emissiveIntensity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
});

BrowserWindow.displayName = 'BrowserWindow';

// Memoized particle positions
const particlePositions: [number, number, number][] = [
    [-1.5, 0.8, 0.5],
    [1.4, 0.6, 0.3],
    [-1.2, -0.5, 0.4],
    [1.6, -0.3, 0.6],
];

const WebAppScene: React.FC = () => {
    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
            <group scale={1.1}>
                <BrowserWindow />

                {/* Reduced particle count for performance */}
                {particlePositions.map((pos, i) => (
                    <CodeParticle key={i} position={pos} delay={i * 0.5} />
                ))}

                {/* Single point light */}
                <pointLight position={[0, 0, 2]} intensity={0.4} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default memo(WebAppScene);
