import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  ArrowRight,
  Scissors,
  Zap,
  Wrench,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react";
import LoadingWrapper from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const programPreviews = [
  {
    icon: Scissors,
    title: "Tailoring & Design",
    duration: "6 months",
    outcome: "Start your own clothing business",
  },
  {
    icon: Zap,
    title: "Electrical Installation",
    duration: "8 months",
    outcome: "Become a certified electrician",
  },
  {
    icon: Wrench,
    title: "Plumbing",
    duration: "8 months",
    outcome: "Run a plumbing contracting business",
  },
  {
    icon: Sparkles,
    title: "Beauty Therapy",
    duration: "4 months",
    outcome: "Open your own beauty salon",
  },
  {
    icon: Users,
    title: "Hairdressing",
    duration: "4 months",
    outcome: "Work in salons or self-employment",
  },
  {
    icon: BookOpen,
    title: "Soap Making",
    duration: "3 months",
    outcome: "Sell locally or to retailers",
  },
];

const storyFeature = {
  name: "Mary Nakato",
  program: "Tailoring Program",
  quote:
    "I joined the tailoring program as a single mother with no income. Today I run a small clothing business and can support my three children. This school changed my life.",
  outcome: "Now runs a tailoring shop in Kampala, employing 2 other women.",
};

const donationTiers = [
  { amount: "$10", impact: "Provides learning materials for one student" },
  { amount: "$25", impact: "Covers essential training tools" },
  { amount: "$50", impact: "Sponsors a student for one month" },
  { amount: "$200", impact: "Covers full training support" },
];

