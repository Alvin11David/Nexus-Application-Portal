import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QuoteSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(quoteRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(attrRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 1, delay: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", toggleActions: "play none none reverse" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-48 md:py-64 px-8 md:px-16 flex flex-col items-center justify-center">
      <div ref={lineRef} className="w-16 h-px bg-accent mb-16 origin-left" />
      <blockquote
        ref={quoteRef}
        className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-foreground text-center max-w-4xl leading-tight italic opacity-0"
      >
        "The task of the university is not to produce graduates, but to produce questions
        that outlast those who ask them."
      </blockquote>
      <p
        ref={attrRef}
        className="font-body text-sm text-muted-foreground mt-12 tracking-[0.3em] uppercase opacity-0"
      >
        Dr. Helena Voss, Founding Provost
      </p>
    </section>
  );
};

export default QuoteSection;
