import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, RoundedBox, Capsule, Box } from "@react-three/drei";
import * as THREE from "three";

/** ---------- Resources ---------- */
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0,
    transmission: 0.6,
    thickness: 0.5,
    clearcoat: 1,
});

const techMaterial = new THREE.MeshStandardMaterial({
    color: "#cbd5e1",
    metalness: 0.8,
    roughness: 0.2,
});

const glowMaterial = new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    emissive: "#3b82f6",
    emissiveIntensity: 2,
    toneMapped: false,
});

/** ---------- Robot Head Component ---------- */
const RobotHead = memo(() => {
    const groupRef = useRef<THREE.Group>(null);
    const eyesRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Head tracking mouse
        if (groupRef.current) {
            const x = (pointer.x * viewport.width) / 2;
            const y = (pointer.y * viewport.height) / 2;

            const targetRotY = x * 0.1; // Look left/right
            const targetRotX = -y * 0.1; // Look up/down

            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
        }

        // Eyes blink/pulse
        if (eyesRef.current) {
            // Random blink
            if (Math.random() > 0.99) {
                eyesRef.current.scale.y = 0.1;
            } else {
                eyesRef.current.scale.y = THREE.MathUtils.lerp(eyesRef.current.scale.y, 1, 0.2);
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Head Shape */}
            <Capsule args={[0.35, 0.5, 4, 16]}>
                <primitive object={glassMaterial} attach="material" />
            </Capsule>

            {/* Internal Mechanics (Brain) */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Face/Visor Area */}
            <group position={[0, 0.1, 0.28]} ref={eyesRef}>
                <mesh position={[-0.1, 0, 0]}>
                    <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
                    <meshBasicMaterial color="#06b6d4" />
                </mesh>
                <mesh position={[0.1, 0, 0]}>
                    <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
                    <meshBasicMaterial color="#06b6d4" />
                </mesh>
            </group>

            {/* Antennae/Ears */}
            <mesh position={[0.38, 0.1, 0]} rotation={[0, 0, -0.3]}>
                <cylinderGeometry args={[0.02, 0.08, 0.2]} />
                <primitive object={techMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.38, 0.1, 0]} rotation={[0, 0, 0.3]}>
                <cylinderGeometry args={[0.02, 0.08, 0.2]} />
                <primitive object={techMaterial} attach="material" />
            </mesh>

            {/* Neck Ring */}
            <mesh position={[0, -0.4, 0]}>
                <torusGeometry args={[0.2, 0.05, 16, 32]} />
                <primitive object={techMaterial} attach="material" />
            </mesh>
        </group>
    );
});
RobotHead.displayName = "RobotHead";


/** ---------- Shared Device Materials ---------- */
const deviceBodyMat = new THREE.MeshStandardMaterial({
    color: "#334155",
    metalness: 0.6,
    roughness: 0.4,
});

const screenPhoneMat = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    emissive: "#1d4ed8",
    emissiveIntensity: 0.2,
    roughness: 0.2,
});

const screenTabletMat = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    emissive: "#8b5cf6",
    emissiveIntensity: 0.2,
    roughness: 0.2,
});

const screenLaptopMat = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    emissive: "#0ea5e9",
    emissiveIntensity: 0.2,
    roughness: 0.2,
});

/** ---------- Device Components ---------- */
type DeviceType = 'phone' | 'laptop' | 'tablet';

const Device = memo<{ type: DeviceType; position: [number, number, number]; rotation?: [number, number, number]; delay?: number }>(
    ({ type, position, rotation = [0, 0, 0], delay = 0 }) => {
        const groupRef = useRef<THREE.Group>(null);

        useFrame(({ clock }) => {
            if (groupRef.current) {
                const t = clock.getElapsedTime() + delay;
                groupRef.current.position.y = position[1] + Math.sin(t) * 0.05;
                groupRef.current.rotation.y += 0.005; // Slow spin
            }
        });

        const renderDevice = () => {
            switch (type) {
                case 'phone':
                    return (
                        <group>
                            <RoundedBox args={[0.2, 0.4, 0.02]} radius={0.02} smoothness={2}>
                                <primitive object={deviceBodyMat} attach="material" />
                            </RoundedBox>
                            <mesh position={[0, 0, 0.011]}>
                                <planeGeometry args={[0.18, 0.38]} />
                                <primitive object={screenPhoneMat} attach="material" />
                            </mesh>
                        </group>
                    );
                case 'tablet':
                    return (
                        <group rotation={[0, 0, Math.PI / 2]}>
                            <RoundedBox args={[0.3, 0.45, 0.02]} radius={0.02} smoothness={2}>
                                <primitive object={deviceBodyMat} attach="material" />
                            </RoundedBox>
                            <mesh position={[0, 0, 0.011]}>
                                <planeGeometry args={[0.28, 0.43]} />
                                <primitive object={screenTabletMat} attach="material" />
                            </mesh>
                        </group>
                    );
                case 'laptop':
                    return (
                        <group>
                            {/* Base */}
                            <RoundedBox args={[0.4, 0.02, 0.28]} radius={0.01} position={[0, -0.14, 0]} smoothness={2}>
                                <primitive object={deviceBodyMat} attach="material" />
                            </RoundedBox>
                            {/* Screen */}
                            <group position={[0, -0.14, -0.14]} rotation={[Math.PI / 6, 0, 0]}> {/* Open angle */}
                                <RoundedBox args={[0.4, 0.26, 0.02]} radius={0.01} position={[0, 0.13, 0]} smoothness={2}>
                                    <primitive object={deviceBodyMat} attach="material" />
                                </RoundedBox>
                                <mesh position={[0, 0.13, 0.011]}>
                                    <planeGeometry args={[0.38, 0.24]} />
                                    <primitive object={screenLaptopMat} attach="material" />
                                </mesh>
                            </group>
                        </group>
                    );
            }
        };

        return (
            <group ref={groupRef} position={position} rotation={rotation} scale={0.6}>
                {renderDevice()}
            </group>
        );
    }
);
Device.displayName = "Device";

