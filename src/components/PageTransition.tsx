import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Overlay wipe in
      tl.fromTo(
        overlayRef.current,
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 0.5, ease: "power3.inOut" }
      );

      // Overlay wipe out + content fade in
      tl.to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.5,
        ease: "power3.inOut",
      });

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-primary pointer-events-none"
        style={{ transform: "scaleY(0)" }}
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
};

export default PageTransition;
