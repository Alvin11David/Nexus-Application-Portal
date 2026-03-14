import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

type OwlState = "idle" | "watching" | "hiding" | "sad";

interface OwlProps {
  mousePos: { x: number; y: number };
  state: OwlState;
}

/* ── Feather ring helper ── */
function FeatherRing({
  radius,
  y,
  count,
  size,
  color,
  tilt = 0,
}: {
  radius: number;
  y: number;
  count: number;
  size: [number, number, number];
  color: THREE.Color;
  tilt?: number;
}) {
  const feathers = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      items.push({
        pos: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rot: [tilt, -angle, 0] as [number, number, number],
      });
    }
    return items;
  }, [radius, y, count, tilt]);

  return (
    <>
      {feathers.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot}>
          <sphereGeometry args={[size[0], 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

function Owl({ mousePos, state }: OwlProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const leftLidRef = useRef<THREE.Mesh>(null);
  const rightLidRef = useRef<THREE.Mesh>(null);
  const leftLidBottomRef = useRef<THREE.Mesh>(null);
  const rightLidBottomRef = useRef<THREE.Mesh>(null);
  const leftBrowRef = useRef<THREE.Mesh>(null);
  const rightBrowRef = useRef<THREE.Mesh>(null);
  const beakTopRef = useRef<THREE.Mesh>(null);
  const beakBottomRef = useRef<THREE.Mesh>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const lidTarget = useRef(0);
  const browTarget = useRef(0);
  const bodyBob = useRef(0);
  const sadAmount = useRef(0);
  const wingFlap = useRef(0);

  // Rich owl palette
  const darkBrown = useMemo(() => new THREE.Color("hsl(22, 40%, 25%)"), []);
  const mainBrown = useMemo(() => new THREE.Color("hsl(25, 38%, 38%)"), []);
  const midBrown = useMemo(() => new THREE.Color("hsl(28, 35%, 45%)"), []);
  const lightBrown = useMemo(() => new THREE.Color("hsl(32, 42%, 55%)"), []);
  const cream = useMemo(() => new THREE.Color("hsl(38, 50%, 75%)"), []);
  const white = useMemo(() => new THREE.Color("hsl(40, 30%, 92%)"), []);
  const eyeRing = useMemo(() => new THREE.Color("hsl(40, 45%, 80%)"), []);
  const pupilColor = useMemo(() => new THREE.Color("hsl(25, 95%, 12%)"), []);
  const irisColor = useMemo(() => new THREE.Color("hsl(38, 90%, 45%)"), []);
  const beakOrange = useMemo(() => new THREE.Color("hsl(30, 75%, 45%)"), []);
  const beakDark = useMemo(() => new THREE.Color("hsl(25, 60%, 30%)"), []);
  const feetColor = useMemo(() => new THREE.Color("hsl(30, 50%, 40%)"), []);
  const cheekPink = useMemo(() => new THREE.Color("hsl(8, 55%, 72%)"), []);
  const talonColor = useMemo(() => new THREE.Color("hsl(35, 30%, 25%)"), []);

  useEffect(() => {
    if (state === "watching" || state === "idle") {
      targetRotation.current = {
        x: -mousePos.y * 0.25,
        y: mousePos.x * 0.35,
      };
      lidTarget.current = 0;
      browTarget.current = 0;
      sadAmount.current = 0;
    } else if (state === "hiding") {
      lidTarget.current = 1;
      browTarget.current = 0;
      sadAmount.current = 0;
    } else if (state === "sad") {
      lidTarget.current = 0.35;
      browTarget.current = 1;
      sadAmount.current = 1;
    }
  }, [mousePos, state]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 4;

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

    // Gentle bob
    bodyBob.current += delta * 1.8;
    groupRef.current.position.y = Math.sin(bodyBob.current) * 0.03;

    // Wing flap when sad
    wingFlap.current += delta * (sadAmount.current > 0.5 ? 6 : 2);
    const flapAngle = sadAmount.current > 0.5
      ? Math.sin(wingFlap.current) * 0.15
      : Math.sin(wingFlap.current) * 0.03;

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = THREE.MathUtils.lerp(
        leftWingRef.current.rotation.z, 0.4 + flapAngle, delta * speed
      );
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = THREE.MathUtils.lerp(
        rightWingRef.current.rotation.z, -0.4 - flapAngle, delta * speed
      );
    }

    // Pupil tracking
    const pupilOffset = state === "hiding"
      ? { x: 0, y: -0.04 }
      : { x: mousePos.x * 0.1, y: mousePos.y * 0.06 };

    [leftPupilRef, rightPupilRef].forEach((ref) => {
      if (ref.current) {
        ref.current.position.x = THREE.MathUtils.lerp(
          ref.current.position.x, pupilOffset.x, delta * speed * 2
        );
        ref.current.position.y = THREE.MathUtils.lerp(
          ref.current.position.y, pupilOffset.y, delta * speed * 2
        );
      }
    });

    // Eyelids
    const lid = lidTarget.current;
    [leftLidRef, rightLidRef].forEach((ref) => {
      if (ref.current) {
        ref.current.scale.y = THREE.MathUtils.lerp(
          ref.current.scale.y, lid, delta * speed * 1.5
        );
      }
    });
    [leftLidBottomRef, rightLidBottomRef].forEach((ref) => {
      if (ref.current) {
        ref.current.scale.y = THREE.MathUtils.lerp(
          ref.current.scale.y, lid * 0.5, delta * speed * 1.5
        );
      }
    });

    // Brows
    const brow = browTarget.current;
    if (leftBrowRef.current) {
      leftBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        leftBrowRef.current.rotation.z, brow * 0.5, delta * speed
      );
      leftBrowRef.current.position.y = THREE.MathUtils.lerp(
        leftBrowRef.current.position.y, 0.48 - brow * 0.1, delta * speed
      );
    }
    if (rightBrowRef.current) {
      rightBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        rightBrowRef.current.rotation.z, -brow * 0.5, delta * speed
      );
      rightBrowRef.current.position.y = THREE.MathUtils.lerp(
        rightBrowRef.current.position.y, 0.48 - brow * 0.1, delta * speed
      );
    }

    // Sad beak
    if (beakBottomRef.current) {
      beakBottomRef.current.rotation.x = THREE.MathUtils.lerp(
        beakBottomRef.current.rotation.x,
        sadAmount.current > 0.5 ? 0.25 : 0,
        delta * speed
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.1}>
      {/* ── BODY ── */}
      {/* Main body */}
      <mesh position={[0, -0.55, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color={mainBrown} roughness={0.82} />
      </mesh>
      {/* Body belly patch */}
      <mesh position={[0, -0.55, 0.4]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={cream} roughness={0.9} />
      </mesh>
      {/* Belly feather spots */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`spot-${i}`} position={[
          (i % 2 === 0 ? -0.12 : 0.12),
          -0.35 - i * 0.1,
          0.58
        ]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={lightBrown} roughness={0.9} />
        </mesh>
      ))}

      {/* ── HEAD ── */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial color={mainBrown} roughness={0.8} />
      </mesh>
      {/* Forehead lighter patch */}
      <mesh position={[0, 0.38, 0.28]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={midBrown} roughness={0.85} />
      </mesh>

      {/* ── FACIAL DISC ── */}
      {/* Main disc */}
      <mesh position={[0, 0.18, 0.32]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={cream} roughness={0.88} />
      </mesh>
      {/* Inner disc ring around eyes */}
      <mesh position={[-0.14, 0.22, 0.42]}>
        <torusGeometry args={[0.17, 0.03, 12, 24]} />
        <meshStandardMaterial color={eyeRing} roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.22, 0.42]}>
        <torusGeometry args={[0.17, 0.03, 12, 24]} />
        <meshStandardMaterial color={eyeRing} roughness={0.8} />
      </mesh>

      {/* ── EAR TUFTS ── */}
      {/* Left tuft - multiple feathers */}
      <group position={[-0.28, 0.65, -0.05]}>
        <mesh rotation={[0.1, 0, 0.35]}>
          <coneGeometry args={[0.08, 0.32, 6]} />
          <meshStandardMaterial color={darkBrown} roughness={0.85} />
        </mesh>
        <mesh position={[0.06, -0.02, 0]} rotation={[0.1, 0, 0.2]}>
          <coneGeometry args={[0.06, 0.25, 6]} />
          <meshStandardMaterial color={mainBrown} roughness={0.85} />
        </mesh>
        <mesh position={[-0.05, -0.03, 0]} rotation={[0.1, 0, 0.5]}>
          <coneGeometry args={[0.05, 0.22, 6]} />
          <meshStandardMaterial color={midBrown} roughness={0.85} />
        </mesh>
      </group>
      {/* Right tuft */}
      <group position={[0.28, 0.65, -0.05]}>
        <mesh rotation={[0.1, 0, -0.35]}>
          <coneGeometry args={[0.08, 0.32, 6]} />
          <meshStandardMaterial color={darkBrown} roughness={0.85} />
        </mesh>
        <mesh position={[-0.06, -0.02, 0]} rotation={[0.1, 0, -0.2]}>
          <coneGeometry args={[0.06, 0.25, 6]} />
          <meshStandardMaterial color={mainBrown} roughness={0.85} />
        </mesh>
        <mesh position={[0.05, -0.03, 0]} rotation={[0.1, 0, -0.5]}>
          <coneGeometry args={[0.05, 0.22, 6]} />
          <meshStandardMaterial color={midBrown} roughness={0.85} />
        </mesh>
      </group>

      {/* ── EYES ── */}
      {/* Left eye */}
      <group position={[-0.14, 0.22, 0.48]}>
        {/* Eye white / sclera */}
        <mesh>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial color={white} roughness={0.2} />
        </mesh>
        {/* Iris */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={irisColor} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Pupil */}
        <mesh ref={leftPupilRef} position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color={pupilColor} roughness={0.15} />
        </mesh>
        {/* Specular highlight */}
        <mesh position={[0.04, 0.04, 0.14]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color={white} emissive={white} emissiveIntensity={0.8} />
        </mesh>
        {/* Second highlight */}
        <mesh position={[-0.02, -0.02, 0.135]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={white} emissive={white} emissiveIntensity={0.5} />
        </mesh>
        {/* Upper eyelid */}
        <mesh ref={leftLidRef} position={[0, 0.07, 0.04]} scale={[1, 0, 1]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={mainBrown} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* Lower eyelid */}
        <mesh ref={leftLidBottomRef} position={[0, -0.07, 0.04]} scale={[1, 0, 1]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={mainBrown} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Right eye */}
      <group position={[0.14, 0.22, 0.48]}>
        <mesh>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial color={white} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={irisColor} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color={pupilColor} roughness={0.15} />
        </mesh>
        <mesh position={[0.04, 0.04, 0.14]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color={white} emissive={white} emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.02, -0.02, 0.135]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={white} emissive={white} emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightLidRef} position={[0, 0.07, 0.04]} scale={[1, 0, 1]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={mainBrown} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={rightLidBottomRef} position={[0, -0.07, 0.04]} scale={[1, 0, 1]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={mainBrown} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── EYEBROWS ── */}
      <mesh ref={leftBrowRef} position={[-0.14, 0.48, 0.46]}>
        <boxGeometry args={[0.2, 0.035, 0.06]} />
        <meshStandardMaterial color={darkBrown} roughness={0.8} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.14, 0.48, 0.46]}>
        <boxGeometry args={[0.2, 0.035, 0.06]} />
        <meshStandardMaterial color={darkBrown} roughness={0.8} />
      </mesh>

      {/* ── BEAK ── */}
      <mesh ref={beakTopRef} position={[0, 0.07, 0.62]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.055, 0.12, 3]} />
        <meshStandardMaterial color={beakOrange} roughness={0.5} />
      </mesh>
      <mesh ref={beakBottomRef} position={[0, 0.02, 0.6]} rotation={[0.6, 0, 0]}>
        <coneGeometry args={[0.035, 0.06, 3]} />
        <meshStandardMaterial color={beakDark} roughness={0.6} />
      </mesh>

      {/* ── CHEEKS ── */}
      <mesh position={[-0.28, 0.1, 0.38]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={cheekPink} roughness={0.9} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.28, 0.1, 0.38]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={cheekPink} roughness={0.9} transparent opacity={0.45} />
      </mesh>

      {/* ── WINGS ── */}
      <group>
        <mesh ref={leftWingRef} position={[-0.55, -0.35, -0.05]} rotation={[0, 0.3, 0.4]}>
          <sphereGeometry args={[0.32, 16, 12]} />
          <meshStandardMaterial color={midBrown} roughness={0.85} />
        </mesh>
        {/* Wing tip feathers */}
        <mesh position={[-0.78, -0.55, -0.12]} rotation={[0, 0.2, 0.8]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={darkBrown} roughness={0.85} />
        </mesh>
      </group>
      <group>
        <mesh ref={rightWingRef} position={[0.55, -0.35, -0.05]} rotation={[0, -0.3, -0.4]}>
          <sphereGeometry args={[0.32, 16, 12]} />
          <meshStandardMaterial color={midBrown} roughness={0.85} />
        </mesh>
        <mesh position={[0.78, -0.55, -0.12]} rotation={[0, -0.2, -0.8]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={darkBrown} roughness={0.85} />
        </mesh>
      </group>

      {/* ── TAIL ── */}
      <mesh position={[0, -0.9, -0.45]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial color={darkBrown} roughness={0.85} />
      </mesh>
      <mesh position={[-0.08, -0.85, -0.4]} rotation={[-0.35, 0.1, 0.1]}>
        <coneGeometry args={[0.12, 0.3, 5]} />
        <meshStandardMaterial color={midBrown} roughness={0.85} />
      </mesh>
      <mesh position={[0.08, -0.85, -0.4]} rotation={[-0.35, -0.1, -0.1]}>
        <coneGeometry args={[0.12, 0.3, 5]} />
        <meshStandardMaterial color={midBrown} roughness={0.85} />
      </mesh>

      {/* ── FEATHER TEXTURE RINGS ── */}
      <FeatherRing radius={0.6} y={-0.3} count={10} size={[0.08, 0.04, 0.06]} color={lightBrown} tilt={0.3} />
      <FeatherRing radius={0.58} y={-0.5} count={10} size={[0.07, 0.04, 0.06]} color={midBrown} tilt={0.2} />
      <FeatherRing radius={0.55} y={-0.7} count={8} size={[0.07, 0.04, 0.06]} color={lightBrown} tilt={0.1} />

      {/* ── FEET ── */}
      <group position={[-0.18, -1.15, 0.15]}>
        {/* Foot pad */}
        <mesh>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial color={feetColor} roughness={0.7} />
        </mesh>
        {/* Talons */}
        {[-0.04, 0, 0.04].map((x, i) => (
          <mesh key={`lt-${i}`} position={[x, -0.04, 0.06]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.015, 0.08, 4]} />
            <meshStandardMaterial color={talonColor} roughness={0.5} />
          </mesh>
        ))}
      </group>
      <group position={[0.18, -1.15, 0.15]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial color={feetColor} roughness={0.7} />
        </mesh>
        {[-0.04, 0, 0.04].map((x, i) => (
          <mesh key={`rt-${i}`} position={[x, -0.04, 0.06]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.015, 0.08, 4]} />
            <meshStandardMaterial color={talonColor} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── PERCH / BRANCH ── */}
      <mesh position={[0, -1.22, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 12]} />
        <meshStandardMaterial color={new THREE.Color("hsl(25, 25%, 22%)")} roughness={0.95} />
      </mesh>
    </group>
  );
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

  const owlState: OwlState = isSad ? "sad" : isTyping ? "hiding" : "watching";

  return (
    <div ref={containerRef} className="w-full h-52 sm:h-60">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} castShadow />
        <directionalLight position={[-2, 2, 3]} intensity={0.3} color="#ffd4a0" />
        <pointLight position={[0, 1, 3]} intensity={0.4} color="#fff5e6" />
        <OwlInner mousePos={mousePos} state={owlState} />
      </Canvas>
    </div>
  );
}

/* Reads ref inside Canvas */
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
