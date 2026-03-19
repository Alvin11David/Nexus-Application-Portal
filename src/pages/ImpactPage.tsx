import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ArrowRight, Quote } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import { useSpotlightCards, useCountUp } from "@/hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const successStories = [
  { name: "Mary Nakato", program: "Tailoring Program", duration: "Graduated 2022", story: "Mary joined the institute as a single mother of three with no income and no marketable skills. After six months in the tailoring program, she opened a small shop in Nakawa market. Today she earns enough to pay rent, school fees for her children, and has hired one employee.", outcome: "Runs a tailoring business, employs 1 person", tag: "Single Mother" },
  { name: "Samuel Opio", program: "Electrical Installation", duration: "Graduated 2023", story: "Samuel was a school dropout who spent years doing casual labour for minimal pay. After the electrical installation course, he got a job with a construction firm and within a year became a lead electrician. He now trains others in his community.", outcome: "Lead electrician, mentors youth in his village", tag: "Vulnerable Youth" },
  { name: "Grace Auma", program: "Beauty Therapy", duration: "Graduated 2021", story: "Grace had tried and failed at several businesses before finding us. The beauty therapy program gave her structured skills and confidence. She now runs a beauty parlour that serves over 40 clients per week, and recently started a small training program for girls in her neighborhood.", outcome: "Owns a beauty parlour, 40+ weekly clients", tag: "Single Mother" },
  { name: "Peter Mukasa", program: "Welding & Fabrication", duration: "Graduated 2022", story: "Peter was referred to our program by a community social worker. He had been unemployed for 3 years. After completing welding, he found a job quickly and now has saved enough to start his own metal fabrication workshop making furniture.", outcome: "Starting own metal fabrication business", tag: "Vulnerable Youth" },
  { name: "Fatuma Nabirye", program: "Soap Making", duration: "Graduated 2023", story: "Fatuma started selling soap from her home after completing the 3-month program. With support from a local microfinance group, she scaled up production. Her 'Pure Home' brand now supplies three shops in her district.", outcome: "Soap brand in 3 local shops", tag: "Single Mother" },
  { name: "John Kaggwa", program: "Plumbing", duration: "Graduated 2021", story: "John was 19 with no formal qualifications when he enrolled. Today, at 24, he runs a plumbing contracting business that wins residential jobs across Kampala. His earnings have tripled since leaving the program.", outcome: "Runs a plumbing contracting business in Kampala", tag: "Vulnerable Youth" },
];

const impactStats = [
  { value: 1200, suffix: "+", label: "Total Graduates" },
  { value: 300, suffix: "+", label: "Businesses Started" },
  { value: 70, suffix: "%", label: "Women & Single Mothers" },
  { value: 12, suffix: "+", label: "Communities Reached" },
  { value: 85, suffix: "%", label: "Employment Rate" },
  { value: 8, suffix: "", label: "Vocational Programs" },
];

const ImpactPage = () => {
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  useCountUp(statsRef);
  useSpotlightCards(storiesRef, ".story-card");

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Hero
      gsap.fromTo(".impact-hero-text > *",
        { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.18, ease: "power3.out", delay: 0.3 }
      );

      // Stats — scale bounce
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll(".stat-card"),
          { y: 50, opacity: 0, scale: 0.85 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, stagger: 0.08,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: statsRef.current, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }

      // Stories — staggered with rotation
      if (storiesRef.current) {
        gsap.fromTo(storiesRef.current.querySelectorAll(".story-card"),
          { y: 60, opacity: 0, rotateY: 6 },
          {
            y: 0, opacity: 1, rotateY: 0,
            duration: 0.9, stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: storiesRef.current, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img src={aboutHero} alt="Graduate success stories" className="w-full h-full object-cover rounded-none" />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 impact-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">Real Transformation</p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.92] mb-8 opacity-0">
            Lives Changed.<br /><em className="text-accent">Communities Transformed.</em>
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Our graduates are proof that practical skills — combined with determination — can break the cycle of poverty in a single generation.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div ref={statsRef} className="px-8 md:px-16 py-24 md:py-32 bg-secondary/20">
        <div className="max-w-2xl mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">By The Numbers</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">Our Impact In Numbers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {impactStats.map(({ value, suffix, label }) => (
            <div key={label} className="stat-card opacity-0 p-8 bg-background border border-border rounded-[20px] text-center stat-glow">
              <p className="stat-value font-heading text-4xl font-light text-accent mb-2">
                <span className="count-up" data-target={value} data-suffix={suffix}>0{suffix}</span>
              </p>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div ref={storiesRef} className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-2xl mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Graduate Stories</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">Meet Our Graduates</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 max-w-lg">
            Behind every statistic is a real person with a real story. These are just a few of the lives transformed by our programs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map(({ name, program, duration, story, outcome, tag }) => (
            <div key={name} className="story-card spotlight-card opacity-0 group flex flex-col p-8 border border-border rounded-[20px]">
              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center icon-bounce">
                    <Quote size={18} className="text-accent" />
                  </div>
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-accent border border-accent/30 px-3 py-1 rounded-full">{tag}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-6 italic">"{story}"</p>
                <div className="border-t border-border pt-6">
                  <p className="font-heading text-xl font-light text-foreground mb-1">{name}</p>
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-accent mb-1">{program}</p>
                  <p className="font-body text-xs text-muted-foreground mb-3">{duration}</p>
                  <p className="font-body text-xs text-foreground/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 md:px-16 py-24 bg-accent text-accent-foreground text-center">
        <h2 className="font-heading text-4xl md:text-6xl font-light leading-tight mb-6 max-w-2xl mx-auto">Help Write the Next Success Story</h2>
        <p className="font-body text-sm text-accent-foreground/80 max-w-lg mx-auto mb-10 leading-relaxed">
          Your donation directly funds a student's journey from vulnerability to self-sufficiency.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate("/donate")} className="group flex items-center gap-2 px-10 py-4 bg-accent-foreground text-accent font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent-foreground/90 btn-lift">
            <Heart size={16} className="fill-current" />Donate Now
          </button>
          <button onClick={() => navigate("/donate#sponsor")} className="group flex items-center gap-2 px-10 py-4 border border-accent-foreground/40 text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent-foreground btn-lift">
            Sponsor a Student
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImpactPage;
