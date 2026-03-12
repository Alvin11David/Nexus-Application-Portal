import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const admissionTypes = [
  {
    type: "Undergraduate",
    intake: "2,500 students",
    deadline: "March 31, 2025",
    desc: "Bachelor degree programs across all schools",
  },
  {
    type: "Postgraduate",
    intake: "1,200 students",
    deadline: "April 30, 2025",
    desc: "Master's and PhD programs",
  },
  {
    type: "Professional",
    intake: "800 students",
    deadline: "May 15, 2025",
    desc: "Specialized professional programs",
  },
  {
    type: "Exchange",
    intake: "300 students",
    deadline: "June 30, 2025",
    desc: "International exchange students",
  },
];

const requirements = [
  "High school completion with strong academic record (min. 3.0 GPA)",
  "Entrance examination scores (varies by program)",
  "English language proficiency (TOEFL/IELTS for international students)",
  "Personal statement and references",
  "Interview (for select programs)",
];

const AdmissionsListsPage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Hero text
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.querySelectorAll("*"),
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.3,
          },
        );
      }

      // Hero image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.1, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }

      // Admission types
      if (typesRef.current) {
        gsap.fromTo(
          typesRef.current.querySelectorAll(".admission-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: typesRef.current, start: "top 85%" },
          },
        );
      }

      // Requirements
      if (requirementsRef.current) {
        gsap.fromTo(
          requirementsRef.current.querySelectorAll(".requirement-item"),
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: requirementsRef.current,
              start: "top 85%",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src={aboutHero}
            alt="Admissions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div
          ref={heroTextRef}
          className="relative z-10 px-8 md:px-16 pb-20 pt-40 max-w-4xl"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">
            Getting Started
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.95] mb-8">
            Admissions Lists
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
            Explore our diverse admission pathways and find the program that
            fits your aspirations.
          </p>
        </div>
      </div>

      {/* Admission Types */}
      <div
        ref={typesRef}
        className="px-8 md:px-16 py-24 bg-gradient-to-b from-secondary/20 to-background"
      >
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-6">
            Pathways
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-12 leading-[1.1]">
            Admission Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {admissionTypes.map((item) => (
            <div key={item.type} className="admission-card">
              <div className="p-8 rounded-[24px] border border-border/50 bg-background hover:border-accent/40 transition-all duration-500 hover:shadow-xl">
                <div className="mb-6 pb-6 border-b border-border/50">
                  <h3 className="font-heading text-2xl font-light text-foreground mb-2">
                    {item.type}
                  </h3>
                  <p className="font-body text-sm text-accent font-semibold">
                    {item.intake}
                  </p>
                </div>
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  {item.desc}
                </p>
                <div className="p-4 rounded-[16px] bg-accent/5 border border-accent/20">
                  <p className="font-body text-xs text-accent font-semibold tracking-widest uppercase mb-1">
                    Application Deadline
                  </p>
                  <p className="font-body text-foreground font-semibold">
                    {item.deadline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div ref={requirementsRef} className="px-8 md:px-16 py-24 bg-background">
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-6">
            Prerequisites
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-12 leading-[1.1]">
            General Requirements
          </h2>
        </div>

        <div className="max-w-3xl">
          <div className="space-y-4">
            {requirements.map((req) => (
              <div
                key={req}
                className="requirement-item flex items-start gap-4 p-6 rounded-[20px] border border-border/40 hover:border-accent/40 bg-gradient-to-r from-secondary/10 to-background transition-all duration-500"
              >
                <CheckCircle2
                  size={24}
                  className="text-accent flex-shrink-0 mt-0.5"
                />
                <p className="font-body text-muted-foreground leading-relaxed pt-1">
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-8 rounded-[24px] border border-accent/30 bg-accent/5">
          <p className="font-body text-sm text-foreground mb-4">
            📝 <span className="font-semibold">Note:</span> Each program may
            have additional specific requirements. Check the program details for
            full information.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdmissionsListsPage;
