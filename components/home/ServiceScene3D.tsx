import React, { Suspense, memo, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import WebAppScene from './3d/WebAppScene';
import MobileAppScene from './3d/MobileAppScene';
import AIScene from './3d/AIScene';

interface ServiceScene3DProps {
    activeIndex: number;
    isMobile?: boolean;
    isVisible?: boolean;
}

// Minimal loading fallback
const LoadingFallback = memo(() => {
    const meshRef = useRef<THREE.Mesh>(null);
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.4, 1), []);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial color="#3b82f6" wireframe emissive="#1d4ed8" emissiveIntensity={0.4} />
        </mesh>
    );
});

LoadingFallback.displayName = 'LoadingFallback';

// Transition wrapper with scale
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
            const timer = setTimeout(() => setMounted(false), 250);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const currentScale = groupRef.current.scale.x;
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 10);
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
            {/* Optimized lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[8, 8, 8]}
                intensity={0.9}
                castShadow
                shadow-mapSize={[512, 512]}
            />
            <pointLight position={[0, -1.5, 1.5]} intensity={0.4} color="#3b82f6" />

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

// Camera with smooth transitions
const AnimatedCamera = memo<{ activeIndex: number }>(({ activeIndex }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPosition = useRef(new THREE.Vector3(0, 0, 4));

    useEffect(() => {
        const positions = [
            new THREE.Vector3(0, 0, 4),
            new THREE.Vector3(0, 0, 3.6),
            new THREE.Vector3(0, 0, 4.2),
        ];
        targetPosition.current = positions[activeIndex] || positions[0];
    }, [activeIndex]);

    useFrame((_, delta) => {
        if (cameraRef.current) {
            cameraRef.current.position.lerp(targetPosition.current, delta * 4);
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4.5]} fov={45} />;
});

AnimatedCamera.displayName = 'AnimatedCamera';

// Renderer optimizer
const RendererOptimizer: React.FC = () => {
    const { gl } = useThree();

    useEffect(() => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }, [gl]);

    return null;
};

// Mobile auto-rotate
const MobileAutoRotate = memo(() => {
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const radius = 3.8;
        const speed = 0.15;
        state.camera.position.x = Math.sin(time * speed) * radius;
        state.camera.position.z = Math.cos(time * speed) * radius;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
});

MobileAutoRotate.displayName = 'MobileAutoRotate';

const ServiceScene3D: React.FC<ServiceScene3DProps> = ({ activeIndex, isMobile = false, isVisible = true }) => {
    return (
        <div className="w-full h-full" style={{ minHeight: isMobile ? '280px' : '450px' }}>
            <Canvas
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1
                }}
                style={{ background: 'transparent' }}
                frameloop={isVisible ? "always" : "never"}
                performance={{ min: 0.5 }}
                shadows
            >
                <RendererOptimizer />
                <AnimatedCamera activeIndex={activeIndex} />

                {/* Environment */}
                <Environment preset="city" />

                {/* Optimized Contact Shadows */}
                <ContactShadows
                    opacity={0.35}
                    scale={8}
                    blur={1.5}
                    far={1.5}
                    resolution={128}
                    color="#000000"
                    frames={1}
                />

                <Suspense fallback={<LoadingFallback />}>
                    <SceneContent activeIndex={activeIndex} />
                </Suspense>

                {!isMobile ? (
                    <OrbitControls
                        makeDefault
                        enableZoom={false}
                        minDistance={3}
                        maxDistance={5.5}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 1.8}
                        minPolarAngle={Math.PI / 2.6}
                        autoRotate={isVisible}
                        autoRotateSpeed={0.35}
                        enableDamping
                        dampingFactor={0.04}
                        rotateSpeed={0.4}
                    />
                ) : (
                    isVisible && <MobileAutoRotate />
                )}
            </Canvas>
        </div>
    );
};


export default memo(ServiceScene3D);
