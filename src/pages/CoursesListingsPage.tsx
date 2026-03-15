import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const colleges = [
  {
    name: "College of Science & Technology",
    programs: 28,
    focus: "Engineering, IT, Math, Physics",
  },
  {
    name: "College of Business",
    programs: 16,
    focus: "Finance, Management, Economics",
  },
  {
    name: "College of Humanities",
    programs: 22,
    focus: "Literature, History, Philosophy",
  },
  {
    name: "College of Medicine & Health Sciences",
    programs: 18,
    focus: "Medicine, Nursing, Public Health",
  },
  {
    name: "College of Law",
    programs: 12,
    focus: "Law, International Relations",
  },
  {
    name: "College of Agriculture",
    programs: 14,
    focus: "Agronomy, Animal Science",
  },
  {
    name: "College of Environmental Studies",
    programs: 11,
    focus: "Ecology, Conservation",
  },
  {
    name: "College of Education",
    programs: 13,
    focus: "Teacher Training, Curriculum",
  },
];

const CoursesListingsPage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const collegesRef = useRef<HTMLDivElement>(null);

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
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }

      // College cards
      if (collegesRef.current) {
        gsap.fromTo(
          collegesRef.current.querySelectorAll(".college-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: collegesRef.current, start: "top 85%" },
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
            alt="Courses & Programs"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div
          ref={heroTextRef}
          className="relative z-10 px-8 md:px-16 pb-20 pt-40 max-w-4xl"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">
            Academic Excellence
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.95] mb-8">
            Courses & Programs
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
            Explore 143+ programs across 10 colleges designed to prepare you for
            global impact.
          </p>
        </div>
      </div>

      {/* Colleges Grid */}
      <div ref={collegesRef} className="px-8 md:px-16 py-24 bg-background">
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-6">
            Colleges
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-12 leading-[1.1]">
            Academic Divisions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div key={college.name} className="college-card opacity-0">
              <Link
                to="/study/courses-programs"
                className="group card-hover block h-full p-8 rounded-[24px] border border-border/50 bg-gradient-to-br from-secondary/20 to-background hover:border-accent/40 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/50">
                  <div>
                    <h3 className="font-heading text-xl font-light text-foreground mb-2 leading-tight">
                      {college.name}
                    </h3>
                    <p className="font-body text-accent text-sm font-semibold">
                      {college.programs} Programs
                    </p>
                  </div>
                  <BookOpen
                    size={32}
                    className="icon-hover text-accent/40 group-hover:text-accent transition-colors duration-300"
                  />
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {college.focus}
                </p>
                <button className="text-accent hover:text-accent/80 transition-colors font-body text-xs tracking-[0.15em] uppercase font-semibold">
                  Explore All →
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[24px] border border-border/40 bg-accent/5 border-accent/30 text-center">
            <p className="font-heading text-5xl font-light text-accent mb-3">
              143+
            </p>
            <p className="font-body text-muted-foreground">Total Programs</p>
          </div>
          <div className="p-8 rounded-[24px] border border-border/40 bg-accent/5 border-accent/30 text-center">
            <p className="font-heading text-5xl font-light text-accent mb-3">
              10
            </p>
            <p className="font-body text-muted-foreground">Academic Colleges</p>
          </div>
          <div className="p-8 rounded-[24px] border border-border/40 bg-accent/5 border-accent/30 text-center">
            <p className="font-heading text-5xl font-light text-accent mb-3">
              Unlimited
            </p>
            <p className="font-body text-muted-foreground">
              Career Possibilities
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoursesListingsPage;
