import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ApplicationCTAProps {
  onApply: () => void;
}

const ApplicationCTA = ({ onApply }: ApplicationCTAProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(btnRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="apply" className="py-48 md:py-64 px-8 md:px-16 flex flex-col items-center justify-center">
      <div className="divider-stone mb-24 max-w-xs mx-auto" />
      <h2 ref={headingRef} className="heading-display text-5xl md:text-7xl lg:text-8xl text-foreground text-center opacity-0">
        Begin Your
        <br />
        Application
      </h2>
      <button
        ref={btnRef}
        onClick={onApply}
        className="mt-16 px-12 py-4 border border-foreground font-body text-sm tracking-[0.3em] uppercase text-foreground transition-colors duration-700 hover:bg-accent hover:border-accent hover:text-accent-foreground opacity-0"
      >
        Apply Now
      </button>
    </section>
  );
};

export default ApplicationCTA;
