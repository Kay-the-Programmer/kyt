import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// Floating code particle
const CodeParticle: React.FC<{ position: [number, number, number]; delay: number }> = ({ position, delay }) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() + delay;
            ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
            ref.current.position.x = position[0] + Math.cos(t * 0.5) * 0.1;
            ref.current.rotation.z = Math.sin(t * 0.3) * 0.2;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <boxGeometry args={[0.08, 0.02, 0.01]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
    );
};

// Browser window component
const BrowserWindow: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
            groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Browser frame */}
            <RoundedBox args={[2.4, 1.6, 0.08]} radius={0.06} position={[0, 0, 0]}>
                <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[2.2, 1.3, 0.02]} radius={0.04} position={[0, -0.05, 0.04]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.1} />
            </RoundedBox>

            {/* Top bar */}
            <mesh position={[0, 0.65, 0.05]}>
                <boxGeometry args={[2.2, 0.12, 0.01]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Window buttons */}
            {[[-0.95, 0.65, 0.06], [-0.85, 0.65, 0.06], [-0.75, 0.65, 0.06]].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <sphereGeometry args={[0.025, 16, 16]} />
                    <meshStandardMaterial color={['#ef4444', '#eab308', '#22c55e'][i]} emissive={['#ef4444', '#eab308', '#22c55e'][i]} emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* Code lines on screen */}
            {[0.3, 0.1, -0.1, -0.3, -0.5].map((y, i) => (
                <mesh key={i} position={[-0.3 + (i % 2) * 0.2, y, 0.05]}>
                    <boxGeometry args={[0.8 + Math.random() * 0.6, 0.04, 0.01]} />
                    <meshStandardMaterial
                        color={i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a78bfa' : '#34d399'}
                        emissive={i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#10b981'}
                        emissiveIntensity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
};

const WebAppScene: React.FC = () => {
    const particlePositions: [number, number, number][] = [
        [-1.5, 0.8, 0.5],
        [1.4, 0.6, 0.3],
        [-1.2, -0.5, 0.4],
        [1.6, -0.3, 0.6],
        [-0.8, 1.0, 0.2],
        [0.9, -0.8, 0.4],
        [-1.6, 0.2, 0.5],
        [1.3, 0.3, 0.3],
    ];

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group scale={1.1}>
                <BrowserWindow />

                {/* Floating particles */}
                {particlePositions.map((pos, i) => (
                    <CodeParticle key={i} position={pos} delay={i * 0.5} />
                ))}

                {/* Ambient glow */}
                <pointLight position={[0, 0, 2]} intensity={0.5} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default WebAppScene;
