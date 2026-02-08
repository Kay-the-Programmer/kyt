import React, { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, Torus, Line } from "@react-three/drei";
import * as THREE from "three";

/** ---------- Layout (systems/modules) ---------- */
const innerNodes: [number, number, number][] = [
    [-0.65, 0.35, 0.25],
    [0.65, 0.35, 0.25],
    [-0.55, -0.35, 0.25],
    [0.55, -0.35, 0.25],
    [0, 0.75, 0.2],
    [0, -0.7, 0.2],
];

const outerModules: [number, number, number][] = [
    [-1.25, 0.75, -0.1],
    [1.25, 0.75, -0.1],
    [-1.35, 0.0, -0.1],
    [1.35, 0.0, -0.1],
    [-1.25, -0.75, -0.1],
    [1.25, -0.75, -0.1],
];

type Conn = { start: [number, number, number]; end: [number, number, number] };

const connections: Conn[] = [
    ...innerNodes.map((n) => ({ start: [0, 0, 0] as [number, number, number], end: n })),
    { start: innerNodes[0], end: outerModules[0] },
    { start: innerNodes[1], end: outerModules[1] },
    { start: innerNodes[2], end: outerModules[2] },
    { start: innerNodes[3], end: outerModules[3] },
    { start: innerNodes[5], end: outerModules[4] },
    { start: innerNodes[5], end: outerModules[5] },
];

/** ---------- AI Core (brain) ---------- */
const AICore = memo(() => {
    const groupRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);
    const ringRef3 = useRef<THREE.Mesh>(null);

    const coreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#3b82f6",
        emissive: "#1d4ed8",
        emissiveIntensity: 2.0,
        roughness: 0,
        metalness: 0.1,
        transmission: 0.2, // Glass-like
        thickness: 0.5,
        clearcoat: 1,
    }), []);

    const ringMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#60a5fa",
        emissive: "#3b82f6",
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        wireframe: true // Tech look
    }), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
        }

        // Pulse core
        if (innerRef.current) {
            const scale = 1 + Math.sin(t * 3) * 0.05 + Math.sin(t * 10) * 0.02; // Complex pulse
            innerRef.current.scale.setScalar(scale);
        }

        // Rotate rings
        if (ringRef1.current) {
            ringRef1.current.rotation.x = t * 0.4;
            ringRef1.current.rotation.y = t * 0.2;
        }
        if (ringRef2.current) {
            ringRef2.current.rotation.x = t * 0.3 + 1;
            ringRef2.current.rotation.z = t * 0.5;
        }
        if (ringRef3.current) {
            ringRef3.current.rotation.y = -t * 0.6;
            ringRef3.current.rotation.z = t * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Inner Glowing Core */}
            <Sphere ref={innerRef} args={[0.3, 32, 32]}>
                <primitive object={coreMat} attach="material" />
            </Sphere>

            {/* Core Halo Glow (Billboard) */}
            <mesh>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Orbiting Rings */}
            <Torus ref={ringRef1} args={[0.5, 0.01, 16, 100]}>
                <primitive object={ringMat} attach="material" />
            </Torus>
            <Torus ref={ringRef2} args={[0.65, 0.01, 16, 100]} rotation={[0.5, 0, 0]}>
                <primitive object={ringMat} attach="material" />
            </Torus>
            <Torus ref={ringRef3} args={[0.8, 0.005, 16, 100]} rotation={[0, 0.5, 0.5]}>
                <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} />
            </Torus>
        </group>
    );
});
AICore.displayName = "AICore";

/** ---------- Circuit Grid (system plane) ---------- */
const CircuitGrid = memo(() => {
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const geo = useMemo(() => new THREE.PlaneGeometry(6, 6, 20, 20), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (mat.current) {
            // Scanning grid effect
            mat.current.emissiveIntensity = 0.2 + (Math.sin(t * 0.5) + 1) * 0.1;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} geometry={geo}>
            <meshStandardMaterial
                ref={mat}
                color="#0b1220"
                emissive="#1d4ed8"
                emissiveIntensity={0.2}
                transparent
                opacity={0.3}
                wireframe
            />
        </mesh>
    );
});
CircuitGrid.displayName = "CircuitGrid";

