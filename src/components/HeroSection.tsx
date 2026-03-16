import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Users, ArrowRight } from "lucide-react";
import heroCampus from "@/assets/hero-campus.jpg";

gsap.registerPlugin(ScrollTrigger);

const impactStats = [
  { value: "1,200+", label: "Students Trained" },
  { value: "70%", label: "Women & Single Mothers" },
  { value: "300+", label: "Graduates Running Businesses" },
  { value: "8", label: "Vocational Programs" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.3 },
      );
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.7 },
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 },
      );
      gsap.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.3 },
      );

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

      gsap.to(overlayRef.current, {
        opacity: 0.75,
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
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      {/* Hero Image */}
      <div ref={imageRef} className="absolute inset-0 -top-10">
        <img
          src={heroCampus}
          alt="Students learning practical vocational skills at the institute"
          className="w-full h-[130%] object-cover"
        />
        <div ref={overlayRef} className="absolute inset-0 bg-foreground/55" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-8 md:px-16 pt-40 pb-16 md:pb-24">
        <div className="max-w-5xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 flex items-center gap-2">
            <Heart size={12} className="fill-accent" />
            Empowering Communities Since 2010
          </p>
          <h1
            ref={titleRef}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.92] max-w-4xl opacity-0"
          >
            Empowering Single Mothers
            <br />
            <em className="text-accent">& Vulnerable Youth</em>
            <br />
            Through Practical Skills
          </h1>
          <p
            ref={subtitleRef}
            className="font-body mt-8 text-primary-foreground/75 max-w-xl text-lg leading-relaxed opacity-0"
          >
            We equip vulnerable youth and single mothers with vocational skills
            that enable them to earn sustainable livelihoods and build better
            futures.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 mt-10 opacity-0">
            <button
              onClick={() => navigate("/donate")}
              className="group flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90 hover:scale-105"
            >
              <Heart size={16} className="fill-current" />
              Donate Now
            </button>
            <button
              onClick={() => navigate("/donate#sponsor")}
              className="group flex items-center gap-2 px-8 py-4 border border-primary-foreground/50 text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent hover:text-accent"
            >
              <Users size={16} />
              Sponsor a Student
            </button>
            <button
              onClick={() => navigate("/about")}
              className="group flex items-center gap-2 px-8 py-4 text-primary-foreground/70 font-body text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:text-primary-foreground"
            >
              Learn More
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Impact Stats Bar */}
        <div
          ref={statsRef}
          className="mt-16 pt-8 border-t border-primary-foreground/20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0"
        >
          {impactStats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-heading text-3xl md:text-4xl font-light text-accent">
                {stat.value}
              </p>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-10">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary-foreground">
          Scroll
        </span>
        <div className="w-px h-8 bg-primary-foreground/50 animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