const Index = () => {
  const navigate = useNavigate();
  const programsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const donateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const cardCleanup: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (programsRef.current) {
        gsap.fromTo(
          programsRef.current.querySelectorAll(".program-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: programsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current.querySelectorAll(".story-anim"),
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
      if (donateRef.current) {
        gsap.fromTo(
          donateRef.current.querySelectorAll(".donate-card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: donateRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.utils
        .toArray<HTMLElement>(".ambient-layer")
        .forEach((layer, index) => {
          gsap.to(layer, {
            y: index % 2 === 0 ? -80 : 70,
            x: index % 2 === 0 ? 40 : -45,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

      gsap.utils.toArray<HTMLElement>(".interactive-card").forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.45,
          ease: "power3.out",
        });
        const rotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.45,
          ease: "power3.out",
        });
        const translateY = gsap.quickTo(card, "y", {
          duration: 0.45,
          ease: "power3.out",
        });

        gsap.set(card, {
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        });

        const move = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const offsetX = px - 0.5;
          const offsetY = py - 0.5;

          rotateX(-offsetY * 12);
          rotateY(offsetX * 14);
          translateY(-8);

          card.style.setProperty("--spotlight-x", `${px * 100}%`);
          card.style.setProperty("--spotlight-y", `${py * 100}%`);
        };

        const leave = () => {
          rotateX(0);
          rotateY(0);
          translateY(0);
          card.style.setProperty("--spotlight-x", "50%");
          card.style.setProperty("--spotlight-y", "50%");
        };

        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);

        cardCleanup.push(() => {
          card.removeEventListener("mousemove", move);
          card.removeEventListener("mouseleave", leave);
        });
      });
    });

    return () => {
      cardCleanup.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <LoadingWrapper>
      <div className="relative min-h-screen bg-background" id="home">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-[20px] font-body text-sm"
        >
          Skip to main content
        </a>
        <Navbar />
        <div id="main-content">
          <HeroSection />

          {/* Programs Preview Section */}
          <section className="relative py-24 md:py-32 px-8 md:px-16 bg-background overflow-hidden">
            <div className="ambient-layer pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="ambient-layer pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="max-w-2xl mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                What We Teach
              </p>
              <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
                Practical Skills That
                <br />
                Create Real Livelihoods
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 max-w-lg">
                Our vocational programs are designed for immediate employment
                and entrepreneurship. Each graduate leaves with the skills to
                earn income from day one.
              </p>
            </div>
            <div
              ref={programsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {programPreviews.map(
                ({ icon: Icon, title, duration, outcome }) => (
                  <div
                    key={title}
                    className="program-card interactive-card relative isolate overflow-hidden opacity-0 group p-8 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_26px_70px_-28px_hsl(var(--accent)/0.35)] cursor-pointer"
                    onClick={() => navigate("/programs")}
                    style={{
                      transformOrigin: "center",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), hsl(var(--accent) / 0.22), transparent 55%)",
                      }}
                    />
                    <Icon size={24} className="text-accent mb-5" />
                    <h3 className="font-heading text-2xl font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-500">
                      {title}
                    </h3>
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      {duration}
                    </p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {outcome}
                    </p>
                  </div>
                ),
              )}
            </div>
            <button
              onClick={() => navigate("/programs")}
              className="group flex items-center gap-2 font-body text-sm tracking-[0.2em] uppercase text-accent transition-all duration-300 hover:gap-4"
            >
              View All Programs
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </section>

          {/* Featured Success Story */}
          <section
            ref={storyRef}
            className="relative py-24 md:py-32 px-8 md:px-16 bg-primary text-primary-foreground overflow-hidden"
          >
            <div className="ambient-layer pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="story-anim opacity-0 font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">
                  Student Success Story
                </p>
                <blockquote className="story-anim opacity-0 font-heading text-3xl md:text-5xl font-light text-primary-foreground leading-tight mb-8">
                  "{storyFeature.quote}"
                </blockquote>
                <p className="story-anim opacity-0 font-body text-sm text-primary-foreground/60 mb-2">
                  — {storyFeature.name}, {storyFeature.program}
                </p>
                <p className="story-anim opacity-0 font-body text-sm text-accent mb-10">
                  {storyFeature.outcome}
                </p>
                <button
                  onClick={() => navigate("/impact")}
                  className="story-anim opacity-0 group flex items-center gap-2 px-8 py-4 border border-primary-foreground/40 text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent hover:text-accent"
                >
                  Read More Stories
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
              <div className="hidden lg:flex flex-col gap-6">
                <div className="interactive-card p-8 bg-primary-foreground/5 border border-primary-foreground/15 rounded-[20px]">
                  <p className="font-heading text-5xl font-light text-accent mb-2">
                    1,200+
                  </p>
                  <p className="font-body text-sm text-primary-foreground/60 uppercase tracking-[0.2em]">
                    Lives Changed
                  </p>
                </div>
                <div className="interactive-card p-8 bg-primary-foreground/5 border border-primary-foreground/15 rounded-[20px]">
                  <p className="font-heading text-5xl font-light text-accent mb-2">
                    300+
                  </p>
                  <p className="font-body text-sm text-primary-foreground/60 uppercase tracking-[0.2em]">
                    Businesses Started
                  </p>
                </div>
                <div className="interactive-card p-8 bg-primary-foreground/5 border border-primary-foreground/15 rounded-[20px]">
                  <p className="font-heading text-5xl font-light text-accent mb-2">
                    12+
                  </p>
                  <p className="font-body text-sm text-primary-foreground/60 uppercase tracking-[0.2em]">
                    Communities Reached
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Donate / Support Section */}
          <section
            ref={donateRef}
            className="relative py-24 md:py-32 px-8 md:px-16 bg-background overflow-hidden"
          >
            <div className="ambient-layer pointer-events-none absolute top-10 right-[-6rem] h-80 w-80 rounded-full bg-accent/12 blur-3xl" />
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Make A Difference
              </p>
              <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
                Your Support Changes
                <br />A Life
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6">
                Every contribution — large or small — directly funds training,
                materials, and opportunity for those who need it most.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              {donationTiers.map(({ amount, impact }) => (
                <div
                  key={amount}
                  className="donate-card interactive-card relative isolate overflow-hidden opacity-0 group p-8 border border-border rounded-[20px] text-center transition-all duration-500 hover:border-accent hover:shadow-[0_26px_70px_-28px_hsl(var(--accent)/0.38)] cursor-pointer"
                  onClick={() => navigate("/donate")}
                  style={{
                    transformOrigin: "center",
                    willChange: "transform",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), hsl(var(--accent) / 0.2), transparent 58%)",
                    }}
                  />
                  <p className="font-heading text-4xl font-light text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {amount}
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {impact}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90 hover:scale-105"
              >
                <Heart size={16} className="fill-current" />
                Donate Now
              </button>
              <button
                onClick={() => navigate("/donate#sponsor")}
                className="group flex items-center gap-2 px-10 py-4 border border-foreground/30 text-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:border-accent hover:text-accent"
              >
                <Users size={16} />
                Sponsor a Student
              </button>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default Index;
