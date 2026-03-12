import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, BookOpen, Calendar, FileText, GraduationCap, HelpCircle, Library, Mail, Map, Phone, Shield, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const linkGroups = [
  {
    title: "Academics",
    links: [
      { icon: BookOpen, label: "Course Catalog", desc: "Browse all undergraduate and graduate programs" },
      { icon: Calendar, label: "Academic Calendar", desc: "Key dates, exam periods, and holidays" },
      { icon: Library, label: "Library Portal", desc: "Access digital resources, journals, and databases" },
      { icon: FileText, label: "Exam Results", desc: "View your grades and transcripts online" },
    ],
  },
  {
    title: "Student Services",
    links: [
      { icon: GraduationCap, label: "Student Portal", desc: "Registration, enrollment, and course management" },
      { icon: Users, label: "Student Organizations", desc: "Clubs, societies, and extracurricular activities" },
      { icon: Shield, label: "Health & Safety", desc: "Campus clinic, emergency contacts, and safety info" },
      { icon: HelpCircle, label: "IT Help Desk", desc: "Technical support for students and staff" },
    ],
  },
  {
    title: "Contact & Directions",
    links: [
      { icon: Mail, label: "Contact Us", desc: "General inquiries and department contacts" },
      { icon: Phone, label: "Directory", desc: "Find faculty, staff, and department phone numbers" },
      { icon: Map, label: "Campus Map", desc: "Interactive map of buildings, parking, and facilities" },
      { icon: FileText, label: "Forms & Documents", desc: "Download official forms and application documents" },
    ],
  },
];

const QuickLinksPage = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".ql-hero > *", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.3 });
      if (gridRef.current) {
        gsap.fromTo(gridRef.current.querySelectorAll(".ql-group"), { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="px-8 md:px-16 pt-40 pb-20 bg-primary">
        <div className="ql-hero max-w-3xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">Quick Links</p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.9] mb-6 opacity-0">
            Find What You Need
          </h1>
          <p className="font-body text-lg text-primary-foreground/60 leading-relaxed opacity-0">
            Fast access to the most-used university resources, portals, and services.
          </p>
        </div>
      </div>

      {/* Links Grid */}
      <div ref={gridRef} className="px-8 md:px-16 py-32 space-y-24">
        {linkGroups.map((group) => (
          <div key={group.title} className="ql-group opacity-0">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-10">{group.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.links.map((link) => {
                const Icon = link.icon;
                return (
                  <a key={link.label} href="#" className="group flex items-start gap-5 p-6 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_15px_50px_-15px_hsl(var(--accent)/0.12)]">
                    <div className="w-12 h-12 rounded-[12px] bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors duration-500">
                      <Icon size={20} className="text-muted-foreground group-hover:text-accent transition-colors duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-xl font-light text-foreground group-hover:text-accent transition-colors duration-500">{link.label}</h3>
                        <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
                      </div>
                      <p className="font-body text-sm text-muted-foreground mt-1">{link.desc}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default QuickLinksPage;
