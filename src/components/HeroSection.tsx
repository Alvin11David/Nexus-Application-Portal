import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroCampus from "@/assets/hero-campus.jpg";

gsap.registerPlugin(ScrollTrigger);

const navItems = ["Academics", "Research", "Faculty", "Apply"];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [navVisible, setNavVisible] = useState(true);

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
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Nav fade out on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          setNavVisible(self.progress < 0.15);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-8 transition-opacity duration-700"
        style={{ opacity: navVisible ? 1 : 0, pointerEvents: navVisible ? "auto" : "none" }}
      >
        <div className="font-heading text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-foreground">
          Veritas Institute
        </div>
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="accent-link font-body text-sm tracking-[0.2em] uppercase"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Image */}
      <div ref={imageRef} className="absolute inset-0 -top-10">
        <img
          src={heroCampus}
          alt="Veritas Institute campus architecture with dramatic shadows and warm light"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
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
      </div>
    </section>
  );
};

export default HeroSection;
