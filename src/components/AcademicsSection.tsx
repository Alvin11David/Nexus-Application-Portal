import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import academicsImg from "@/assets/academics.jpg";

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    name: "Philosophy & Ethics",
    duration: "4 Years",
    type: "Bachelor of Arts",
  },
  {
    name: "Theoretical Physics",
    duration: "4 Years",
    type: "Bachelor of Science",
  },
  {
    name: "Comparative Literature",
    duration: "3 Years",
    type: "Bachelor of Arts",
  },
  {
    name: "Biomedical Engineering",
    duration: "5 Years",
    type: "Bachelor of Engineering",
  },
  {
    name: "Mathematical Sciences",
    duration: "4 Years",
    type: "Bachelor of Science",
  },
  {
    name: "Architecture & Urban Design",
    duration: "5 Years",
    type: "Bachelor of Architecture",
  },
];

const AcademicsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading slides from left
      gsap.fromTo(
        headingRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Image clip-path reveal + parallax
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Parallax on inner image
      if (imageRef.current) {
        gsap.to(imageRef.current.querySelector("img"), {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Program items stagger
      if (programsRef.current) {
        const items = programsRef.current.querySelectorAll(".program-item");
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: programsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="academics"
      className="py-32 md:py-48 px-8 md:px-16"
    >
      <h2
        ref={headingRef}
        className="heading-section text-foreground mb-24 opacity-0"
      >
        Academics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        <div className="lg:col-span-5">
          <div ref={imageRef} className="overflow-hidden rounded-[20px]">
            <img
              src={academicsImg}
              alt="Aged leather-bound books on weathered wooden library shelves"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <p className="body-text text-muted-foreground mt-6 max-w-sm">
            Our curriculum is designed not to fill minds, but to sharpen
            them—through direct engagement with primary sources and rigorous
            methodological training.
          </p>
        </div>

        <div className="lg:col-span-7 lg:pl-8" ref={programsRef}>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-12">
            Programs of Study
          </p>
          <div className="space-y-0">
            {programs.map((program) => (
              <div
                key={program.name}
                className="program-item border-t border-border py-6 flex items-baseline justify-between gap-4 opacity-0 group cursor-default"
              >
                <div className="flex-1">
                  <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground group-hover:text-accent transition-colors duration-500">
                    {program.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="font-body text-sm text-muted-foreground hidden md:block">
                    {program.type}
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    {program.duration}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademicsSection;
