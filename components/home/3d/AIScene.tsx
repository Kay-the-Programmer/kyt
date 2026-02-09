import React, { memo, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Capsule } from "@react-three/drei";
import * as THREE from "three";

// Minimalist materials
const techMaterial = new THREE.MeshStandardMaterial({
    color: "#cbd5e1",
    metalness: 0.7,
    roughness: 0.3,
});

const deviceBodyMaterial = new THREE.MeshStandardMaterial({
    color: "#334155",
    metalness: 0.5,
    roughness: 0.4,
});

const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    emissive: "#1d4ed8",
    emissiveIntensity: 0.15,
    roughness: 0.2,
});

// Robot head - simplified for performance
const RobotHead = memo(() => {
    const groupRef = useRef<THREE.Group>(null);
    const eyesRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Head follows mouse
        if (groupRef.current) {
            const x = (pointer.x * viewport.width) / 4;
            const y = (pointer.y * viewport.height) / 4;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.15, 0.08);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.15, 0.08);
            groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
        }

        // Blink effect
        if (eyesRef.current) {
            const blink = Math.random() > 0.985 ? 0.1 : 1;
            eyesRef.current.scale.y = THREE.MathUtils.lerp(eyesRef.current.scale.y, blink, 0.25);
        }

        // Core rotation
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.4;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer shell - simplified material */}
            <Capsule args={[0.35, 0.45, 6, 24]}>
                <meshStandardMaterial
                    color="#e2e8f0"
                    metalness={0.3}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                />
            </Capsule>

            {/* Core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.22, 24, 24]} />
                <meshStandardMaterial
                    color="#1e293b"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#3b82f6"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Eyes */}
            <group position={[0, 0.08, 0.28]} ref={eyesRef}>
                <mesh position={[-0.1, 0, 0]}>
                    <capsuleGeometry args={[0.035, 0.1, 4, 6]} />
                    <meshBasicMaterial color="#06b6d4" />
                </mesh>
                <mesh position={[0.1, 0, 0]}>
                    <capsuleGeometry args={[0.035, 0.1, 4, 6]} />
                    <meshBasicMaterial color="#06b6d4" />
                </mesh>
            </group>

            {/* Antennae */}
            <mesh position={[0.38, 0.08, 0]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.008, 0.04, 0.2]} />
                <primitive object={techMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.38, 0.08, 0]} rotation={[0, 0, 0.35]}>
                <cylinderGeometry args={[0.008, 0.04, 0.2]} />
                <primitive object={techMaterial} attach="material" />
            </mesh>
        </group>
    );
});
RobotHead.displayName = "RobotHead";

// Device layout - reduced to 5 for minimalism
type DeviceType = 'phone' | 'tablet';
const deviceLayout: { type: DeviceType; pos: [number, number, number] }[] = [
    { type: 'phone', pos: [-0.75, 0.35, 0.35] },
    { type: 'phone', pos: [0.75, 0.35, 0.35] },
    { type: 'tablet', pos: [-0.8, -0.3, 0.15] },
    { type: 'tablet', pos: [0.8, -0.3, 0.15] },
    { type: 'phone', pos: [0, -0.7, 0.3] },
];

// Instanced devices
const InstancedDevices = memo(() => {
    const phoneRef = useRef<THREE.InstancedMesh>(null);
    const tabletRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    const phoneData = useMemo(() => deviceLayout.filter(d => d.type === 'phone'), []);
    const tabletData = useMemo(() => deviceLayout.filter(d => d.type === 'tablet'), []);

    const phoneGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 0.35, 0.02), []);
    const tabletGeometry = useMemo(() => new THREE.BoxGeometry(0.4, 0.28, 0.02), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (phoneRef.current) {
            phoneData.forEach((d, i) => {
                tempObj.position.set(d.pos[0], d.pos[1] + Math.sin(t * 0.8 + i) * 0.03, d.pos[2]);
                tempObj.rotation.y = t * 0.15 + i * 0.5;
                tempObj.scale.setScalar(0.55);
                tempObj.updateMatrix();
                phoneRef.current?.setMatrixAt(i, tempObj.matrix);
            });
            phoneRef.current.instanceMatrix.needsUpdate = true;
        }

        if (tabletRef.current) {
            tabletData.forEach((d, i) => {
                tempObj.position.set(d.pos[0], d.pos[1] + Math.sin(t * 0.6 + i * 0.5) * 0.025, d.pos[2]);
                tempObj.rotation.y = t * 0.1 + i * 0.4;
                tempObj.scale.setScalar(0.55);
                tempObj.updateMatrix();
                tabletRef.current?.setMatrixAt(i, tempObj.matrix);
            });
            tabletRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <>
            <instancedMesh ref={phoneRef} args={[phoneGeometry, deviceBodyMaterial, phoneData.length]} />
            <instancedMesh ref={tabletRef} args={[tabletGeometry, deviceBodyMaterial, tabletData.length]} />
        </>
    );
});
InstancedDevices.displayName = "InstancedDevices";

// Static connections - no animation for performance
const connectionGeometry = new THREE.CylinderGeometry(0.004, 0.004, 1, 6);
connectionGeometry.rotateX(Math.PI / 2);
connectionGeometry.translate(0, 0, 0.5);

const Connections = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);

    const connections = useMemo(() =>
        deviceLayout.map(d => ({
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(...d.pos)
        })),
        []);

    React.useLayoutEffect(() => {
        if (!meshRef.current) return;
        connections.forEach((conn, i) => {
            const dist = conn.start.distanceTo(conn.end);
            temp.position.copy(conn.start);
            temp.lookAt(conn.end);
            temp.scale.set(1, 1, dist);
            temp.updateMatrix();
            meshRef.current!.setMatrixAt(i, temp.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [connections, temp]);

    return (
        <instancedMesh ref={meshRef} args={[connectionGeometry, undefined, connections.length]}>
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} depthWrite={false} />
        </instancedMesh>
    );
});
Connections.displayName = "Connections";

// Main scene
const AIScene: React.FC = () => {
    return (
        <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.3}>
            <group scale={1.05}>
                <RobotHead />
                <InstancedDevices />
                <Connections />
                <pointLight position={[0, 0, 1.5]} intensity={1} color="#3b82f6" />
                <pointLight position={[-1.5, 0.8, 0.8]} intensity={0.4} color="#a78bfa" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
