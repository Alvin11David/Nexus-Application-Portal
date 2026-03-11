import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroCampus from "@/assets/hero-campus.jpg";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.7 }
      );

      // Hero image parallax
      gsap.to(imageRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Overlay darkens as you scroll
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Hero Image */}
      <div ref={imageRef} className="absolute inset-0 -top-10">
        <img
          src={heroCampus}
          alt="Veritas Institute campus architecture with dramatic shadows and warm light"
          className="w-full h-[130%] object-cover"
        />
        <div ref={overlayRef} className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-16 pb-24 md:pb-32">
        <h1
          ref={titleRef}
          className="heading-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-primary-foreground leading-[0.9] max-w-4xl opacity-0"
        >
          Where Thought
          <br />
          Takes Form
        </h1>
        <p
          ref={subtitleRef}
          className="body-text mt-8 text-primary-foreground/70 max-w-xl text-lg opacity-0"
        >
          Veritas Institute is a place of rigorous inquiry, where the pursuit of knowledge
          shapes not just careers, but the very architecture of understanding.
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary-foreground">Scroll</span>
          <div className="w-px h-8 bg-primary-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
