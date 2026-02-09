import React, { memo, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Minimalist materials
const coreMaterial = new THREE.MeshStandardMaterial({
    color: "#18181b",
    metalness: 0.9,
    roughness: 0.1,
    emissive: "#3b82f6",
    emissiveIntensity: 0.15
});

const ringMaterial = new THREE.MeshStandardMaterial({
    color: "#27272a",
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.6
});

// Central AI Core - minimalist brain/processor representation
const AICore = memo(() => {
    const groupRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const pulseRef = useRef<THREE.Mesh>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            const x = (pointer.x * viewport.width) / 5;
            const y = (pointer.y * viewport.height) / 5;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.12, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.12, 0.05);
        }

        if (innerRef.current) {
            innerRef.current.rotation.y = t * 0.3;
            innerRef.current.rotation.z = t * 0.2;
        }

        if (pulseRef.current) {
            const pulse = 1 + Math.sin(t * 2) * 0.05;
            pulseRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.02, 16, 64]} />
                <primitive object={ringMaterial} attach="material" />
            </mesh>

            {/* Inner rotating ring */}
            <mesh ref={innerRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.38, 0.015, 12, 48]} />
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#3b82f6"
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Core sphere */}
            <mesh ref={pulseRef}>
                <icosahedronGeometry args={[0.22, 1]} />
                <meshStandardMaterial
                    color="#09090b"
                    metalness={1}
                    roughness={0.1}
                    emissive="#6366f1"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Center glow */}
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
            </mesh>
        </group>
    );
});
AICore.displayName = "AICore";

// Orbiting nodes - representing data/integration points
const ORBIT_NODES = [
    { radius: 0.85, speed: 0.4, offset: 0, size: 0.06 },
    { radius: 0.85, speed: 0.4, offset: Math.PI * 0.66, size: 0.05 },
    { radius: 0.85, speed: 0.4, offset: Math.PI * 1.33, size: 0.055 },
];

const OrbitingNodes = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);
    const geometry = useMemo(() => new THREE.SphereGeometry(1, 12, 12), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#6366f1',
        emissive: '#6366f1',
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.3
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        ORBIT_NODES.forEach((node, i) => {
            const angle = t * node.speed + node.offset;
            tempObj.position.set(
                Math.cos(angle) * node.radius,
                Math.sin(t * 0.3 + i) * 0.1,
                Math.sin(angle) * node.radius
            );
            tempObj.scale.setScalar(node.size);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, ORBIT_NODES.length]} />;
});
OrbitingNodes.displayName = "OrbitingNodes";

// Connection lines from core to orbiting nodes
const ConnectionLines = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    const geometry = useMemo(() => {
        const geo = new THREE.CylinderGeometry(0.003, 0.003, 1, 4);
        geo.rotateX(Math.PI / 2);
        geo.translate(0, 0, 0.5);
        return geo;
    }, []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        ORBIT_NODES.forEach((node, i) => {
            const angle = t * node.speed + node.offset;
            const endPos = new THREE.Vector3(
                Math.cos(angle) * node.radius,
                Math.sin(t * 0.3 + i) * 0.1,
                Math.sin(angle) * node.radius
            );

            const dist = endPos.length();
            tempObj.position.set(0, 0, 0);
            tempObj.lookAt(endPos);
            tempObj.scale.set(1, 1, dist);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, ORBIT_NODES.length]}>
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </instancedMesh>
    );
});
ConnectionLines.displayName = "ConnectionLines";

// Subtle background particles
const BackgroundParticles = memo(() => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    const positions = useMemo(() => {
        const pos: [number, number, number][] = [];
        for (let i = 0; i < 8; i++) {
            const theta = (i / 8) * Math.PI * 2;
            const r = 1.1 + Math.random() * 0.3;
            pos.push([Math.cos(theta) * r, (Math.random() - 0.5) * 0.6, Math.sin(theta) * r]);
        }
        return pos;
    }, []);

    const geometry = useMemo(() => new THREE.SphereGeometry(0.015, 6, 6), []);
    const material = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.4
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();

        positions.forEach((pos, i) => {
            tempObj.position.set(
                pos[0] + Math.sin(t * 0.2 + i) * 0.05,
                pos[1] + Math.cos(t * 0.3 + i * 0.5) * 0.08,
                pos[2] + Math.sin(t * 0.25 + i * 0.3) * 0.05
            );
            const pulse = 0.8 + Math.sin(t * 0.5 + i) * 0.2;
            tempObj.scale.setScalar(pulse);
            tempObj.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} />;
});
BackgroundParticles.displayName = "BackgroundParticles";

// Main scene
const AIScene: React.FC = () => {
    return (
        <Float speed={1} rotationIntensity={0.08} floatIntensity={0.2}>
            <group scale={1.1}>
                <AICore />
                <OrbitingNodes />
                <ConnectionLines />
                <BackgroundParticles />
                <pointLight position={[0, 0, 1.5]} intensity={0.8} color="#3b82f6" />
                <pointLight position={[1, 1, 0]} intensity={0.3} color="#8b5cf6" />
            </group>
        </Float>
    );
};

export default memo(AIScene);
