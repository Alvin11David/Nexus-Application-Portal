import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OwlState = "idle" | "watching" | "hiding" | "sad";

interface OwlProps {
  mousePos: { x: number; y: number };
  state: OwlState;
}

function Owl({ mousePos, state }: OwlProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const leftLidRef = useRef<THREE.Mesh>(null);
  const rightLidRef = useRef<THREE.Mesh>(null);
  const leftBrowRef = useRef<THREE.Mesh>(null);
  const rightBrowRef = useRef<THREE.Mesh>(null);
  const beakRef = useRef<THREE.Mesh>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const lidTarget = useRef(0);
  const browTarget = useRef(0);
  const bodyBob = useRef(0);
  const sadAmount = useRef(0);

  const bodyColor = useMemo(() => new THREE.Color("hsl(25, 35%, 42%)"), []);
  const bellyColor = useMemo(() => new THREE.Color("hsl(35, 40%, 65%)"), []);
  const eyeWhite = useMemo(() => new THREE.Color("hsl(0, 0%, 96%)"), []);
  const pupilColor = useMemo(() => new THREE.Color("hsl(25, 90%, 15%)"), []);
  const beakColor = useMemo(() => new THREE.Color("hsl(38, 70%, 55%)"), []);
  const lidColor = useMemo(() => new THREE.Color("hsl(25, 30%, 38%)"), []);
  const browColor = useMemo(() => new THREE.Color("hsl(25, 25%, 30%)"), []);
  const earColor = useMemo(() => new THREE.Color("hsl(25, 30%, 35%)"), []);
  const footColor = useMemo(() => new THREE.Color("hsl(38, 60%, 50%)"), []);
  const cheekColor = useMemo(() => new THREE.Color("hsl(10, 50%, 70%)"), []);

  useEffect(() => {
    if (state === "watching" || state === "idle") {
      targetRotation.current = {
        x: -mousePos.y * 0.3,
        y: mousePos.x * 0.4,
      };
      lidTarget.current = 0;
      browTarget.current = 0;
      sadAmount.current = 0;
    } else if (state === "hiding") {
      lidTarget.current = 1;
      browTarget.current = 0;
      sadAmount.current = 0;
    } else if (state === "sad") {
      lidTarget.current = 0.3;
      browTarget.current = 1;
      sadAmount.current = 1;
    }
  }, [mousePos, state]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 4;

    // Body rotation follows cursor
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

    // Body bob
    bodyBob.current += delta * 2;
    groupRef.current.position.y = Math.sin(bodyBob.current) * 0.05;

    // Pupil tracking
    const pupilOffset = state === "hiding" ? { x: 0, y: 0 } : {
      x: mousePos.x * 0.12,
      y: mousePos.y * 0.08,
    };

    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(
        leftPupilRef.current.position.x, pupilOffset.x, delta * speed * 2
      );
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(
        leftPupilRef.current.position.y, pupilOffset.y, delta * speed * 2
      );
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(
        rightPupilRef.current.position.x, pupilOffset.x, delta * speed * 2
      );
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(
        rightPupilRef.current.position.y, pupilOffset.y, delta * speed * 2
      );
    }

    // Eyelid animation
    const currentLid = lidTarget.current;
    if (leftLidRef.current) {
      leftLidRef.current.scale.y = THREE.MathUtils.lerp(
        leftLidRef.current.scale.y, currentLid, delta * speed * 1.5
      );
    }
    if (rightLidRef.current) {
      rightLidRef.current.scale.y = THREE.MathUtils.lerp(
        rightLidRef.current.scale.y, currentLid, delta * speed * 1.5
      );
    }

    // Brow (sad) animation
    const currentBrow = browTarget.current;
    if (leftBrowRef.current) {
      leftBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        leftBrowRef.current.rotation.z, currentBrow * 0.4, delta * speed
      );
      leftBrowRef.current.position.y = THREE.MathUtils.lerp(
        leftBrowRef.current.position.y, 0.42 - currentBrow * 0.08, delta * speed
      );
    }
    if (rightBrowRef.current) {
      rightBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        rightBrowRef.current.rotation.z, -currentBrow * 0.4, delta * speed
      );
      rightBrowRef.current.position.y = THREE.MathUtils.lerp(
        rightBrowRef.current.position.y, 0.42 - currentBrow * 0.08, delta * speed
      );
    }

    // Sad beak droop
    if (beakRef.current) {
      const sadVal = THREE.MathUtils.lerp(
        beakRef.current.rotation.x,
        sadAmount.current > 0.5 ? 0.2 : 0,
        delta * speed
      );
      beakRef.current.rotation.x = sadVal;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Belly */}
      <mesh position={[0, -0.5, 0.45]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={bellyColor} roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Face disc */}
      <mesh position={[0, 0.2, 0.35]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={bellyColor} roughness={0.9} />
      </mesh>

      {/* Left ear tuft */}
      <mesh position={[-0.3, 0.7, -0.05]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color={earColor} roughness={0.8} />
      </mesh>

      {/* Right ear tuft */}
      <mesh position={[0.3, 0.7, -0.05]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color={earColor} roughness={0.8} />
      </mesh>

      {/* Left eye group */}
      <group ref={leftEyeRef} position={[-0.18, 0.25, 0.45]}>
        {/* Eye white */}
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color={eyeWhite} roughness={0.3} />
        </mesh>
        {/* Pupil */}
        <mesh ref={leftPupilRef} position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color={pupilColor} roughness={0.2} />
        </mesh>
        {/* Pupil highlight */}
        <mesh position={[0.03, 0.03, 0.16]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={eyeWhite} emissive={eyeWhite} emissiveIntensity={0.5} />
        </mesh>
        {/* Eyelid */}
        <mesh ref={leftLidRef} position={[0, 0.08, 0.04]} scale={[1, 0, 1]}>
          <boxGeometry args={[0.35, 0.2, 0.2]} />
          <meshStandardMaterial color={lidColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Right eye group */}
      <group ref={rightEyeRef} position={[0.18, 0.25, 0.45]}>
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color={eyeWhite} roughness={0.3} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color={pupilColor} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0.03, 0.16]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={eyeWhite} emissive={eyeWhite} emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightLidRef} position={[0, 0.08, 0.04]} scale={[1, 0, 1]}>
          <boxGeometry args={[0.35, 0.2, 0.2]} />
          <meshStandardMaterial color={lidColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Left eyebrow */}
      <mesh ref={leftBrowRef} position={[-0.18, 0.42, 0.5]}>
        <boxGeometry args={[0.22, 0.04, 0.05]} />
        <meshStandardMaterial color={browColor} roughness={0.8} />
      </mesh>

      {/* Right eyebrow */}
      <mesh ref={rightBrowRef} position={[0.18, 0.42, 0.5]}>
        <boxGeometry args={[0.22, 0.04, 0.05]} />
        <meshStandardMaterial color={browColor} roughness={0.8} />
      </mesh>

      {/* Beak */}
      <mesh ref={beakRef} position={[0, 0.08, 0.6]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.06, 0.15, 3]} />
        <meshStandardMaterial color={beakColor} roughness={0.5} />
      </mesh>

      {/* Left cheek */}
      <mesh position={[-0.3, 0.12, 0.42]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={cheekColor} roughness={0.9} transparent opacity={0.5} />
      </mesh>

      {/* Right cheek */}
      <mesh position={[0.3, 0.12, 0.42]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={cheekColor} roughness={0.9} transparent opacity={0.5} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.6, -0.4, -0.1]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.6, -0.4, -0.1]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Left foot */}
      <mesh position={[-0.2, -1.15, 0.2]}>
        <boxGeometry args={[0.18, 0.06, 0.2]} />
        <meshStandardMaterial color={footColor} roughness={0.7} />
      </mesh>

      {/* Right foot */}
      <mesh position={[0.2, -1.15, 0.2]}>
        <boxGeometry args={[0.18, 0.06, 0.2]} />
        <meshStandardMaterial color={footColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

interface LoginOwl3DProps {
  isTyping: boolean;
  isSad: boolean;
}

export default function LoginOwl3D({ isTyping, isSad }: LoginOwl3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mousePos.current = {
        x: ((e.clientX - centerX) / (window.innerWidth / 2)),
        y: -((e.clientY - centerY) / (window.innerHeight / 2)),
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Sync ref to a state-like value via animation frame
  useEffect(() => {
    let animId: number;
    const tick = () => {
      currentMouse.current = { ...mousePos.current };
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const owlState: OwlState = isSad ? "sad" : isTyping ? "hiding" : "watching";

  return (
    <div ref={containerRef} className="w-full h-48 sm:h-56">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={0.8} />
        <directionalLight position={[-2, 1, 2]} intensity={0.3} color="#ffd4a0" />
        <OwlInner mousePos={mousePos} state={owlState} />
      </Canvas>
    </div>
  );
}

// Wrapper to read ref inside Canvas
function OwlInner({
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

  return <Owl mousePos={pos.current} state={state} />;
}
