import React, { useRef, useMemo, memo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Instance, Instances } from '@react-three/drei';
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

// Optimized Instanced Nodes
const InstancedNodes = memo<{ positions: [number, number, number][]; isOuter?: boolean; baseDelay: number }>(({
    positions,
    isOuter = false,
    baseDelay
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < positions.length; i++) {
            const delay = i * (isOuter ? 0.4 : 0.3) + baseDelay;
            const scale = 1 + Math.sin(t * 2 + delay) * 0.2;

            tempObj.position.set(positions[i][0], positions[i][1], positions[i][2]);
            tempObj.scale.setScalar(scale);
            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[isOuter ? nodeGeometrySmall : nodeGeometryMedium, isOuter ? outerNodeMaterial : innerNodeMaterial, positions.length]}
        />
    );
});

InstancedNodes.displayName = 'InstancedNodes';

// Optimized Connections
const Connections = memo<{ connections: { start: [number, number, number]; end: [number, number, number] }[] }>(({ connections }) => {
    const linesRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        return connections.map((conn, i) => {
            const points = [new THREE.Vector3(...conn.start), new THREE.Vector3(...conn.end)];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: '#60a5fa',
                transparent: true,
                opacity: 0.5
            });
            const line = new THREE.Line(geometry, material);
            return <primitive key={i} object={line} />;
        });
    }, [connections]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (linesRef.current) {
            linesRef.current.children.forEach((child, i) => {
                const line = child as THREE.Line;
                const material = line.material as THREE.LineBasicMaterial;
                if (material) {
                    const delay = i * 0.15;
                    material.opacity = 0.3 + Math.sin(t * 2 + delay) * 0.25;
                }
            });
        }
    });

    return <group ref={linesRef}>{lines}</group>;
});

Connections.displayName = 'Connections';

// Optimized Particles
const Particles = memo<{ connections: { start: [number, number, number]; end: [number, number, number] }[] }>(({ connections }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    // Pre-calculate vectors to avoid creation in loop
    const vectors = useMemo(() => connections.map(c => ({
        start: new THREE.Vector3(...c.start),
        dir: new THREE.Vector3(...c.end).sub(new THREE.Vector3(...c.start))
    })), [connections]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < vectors.length; i++) {
            const delay = i * 0.5;
            const progress = ((t + delay) * 0.3) % 1;

            // LERP manually
            tempObj.position.copy(vectors[i].start).addScaledVector(vectors[i].dir, progress);
            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[particleGeometry, particleMaterial, connections.length]}
        />
    );
});

Particles.displayName = 'Particles';

// Smooth rotating core
const AICore = memo(() => {
    const coreRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.3;
            coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        }
        if (innerRef.current) {
            const scale = 1 + Math.sin(t * 2) * 0.1;
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

                <InstancedNodes positions={innerNodes} baseDelay={0} />
                <InstancedNodes positions={outerNodes} isOuter baseDelay={1} />

                <Connections connections={connections} />

                <Particles connections={connections.slice(0, 6)} />

                <pointLight position={[0, 0, 2]} intensity={0.5} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
