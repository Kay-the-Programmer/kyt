import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Floating app icon
const AppIcon: React.FC<{ position: [number, number, number]; color: string; delay: number }> = ({ position, color, delay }) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() + delay;
            ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.15;
            ref.current.position.x = position[0] + Math.cos(t * 0.4) * 0.1;
            ref.current.rotation.y = t * 0.3;
        }
    });

    return (
        <RoundedBox ref={ref} args={[0.2, 0.2, 0.04]} radius={0.04} position={position}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </RoundedBox>
    );
};

// Phone device
const PhoneDevice: React.FC = () => {
    const phoneRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (phoneRef.current) {
            phoneRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.15;
            phoneRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.3) * 0.05;
        }
    });

    return (
        <group ref={phoneRef}>
            {/* Phone body */}
            <RoundedBox args={[1.0, 2.0, 0.1]} radius={0.1}>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[0.88, 1.8, 0.02]} radius={0.06} position={[0, 0, 0.06]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.15} />
            </RoundedBox>

            {/* Screen content - app grid */}
            {[
                [-0.25, 0.6], [0, 0.6], [0.25, 0.6],
                [-0.25, 0.3], [0, 0.3], [0.25, 0.3],
                [-0.25, 0], [0, 0], [0.25, 0],
            ].map(([x, y], i) => (
                <RoundedBox key={i} args={[0.15, 0.15, 0.01]} radius={0.03} position={[x, y, 0.08]}>
                    <meshStandardMaterial
                        color={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'][i]}
                        emissive={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'][i]}
                        emissiveIntensity={0.4}
                    />
                </RoundedBox>
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

            {/* Side buttons */}
            <mesh position={[0.52, 0.4, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-0.52, 0.5, 0]}>
                <boxGeometry args={[0.02, 0.1, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-0.52, 0.3, 0]}>
                <boxGeometry args={[0.02, 0.15, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
        </group>
    );
};

const MobileAppScene: React.FC = () => {
    const floatingIcons: { position: [number, number, number]; color: string }[] = [
        { position: [-0.9, 0.8, 0.3], color: '#3b82f6' },
        { position: [0.85, 0.6, 0.4], color: '#8b5cf6' },
        { position: [-0.8, -0.7, 0.25], color: '#10b981' },
        { position: [0.9, -0.5, 0.35], color: '#f59e0b' },
        { position: [-0.7, 0.2, 0.5], color: '#ec4899' },
        { position: [0.75, 0.1, 0.45], color: '#06b6d4' },
    ];

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
            <group scale={1.2}>
                <PhoneDevice />

                {/* Floating app icons around phone */}
                {floatingIcons.map((icon, i) => (
                    <AppIcon key={i} position={icon.position} color={icon.color} delay={i * 0.7} />
                ))}

                {/* Glow */}
                <pointLight position={[0, 0, 1.5]} intensity={0.4} color="#8b5cf6" />
            </group>
        </Float>
    );
};

export default MobileAppScene;
