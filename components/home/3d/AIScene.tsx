import React, { memo, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, RoundedBox, Line } from "@react-three/drei";
import * as THREE from "three";

/** ---------- Shared geometry/material (perf) ---------- */
// Moved inside components for proper lifecycle management
// const nodeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
// const packetGeometry = new THREE.SphereGeometry(0.03, 10, 10);

// Moved inside components
// const coreMaterial = ...
// const nodeMaterial = ...
// const outerNodeMaterial = ...
// const packetMaterial = ...

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
    const g = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Mesh>(null);
    const halo = useRef<THREE.Mesh>(null);

    const ring1 = useMemo(() => new THREE.TorusGeometry(0.48, 0.018, 14, 80), []);
    const ring2 = useMemo(() => new THREE.TorusGeometry(0.60, 0.014, 14, 80), []);
    const haloGeo = useMemo(() => new THREE.RingGeometry(0.72, 0.86, 64), []);

    const coreMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#3b82f6",
        emissive: "#1d4ed8",
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.92,
    }), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (g.current) {
            g.current.rotation.y = t * 0.28;
            g.current.rotation.x = Math.sin(t * 0.18) * 0.08;
        }
        if (inner.current) {
            const s = 1 + Math.sin(t * 2.1) * 0.09;
            inner.current.scale.setScalar(s);
        }
        if (halo.current) {
            const p = 0.35 + (Math.sin(t * 1.6) + 1) * 0.12;
            (halo.current.material as THREE.MeshBasicMaterial).opacity = p;
            halo.current.rotation.z = t * 0.18;
        }
    });

    return (
        <group ref={g}>
            <Sphere ref={inner} args={[0.26, 28, 28]}>
                <primitive object={coreMat} attach="material" />
            </Sphere>

            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={ring1}>
                <meshStandardMaterial
                    color="#60a5fa"
                    emissive="#3b82f6"
                    emissiveIntensity={0.65}
                />
            </mesh>

            <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]} geometry={ring2}>
                <meshStandardMaterial
                    color="#a78bfa"
                    emissive="#8b5cf6"
                    emissiveIntensity={0.55}
                />
            </mesh>

            {/* Holo halo */}
            <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} geometry={haloGeo} position={[0, -0.02, 0]}>
                <meshBasicMaterial
                    color="#22d3ee"
                    transparent
                    opacity={0.35}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
});
AICore.displayName = "AICore";

/** ---------- Circuit Grid (system plane) ---------- */
const CircuitGrid = memo(() => {
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const geo = useMemo(() => new THREE.PlaneGeometry(4.4, 4.4, 1, 1), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (mat.current) {
            mat.current.opacity = 0.08 + (Math.sin(t * 0.8) + 1) * 0.02;
            mat.current.emissiveIntensity = 0.25 + (Math.sin(t * 0.9) + 1) * 0.08;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} geometry={geo}>
            <meshStandardMaterial
                ref={mat}
                color="#0b1220"
                emissive="#1d4ed8"
                emissiveIntensity={0.3}
                transparent
                opacity={0.1}
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
        const geometry = useMemo(() => new THREE.SphereGeometry(0.06, 16, 16), []);
        const material = useMemo(() => outer
            ? new THREE.MeshStandardMaterial({
                color: "#a78bfa",
                emissive: "#8b5cf6",
                emissiveIntensity: 0.55,
                transparent: true,
                opacity: 0.9,
            })
            : new THREE.MeshStandardMaterial({
                color: "#60a5fa",
                emissive: "#60a5fa",
                emissiveIntensity: 0.55,
                transparent: true,
                opacity: 0.9,
            }), [outer]);

        useFrame(({ clock }) => {
            const t = clock.getElapsedTime();
            if (!meshRef.current) return;

            for (let i = 0; i < positions.length; i++) {
                const delay = baseDelay + i * (outer ? 0.35 : 0.25);
                const pulse = 1 + Math.sin(t * 2.2 + delay) * (outer ? 0.16 : 0.22);

                temp.position.set(...positions[i]);
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

/** ---------- Outer Modules (boxes) - Cached Geometry ---------- */
const Modules = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);

    // Memoize resources
    const geometry = useMemo(() => new THREE.BoxGeometry(0.26, 0.16, 0.12), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#111827",
        emissive: "#8b5cf6",
        emissiveIntensity: 0.25,
        metalness: 0.3,
        roughness: 0.35,
        transparent: true,
        opacity: 0.95,
    }), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!meshRef.current) return;

        outerModules.forEach((pos, i) => {
            const wobble = Math.sin(t * 1.4 + i * 0.6) * 0.04;
            temp.position.set(pos[0], pos[1] + wobble, pos[2]);
            temp.updateMatrix();
            meshRef.current!.setMatrixAt(i, temp.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, outerModules.length]}
        >
        </instancedMesh>
    );
});
Modules.displayName = "Modules";

/** ---------- Connections (Optimized Instanced Cylinders) ---------- */
// Shared geometry for connections (Cylinder pointing up Y, height 1)
const connectionGeometry = new THREE.CylinderGeometry(0.005, 0.005, 1, 8);
// Rotate geometry so cylinder lies along Z axis for easier lookAt logic
connectionGeometry.rotateX(Math.PI / 2);
connectionGeometry.translate(0, 0, 0.5); // Pivot at start

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
            temp.scale.set(1, 1, dist); // Scale length (Z)
            temp.updateMatrix();

            meshRef.current!.setMatrixAt(i, temp.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [connections, temp]);

    // Animation loop for opacity/color pulse
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < connections.length; i++) {
            const phase = i * 0.18;
            // Pulse opacity by modulating color brightness
            const pulse = 0.22 + (Math.sin(t * 2.0 + phase) + 1) * 0.12;
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
                color="#ffffff" // Multiplied by instance color
                transparent
                opacity={1}
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
            // scan-like packets
            const speed = 0.35;
            const offset = i * 0.55;
            const p = ((t + offset) * speed) % 1;

            // ease in/out to feel like "processing"
            const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

            temp.position.copy(vecs[i].start).addScaledVector(vecs[i].dir, eased);
            temp.scale.setScalar(0.9 + Math.sin((t + i) * 6) * 0.15);
            temp.updateMatrix();
            meshRef.current.setMatrixAt(i, temp.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Memoize resources
    const packetGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 10, 10), []);
    const packetMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#22d3ee",
        emissive: "#06b6d4",
        emissiveIntensity: 1.25,
    }), []);

    return <instancedMesh ref={meshRef} args={[packetGeometry, packetMaterial, vecs.length]} />;
});
DataPackets.displayName = "DataPackets";

/** ---------- Final Scene ---------- */
const AIScene: React.FC = () => {
    // choose which links carry packets (usually core -> inner + a few outward)
    const packetLinks = useMemo(() => connections.slice(0, 8), []);

    return (
        <Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.35}>
            <group scale={1.35}>
                {/* environment */}
                <CircuitGrid />

                {/* AI core */}
                <AICore />

                {/* nodes + modules */}
                <InstancedNodes positions={innerNodes} baseDelay={0} />
                <Modules />
                <InstancedNodes positions={outerModules} outer baseDelay={0.8} />

                {/* wiring + flow */}
                <Connections connections={connections} />
                <DataPackets links={packetLinks} />

                {/* lighting */}
                <ambientLight intensity={0.35} />
                <pointLight position={[0, 0.2, 2]} intensity={0.9} color="#3b82f6" />
                <pointLight position={[-1.6, 0.6, 1]} intensity={0.55} color="#a78bfa" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
