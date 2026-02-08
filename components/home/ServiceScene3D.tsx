import React, { Suspense, memo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import WebAppScene from './3d/WebAppScene';
import MobileAppScene from './3d/MobileAppScene';
import AIScene from './3d/AIScene';

interface ServiceScene3DProps {
    activeIndex: number;
}

// Animated loading fallback with pulsing effect
const LoadingFallback: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
            meshRef.current.scale.setScalar(scale);
            meshRef.current.rotation.y = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshStandardMaterial color="#3b82f6" wireframe emissive="#1d4ed8" emissiveIntensity={0.5} />
        </mesh>
    );
};

// Transition wrapper for smooth scene changes
interface TransitionWrapperProps {
    isActive: boolean;
    children: React.ReactNode;
    delay?: number;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ isActive, children, delay = 0 }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [mounted, setMounted] = useState(false);
    const targetScale = useRef(0);
    const targetOpacity = useRef(0);
    const targetRotation = useRef(-Math.PI / 4);

    useEffect(() => {
        if (isActive) {
            setMounted(true);
            setTimeout(() => {
                targetScale.current = 1;
                targetOpacity.current = 1;
                targetRotation.current = 0;
            }, delay);
        } else {
            targetScale.current = 0.8;
            targetOpacity.current = 0;
            targetRotation.current = Math.PI / 4;
            setTimeout(() => setMounted(false), 500);
        }
    }, [isActive, delay]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            // Smooth interpolation for scale
            const currentScale = groupRef.current.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 5);
            groupRef.current.scale.setScalar(newScale);

            // Smooth rotation transition
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotation.current,
                delta * 4
            );

            // Update material opacity for all children
            groupRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                    const material = child.material as THREE.MeshStandardMaterial;
                    if (material.opacity !== undefined) {
                        material.transparent = true;
                        material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity.current, delta * 6);
                    }
                }
            });
        }
    });

    if (!mounted && !isActive) return null;

    return (
        <group ref={groupRef} scale={0}>
            {children}
        </group>
    );
};

// Scene wrapper with smooth transitions
const SceneContent: React.FC<{ activeIndex: number }> = memo(({ activeIndex }) => {
    return (
        <>
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} color="#ffffff" castShadow />
            <directionalLight position={[-5, -5, 5]} intensity={0.4} color="#60a5fa" />
            <pointLight position={[0, 2, 3]} intensity={0.5} color="#a78bfa" />

            {/* Subtle fog for depth */}
            <fog attach="fog" args={['#0f172a', 8, 20]} />

            {/* Render scenes with transitions */}
            <TransitionWrapper isActive={activeIndex === 0} delay={0}>
                <WebAppScene />
            </TransitionWrapper>
            <TransitionWrapper isActive={activeIndex === 1} delay={50}>
                <MobileAppScene />
            </TransitionWrapper>
            <TransitionWrapper isActive={activeIndex === 2} delay={100}>
                <AIScene />
            </TransitionWrapper>
        </>
    );
});

SceneContent.displayName = 'SceneContent';

// Camera animation on scene change
const AnimatedCamera: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPosition = useRef(new THREE.Vector3(0, 0, 4));
    const targetFov = useRef(45);

    useEffect(() => {
        // Subtle camera movement on scene change
        const positions = [
            new THREE.Vector3(0.2, 0.1, 4),
            new THREE.Vector3(-0.1, 0.15, 3.8),
            new THREE.Vector3(0.1, -0.1, 4.2),
        ];
        targetPosition.current = positions[activeIndex] || positions[0];
        targetFov.current = [45, 42, 48][activeIndex] || 45;
    }, [activeIndex]);

    useFrame((_, delta) => {
        if (cameraRef.current) {
            // Smooth camera position interpolation
            cameraRef.current.position.lerp(targetPosition.current, delta * 2);

            // Smooth FOV transition
            cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov.current, delta * 3);
            cameraRef.current.updateProjectionMatrix();
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4]} fov={45} />;
};

const ServiceScene3D: React.FC<ServiceScene3DProps> = ({ activeIndex }) => {
    return (
        <div className="w-full h-full" style={{ minHeight: '400px' }}>
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
                style={{ background: 'transparent' }}
                shadows
            >
                <AnimatedCamera activeIndex={activeIndex} />

                <Suspense fallback={<LoadingFallback />}>
                    <SceneContent activeIndex={activeIndex} />
                </Suspense>

                {/* Enhanced orbit controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.6}
                    minPolarAngle={Math.PI / 2.8}
                    autoRotate
                    autoRotateSpeed={0.3}
                    dampingFactor={0.05}
                    enableDamping
                />
            </Canvas>
        </div>
    );
};

export default memo(ServiceScene3D);
