import React, { useRef, useMemo, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared colors for app icons
const appColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'];

const APP_GRID_POSITIONS = [
    [-0.22, 0.55], [0, 0.55], [0.22, 0.55],
    [-0.22, 0.3], [0, 0.3], [0.22, 0.3],
    [-0.22, 0.05], [0, 0.05], [0.22, 0.05],
];

// Minimalist materials
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: "#1e293b",
    metalness: 0.7,
    roughness: 0.2
});

const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    metalness: 0.2,
    roughness: 0.1,
    emissive: "#1e40af",
    emissiveIntensity: 0.1
});

// Instanced grid icons - minimal animation
const GridIcons = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);

    const geometry = useMemo(() => new THREE.BoxGeometry(0.12, 0.12, 0.01), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 0.1
    }), []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        APP_GRID_POSITIONS.forEach((pos, i) => {
            tempObj.position.set(pos[0], pos[1], 0.07);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
            colorObj.set(appColors[i]);
            meshRef.current?.setColorAt(i, colorObj);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [tempObj, colorObj]);

    // Subtle breathing animation - less frequent updates
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        // Only update every few frames for performance
        if (Math.floor(t * 30) % 2 !== 0) return;

        APP_GRID_POSITIONS.forEach((pos, i) => {
            const pulse = Math.sin(t * 2 + i * 0.3) * 0.01;
            tempObj.position.set(pos[0], pos[1], 0.07 + pulse);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, APP_GRID_POSITIONS.length]} />;
});
GridIcons.displayName = 'GridIcons';

// Clean phone device
const PhoneDevice = memo(React.forwardRef<THREE.Group>((_, ref) => {
    return (
        <group ref={ref}>
            {/* Phone body */}
            <RoundedBox args={[0.9, 1.9, 0.08]} radius={0.1} smoothness={3}>
                <primitive object={bodyMaterial} attach="material" />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[0.82, 1.8, 0.02]} radius={0.06} smoothness={2} position={[0, 0, 0.045]}>
                <primitive object={screenMaterial} attach="material" />
            </RoundedBox>

            {/* Notch */}
            <mesh position={[0, 0.85, 0.05]}>
                <capsuleGeometry args={[0.06, 0.15, 4, 6]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* App Icons */}
            <GridIcons />
        </group>
    );
}));
PhoneDevice.displayName = 'PhoneDevice';

// Reduced floating icons - just 3 for minimalism
const floatingIconsData: { position: [number, number, number]; color: string }[] = [
    { position: [-0.75, 0.6, 0.3], color: '#3b82f6' },
    { position: [0.7, 0.4, 0.35], color: '#8b5cf6' },
    { position: [-0.65, -0.5, 0.25], color: '#10b981' },
];

const InstancedFloatingIcons = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);

    const geometry = useMemo(() => new THREE.BoxGeometry(0.15, 0.15, 0.03), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.2
    }), []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        floatingIconsData.forEach((icon, i) => {
            colorObj.set(icon.color);
            meshRef.current?.setColorAt(i, colorObj);
        });
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [colorObj]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        floatingIconsData.forEach((icon, i) => {
            const delay = i * 0.8;
            tempObj.position.set(
                icon.position[0] + Math.cos(t * 0.3 + delay) * 0.1,
                icon.position[1] + Math.sin(t * 0.5 + delay) * 0.15,
                icon.position[2]
            );
            tempObj.rotation.set(t * 0.15 + delay, t * 0.2 + delay, 0);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, floatingIconsData.length]} />;
});
InstancedFloatingIcons.displayName = 'InstancedFloatingIcons';

const MobileAppScene: React.FC = () => {
    const phoneRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.5) * 0.04;
        }

        if (phoneRef.current) {
            const autoRotX = Math.cos(t * 0.2) * 0.04;
            const autoRotY = Math.sin(t * 0.3) * 0.06;
            const mouseRotX = -(pointer.y * viewport.height / 2) * 0.02;
            const mouseRotY = (pointer.x * viewport.width / 2) * 0.02;

            phoneRef.current.rotation.x = THREE.MathUtils.lerp(phoneRef.current.rotation.x, autoRotX + mouseRotX, 0.08);
            phoneRef.current.rotation.y = THREE.MathUtils.lerp(phoneRef.current.rotation.y, autoRotY + mouseRotY, 0.08);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.25}>
                <group scale={1.15}>
                    {/* @ts-ignore */}
                    <PhoneDevice ref={phoneRef} />
                    <InstancedFloatingIcons />
                    <pointLight position={[0, 0, 1.2]} intensity={0.6} color="#8b5cf6" />
                </group>
            </Float>
        </group>
    );
};

export default memo(MobileAppScene);
