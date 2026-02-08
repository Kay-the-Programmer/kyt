import React, { useRef, useMemo, memo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
const appColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'];

// Notification Bubble Component
const NotificationBubble = memo(() => {
    const ref = useRef<THREE.Group>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(v => !v);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useFrame(({ clock }) => {
        if (!ref.current) return;

        const targetScale = visible ? 1 : 0;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        if (visible) {
            ref.current.position.y = 1.2 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
        }
    });

    return (
        <group ref={ref} position={[0.6, 1.2, 0.2]} scale={0}>
            <RoundedBox args={[0.8, 0.3, 0.05]} radius={0.15} smoothness={4}>
                <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.2} />
            </RoundedBox>
            <mesh position={[-0.2, 0, 0.03]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0.1, 0.05, 0.03]}>
                <planeGeometry args={[0.3, 0.02]} />
                <meshBasicMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0.1, -0.05, 0.03]}>
                <planeGeometry args={[0.2, 0.02]} />
                <meshBasicMaterial color="#cbd5e1" />
            </mesh>
        </group>
    );
});
NotificationBubble.displayName = 'NotificationBubble';

// Smooth phone animation - Forward Ref
const PhoneDevice = memo(React.forwardRef<THREE.Group>((_, ref) => {
    const appGrid = useMemo(() => [
        [-0.25, 0.6], [0, 0.6], [0.25, 0.6],
        [-0.25, 0.3], [0, 0.3], [0.25, 0.3],
        [-0.25, 0], [0, 0], [0.25, 0],
    ].map(([x, y], i) => ({
        position: [x, y, 0.08] as [number, number, number],
        color: appColors[i],
        delay: i * 0.1
    })), []);

    // Memoize geometries
    const smallIconGeometry = useMemo(() => new THREE.BoxGeometry(0.15, 0.15, 0.01), []);

    // Premium Materials
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#1e293b",
        metalness: 0.8,
        roughness: 0.2
    }), []);

    const sideBandMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#334155",
        metalness: 0.9,
        roughness: 0.1
    }), []);

    const screenMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#0f172a",
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    }), []);

    // Animated App Icons
    const AnimatedAppIcon = ({ position, color, delay }: { position: [number, number, number], color: string, delay: number }) => {
        const iconRef = useRef<THREE.Mesh>(null);

        useFrame(({ clock }) => {
            if (iconRef.current) {
                const t = clock.getElapsedTime();
                const zOffset = Math.sin(t * 2 + delay) * 0.005;
                iconRef.current.position.z = position[2] + zOffset;
                // Subtle scale pulse
                const scale = 1 + Math.sin(t * 3 + delay) * 0.03;
                iconRef.current.scale.setScalar(scale);
            }
        });

        return (
            <mesh ref={iconRef} position={position} geometry={smallIconGeometry}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
        );
    };

    return (
        <group ref={ref}>
            {/* Body */}
            <RoundedBox args={[1.0, 2.05, 0.1]} radius={0.12} smoothness={4}>
                <primitive object={bodyMat} attach="material" />
            </RoundedBox>

            {/* Side Band (metallic look) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.02, 2.02, 0.09]} />
                <primitive object={sideBandMat} attach="material" />
            </mesh>

            {/* Screen */}
            <RoundedBox args={[0.92, 1.95, 0.02]} radius={0.08} smoothness={4} position={[0, 0, 0.051]}>
                <primitive object={screenMat} attach="material" />
            </RoundedBox>

            {/* Notch */}
            <mesh position={[0, 0.9, 0.052]}>
                <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
                <meshBasicMaterial color="#000000" />
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
            </mesh>

            {/* Apps */}
            {appGrid.map((app, i) => (
                <AnimatedAppIcon key={i} {...app} />
            ))}

            {/* Button */}
            <mesh position={[0.51, 0.4, 0]}>
                <boxGeometry args={[0.02, 0.15, 0.04]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Dynamic Element: Notification */}
            <NotificationBubble />
        </group>
    );
}));

PhoneDevice.displayName = 'PhoneDevice';

const floatingIcons: { position: [number, number, number]; color: string }[] = [
    { position: [-0.9, 0.8, 0.3], color: '#3b82f6' },
    { position: [0.85, 0.6, 0.4], color: '#8b5cf6' },
    { position: [-0.8, -0.7, 0.25], color: '#10b981' },
    { position: [0.9, -0.5, 0.35], color: '#f59e0b' },
    { position: [-0.7, 0.2, 0.5], color: '#ec4899' },
];

// Instanced icons with colors
const InstancedIcons = memo<{ icons: { position: [number, number, number]; color: string }[] }>(({ icons }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const colorObj = useMemo(() => new THREE.Color(), []);

    const iconGeometry = useMemo(() => new THREE.BoxGeometry(0.2, 0.2, 0.04), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff', // Base color, instance color will multiply
        emissive: '#ffffff',
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.3
    }), []);

    // Set instance colors once
    React.useLayoutEffect(() => {
        if (meshRef.current) {
            icons.forEach((icon, i) => {
                colorObj.set(icon.color);
                meshRef.current?.setColorAt(i, colorObj);
            });
            meshRef.current.instanceColor!.needsUpdate = true;
        }
    }, [icons, colorObj]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < icons.length; i++) {
            const delay = i * 0.7;
            const basePos = icons[i].position;

            // Calculate animated position
            tempObj.position.x = basePos[0] + Math.cos(t * 0.4 + delay) * 0.15;
            tempObj.position.y = basePos[1] + Math.sin(t * 0.6 + delay) * 0.2;
            tempObj.position.z = basePos[2];

            // Tumble
            tempObj.rotation.x = t * 0.2 + delay;
            tempObj.rotation.y = t * 0.3 + delay;

            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[iconGeometry, material, icons.length]}
        />
    );
});

InstancedIcons.displayName = 'InstancedIcons';

const MobileAppScene: React.FC = () => {
    const phoneRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Organic floating
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.6) * 0.05;
        }

        if (phoneRef.current) {

            // Gentle sway
            const autoRotX = Math.cos(t * 0.25) * 0.05;
            const autoRotY = Math.sin(t * 0.35) * 0.08;

            // Mouse influence (damped)
            const x = pointer.x * viewport.width / 2;
            const y = pointer.y * viewport.height / 2;
            const mouseRotX = -y * 0.03;
            const mouseRotY = x * 0.03;

            // Lerp current rotation to target
            phoneRef.current.rotation.x = THREE.MathUtils.lerp(phoneRef.current.rotation.x, autoRotX + mouseRotX, 0.1);
            phoneRef.current.rotation.y = THREE.MathUtils.lerp(phoneRef.current.rotation.y, autoRotY + mouseRotY, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
                <group scale={1.2}>
                    {/* @ts-ignore */}
                    <PhoneDevice ref={phoneRef} />

                    <InstancedIcons icons={floatingIcons} />

                    <pointLight position={[0, 0, 1.5]} intensity={0.35} color="#8b5cf6" />
                </group>
            </Float>
        </group>
    );
};

export default memo(MobileAppScene);
