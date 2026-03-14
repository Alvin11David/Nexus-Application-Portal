import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type OwlState = "idle" | "watching" | "hiding" | "sad";

function Elephant({
  mousePos,
  state,
}: {
  mousePos: { x: number; y: number };
  state: OwlState;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/elephant.glb");
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const bodyBob = useRef(0);
  const sadDroop = useRef(0);
  const hideAmount = useRef(0);
  const scaleTarget = useRef(1);

  useEffect(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material = child.material.clone();
        child.material.roughness = 0.7;
        child.material.metalness = 0.05;
      }
    });
    setClonedScene(clone);
  }, [scene]);

  useEffect(() => {
    if (state === "watching" || state === "idle") {
      targetRotation.current = {
        x: -mousePos.y * 0.2,
        y: mousePos.x * 0.35,
      };
      hideAmount.current = 0;
      sadDroop.current = 0;
      scaleTarget.current = 1;
    } else if (state === "hiding") {
      hideAmount.current = 1;
      sadDroop.current = 0;
      scaleTarget.current = 0.9;
      targetRotation.current = { x: 0.3, y: 0 };
    } else if (state === "sad") {
      sadDroop.current = 1;
      hideAmount.current = 0;
      scaleTarget.current = 0.95;
      targetRotation.current = { x: 0.15, y: 0 };
    }
  }, [mousePos, state]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 3.5;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      delta * speed
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      delta * speed
    );

    bodyBob.current += delta * (sadDroop.current > 0.5 ? 3.5 : 1.6);
    const bobAmount = sadDroop.current > 0.5
      ? Math.sin(bodyBob.current) * 0.08
      : Math.sin(bodyBob.current) * 0.04;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      bobAmount,
      delta * speed
    );

    const s = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      scaleTarget.current,
      delta * speed
    );
    groupRef.current.scale.set(s, s, s);

    if (sadDroop.current > 0.5) {
      groupRef.current.rotation.z = Math.sin(bodyBob.current * 0.7) * 0.05;
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        0,
        delta * speed
      );
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

function ElephantInner({
  mousePos,
  state,
}: {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  state: OwlState;
}) {
  const pos = useRef({ x: 0, y: 0 });
  useFrame(() => {
    pos.current = mousePos.current;
  });
  return <Elephant mousePos={pos.current} state={state} />;
}

interface LoginOwl3DProps {
  isTyping: boolean;
  isSad: boolean;
}

export default function LoginOwl3D({ isTyping, isSad }: LoginOwl3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mousePos.current = {
        x: (e.clientX - centerX) / (window.innerWidth / 2),
        y: -((e.clientY - centerY) / (window.innerHeight / 2)),
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const owlState: OwlState = isSad ? "sad" : isTyping ? "hiding" : "watching";

  return (
    <div ref={containerRef} className="w-full h-52 sm:h-60">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1} />
        <directionalLight position={[-2, 3, 2]} intensity={0.4} color="#ffd4a0" />
        <pointLight position={[0, 2, 4]} intensity={0.3} color="#fff5e6" />
        <Suspense fallback={null}>
          <ElephantInner mousePos={mousePos} state={owlState} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/elephant.glb");
