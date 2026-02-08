import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Neural node
const NeuralNode: React.FC<{ position: [number, number, number]; size?: number; color?: string; pulseDelay?: number }> = ({
    position,
    size = 0.08,
    color = '#60a5fa',
    pulseDelay = 0
}) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() + pulseDelay;
            const scale = 1 + Math.sin(t * 2) * 0.2;
            ref.current.scale.setScalar(scale);
        }
    });

    return (
        <Sphere ref={ref} args={[size, 16, 16]} position={position}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.9} />
        </Sphere>
    );
};

// Connection line between nodes
const ConnectionLine: React.FC<{ start: [number, number, number]; end: [number, number, number]; delay: number }> = ({ start, end, delay }) => {
    const ref = useRef<THREE.Line>(null);

    const geometry = useMemo(() => {
        const points = [
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
        ];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [start, end]);

    useFrame(({ clock }) => {
        if (ref.current && ref.current.material) {
            const t = clock.getElapsedTime() + delay;
            const material = ref.current.material as THREE.LineBasicMaterial;
            material.opacity = 0.3 + Math.sin(t * 3) * 0.3;
        }
    });

    return (
        <line ref={ref} geometry={geometry}>
            <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </line>
    );
};

// Data particle flowing along connection
const DataParticle: React.FC<{ start: [number, number, number]; end: [number, number, number]; speed: number; delay: number }> = ({ start, end, speed, delay }) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = ((clock.getElapsedTime() + delay) * speed) % 1;
            ref.current.position.x = start[0] + (end[0] - start[0]) * t;
            ref.current.position.y = start[1] + (end[1] - start[1]) * t;
            ref.current.position.z = start[2] + (end[2] - start[2]) * t;
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1} />
        </mesh>
    );
};

// Central AI core
const AICore: React.FC = () => {
    const coreRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (coreRef.current) {
            coreRef.current.rotation.y = clock.getElapsedTime() * 0.3;
            coreRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
        }
        if (innerRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
            innerRef.current.scale.setScalar(scale);
        }
    });

    return (
        <group ref={coreRef}>
            {/* Core sphere */}
            <Sphere ref={innerRef} args={[0.25, 32, 32]}>
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#1d4ed8"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.4, 0.02, 16, 64]} />
                <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>

            {/* Second ring */}
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[0.5, 0.015, 16, 64]} />
                <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.4} />
            </mesh>
        </group>
    );
};

const AIScene: React.FC = () => {
    // Neural network node positions
    const nodes: [number, number, number][] = [
        // Inner layer
        [-0.6, 0.4, 0.2],
        [0.6, 0.4, 0.2],
        [-0.5, -0.4, 0.3],
        [0.5, -0.4, 0.3],
        [0, 0.7, 0.1],
        [0, -0.6, 0.2],
        // Outer layer
        [-1.0, 0.7, -0.1],
        [1.0, 0.7, -0.1],
        [-1.1, 0, 0],
        [1.1, 0, 0],
        [-1.0, -0.6, -0.1],
        [1.0, -0.6, -0.1],
    ];

    // Connections from core to inner nodes
    const connections: { start: [number, number, number]; end: [number, number, number] }[] = [
        { start: [0, 0, 0], end: nodes[0] },
        { start: [0, 0, 0], end: nodes[1] },
        { start: [0, 0, 0], end: nodes[2] },
        { start: [0, 0, 0], end: nodes[3] },
        { start: [0, 0, 0], end: nodes[4] },
        { start: [0, 0, 0], end: nodes[5] },
        // Inner to outer connections
        { start: nodes[0], end: nodes[6] },
        { start: nodes[0], end: nodes[8] },
        { start: nodes[1], end: nodes[7] },
        { start: nodes[1], end: nodes[9] },
        { start: nodes[2], end: nodes[8] },
        { start: nodes[2], end: nodes[10] },
        { start: nodes[3], end: nodes[9] },
        { start: nodes[3], end: nodes[11] },
        { start: nodes[4], end: nodes[6] },
        { start: nodes[4], end: nodes[7] },
        { start: nodes[5], end: nodes[10] },
        { start: nodes[5], end: nodes[11] },
    ];

    return (
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <group scale={1.3}>
                {/* Central AI core */}
                <AICore />

                {/* Neural nodes */}
                {nodes.slice(0, 6).map((pos, i) => (
                    <NeuralNode key={`inner-${i}`} position={pos} size={0.07} color="#60a5fa" pulseDelay={i * 0.3} />
                ))}
                {nodes.slice(6).map((pos, i) => (
                    <NeuralNode key={`outer-${i}`} position={pos} size={0.05} color="#a78bfa" pulseDelay={i * 0.4 + 1} />
                ))}

                {/* Connection lines */}
                {connections.map((conn, i) => (
                    <ConnectionLine key={i} start={conn.start} end={conn.end} delay={i * 0.2} />
                ))}

                {/* Data particles flowing */}
                {connections.slice(0, 6).map((conn, i) => (
                    <DataParticle key={i} start={conn.start} end={conn.end} speed={0.3 + i * 0.05} delay={i * 0.5} />
                ))}

                {/* Ambient lighting */}
                <pointLight position={[0, 0, 2]} intensity={0.6} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default AIScene;
