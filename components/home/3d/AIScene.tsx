import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
const nodeGeometrySmall = new THREE.SphereGeometry(0.05, 12, 12);
const nodeGeometryMedium = new THREE.SphereGeometry(0.07, 12, 12);
const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);

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

// Smooth pulsing node
const NeuralNode = memo<{ position: [number, number, number]; isOuter?: boolean; pulseDelay: number }>(({
    position,
    isOuter = false,
    pulseDelay
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
        <mesh
            ref={ref}
            position={position}
            geometry={isOuter ? nodeGeometrySmall : nodeGeometryMedium}
            material={isOuter ? outerNodeMaterial : innerNodeMaterial}
        />
    );
});

NeuralNode.displayName = 'NeuralNode';

// Animated connection with pulsing opacity
const ConnectionLine = memo<{ start: [number, number, number]; end: [number, number, number]; delay: number }>(({ start, end, delay }) => {
    const ref = useRef<THREE.Line>(null);

    const geometry = useMemo(() => {
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [start, end]);

    useFrame(({ clock }) => {
        if (ref.current && ref.current.material) {
            const t = clock.getElapsedTime() + delay;
            (ref.current.material as THREE.LineBasicMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.25;
        }
    });

    return (
        <line ref={ref} geometry={geometry}>
            <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </line>
    );
});

ConnectionLine.displayName = 'ConnectionLine';

// Smooth flowing particle
const DataParticle = memo<{ start: [number, number, number]; end: [number, number, number]; speed: number; delay: number }>(({ start, end, speed, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
    const direction = useMemo(() => new THREE.Vector3(...end).sub(startVec), [end, startVec]);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = ((clock.getElapsedTime() + delay) * speed) % 1;
            ref.current.position.copy(startVec).addScaledVector(direction, t);
        }
    });

    return <mesh ref={ref} geometry={particleGeometry} material={particleMaterial} />;
});

DataParticle.displayName = 'DataParticle';

// Smooth rotating core
const AICore = memo(() => {
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

    const torusGeometry1 = useMemo(() => new THREE.TorusGeometry(0.4, 0.02, 12, 48), []);
    const torusGeometry2 = useMemo(() => new THREE.TorusGeometry(0.5, 0.015, 12, 48), []);

    return (
        <group ref={coreRef}>
            <Sphere ref={innerRef} args={[0.25, 24, 24]}>
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#1d4ed8"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={torusGeometry1}>
                <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>

            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} geometry={torusGeometry2}>
                <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.4} />
            </mesh>
        </group>
    );
});

AICore.displayName = 'AICore';

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
    [-1.0, -0.6, -0.1],
    [1.0, -0.6, -0.1],
];

const connections: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [0, 0, 0], end: innerNodes[0] },
    { start: [0, 0, 0], end: innerNodes[1] },
    { start: [0, 0, 0], end: innerNodes[2] },
    { start: [0, 0, 0], end: innerNodes[3] },
    { start: [0, 0, 0], end: innerNodes[4] },
    { start: [0, 0, 0], end: innerNodes[5] },
    { start: innerNodes[0], end: outerNodes[0] },
    { start: innerNodes[1], end: outerNodes[1] },
    { start: innerNodes[2], end: outerNodes[2] },
    { start: innerNodes[3], end: outerNodes[3] },
];

const AIScene: React.FC = () => {
    return (
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <group scale={1.3}>
                <AICore />

                {innerNodes.map((pos, i) => (
                    <NeuralNode key={`inner-${i}`} position={pos} pulseDelay={i * 0.3} />
                ))}

                {outerNodes.map((pos, i) => (
                    <NeuralNode key={`outer-${i}`} position={pos} isOuter pulseDelay={i * 0.4 + 1} />
                ))}

                {connections.map((conn, i) => (
                    <ConnectionLine key={i} start={conn.start} end={conn.end} delay={i * 0.15} />
                ))}

                {connections.slice(0, 6).map((conn, i) => (
                    <DataParticle key={i} start={conn.start} end={conn.end} speed={0.3} delay={i * 0.5} />
                ))}

                <pointLight position={[0, 0, 2]} intensity={0.5} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
