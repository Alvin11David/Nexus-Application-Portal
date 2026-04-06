import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Scissors, Zap, Wrench, Sparkles, Users, BookOpen, Car, Flame,
  ChevronDown, ChevronUp, Heart, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import academicsImage from "@/assets/academics.jpg";
import campusLifeImage from "@/assets/campus-life.jpg";
import donateHeroImage from "@/assets/donate-hero.jpg";
import researchHeroImage from "@/assets/research-hero.jpg";
import researchImage from "@/assets/research.jpg";
import studentsHeroImage from "@/assets/students-hero.jpg";
import heroCampusImage from "@/assets/hero-campus.jpg";
import newsHeroImage from "@/assets/news-hero.jpg";
import { useFirestoreCollection } from "@/hooks/useFirestore";

gsap.registerPlugin(ScrollTrigger);

const fallbackPrograms = [
  { id: "tailoring", icon: Scissors, title: "Tailoring & Garment Design", duration: "6 months", image: academicsImage, skills: ["Sewing techniques", "Pattern making", "Clothing repair & alterations", "Fashion design basics"], careers: ["Run your own tailoring shop", "Work as a designer for boutiques", "Clothing repairs & alterations business"], description: "One of our most popular programs. Students learn to design, cut, and sew garments professionally. Many graduates open small tailoring shops or work for clothing manufacturers." },
  { id: "plumbing", icon: Wrench, title: "Plumbing", duration: "8 months", image: campusLifeImage, skills: ["Pipe fitting & installation", "Drainage systems", "Water supply systems", "Maintenance & repair"], careers: ["Start a plumbing contracting business", "Work with construction companies", "Maintenance technician roles"], description: "Skilled plumbers are always in demand. This program trains students to install, maintain, and repair water and drainage systems in residential and commercial buildings." },
  { id: "electrical", icon: Zap, title: "Electrical Installation", duration: "8 months", image: donateHeroImage, skills: ["Wiring & circuitry", "Safety standards", "Solar installation basics", "Fault diagnosis & repair"], careers: ["Certified electrician", "Solar installation business", "Electrical maintenance technician"], description: "Electricity needs are growing rapidly. Graduates leave ready to wire buildings, install solar panels, and troubleshoot electrical faults — all high-demand skills." },
  { id: "welding", icon: Flame, title: "Welding & Fabrication", duration: "6 months", image: researchHeroImage, skills: ["Arc welding", "Gas welding", "Metal fabrication", "Structural welding"], careers: ["Fabrication workshop owner", "Construction site welder", "Custom metalwork business"], description: "Welding is one of the most in-demand trades in Uganda. From construction to furniture fabrication, trained welders find steady work and can build lucrative businesses." },
  { id: "hairdressing", icon: Users, title: "Hairdressing", duration: "4 months", image: studentsHeroImage, skills: ["Cutting & styling", "Braiding & weaves", "Hair treatment & care", "Salon management"], careers: ["Open your own salon", "Work in established salons", "Mobile hairdressing services"], description: "Hair care is a booming industry. Our program trains students in modern styles and techniques, equipping them to serve both urban and rural clients effectively." },
  { id: "beauty", icon: Sparkles, title: "Beauty Therapy", duration: "4 months", image: newsHeroImage, skills: ["Skincare & facials", "Manicure & pedicure", "Make-up artistry", "Waxing & threading"], careers: ["Open a beauty salon", "Freelance beauty therapist", "Work in hotels or spas"], description: "From skincare to makeup artistry, this program covers the full range of beauty services. Graduates can work independently or establish their own beauty studios." },
  { id: "auto", icon: Car, title: "Auto Mechanics", duration: "9 months", image: researchImage, skills: ["Engine repair & maintenance", "Brake & suspension systems", "Electrical diagnostics", "Bodywork basics"], careers: ["Run your own garage", "Work with transport companies", "Fleet maintenance roles"], description: "With Uganda's growing vehicle numbers, trained mechanics are in high demand. Graduates gain hands-on experience with real vehicles and leave ready to earn immediately." },
  { id: "soap", icon: BookOpen, title: "Soap & Cosmetics Making", duration: "3 months", image: heroCampusImage, skills: ["Soap formulation", "Packaging & branding", "Quality control", "Business & marketing basics"], careers: ["Home-based soap business", "Supply to local shops & markets", "Build a beauty products brand"], description: "A low-cost, high-return business opportunity. Students learn to make and brand quality soaps and cosmetics, with a strong focus on turning the skill into a viable income source." },
];

type ProgramCard = {
  id: string;
  title: string;
  duration?: string;
  description?: string;
  skills?: string[];
  careers?: string[];
  level?: string;
  icon: LucideIcon;
  image: string;
};

type FirestoreProgram = {
  id: string;
  name: string;
  level?: string;
  description?: string;
  duration?: string;
  admission_requirements?: string;
};

