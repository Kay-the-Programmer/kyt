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

// Simple loading fallback
const LoadingFallback = memo(() => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
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

// Smooth transition wrapper - no bounce, just linear fade
interface TransitionWrapperProps {
    isActive: boolean;
    children: React.ReactNode;
}

const TransitionWrapper = memo<TransitionWrapperProps>(({ isActive, children }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [mounted, setMounted] = useState(false);
    const targetScale = useRef(0);

    useEffect(() => {
        if (isActive) {
            setMounted(true);
            targetScale.current = 1;
        } else {
            targetScale.current = 0;
            const timer = setTimeout(() => setMounted(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // Simple smooth lerp - no bounce
        const currentScale = groupRef.current.scale.x;
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 4);
        groupRef.current.scale.setScalar(Math.max(0.001, newScale));
    });

    if (!mounted && !isActive) return null;

    return (
        <group ref={groupRef} scale={0.001}>
            {children}
        </group>
    );
});

TransitionWrapper.displayName = 'TransitionWrapper';

// Scene content
const SceneContent = memo<{ activeIndex: number }>(({ activeIndex }) => {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <directionalLight position={[-3, -3, 3]} intensity={0.3} color="#60a5fa" />

            {/* Scenes */}
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

// Smooth camera - no bounce
const AnimatedCamera = memo<{ activeIndex: number }>(({ activeIndex }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPosition = useRef(new THREE.Vector3(0, 0, 4));

    useEffect(() => {
        const positions = [
            new THREE.Vector3(0.1, 0.05, 4),
            new THREE.Vector3(-0.05, 0.08, 3.9),
            new THREE.Vector3(0.05, -0.05, 4.1),
        ];
        targetPosition.current = positions[activeIndex] || positions[0];
    }, [activeIndex]);

    useFrame((_, delta) => {
        if (cameraRef.current) {
            // Simple smooth lerp
            cameraRef.current.position.lerp(targetPosition.current, delta * 3);
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4]} fov={45} />;
});

AnimatedCamera.displayName = 'AnimatedCamera';

// Renderer optimizer
const RendererOptimizer: React.FC = () => {
    const { gl } = useThree();

    useEffect(() => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, [gl]);

    return null;
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
                }}
                style={{ background: 'transparent' }}
                frameloop="always"
            >
                <RendererOptimizer />
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
                    autoRotateSpeed={0.4}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>
        </div>
    );
};

export default memo(ServiceScene3D);
