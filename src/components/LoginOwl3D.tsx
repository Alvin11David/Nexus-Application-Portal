import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

type AnimalState = "idle" | "watching" | "hiding" | "sad";

function Elephant({
  mousePos,
  state,
}: {
  mousePos: { x: number; y: number };
  state: AnimalState;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/elephant.glb");
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const bodyBob = useRef(0);
  const sadAmount = useRef(0);
  const scaleTarget = useRef(1);

  useEffect(() => {
    const clone = scene.clone(true);
    // Improve materials
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = child.material.clone();
          child.material.roughness = 0.65;
          child.material.metalness = 0.05;
        }
      }
    });
    
    // Auto-center and scale to fit
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim; // Fit in ~2.2 units
    clone.scale.multiplyScalar(scale);
    clone.position.sub(center.multiplyScalar(scale));
    
    setClonedScene(clone);
  }, [scene]);

  useEffect(() => {
    if (state === "watching" || state === "idle") {
      targetRotation.current = {
        x: -mousePos.y * 0.15,
        y: mousePos.x * 0.4,
      };
      sadAmount.current = 0;
      scaleTarget.current = 1;
    } else if (state === "hiding") {
      sadAmount.current = 0;
      scaleTarget.current = 0.85;
      targetRotation.current = { x: 0.25, y: 0 }; // Look down shyly
    } else if (state === "sad") {
      sadAmount.current = 1;
      scaleTarget.current = 0.92;
      targetRotation.current = { x: 0.12, y: 0 };
    }
  }, [mousePos, state]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 3.5;

    // Smooth rotation toward target
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

    // Body bob — faster and shakier when sad
    bodyBob.current += delta * (sadAmount.current > 0.5 ? 4 : 1.5);
    const bob = sadAmount.current > 0.5
      ? Math.sin(bodyBob.current) * 0.06
      : Math.sin(bodyBob.current) * 0.03;
    groupRef.current.position.y = bob;

    // Scale (shrink when hiding/sad)
    const s = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      scaleTarget.current,
      delta * speed
    );
    groupRef.current.scale.set(s, s, s);

    // Sad sway
    if (sadAmount.current > 0.5) {
      groupRef.current.rotation.z = Math.sin(bodyBob.current * 0.6) * 0.06;
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, 0, delta * speed
      );
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/* Read mouse ref inside Canvas render loop */
function ElephantInner({
  mousePos,
  state,
}: {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  state: AnimalState;
}) {
  const pos = useRef({ x: 0, y: 0 });
  useFrame(() => {
    pos.current = mousePos.current;
  });
  return <Elephant mousePos={pos.current} state={state} />;
}

/* ── Main export ── */
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

  const animalState: AnimalState = isSad ? "sad" : isTyping ? "hiding" : "watching";

  return (
    <div ref={containerRef} className="w-full h-52 sm:h-60">
      <Canvas
        camera={{ position: [0, 0.5, 3.8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#ffd4a0" />
        <pointLight position={[0, 2, 5]} intensity={0.3} color="#fff5e6" />
        <Suspense fallback={null}>
          <ElephantInner mousePos={mousePos} state={animalState} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/elephant.glb");
