import React, { useRef, useMemo, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Minimalist monochrome materials
const frameMaterial = new THREE.MeshStandardMaterial({
    color: "#18181b",
    metalness: 0.9,
    roughness: 0.1
});

const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#09090b",
    metalness: 0.1,
    roughness: 0.05,
    emissive: "#3b82f6",
    emissiveIntensity: 0.03
});

// Minimal UI elements - just 4 simple blocks
const UI_ELEMENTS = [
    { pos: [0, 0.5, 0.06] as const, size: [0.6, 0.08, 0.005] as const, color: '#3b82f6' },
    { pos: [0, 0.35, 0.06] as const, size: [0.5, 0.06, 0.005] as const, color: '#6366f1' },
    { pos: [0, 0.1, 0.06] as const, size: [0.55, 0.15, 0.005] as const, color: '#1e293b' },
    { pos: [0, -0.2, 0.06] as const, size: [0.55, 0.15, 0.005] as const, color: '#1e293b' },
];

// Static UI bars
const UIElements = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);
    const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.9
    }), []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        UI_ELEMENTS.forEach((el, i) => {
            tempObj.position.set(el.pos[0], el.pos[1], el.pos[2]);
            tempObj.scale.set(el.size[0], el.size[1], el.size[2]);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
            colorObj.set(el.color);
            meshRef.current?.setColorAt(i, colorObj);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [tempObj, colorObj]);

    return <instancedMesh ref={meshRef} args={[geometry, material, UI_ELEMENTS.length]} />;
});
UIElements.displayName = 'UIElements';

// Clean minimal phone
const PhoneDevice = memo(React.forwardRef<THREE.Group>((_, ref) => {
    return (
        <group ref={ref}>
            {/* Frame */}
            <RoundedBox args={[0.85, 1.75, 0.07]} radius={0.08} smoothness={4}>
                <primitive object={frameMaterial} attach="material" />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[0.78, 1.68, 0.01]} radius={0.05} smoothness={3} position={[0, 0, 0.035]}>
                <primitive object={screenMaterial} attach="material" />
            </RoundedBox>

            {/* Dynamic island - minimal */}
            <mesh position={[0, 0.75, 0.042]}>
                <boxGeometry args={[0.2, 0.05, 0.005]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* UI Elements */}
            <UIElements />

            {/* Bottom bar */}
            <mesh position={[0, -0.75, 0.042]}>
                <boxGeometry args={[0.25, 0.015, 0.005]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </mesh>
        </group>
    );
}));
PhoneDevice.displayName = 'PhoneDevice';

// Minimal floating dots - just subtle ambient particles
const FloatingDots = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    const positions = useMemo(() => [
        [-0.8, 0.5, 0.2],
        [0.75, 0.3, 0.25],
        [-0.7, -0.4, 0.15],
    ] as [number, number, number][], []);

    const geometry = useMemo(() => new THREE.SphereGeometry(0.03, 8, 8), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#6366f1',
        emissive: '#6366f1',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        positions.forEach((pos, i) => {
            const delay = i * 1.2;
            tempObj.position.set(
                pos[0] + Math.sin(t * 0.4 + delay) * 0.08,
                pos[1] + Math.cos(t * 0.3 + delay) * 0.1,
                pos[2]
            );
            tempObj.scale.setScalar(0.8 + Math.sin(t * 0.5 + delay) * 0.2);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} />;
});
FloatingDots.displayName = 'FloatingDots';

const MobileAppScene: React.FC = () => {
    const phoneRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
        }

        if (phoneRef.current) {
            const autoRotX = Math.cos(t * 0.15) * 0.03;
            const autoRotY = Math.sin(t * 0.25) * 0.05;
            const mouseRotX = -(pointer.y * viewport.height / 2) * 0.015;
            const mouseRotY = (pointer.x * viewport.width / 2) * 0.015;

            phoneRef.current.rotation.x = THREE.MathUtils.lerp(phoneRef.current.rotation.x, autoRotX + mouseRotX, 0.06);
            phoneRef.current.rotation.y = THREE.MathUtils.lerp(phoneRef.current.rotation.y, autoRotY + mouseRotY, 0.06);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
                <group scale={1.2}>
                    {/* @ts-ignore */}
                    <PhoneDevice ref={phoneRef} />
                    <FloatingDots />
                    <pointLight position={[0, 0, 1]} intensity={0.4} color="#6366f1" />
                </group>
            </Float>
        </group>
    );
};

export default memo(MobileAppScene);
