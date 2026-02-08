import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
const iconGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.04);
const smallIconGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.01);

const appColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#6366f1'];

// Smooth phone animation - Forward Ref
const PhoneDevice = memo(React.forwardRef<THREE.Group>((_, ref) => {
    const appGrid = useMemo(() => [
        [-0.25, 0.6], [0, 0.6], [0.25, 0.6],
        [-0.25, 0.3], [0, 0.3], [0.25, 0.3],
        [-0.25, 0], [0, 0], [0.25, 0],
    ].map(([x, y], i) => ({
        position: [x, y, 0.08] as [number, number, number],
        color: appColors[i]
    })), []);

    return (
        <group ref={ref}>
            <RoundedBox args={[1.0, 2.0, 0.1]} radius={0.1} smoothness={3}>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
            </RoundedBox>

            <RoundedBox args={[0.88, 1.8, 0.02]} radius={0.06} smoothness={3} position={[0, 0, 0.06]}>
                <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.15} />
            </RoundedBox>

            {appGrid.map((app, i) => (
                <mesh key={i} position={app.position} geometry={smallIconGeometry}>
                    <meshStandardMaterial color={app.color} emissive={app.color} emissiveIntensity={0.4} />
                </mesh>
            ))}

            <mesh position={[0, 0.85, 0.07]}>
                <boxGeometry args={[0.3, 0.05, 0.01]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>

            <mesh position={[0, -0.8, 0.07]}>
                <boxGeometry args={[0.25, 0.02, 0.01]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            <mesh position={[0.52, 0.4, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.06]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
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
            tempObj.position.x = basePos[0] + Math.cos(t * 0.4 + delay) * 0.1;
            tempObj.position.y = basePos[1] + Math.sin(t * 0.6 + delay) * 0.15;
            tempObj.position.z = basePos[2];
            tempObj.rotation.y = (t + delay) * 0.3;

            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff', // Base color, instance color will multiply
        emissive: '#ffffff',
        emissiveIntensity: 0.3,
    }), []);

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

    useFrame(({ clock }) => {
        if (phoneRef.current) {
            const t = clock.getElapsedTime();
            phoneRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
            phoneRef.current.rotation.z = Math.cos(t * 0.3) * 0.05;
        }
    });

    return (
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
            <group scale={1.2}>
                {/* @ts-ignore */}
                <PhoneDevice ref={phoneRef} />

                <InstancedIcons icons={floatingIcons} />

                <pointLight position={[0, 0, 1.5]} intensity={0.35} color="#8b5cf6" />
            </group>
        </Float>
    );
};

export default memo(MobileAppScene);
