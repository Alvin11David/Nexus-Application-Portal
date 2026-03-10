import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mottoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.inOut" }
    )
    .fromTo(nameRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(mottoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .to({}, { duration: 0.6 }); // pause

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center"
    >
      <div ref={lineRef} className="w-12 h-px bg-accent mb-8 origin-center" />
      <div
        ref={nameRef}
        className="font-heading text-3xl md:text-5xl font-light text-primary-foreground tracking-[0.3em] uppercase opacity-0"
      >
        Veritas
      </div>
      <p
        ref={mottoRef}
        className="font-body text-xs text-primary-foreground/50 tracking-[0.4em] uppercase mt-4 opacity-0"
      >
        Institute
      </p>
    </div>
  );
};

const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.4s ease" }}>
        {children}
      </div>
    </>
  );
};

export default LoadingWrapper;
