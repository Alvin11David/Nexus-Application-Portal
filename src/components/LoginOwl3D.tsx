import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
  const expressiveness = useRef(0.25);
  const scaleTarget = useRef(1);

  useEffect(() => {
    const clone = scene.clone(true);
    // Improve materials
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = child.material.clone();
          child.material.roughness = 0.78;
          child.material.metalness = 0.02;
          child.material.envMapIntensity = 0.9;
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
        x: -mousePos.y * 0.08,
        y: mousePos.x * 0.24,
      };
      sadAmount.current = 0;
      expressiveness.current = 0.2;
      scaleTarget.current = 1;
    } else if (state === "hiding") {
      sadAmount.current = 0;
      expressiveness.current = 0.55;
      scaleTarget.current = 0.9;
      targetRotation.current = { x: 0.2, y: 0 }; // Look down shyly
    } else if (state === "sad") {
      sadAmount.current = 1;
      expressiveness.current = 0.7;
      scaleTarget.current = 0.9;
      targetRotation.current = { x: 0.16, y: 0 };
    }
  }, [mousePos, state]);

  useFrame((_, delta) => {
    if (!groupRef.current || !innerRef.current) return;
    const speed = THREE.MathUtils.lerp(2.2, 4.1, expressiveness.current);

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

    // Idle feels grounded; reactive states add character.
    const bobFrequency = THREE.MathUtils.lerp(1.2, 3.6, expressiveness.current);
    const bobAmplitude = THREE.MathUtils.lerp(0.018, 0.055, expressiveness.current);
    bodyBob.current += delta * bobFrequency;
    const bob = Math.sin(bodyBob.current) * bobAmplitude;
    groupRef.current.position.y = bob;

    // Scale (shrink when hiding/sad)
    const s = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      scaleTarget.current,
      delta * speed
    );
    groupRef.current.scale.set(s, s, s);

    // Mild squash/stretch sells expression without getting cartoony all the time.
    const squash = sadAmount.current > 0.5 ? 0.92 : state === "hiding" ? 0.95 : 0.985;
    innerRef.current.scale.y = THREE.MathUtils.lerp(innerRef.current.scale.y, squash, delta * speed);
    const width = THREE.MathUtils.lerp(innerRef.current.scale.x, 2 - squash, delta * speed);
    innerRef.current.scale.x = width;
    innerRef.current.scale.z = width;

    // Sad sway
    if (sadAmount.current > 0.5) {
      groupRef.current.rotation.z = Math.sin(bodyBob.current * 0.65) * 0.08;
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
        camera={{ position: [0, 0.55, 4.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.58} />
        <hemisphereLight args={["#f7f8ff", "#e9d9bf", 0.45]} />
        <directionalLight position={[3, 5, 4]} intensity={1.05} />
        <directionalLight position={[-3, 3, 2]} intensity={0.35} color="#ffd7ae" />
        <pointLight position={[0, 2, 5]} intensity={0.24} color="#fff5e6" />
        <Suspense fallback={null}>
          <ElephantInner mousePos={mousePos} state={animalState} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/elephant.glb");