/** ---------- Inner Nodes (instanced) ---------- */
const InstancedNodes = memo<{ positions: [number, number, number][]; outer?: boolean; baseDelay: number }>(
    ({ positions, outer = false, baseDelay }) => {
        const meshRef = useRef<THREE.InstancedMesh>(null);
        const temp = useMemo(() => new THREE.Object3D(), []);

        // Memoize resources
        const geometry = useMemo(() => new THREE.SphereGeometry(outer ? 0.08 : 0.06, 16, 16), [outer]);
        const material = useMemo(() => new THREE.MeshStandardMaterial({
            color: outer ? "#a78bfa" : "#60a5fa",
            emissive: outer ? "#8b5cf6" : "#3b82f6",
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.8
        }), [outer]);

        useFrame(({ clock }) => {
            const t = clock.getElapsedTime();
            if (!meshRef.current) return;

            for (let i = 0; i < positions.length; i++) {
                const delay = baseDelay + i * 0.2;
                const pulse = 1 + Math.sin(t * 3 + delay) * 0.15;

                temp.position.set(...positions[i]);
                // Subtle float
                temp.position.y += Math.sin(t + delay) * 0.05;

                temp.scale.setScalar(pulse);
                temp.updateMatrix();
                meshRef.current.setMatrixAt(i, temp.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        });

        return (
            <instancedMesh
                ref={meshRef}
                args={[geometry, material, positions.length]}
            />
        );
    }
);
InstancedNodes.displayName = "InstancedNodes";

/** ---------- Connections (Optimized Instanced Cylinders) ---------- */
const connectionGeometry = new THREE.CylinderGeometry(0.005, 0.005, 1, 8);
connectionGeometry.rotateX(Math.PI / 2);
connectionGeometry.translate(0, 0, 0.5);

const Connections = memo<{ connections: Conn[] }>(({ connections }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);
    const color = useMemo(() => new THREE.Color(), []);

    // Static layout
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
    }, [connections, temp]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < connections.length; i++) {
            const phase = i * 0.2;
            const pulse = 0.3 + (Math.sin(t * 3.0 + phase) + 1) * 0.2; // Faster pulse
            color.set("#60a5fa").multiplyScalar(pulse);
            meshRef.current.setColorAt(i, color);
        }
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[connectionGeometry, undefined, connections.length]}
        >
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.4}
                depthWrite={false}
                toneMapped={false}
            />
        </instancedMesh>
    );
});
Connections.displayName = "Connections";

/** ---------- Data Packets flowing through links ---------- */
const DataPackets = memo<{ links: Conn[] }>(({ links }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);

    const vecs = useMemo(
        () =>
            links.map((c) => {
                const a = new THREE.Vector3(...c.start);
                const b = new THREE.Vector3(...c.end);
                return { start: a, dir: b.sub(a) };
            }),
        [links]
    );

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!meshRef.current) return;

        for (let i = 0; i < vecs.length; i++) {
            const speed = 0.8; // Faster data
            const offset = i * 1.25;
            const p = ((t * speed + offset) % 1);

            // Easing
            const eased = p; // Linear is often better for data flow consistency

            temp.position.copy(vecs[i].start).addScaledVector(vecs[i].dir, eased);

            // Scale pulse based on position (grow as it travels?)
            temp.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.5);

            temp.updateMatrix();
            meshRef.current.setMatrixAt(i, temp.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Memoize resources
    const packetGeometry = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);
    const packetMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: "#ffffff",
    }), []);

    return <instancedMesh ref={meshRef} args={[packetGeometry, packetMaterial, vecs.length]} />;
});
DataPackets.displayName = "DataPackets";

/** ---------- Final Scene ---------- */
const AIScene: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const { pointer, viewport } = useThree();

    // Mouse parallax
    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime();
        const x = pointer.x * viewport.width / 2;
        const y = pointer.y * viewport.height / 2;

        // Auto rotate + mouse influence
        const targetRotY = (x * 0.05) + Math.sin(t * 0.1) * 0.1;
        const targetRotX = (-y * 0.05) + Math.cos(t * 0.15) * 0.05;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    });

    // choose which links carry packets
    const packetLinks = useMemo(() => connections, []);

    return (
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group scale={1.2} ref={groupRef}>
                {/* Environment */}
                <CircuitGrid />

                {/* AI core */}
                <AICore />

                {/* Nodes */}
                <InstancedNodes positions={innerNodes} baseDelay={0} />
                <InstancedNodes positions={outerModules} outer baseDelay={0.5} />

                {/* Networking */}
                <Connections connections={connections} />
                <DataPackets links={packetLinks} />

                <pointLight position={[0, 0.2, 2]} intensity={1.5} color="#3b82f6" />
                <pointLight position={[-2, 1, 1]} intensity={0.8} color="#a78bfa" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
