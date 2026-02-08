import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
const particleGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.01);
const particleMaterial = new THREE.MeshStandardMaterial({
    color: '#60a5fa',
    emissive: '#3b82f6',
    emissiveIntensity: 0.5
});

// Smooth floating particle
const CodeParticle = memo<{ position: [number, number, number]; delay: number }>(({ position, delay }) => {
    const ref = useRef<THREE.Mesh>(null);
    const baseY = useRef(position[1]);
    const baseX = useRef(position[0]);

    useFrame(({ clock }) => {
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

// Memoized colors
const codeLineColors = [
    { color: '#60a5fa', emissive: '#3b82f6' },
    { color: '#a78bfa', emissive: '#8b5cf6' },
    { color: '#34d399', emissive: '#10b981' },
];

const lineWidths = [1.2, 0.9, 1.1, 0.8, 1.0];

// Smooth browser animation - Forward ref for external animation
const BrowserWindow = memo(React.forwardRef<THREE.Group>((_, ref) => {
    const buttons = useMemo(() => [
        { pos: [-0.95, 0.65, 0.06] as [number, number, number], color: '#ef4444' },
        { pos: [-0.85, 0.65, 0.06] as [number, number, number], color: '#eab308' },
        { pos: [-0.75, 0.65, 0.06] as [number, number, number], color: '#22c55e' },
    ], []);

    const codeLines = useMemo(() => [0.3, 0.1, -0.1, -0.3, -0.5].map((y, i) => ({
        position: [-0.3 + (i % 2) * 0.2, y, 0.05] as [number, number, number],
        width: lineWidths[i],
        colorIndex: i % 3,
    })), []);

    const buttonGeometry = useMemo(() => new THREE.SphereGeometry(0.025, 12, 12), []);
    const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []); // Generic box for clean reuse if needed

    return (
        <group ref={ref}>
            <RoundedBox args={[2.4, 1.6, 0.08]} radius={0.06} smoothness={3}>
                <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
            </RoundedBox>

            <RoundedBox args={[2.2, 1.3, 0.02]} radius={0.04} smoothness={3} position={[0, -0.05, 0.04]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.1} />
            </RoundedBox>

            <mesh position={[0, 0.65, 0.05]}>
                <boxGeometry args={[2.2, 0.12, 0.01]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {buttons.map((btn, i) => (
                <mesh key={i} position={btn.pos} geometry={buttonGeometry}>
                    <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={0.3} />
                </mesh>
            ))}

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
}));

BrowserWindow.displayName = 'BrowserWindow';

const particlePositions: [number, number, number][] = [
    [-1.5, 0.8, 0.5],
    [1.4, 0.6, 0.3],
    [-1.2, -0.5, 0.4],
    [1.6, -0.3, 0.6],
    [-0.8, 1.0, 0.2],
    [0.9, -0.8, 0.4],
];

// Instanced particles component
const InstancedParticles = memo<{ positions: [number, number, number][] }>(({ positions }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < positions.length; i++) {
            const delay = i * 0.5;
            tempObj.position.set(positions[i][0], positions[i][1], positions[i][2]);

            // Apply animations
            tempObj.position.y += Math.sin(t * 0.8 + delay) * 0.3;
            tempObj.position.x += Math.cos(t * 0.5 + delay) * 0.1;
            tempObj.rotation.z = Math.sin(t * 0.3 + delay) * 0.2;

            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[particleGeometry, particleMaterial, positions.length]}
        />
    );
});

InstancedParticles.displayName = 'InstancedParticles';

const WebAppScene: React.FC = () => {
    const browserRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        // Animate the single browser instance here
        if (browserRef.current) {
            const t = clock.getElapsedTime();
            browserRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
            browserRef.current.rotation.x = Math.cos(t * 0.2) * 0.05;
        }
    });

    return (
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
            <group scale={1.1}>
                {/* @ts-ignore - ref type mismatch with forwardRef depending on R3F version, safe to ignore */}
                <BrowserWindow ref={browserRef} />

                <InstancedParticles positions={particlePositions} />

                <pointLight position={[0, 0, 2]} intensity={0.4} color="#3b82f6" />
            </group>
        </Float>
    );
};

export default memo(WebAppScene);
