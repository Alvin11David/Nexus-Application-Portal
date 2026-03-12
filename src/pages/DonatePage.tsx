import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, GraduationCap, Microscope, Building, TreePine, ArrowRight } from "lucide-react";
import donateHero from "@/assets/donate-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const amounts = [25, 50, 100, 250, 500, 1000];

const impactAreas = [
  { icon: GraduationCap, title: "Student Scholarships", desc: "Fund access for deserving students who lack financial means to attend university.", raised: "$2.4M", goal: "$5M" },
  { icon: Microscope, title: "Research Grants", desc: "Support groundbreaking research in medicine, AI, and environmental science.", raised: "$3.8M", goal: "$6M" },
  { icon: Building, title: "Campus Development", desc: "Help build new facilities including a performing arts center and student commons.", raised: "$8.2M", goal: "$15M" },
  { icon: TreePine, title: "Sustainability Fund", desc: "Accelerate our carbon-neutral 2030 goal with solar, recycling, and green infrastructure.", raised: "$1.1M", goal: "$3M" },
];

const DonatePage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".donate-hero-text > *", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.3 });
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power2.out", delay: 0.2 });
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: formRef.current, start: "top 85%" },
        });
      }
      if (impactRef.current) {
        gsap.fromTo(impactRef.current.querySelectorAll(".impact-card"), { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: impactRef.current, start: "top 80%" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[80vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img ref={imageRef} src={donateHero} alt="University gala" className="w-full h-full object-cover rounded-none" />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 donate-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">Give to Veritas</p>
          <h1 className="font-heading text-5xl md:text-8xl font-light text-primary-foreground leading-[0.9] mb-8 opacity-0">
            Invest in<br />Tomorrow
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Your generosity transforms lives, fuels discovery, and shapes the leaders of tomorrow.
          </p>
        </div>
      </div>

      {/* Donation Form */}
      <div ref={formRef} className="px-8 md:px-16 py-32 opacity-0">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Heart size={32} className="text-accent mx-auto mb-4" />
            <h2 className="font-heading text-4xl font-light text-foreground mb-2">Make a Gift</h2>
            <p className="font-body text-sm text-muted-foreground">Every contribution makes a difference</p>
          </div>

          {/* Type Toggle */}
          <div className="flex justify-center gap-2 mb-10">
            {(["one-time", "monthly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDonationType(type)}
                className={`px-6 py-3 font-body text-xs tracking-[0.15em] uppercase rounded-[20px] border transition-all duration-500 ${
                  donationType === type ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/40"
                }`}
              >
                {type === "one-time" ? "One-Time" : "Monthly"}
              </button>
            ))}
          </div>

          {/* Amount Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-4 font-heading text-2xl font-light rounded-[16px] border transition-all duration-500 ${
                  selectedAmount === amt ? "bg-accent text-accent-foreground border-accent shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.3)]" : "border-border text-foreground hover:border-accent/40"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-10">
            <div className="flex items-center border border-border rounded-[16px] overflow-hidden focus-within:border-accent transition-colors duration-500">
              <span className="px-4 font-heading text-xl text-muted-foreground">$</span>
              <input
                type="number"
                placeholder="Custom amount"
                className="flex-1 bg-transparent font-body text-sm text-foreground py-4 pr-4 placeholder:text-muted-foreground/40 focus:outline-none"
                onFocus={() => setSelectedAmount(null)}
              />
            </div>
          </div>

          {/* Submit */}
          <button className="w-full py-5 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:shadow-[0_15px_50px_-12px_hsl(var(--accent)/0.4)] hover:scale-[1.02] active:scale-[0.98]">
            Donate {selectedAmount ? `$${selectedAmount}` : ""} {donationType === "monthly" ? "Monthly" : ""}
          </button>

          <p className="text-center font-body text-xs text-muted-foreground/60 mt-6">
            All donations are tax-deductible. You will receive a receipt via email.
          </p>
        </div>
      </div>

      {/* Impact Areas */}
      <div ref={impactRef} className="px-8 md:px-16 py-32 bg-primary">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Where It Goes</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight">Your Impact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactAreas.map((area) => {
            const Icon = area.icon;
            const raisedNum = parseFloat(area.raised.replace(/[$M]/g, ""));
            const goalNum = parseFloat(area.goal.replace(/[$M]/g, ""));
            const pct = Math.round((raisedNum / goalNum) * 100);
            return (
              <div key={area.title} className="impact-card opacity-0 group p-8 border border-primary-foreground/10 rounded-[20px] transition-all duration-500 hover:border-accent/30">
                <Icon size={24} className="text-accent mb-6" />
                <h3 className="font-heading text-2xl font-light text-primary-foreground mb-3 group-hover:text-accent transition-colors duration-500">{area.title}</h3>
                <p className="font-body text-sm text-primary-foreground/60 leading-relaxed mb-6">{area.desc}</p>
                <div className="mb-3">
                  <div className="h-1 bg-primary-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-primary-foreground/50">{area.raised} raised</span>
                  <span className="font-body text-xs text-primary-foreground/50">Goal: {area.goal}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DonatePage;
