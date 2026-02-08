import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries created once
const iconGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.04);
const smallIconGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.01);

// Pre-defined colors
const appColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'];

// Floating app icon - optimized
const AppIcon = memo<{ position: [number, number, number]; color: string; delay: number }>(({ position, color, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const basePos = useRef({ x: position[0], y: position[1] });
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Skip every other frame
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (ref.current) {
            const t = clock.getElapsedTime() + delay;
            ref.current.position.y = basePos.current.y + Math.sin(t * 0.6) * 0.15;
            ref.current.position.x = basePos.current.x + Math.cos(t * 0.4) * 0.1;
            ref.current.rotation.y = t * 0.3;
        }
    });

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3
    }), [color]);

    return (
        <mesh ref={ref} position={position} geometry={iconGeometry} material={material} />
    );
});

AppIcon.displayName = 'AppIcon';

// Phone device - memoized
const PhoneDevice = memo(() => {
    const phoneRef = useRef<THREE.Group>(null);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Skip frames for subtle animation
        frameCount++;
        if (frameCount % 3 !== 0) return;

        if (phoneRef.current) {
            const t = clock.getElapsedTime();
            phoneRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
            phoneRef.current.rotation.z = Math.cos(t * 0.3) * 0.05;
        }
    });

    // Memoized app grid positions
    const appGrid = useMemo(() => [
        [-0.25, 0.6], [0, 0.6], [0.25, 0.6],
        [-0.25, 0.3], [0, 0.3], [0.25, 0.3],
        [-0.25, 0], [0, 0], [0.25, 0],
    ].map(([x, y], i) => ({
        position: [x, y, 0.08] as [number, number, number],
        color: appColors[i]
    })), []);

    return (
        <group ref={phoneRef}>
            {/* Phone body - reduced smoothness */}
            <RoundedBox args={[1.0, 2.0, 0.1]} radius={0.1} smoothness={2}>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[0.88, 1.8, 0.02]} radius={0.06} smoothness={2} position={[0, 0, 0.06]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.15} />
            </RoundedBox>

            {/* App grid - shared geometry */}
            {appGrid.map((app, i) => (
                <mesh key={i} position={app.position} geometry={smallIconGeometry}>
                    <meshStandardMaterial color={app.color} emissive={app.color} emissiveIntensity={0.4} />
                </mesh>
            ))}

            {/* Notch */}
            <mesh position={[0, 0.85, 0.07]}>
                <boxGeometry args={[0.3, 0.05, 0.01]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>

            {/* Home indicator */}
            <mesh position={[0, -0.8, 0.07]}>
                <boxGeometry args={[0.25, 0.02, 0.01]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Side button (reduced from 3 to 1) */}
            <mesh position={[0.52, 0.4, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
        </group>
    );
});

PhoneDevice.displayName = 'PhoneDevice';

// Reduced floating icons count
const floatingIcons: { position: [number, number, number]; color: string }[] = [
    { position: [-0.9, 0.8, 0.3], color: '#3b82f6' },
    { position: [0.85, 0.6, 0.4], color: '#8b5cf6' },
    { position: [-0.8, -0.7, 0.25], color: '#10b981' },
    { position: [0.9, -0.5, 0.35], color: '#f59e0b' },
];

const MobileAppScene: React.FC = () => {
    return (
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <group scale={1.2}>
                <PhoneDevice />

                {/* Reduced floating icons */}
                {floatingIcons.map((icon, i) => (
                    <AppIcon key={i} position={icon.position} color={icon.color} delay={i * 0.7} />
                ))}

                {/* Single glow light */}
                <pointLight position={[0, 0, 1.5]} intensity={0.3} color="#8b5cf6" />
            </group>
        </Float>
    );
};

export default memo(MobileAppScene);