/** ---------- Scene Layout ---------- */
const deviceLayout: { type: DeviceType, pos: [number, number, number] }[] = [
    // Inner Ring
    { type: 'phone', pos: [-0.8, 0.4, 0.4] },
    { type: 'phone', pos: [0.8, 0.4, 0.4] },
    { type: 'tablet', pos: [-0.9, -0.3, 0.0] },
    { type: 'tablet', pos: [0.9, -0.3, 0.0] },
    // Outer Ring
    { type: 'laptop', pos: [0, 0.9, -0.5] },
    { type: 'laptop', pos: [0, -0.9, -0.5] },
    { type: 'phone', pos: [-1.4, 0.0, -0.2] },
    { type: 'tablet', pos: [1.4, 0.0, -0.2] },
];

type Conn = { start: [number, number, number]; end: [number, number, number] };
const connections: Conn[] = deviceLayout.map(d => ({
    start: [0, 0, 0], // From Robot Center
    end: d.pos
}));


/** ---------- Connections & Data ---------- */
const connectionGeometry = new THREE.CylinderGeometry(0.005, 0.005, 1, 8);
connectionGeometry.rotateX(Math.PI / 2);
connectionGeometry.translate(0, 0, 0.5);

const Connections = memo<{ connections: Conn[] }>(({ connections }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        connections.forEach((conn, i) => {
            const start = new THREE.Vector3(...conn.start);
            const end = new THREE.Vector3(...conn.end);
            const dist = start.distanceTo(end);
            temp.position.copy(start);
            temp.lookAt(end);
            temp.scale.set(1, 1, dist);
            temp.updateMatrix();
            meshRef.current!.setMatrixAt(i, temp.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [connections]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        // Simple static blue lines
    });

    return (
        <instancedMesh ref={meshRef} args={[connectionGeometry, undefined, connections.length]}>
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
        </instancedMesh>
    );
});
Connections.displayName = "Connections";

const DataPackets = memo<{ links: Conn[] }>(({ links }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);
    const vecs = useMemo(() => links.map(c => ({
        start: new THREE.Vector3(...c.start),
        dir: new THREE.Vector3(...c.end).sub(new THREE.Vector3(...c.start))
    })), [links]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!meshRef.current) return;

        for (let i = 0; i < vecs.length; i++) {
            const speed = 1.0;
            const offset = i * 0.7;
            const p = ((t * speed + offset) % 1);

            // Bidirectional flow? Or just Outward? Let's do outward for "Powering"
            temp.position.copy(vecs[i].start).addScaledVector(vecs[i].dir, p);
            temp.scale.setScalar(1);
            temp.updateMatrix();
            meshRef.current.setMatrixAt(i, temp.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const geo = useMemo(() => new THREE.SphereGeometry(0.03, 8, 8), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#60a5fa" }), []);

    return <instancedMesh ref={meshRef} args={[geo, mat, vecs.length]} />;
});
DataPackets.displayName = "DataPackets";


/** ---------- Main Scene ---------- */
const AIScene: React.FC = () => {
    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <group scale={1.1}>
                {/* The AI Robot */}
                <RobotHead />

                {/* Surrounding Devices */}
                {deviceLayout.map((d, i) => (
                    <Device key={i} type={d.type} position={d.pos} delay={i * 0.2} />
                ))}

                {/* Connectivity */}
                <Connections connections={connections} />
                <DataPackets links={connections} />

                {/* Circuit Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
                    <planeGeometry args={[6, 6]} />
                    <meshBasicMaterial color="#0f172a" transparent opacity={0.0} />
                    {/* Invisible catcher or just strict visuals? Using grid helper instead */}
                    <gridHelper args={[6, 20, 0x1e3a8a, 0x1e293b]} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                </mesh>

                <pointLight position={[0, 0, 2]} intensity={2} color="#3b82f6" />
                <pointLight position={[-2, 1, 1]} intensity={1} color="#a78bfa" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
