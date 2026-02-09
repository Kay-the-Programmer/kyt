import React, { useRef, useMemo, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Minimalist materials - optimized for performance
const frameMaterial = new THREE.MeshStandardMaterial({
    color: "#1e293b",
    metalness: 0.7,
    roughness: 0.3
});

const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    metalness: 0.3,
    roughness: 0.1,
    emissive: "#1e40af",
    emissiveIntensity: 0.1
});

const codeLineMaterial = new THREE.MeshStandardMaterial({
    color: '#60a5fa',
    emissive: '#3b82f6',
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9,
});

// Static line data - cleaner minimalistic look
const LINE_DATA = [
    { width: 1.1, color: '#60a5fa', y: 0.3, x: -0.25 },
    { width: 0.8, color: '#a78bfa', y: 0.15, x: -0.1 },
    { width: 1.0, color: '#34d399', y: 0.0, x: -0.25 },
    { width: 0.7, color: '#60a5fa', y: -0.15, x: -0.1 },
    { width: 0.9, color: '#a78bfa', y: -0.3, x: -0.25 },
];

// Static instanced lines - no per-frame updates for cleaner look
const InstancedLines = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);
    const geometry = useMemo(() => new THREE.BoxGeometry(1, 0.035, 0.01), []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        LINE_DATA.forEach((line, i) => {
            tempObj.position.set(line.x, line.y, 0.05);
            tempObj.scale.set(line.width, 1, 1);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
            colorObj.set(line.color);
            meshRef.current?.setColorAt(i, colorObj);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [tempObj, colorObj]);

    return <instancedMesh ref={meshRef} args={[geometry, codeLineMaterial, LINE_DATA.length]} />;
});

InstancedLines.displayName = 'InstancedLines';

// Reduced particle count for minimalism
const PARTICLE_POSITIONS: [number, number, number][] = [
    [-1.3, 0.7, 0.4],
    [1.2, 0.5, 0.3],
    [-1.0, -0.4, 0.3],
    [1.4, -0.6, 0.5],
];

const InstancedParticles = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const geometry = useMemo(() => new THREE.BoxGeometry(0.08, 0.015, 0.01), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        emissive: '#3b82f6',
        emissiveIntensity: 0.8
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        PARTICLE_POSITIONS.forEach((pos, i) => {
            const delay = i * 0.4;
            tempObj.position.set(
                pos[0] + Math.cos(t * 0.25 + delay) * 0.1,
                pos[1] + Math.sin(t * 0.4 + delay) * 0.3,
                pos[2]
            );
            tempObj.rotation.set(0, t * 0.15, Math.sin(t * 0.3 + delay) * 0.2);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, PARTICLE_POSITIONS.length]} />;
});

InstancedParticles.displayName = 'InstancedParticles';

// Clean browser window component
const BrowserWindow = memo(React.forwardRef<THREE.Group>((_, ref) => {
    const buttons = useMemo(() => [
        { pos: [-0.9, 0.62, 0.055] as [number, number, number], color: '#ef4444' },
        { pos: [-0.82, 0.62, 0.055] as [number, number, number], color: '#eab308' },
        { pos: [-0.74, 0.62, 0.055] as [number, number, number], color: '#22c55e' },
    ], []);

    const buttonGeometry = useMemo(() => new THREE.SphereGeometry(0.02, 8, 8), []);

    return (
        <group ref={ref}>
            {/* Main Frame */}
            <RoundedBox args={[2.2, 1.5, 0.07]} radius={0.05} smoothness={2}>
                <primitive object={frameMaterial} attach="material" />
            </RoundedBox>

            {/* Screen Area */}
            <RoundedBox args={[2.0, 1.2, 0.02]} radius={0.03} smoothness={2} position={[0, -0.05, 0.035]}>
                <primitive object={screenMaterial} attach="material" />
            </RoundedBox>

            {/* Top Bar */}
            <mesh position={[0, 0.62, 0.045]}>
                <boxGeometry args={[2.0, 0.1, 0.01]} />
                <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.5} />
            </mesh>

            {/* Window Controls */}
            {buttons.map((btn, i) => (
                <mesh key={i} position={btn.pos} geometry={buttonGeometry}>
                    <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={0.4} />
                </mesh>
            ))}

            {/* Code Lines */}
            <InstancedLines />
        </group>
    );
}));

BrowserWindow.displayName = 'BrowserWindow';

const WebAppScene: React.FC = () => {
    const browserRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.4) * 0.04;
        }

        if (browserRef.current) {
            const autoRotX = Math.cos(t * 0.15) * 0.04;
            const autoRotY = Math.sin(t * 0.25) * 0.06;

            const x = pointer.x * viewport.width / 2;
            const y = pointer.y * viewport.height / 2;
            const mouseRotX = -y * 0.015;
            const mouseRotY = x * 0.015;

            browserRef.current.rotation.x = THREE.MathUtils.lerp(browserRef.current.rotation.x, autoRotX + mouseRotX, 0.08);
            browserRef.current.rotation.y = THREE.MathUtils.lerp(browserRef.current.rotation.y, autoRotY + mouseRotY, 0.08);
        }
    });

    return (
        <group ref={groupRef} scale={1}>
            <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
                <BrowserWindow ref={browserRef} />
                <InstancedParticles />
                <pointLight position={[0, 0, 1.5]} intensity={0.8} color="#3b82f6" />
            </Float>
        </group>
    );
};

export default memo(WebAppScene);
