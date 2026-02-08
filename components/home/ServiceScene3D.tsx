import React, { Suspense, memo, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import WebAppScene from './3d/WebAppScene';
import MobileAppScene from './3d/MobileAppScene';
import AIScene from './3d/AIScene';

interface ServiceScene3DProps {
    activeIndex: number;
}

// Optimized loading fallback
const LoadingFallback = memo(() => {
    const meshRef = useRef<THREE.Mesh>(null);
    let frameCount = 0;

    useFrame(({ clock }) => {
        // Frame skip
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (meshRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
            meshRef.current.scale.setScalar(scale);
            meshRef.current.rotation.y = clock.getElapsedTime();
        }
    });

    const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), []);

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial color="#3b82f6" wireframe emissive="#1d4ed8" emissiveIntensity={0.5} />
        </mesh>
    );
});

LoadingFallback.displayName = 'LoadingFallback';

// Optimized transition wrapper
interface TransitionWrapperProps {
    isActive: boolean;
    children: React.ReactNode;
}

const TransitionWrapper = memo<TransitionWrapperProps>(({ isActive, children }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [mounted, setMounted] = useState(false);
    const targetScale = useRef(0);
    let frameCount = 0;

    useEffect(() => {
        if (isActive) {
            setMounted(true);
            // Delay to allow mounting
            requestAnimationFrame(() => {
                targetScale.current = 1;
            });
        } else {
            targetScale.current = 0;
            const timer = setTimeout(() => setMounted(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    useFrame((_, delta) => {
        // Frame skip for performance
        frameCount++;
        if (frameCount % 2 !== 0) return;

        if (groupRef.current) {
            const currentScale = groupRef.current.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 6);
            groupRef.current.scale.setScalar(Math.max(0.001, newScale)); // Prevent zero scale
        }
    });

    if (!mounted && !isActive) return null;

    return (
        <group ref={groupRef} scale={0.001}>
            {children}
        </group>
    );
});

TransitionWrapper.displayName = 'TransitionWrapper';

// Optimized scene content
const SceneContent = memo<{ activeIndex: number }>(({ activeIndex }) => {
    return (
        <>
            {/* Optimized lighting - fewer lights */}
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />
            <directionalLight position={[-3, -3, 3]} intensity={0.25} color="#60a5fa" />

            {/* Scene transitions */}
            <TransitionWrapper isActive={activeIndex === 0}>
                <WebAppScene />
            </TransitionWrapper>
            <TransitionWrapper isActive={activeIndex === 1}>
                <MobileAppScene />
            </TransitionWrapper>
            <TransitionWrapper isActive={activeIndex === 2}>
                <AIScene />
            </TransitionWrapper>
        </>
    );
});

SceneContent.displayName = 'SceneContent';

// Optimized camera with frame skipping
const AnimatedCamera = memo<{ activeIndex: number }>(({ activeIndex }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPosition = useRef(new THREE.Vector3(0, 0, 4));
    let frameCount = 0;

    useEffect(() => {
        const positions = [
            new THREE.Vector3(0.1, 0.05, 4),
            new THREE.Vector3(-0.05, 0.1, 3.9),
            new THREE.Vector3(0.05, -0.05, 4.1),
        ];
        targetPosition.current = positions[activeIndex] || positions[0];
    }, [activeIndex]);

    useFrame((_, delta) => {
        // Skip frames
        frameCount++;
        if (frameCount % 3 !== 0) return;

        if (cameraRef.current) {
            cameraRef.current.position.lerp(targetPosition.current, delta * 3);
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4]} fov={45} />;
});

AnimatedCamera.displayName = 'AnimatedCamera';

// Performance monitor - disable in production
const PerformanceOptimizer: React.FC = () => {
    const { gl } = useThree();

    useEffect(() => {
        // Optimize renderer settings
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, [gl]);

    return null;
};

const ServiceScene3D: React.FC<ServiceScene3DProps> = ({ activeIndex }) => {
    return (
        <div className="w-full h-full" style={{ minHeight: '400px' }}>
            <Canvas
                dpr={[1, 1.5]} // Reduced max DPR for performance
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false, // Disable if not needed
                    depth: true,
                }}
                style={{ background: 'transparent' }}
                frameloop="demand" // Only render when needed
                performance={{ min: 0.5 }} // Allow frame rate to drop
            >
                <PerformanceOptimizer />
                <AnimatedCamera activeIndex={activeIndex} />

                <Suspense fallback={<LoadingFallback />}>
                    <SceneContent activeIndex={activeIndex} />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.7}
                    minPolarAngle={Math.PI / 2.6}
                    autoRotate
                    autoRotateSpeed={0.25}
                    enableDamping
                    dampingFactor={0.03}
                />
            </Canvas>
        </div>
    );
};

export default memo(ServiceScene3D);