const iconByKeyword: Array<{ keyword: string; icon: LucideIcon; image: string }> = [
  { keyword: "tailor", icon: Scissors, image: academicsImage },
  { keyword: "plumb", icon: Wrench, image: campusLifeImage },
  { keyword: "electric", icon: Zap, image: donateHeroImage },
  { keyword: "weld", icon: Flame, image: researchHeroImage },
  { keyword: "hair", icon: Users, image: studentsHeroImage },
  { keyword: "beauty", icon: Sparkles, image: newsHeroImage },
  { keyword: "auto", icon: Car, image: researchImage },
  { keyword: "soap", icon: BookOpen, image: heroCampusImage },
];

const resolveProgramVisuals = (title: string) => {
  const lower = title.toLowerCase();
  const matched = iconByKeyword.find((item) => lower.includes(item.keyword));
  return {
    icon: matched?.icon ?? BookOpen,
    image: matched?.image ?? academicsImage,
  };
};

const ProgramsPage = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data: firestorePrograms } = useFirestoreCollection<FirestoreProgram>(
    "programs",
    [],
    { orderBy: { field: "name", direction: "asc" } },
  );

  const programs: ProgramCard[] =
    firestorePrograms.length > 0
      ? firestorePrograms.map((program) => {
          const visuals = resolveProgramVisuals(program.name);
          const fallbackSkills = program.admission_requirements
            ? [program.admission_requirements]
            : ["Practical hands-on training", "Career-oriented curriculum"];

          return {
            id: program.id,
            title: program.name,
            duration: program.duration ?? "Flexible",
            description:
              program.description ??
              "A practical, market-focused program designed to build job-ready skills.",
            skills: fallbackSkills,
            careers: [
              `${program.name} technician`,
              "Self-employment pathway",
              "Industry apprenticeship",
            ],
            level: program.level,
            icon: visuals.icon,
            image: visuals.image,
          };
        })
      : fallbackPrograms;

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".programs-hero-text > *",
        { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.18, ease: "power3.out", delay: 0.3 }
      );

      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.querySelectorAll(".prog-card"),
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.85, stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Animate expanded content
  useEffect(() => {
    if (!expandedId) return;
    const el = document.getElementById(`prog-detail-${expandedId}`);
    if (!el) return;
    gsap.fromTo(el,
      { height: 0, opacity: 0 },
      { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [expandedId]);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img src={aboutHero} alt="Students learning vocational skills" className="w-full h-full object-cover rounded-none" />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 programs-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">What We Teach</p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.92] mb-8 opacity-0">
            Vocational Programs<br />That Build Real Futures
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            8 practical programs. Market-driven curricula. Every graduate leaves with skills to earn a living from day one.
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <div ref={cardsRef} className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-2xl mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Programs</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">Choose Your Path</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 max-w-lg">
            Click on any program to see skills, career outcomes, and how long it takes to complete.
          </p>
        </div>

        <div className="space-y-4">
          {programs.map(({ id, icon: Icon, title, duration, image, skills, careers, description }) => {
            const isOpen = expandedId === id;
            return (
              <div key={id} className="prog-card opacity-0 border border-border rounded-[20px] overflow-hidden magnetic-card">
                <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-5 md:p-6 text-left group">
                  <div className="flex items-center gap-4 md:gap-6 min-w-0">
                    <div className="relative h-20 w-24 md:h-24 md:w-32 shrink-0 overflow-hidden rounded-[14px] img-zoom">
                      <img src={image} alt={title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/35 via-primary/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
                      <div className="absolute inset-0 ring-1 ring-primary-foreground/20 rounded-[14px]" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0 icon-bounce">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-xl md:text-2xl font-light text-foreground group-hover:text-accent transition-colors duration-300">{title}</h3>
                      <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">Duration: {duration}</p>
                    </div>
                  </div>
                  {isOpen
                    ? <ChevronUp size={20} className="text-accent shrink-0 transition-transform duration-300" />
                    : <ChevronDown size={20} className="text-muted-foreground shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" />
                  }
                </button>

                {isOpen && (
                  <div id={`prog-detail-${id}`} className="px-8 pb-8 border-t border-border/50 overflow-hidden">
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 mb-8 max-w-2xl">{description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Skills Learned</p>
                        <ul className="space-y-2">
                          {skills.map((s) => (
                            <li key={s} className="flex items-center gap-3 font-body text-sm text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Career Opportunities</p>
                        <ul className="space-y-2">
                          {careers.map((c) => (
                            <li key={c} className="flex items-center gap-3 font-body text-sm text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 md:px-16 py-24 bg-primary text-primary-foreground text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">Ready to Help?</p>
        <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight mb-10 max-w-2xl mx-auto">Sponsor a Student's Journey</h2>
        <p className="font-body text-sm text-primary-foreground/60 max-w-lg mx-auto mb-10 leading-relaxed">
          For as little as $50 a month, you can sponsor a student through one of these life-changing programs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate("/donate")} className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90 btn-lift">
            <Heart size={16} className="fill-current" />Sponsor a Student
          </button>
          <button onClick={() => navigate("/contact")} className="group flex items-center gap-2 px-10 py-4 border border-primary-foreground/30 text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent hover:text-accent btn-lift">
            Contact Us
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramsPage;
