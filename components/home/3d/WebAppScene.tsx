import React, { useRef, useMemo, memo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
const particleGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.01);
const particleMaterial = new THREE.MeshStandardMaterial({
    color: '#60a5fa',
    emissive: '#3b82f6',
    emissiveIntensity: 0.8
});

// Smooth floating particle
const CodeParticle = memo<{ position: [number, number, number]; delay: number }>(({ position, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const baseY = useRef(position[1]);
    const baseX = useRef(position[0]);
    // Random rotation speed
    const rotSpeed = useRef(Math.random() * 0.5 + 0.2);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() + delay;
            ref.current.position.y = baseY.current + Math.sin(t * 0.5) * 0.4;
            ref.current.position.x = baseX.current + Math.cos(t * 0.3) * 0.15;
            ref.current.rotation.z = Math.sin(t * rotSpeed.current) * 0.3;
            ref.current.rotation.y = t * 0.2;
        }
    });

    return (
        <mesh ref={ref} position={position} geometry={particleGeometry} material={particleMaterial} />
    );
});

CodeParticle.displayName = 'CodeParticle';

// Memoized colors
const codeLineColors = [
    { color: '#60a5fa', emissive: '#3b82f6' },
    { color: '#a78bfa', emissive: '#8b5cf6' },
    { color: '#34d399', emissive: '#10b981' },
];

const lineWidths = [1.2, 0.9, 1.1, 0.8, 1.0, 0.7, 0.9];

// Animated Code Line
const CodeLine = memo<{ position: [number, number, number]; width: number; colorIndex: number; delay: number }>(({ position, width, colorIndex, delay }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const colors = codeLineColors[colorIndex];

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (meshRef.current) {
            // Typing effect scale
            const pulse = Math.sin(t * 3 + delay) * 0.5 + 0.5; // 0 to 1
            // Use scale x to simulate typing? No, maybe just opacity pulse
            // Actually let's just do a subtle pulse
        }
        if (materialRef.current) {
            const opacity = 0.5 + Math.sin(t * 2 + delay) * 0.3;
            materialRef.current.emissiveIntensity = 0.4 + Math.sin(t * 3 + delay) * 0.3;
            materialRef.current.opacity = 1; // Keep fully opaque for consistent look, vary emissive
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[width, 0.04, 0.01]} />
            <meshStandardMaterial
                ref={materialRef}
                color={colors.color}
                emissive={colors.emissive}
                emissiveIntensity={0.5}
                transparent
            />
        </mesh>
    );
});
CodeLine.displayName = 'CodeLine';

// Smooth browser animation - Forward ref for external animation
const BrowserWindow = memo(React.forwardRef<THREE.Group>((_, ref) => {
    const buttons = useMemo(() => [
        { pos: [-0.95, 0.65, 0.06] as [number, number, number], color: '#ef4444' },
        { pos: [-0.85, 0.65, 0.06] as [number, number, number], color: '#eab308' },
        { pos: [-0.75, 0.65, 0.06] as [number, number, number], color: '#22c55e' },
    ], []);

    const codeLines = useMemo(() => [0.35, 0.2, 0.05, -0.1, -0.25, -0.4, -0.55].map((y, i) => ({
        position: [-0.3 + (i % 2) * 0.2, y, 0.05] as [number, number, number],
        width: lineWidths[i],
        colorIndex: i % 3,
        delay: i * 0.2
    })), []);

    const buttonGeometry = useMemo(() => new THREE.SphereGeometry(0.025, 12, 12), []);

    // Glass material
    const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#0f172a",
        metalness: 0.2,
        roughness: 0.2,
        transmission: 0.2, // Slight transparency
        transparent: true,
        opacity: 0.95,
        reflectivity: 0.5,
    }), []);

    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#1e293b",
        metalness: 0.6,
        roughness: 0.4
    }), []);

    return (
        <group ref={ref}>
            {/* Main Frame */}
            <RoundedBox args={[2.4, 1.6, 0.08]} radius={0.06} smoothness={3}>
                <primitive object={frameMaterial} attach="material" />
            </RoundedBox>

            {/* Screen Area (Glassy) */}
            <RoundedBox args={[2.2, 1.3, 0.02]} radius={0.04} smoothness={3} position={[0, -0.05, 0.04]}>
                <primitive object={glassMaterial} attach="material" />
            </RoundedBox>

            {/* Top Bar Background */}
            <mesh position={[0, 0.65, 0.05]}>
                <boxGeometry args={[2.2, 0.12, 0.01]} />
                <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
            </mesh>

            {/* Window Controls */}
            {buttons.map((btn, i) => (
                <mesh key={i} position={btn.pos} geometry={buttonGeometry}>
                    <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={0.5} toneMapped={false} />
                </mesh>
            ))}

            {/* Code Content */}
            {codeLines.map((line, i) => (
                <CodeLine
                    key={i}
                    position={line.position}
                    width={line.width}
                    colorIndex={line.colorIndex}
                    delay={line.delay}
                />
            ))}
        </group>
    );
}));

BrowserWindow.displayName = 'BrowserWindow';

const particlePositions: [number, number, number][] = [
    [-1.5, 0.8, 0.5],
    [1.4, 0.6, 0.3],
    [-1.2, -0.5, 0.4],
    [1.6, -0.3, 0.6],
    [-0.8, 1.0, 0.2],
    [0.9, -0.8, 0.4],
    [-1.4, 0.0, 0.8],
    [1.2, -0.9, 0.2]
];

const WebAppScene: React.FC = () => {
    const browserRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Organic floating for the whole group
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
        }

        // Mouse parallax effect
        if (browserRef.current) {
            // Gentle sway
            const autoRotX = Math.cos(t * 0.2) * 0.05;
            const autoRotY = Math.sin(t * 0.3) * 0.08;

            // Mouse influence (damped)
            const x = pointer.x * viewport.width / 2;
            const y = pointer.y * viewport.height / 2;
            const mouseRotX = -y * 0.02;
            const mouseRotY = x * 0.02;

            // Lerp current rotation to target
            browserRef.current.rotation.x = THREE.MathUtils.lerp(browserRef.current.rotation.x, autoRotX + mouseRotX, 0.1);
            browserRef.current.rotation.y = THREE.MathUtils.lerp(browserRef.current.rotation.y, autoRotY + mouseRotY, 0.1);
        }
    });

    return (
        <group ref={groupRef} scale={1.1}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                {/* @ts-ignore - ref type mismatch with forwardRef safe to ignore */}
                <BrowserWindow ref={browserRef} />

                {particlePositions.map((pos, i) => (
                    <CodeParticle key={i} position={pos} delay={i * 0.3} />
                ))}

                <pointLight position={[0, 0, 2]} intensity={0.6} color="#3b82f6" />
                <pointLight position={[-2, 1, 1]} intensity={0.4} color="#60a5fa" />
            </Float>
        </group>
    );
};

export default memo(WebAppScene);
