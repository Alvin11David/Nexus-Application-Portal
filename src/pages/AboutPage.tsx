import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutHero from "@/assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: "1922", event: "Founded as the East African Institute of Higher Learning with 47 students and 6 faculty members." },
  { year: "1948", event: "Became a fully chartered university, expanding to include schools of law, medicine, and engineering." },
  { year: "1971", event: "Established the first research center in sub-Saharan Africa dedicated to tropical medicine." },
  { year: "1995", event: "Launched international partnerships with universities across Europe, Asia, and North America." },
  { year: "2010", event: "Opened the Innovation Hub, a 50,000 sq ft facility bridging academia and industry." },
  { year: "2024", event: "Ranked among the top 200 universities globally, with research output growing 34% year-over-year." },
];

const leadership = [
  { name: "Prof. Eleanor Mwangi", role: "Vice-Chancellor", focus: "Institutional Strategy" },
  { name: "Dr. Samuel Okafor", role: "Deputy Vice-Chancellor", focus: "Academic Affairs" },
  { name: "Prof. Aisha Kamau", role: "Pro-Vice-Chancellor", focus: "Research & Innovation" },
  { name: "Dr. Richard Ssempa", role: "Registrar", focus: "Administration & Student Affairs" },
];

const values = [
  { title: "Truth & Inquiry", desc: "We pursue knowledge without compromise, questioning assumptions and following evidence wherever it leads." },
  { title: "Community & Belonging", desc: "Every member of our community is valued. We create spaces where diverse perspectives flourish." },
  { title: "Service & Impact", desc: "Knowledge gains meaning through application. We educate leaders who serve society with integrity." },
  { title: "Innovation & Courage", desc: "We embrace bold ideas, calculated risks, and the creative disruption that drives progress." },
];

const AboutPage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-hero-text > *", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.3 });
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power2.out", delay: 0.2 });
      }
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current.querySelectorAll(".tl-item"), { x: -40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: timelineRef.current, start: "top 80%" },
        });
      }
      if (valuesRef.current) {
        gsap.fromTo(valuesRef.current.querySelectorAll(".value-card"), { y: 50, opacity: 0, rotateX: 10 }, {
          y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: valuesRef.current, start: "top 80%" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-screen flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img ref={imageRef} src={aboutHero} alt="University hall" className="w-full h-full object-cover rounded-none" />
          <div className="absolute inset-0 bg-primary/65 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 about-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">About Veritas</p>
          <h1 className="font-heading text-5xl md:text-8xl font-light text-primary-foreground leading-[0.9] mb-8 opacity-0">
            A Century of<br />Bold Inquiry
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Since 1922, Veritas Institute has been a beacon of academic excellence, producing leaders who transform communities across Africa and the world.
          </p>
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="px-8 md:px-16 py-32">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Values</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v) => (
            <div key={v.title} className="value-card opacity-0 group p-10 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.12)]">
              <h3 className="font-heading text-3xl font-light text-foreground mb-4 group-hover:text-accent transition-colors duration-500">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="px-8 md:px-16 py-32 bg-primary">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our History</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight">A Legacy of Excellence</h2>
        </div>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={t.year} className="tl-item opacity-0 group flex items-start gap-8 md:gap-16 py-10 border-t border-primary-foreground/10 last:border-b cursor-default">
              <span className="font-heading text-4xl md:text-5xl font-light text-accent shrink-0 w-28 group-hover:tracking-wider transition-all duration-500">{t.year}</span>
              <p className="font-body text-base text-primary-foreground/70 leading-relaxed group-hover:text-primary-foreground transition-colors duration-500">{t.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div className="px-8 md:px-16 py-32">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Leadership</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">University Leadership</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leadership.map((l) => (
            <div key={l.name} className="group text-center p-8 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40">
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 group-hover:bg-accent/10 transition-colors duration-500" />
              <h3 className="font-heading text-xl font-light text-foreground mb-1">{l.name}</h3>
              <p className="font-body text-xs text-accent tracking-[0.15em] uppercase mb-1">{l.role}</p>
              <p className="font-body text-xs text-muted-foreground">{l.focus}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
