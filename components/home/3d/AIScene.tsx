import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries - lower polygon counts
const nodeGeometrySmall = new THREE.SphereGeometry(0.05, 8, 8);
const nodeGeometryMedium = new THREE.SphereGeometry(0.07, 8, 8);
const particleGeometry = new THREE.SphereGeometry(0.03, 6, 6);

// Shared materials
const innerNodeMaterial = new THREE.MeshStandardMaterial({
    color: '#60a5fa',
    emissive: '#60a5fa',
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.9
});

const outerNodeMaterial = new THREE.MeshStandardMaterial({
    color: '#a78bfa',
    emissive: '#a78bfa',
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.9
});

const particleMaterial = new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    emissive: '#06b6d4',
    emissiveIntensity: 1
});

// Optimized neural node with shared geometry
const NeuralNode = memo<{ position: [number, number, number]; isOuter?: boolean; pulseDelay: number }>(({
    position,
    isOuter = false,
    pulseDelay
}) => {
    const ref = useRef<THREE.Mesh>(null);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip
        frameCount++;
        if (frameCount % 3 !== 0) return;

        if (ref.current) {
            const t = clock.getElapsedTime() + pulseDelay;
            const scale = 1 + Math.sin(t * 2) * 0.2;
            ref.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh
            ref={ref}
            position={position}
            geometry={isOuter ? nodeGeometrySmall : nodeGeometryMedium}
            material={isOuter ? outerNodeMaterial : innerNodeMaterial}
        />
    );
});

NeuralNode.displayName = 'NeuralNode';

// Optimized connection line - static, no animation for performance
const ConnectionLine = memo<{ start: [number, number, number]; end: [number, number, number] }>(({ start, end }) => {
    const geometry = useMemo(() => {
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [start, end]);

    const material = useMemo(() => new THREE.LineBasicMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.4
    }), []);

    return <line geometry={geometry} material={material} />;
});

ConnectionLine.displayName = 'ConnectionLine';

// Optimized data particle
const DataParticle = memo<{ start: [number, number, number]; end: [number, number, number]; speed: number; delay: number }>(({ start, end, speed, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
    const direction = useMemo(() => new THREE.Vector3(...end).sub(startVec), [end, startVec]);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (ref.current) {
            const t = ((clock.getElapsedTime() + delay) * speed) % 1;
            ref.current.position.copy(startVec).addScaledVector(direction, t);
        }
    });

    return <mesh ref={ref} geometry={particleGeometry} material={particleMaterial} />;
});

DataParticle.displayName = 'DataParticle';

// Optimized AI core
const AICore = memo(() => {
    const coreRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (coreRef.current) {
            coreRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        }
        if (innerRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
            innerRef.current.scale.setScalar(scale);
        }
    });

    // Lower polygon torus
    const torusGeometry1 = useMemo(() => new THREE.TorusGeometry(0.4, 0.02, 8, 32), []);
    const torusGeometry2 = useMemo(() => new THREE.TorusGeometry(0.5, 0.015, 8, 32), []);

    return (
        <group ref={coreRef}>
            {/* Core sphere - lower segments */}
            <Sphere ref={innerRef} args={[0.25, 16, 16]}>
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#1d4ed8"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            {/* Outer ring - lower segments */}
            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={torusGeometry1}>
                <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>

            {/* Second ring */}
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} geometry={torusGeometry2}>
                <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.4} />
            </mesh>
        </group>
    );
});

AICore.displayName = 'AICore';

// Memoized node and connection data
const innerNodes: [number, number, number][] = [
    [-0.6, 0.4, 0.2],
    [0.6, 0.4, 0.2],
    [-0.5, -0.4, 0.3],
    [0.5, -0.4, 0.3],
    [0, 0.7, 0.1],
    [0, -0.6, 0.2],
];

const outerNodes: [number, number, number][] = [
    [-1.0, 0.7, -0.1],
    [1.0, 0.7, -0.1],
    [-1.1, 0, 0],
    [1.1, 0, 0],
];

// Reduced connections for performance
const connections: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [0, 0, 0], end: innerNodes[0] },
    { start: [0, 0, 0], end: innerNodes[1] },
    { start: [0, 0, 0], end: innerNodes[2] },
    { start: [0, 0, 0], end: innerNodes[3] },
    { start: innerNodes[0], end: outerNodes[0] },
    { start: innerNodes[1], end: outerNodes[1] },
    { start: innerNodes[2], end: outerNodes[2] },
    { start: innerNodes[3], end: outerNodes[3] },
];

const AIScene: React.FC = () => {
    return (
        <Float speed={1} rotationIntensity={0.08} floatIntensity={0.25}>
            <group scale={1.3}>
                <AICore />

                {/* Inner nodes */}
                {innerNodes.map((pos, i) => (
                    <NeuralNode key={`inner-${i}`} position={pos} pulseDelay={i * 0.3} />
                ))}

                {/* Outer nodes - reduced count */}
                {outerNodes.map((pos, i) => (
                    <NeuralNode key={`outer-${i}`} position={pos} isOuter pulseDelay={i * 0.4 + 1} />
                ))}

                {/* Connection lines - static */}
                {connections.map((conn, i) => (
                    <ConnectionLine key={i} start={conn.start} end={conn.end} />
                ))}

                {/* Reduced data particles */}
                {connections.slice(0, 4).map((conn, i) => (
                    <DataParticle key={i} start={conn.start} end={conn.end} speed={0.25} delay={i * 0.5} />
                ))}

                <pointLight position={[0, 0, 2]} intensity={0.5} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
