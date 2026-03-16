import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutHero from "@/assets/about-hero.jpg";
import { Heart, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    title: "Empowerment",
    desc: "We believe every person has untapped potential. Our role is to unlock it through practical education and mentorship.",
  },
  {
    title: "Dignity",
    desc: "We treat every student with respect and dignity, creating a safe and nurturing environment for growth.",
  },
  {
    title: "Practical Education",
    desc: "Theory alone doesn't feed a family. We focus on hands-on, market-relevant skills that translate directly into income.",
  },
  {
    title: "Community Impact",
    desc: "When one person rises, the whole community benefits. We measure our success by the livelihoods transformed.",
  },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-text > *",
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
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, ease: "power2.out", delay: 0.2 },
        );
      }
      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.querySelectorAll(".value-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: valuesRef.current, start: "top 80%" },
          },
        );
      }
      if (founderRef.current) {
        gsap.fromTo(
          founderRef.current.querySelectorAll(".founder-anim"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: founderRef.current, start: "top 80%" },
          },
        );
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
          <img
            ref={imageRef}
            src={aboutHero}
            alt="Students at the institute"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 about-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">
            Our Story
          </p>
          <h1 className="font-heading text-5xl md:text-8xl font-light text-primary-foreground leading-[0.9] mb-8 opacity-0">
            Built on Hope,
            <br />
            Powered by Purpose
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            We started with one belief: that every person — regardless of
            circumstance — deserves the chance to build a dignified life through
            skills and hard work.
          </p>
        </div>
      </div>

      {/* Founder Story */}
      <div ref={founderRef} className="px-8 md:px-16 py-32 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="founder-anim opacity-0 font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Our Founding Story
            </p>
            <h2 className="founder-anim opacity-0 font-heading text-4xl md:text-6xl font-light text-foreground leading-tight mb-8">
              Why We Started
            </h2>
            <p className="founder-anim opacity-0 font-body text-base text-muted-foreground leading-relaxed mb-6">
              Our institute was founded after witnessing firsthand the cycle of
              poverty trapping single mothers and vulnerable youth in our
              community — not because of lack of ability, but lack of
              opportunity and skills.
            </p>
            <p className="founder-anim opacity-0 font-body text-base text-muted-foreground leading-relaxed mb-6">
              The founder, a community leader and educator, believed that
              practical vocational training — not charity — was the most
              dignified path to self-sufficiency. A small rented space, three
              sewing machines, and twelve students became the beginning of
              something far greater.
            </p>
            <p className="founder-anim opacity-0 font-body text-base text-muted-foreground leading-relaxed mb-10">
              Today, hundreds of graduates are running their own businesses,
              supporting their families, and transforming their communities —
              one skill at a time.
            </p>
            <button
              onClick={() => navigate("/programs")}
              className="founder-anim opacity-0 group flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90"
            >
              See Our Programs
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
          <div className="space-y-6">
            <div className="founder-anim opacity-0 p-10 bg-primary text-primary-foreground rounded-[20px]">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Our Mission
              </p>
              <p className="font-heading text-2xl md:text-3xl font-light text-primary-foreground leading-relaxed">
                "To equip vulnerable youth and single mothers with practical
                vocational skills that enable them to earn sustainable
                livelihoods."
              </p>
            </div>
            <div className="founder-anim opacity-0 p-10 border border-border rounded-[20px]">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Our Vision
              </p>
              <p className="font-heading text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                "A society where every young person has the skills to build a
                better future."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="px-8 md:px-16 py-32 bg-secondary/30">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            What We Stand For
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
            Our Core Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="value-card opacity-0 group p-10 border border-border bg-background rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.12)]"
            >
              <h3 className="font-heading text-3xl font-light text-foreground mb-4 group-hover:text-accent transition-colors duration-500">
                {v.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-8 md:px-16 py-32 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">
          Join Our Mission
        </p>
        <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight mb-10 max-w-2xl mx-auto">
          Be Part of the Change
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/donate")}
            className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90"
          >
            <Heart size={16} className="fill-current" />
            Donate Now
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="group flex items-center gap-2 px-10 py-4 border border-foreground/30 text-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent hover:text-accent"
          >
            Partner With Us
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;

const AboutPage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-text > *",
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
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, ease: "power2.out", delay: 0.2 },
        );
      }
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current.querySelectorAll(".tl-item"),
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: timelineRef.current, start: "top 80%" },
          },
        );
      }
      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.querySelectorAll(".value-card"),
          { y: 50, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: valuesRef.current, start: "top 80%" },
          },
        );
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
          <img
            ref={imageRef}
            src={aboutHero}
            alt="University hall"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-primary/65 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 about-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">
            About Veritas
          </p>
          <h1 className="font-heading text-5xl md:text-8xl font-light text-primary-foreground leading-[0.9] mb-8 opacity-0">
            A Century of
            <br />
            Bold Inquiry
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Since 1922, Veritas Institute has been a beacon of academic
            excellence, producing leaders who transform communities across
            Africa and the world.
          </p>
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="px-8 md:px-16 py-32">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Our Values
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
            What We Stand For
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="value-card opacity-0 group p-10 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.12)]"
            >
              <h3 className="font-heading text-3xl font-light text-foreground mb-4 group-hover:text-accent transition-colors duration-500">
                {v.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="px-8 md:px-16 py-32 bg-primary">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Our History
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight">
            A Legacy of Excellence
          </h2>
        </div>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div
              key={t.year}
              className="tl-item opacity-0 group flex items-start gap-8 md:gap-16 py-10 border-t border-primary-foreground/10 last:border-b cursor-default"
            >
              <span className="font-heading text-4xl md:text-5xl font-light text-accent shrink-0 w-28 group-hover:tracking-wider transition-all duration-500">
                {t.year}
              </span>
              <p className="font-body text-base text-primary-foreground/70 leading-relaxed group-hover:text-primary-foreground transition-colors duration-500">
                {t.event}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div className="px-8 md:px-16 py-32">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Leadership
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
            University Leadership
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leadership.map((l) => (
            <div
              key={l.name}
              className="group text-center p-8 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40"
            >
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 group-hover:bg-accent/10 transition-colors duration-500" />
              <h3 className="font-heading text-xl font-light text-foreground mb-1">
                {l.name}
              </h3>
              <p className="font-body text-xs text-accent tracking-[0.15em] uppercase mb-1">
                {l.role}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {l.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
