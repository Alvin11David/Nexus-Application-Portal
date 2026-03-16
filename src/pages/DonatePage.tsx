import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Users, Check, ChevronDown, ChevronUp } from "lucide-react";
import heroCampus from "@/assets/hero-campus.jpg";

gsap.registerPlugin(ScrollTrigger);

const donationTiers = [
  {
    amount: "$10",
    usd: 10,
    label: "Learning Materials",
    description:
      "Provides one student with notebooks, pens, and essential reading materials for a month.",
    impact: "Learning materials for 1 student",
    color: "border-border hover:border-accent/40",
  },
  {
    amount: "$25",
    usd: 25,
    label: "Training Tools",
    description:
      "Covers specialized tools and supplies needed for hands-on vocational training — needles, thread, fittings, or electrical components.",
    impact: "Training tools for 1 student",
    color: "border-border hover:border-accent/40",
  },
  {
    amount: "$50",
    usd: 50,
    label: "Monthly Sponsorship",
    description:
      "Sponsors a student for a full month, covering training fees, materials, and basic support. The most popular giving level.",
    impact: "Full monthly support for 1 student",
    color:
      "border-accent bg-accent/5 shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.25)]",
    featured: true,
  },
  {
    amount: "$200",
    usd: 200,
    label: "Full Program Support",
    description:
      "Covers a significant portion of a student's full training program from start to finish — a transformative gift that changes a life completely.",
    impact: "Covers most of a full training program",
    color: "border-border hover:border-accent/40",
  },
];

const faqs = [
  {
    q: "How is my donation used?",
    a: "100% of your donation goes directly to student training — covering fees, materials, tools, and basic support. We publish annual impact reports so you can see exactly how funds are used.",
  },
  {
    q: "Can I sponsor a specific student?",
    a: "Yes! Through our Sponsor a Student program, we match you with a student in our program. You'll receive updates on their progress and a letter from them upon graduation.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "We are a registered non-profit organization. Depending on your country, your donation may be tax-deductible. Contact us for official documentation.",
  },
  {
    q: "Can organizations or companies donate?",
    a: "Absolutely. We welcome corporate partnerships, NGO funding, and institutional support. Please visit our Partners page or contact us directly to discuss collaboration.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, mobile money (MTN/Airtel), PayPal, and credit/debit cards. Contact us via WhatsApp or email to get payment details.",
  },
];

const DonatePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tiersRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".donate-hero-text > *",
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
      if (tiersRef.current) {
        gsap.fromTo(
          tiersRef.current.querySelectorAll(".tier-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tiersRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleDonate = (amount: number) => {
    // In a real implementation, this would connect to a payment processor
    // For now, direct to contact/WhatsApp
    const message = encodeURIComponent(
      `Hello, I would like to donate $${amount} to support a student. Please send me the payment details.`,
    );
    window.open(
      `https://wa.me/256700000000?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img
            src={heroCampus}
            alt="Students learning skills"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-primary/75 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 donate-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">
            Make A Difference
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.92] mb-8 opacity-0">
            Your Gift Builds
            <br />
            <em className="text-accent">A Better Tomorrow</em>
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            One donation. One student. One family lifted out of poverty. Your
            support is the bridge between vulnerability and self-sufficiency.
          </p>
        </div>
      </div>

      {/* Donation Tiers */}
      <div ref={tiersRef} className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Choose Your Level
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
            Every Amount Makes an Impact
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6">
            All donations go directly to student training, materials, and
            support. No overhead. Real impact.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {donationTiers.map(
            ({ amount, usd, label, description, impact, color, featured }) => (
              <div
                key={amount}
                className={`tier-card opacity-0 flex flex-col p-8 border rounded-[20px] transition-all duration-500 ${color} ${featured ? "relative" : ""}`}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="font-heading text-5xl font-light text-accent mb-2">
                  {amount}
                </p>
                <p className="font-body text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                  {label}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                  {description}
                </p>
                <div className="flex items-center gap-2 mb-6 font-body text-xs text-foreground/70">
                  <Check size={14} className="text-accent shrink-0" />
                  <span>{impact}</span>
                </div>
                <button
                  onClick={() => handleDonate(usd)}
                  className={`w-full py-3 font-body text-sm tracking-[0.2em] uppercase rounded-[16px] transition-all duration-300 ${
                    featured
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "border border-foreground/20 text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  Donate {amount}
                </button>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Sponsor a Student Section */}
      <div
        id="sponsor"
        className="px-8 md:px-16 py-24 bg-primary text-primary-foreground"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Personal Impact
            </p>
            <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight mb-8">
              Sponsor a Student Directly
            </h2>
            <p className="font-body text-base text-primary-foreground/70 leading-relaxed mb-6">
              Through our Sponsor a Student program, you are matched with a
              specific student. You receive:
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "A profile and story of the student you're supporting",
                "Regular progress updates throughout their program",
                "A personal letter and certificate upon their graduation",
                "The knowledge that you directly changed a life",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-body text-sm text-primary-foreground/80"
                >
                  <Heart
                    size={16}
                    className="text-accent fill-accent shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  "Hello, I would like to sponsor a student. Please tell me more about the Sponsor a Student program.",
                );
                window.open(
                  `https://wa.me/256700000000?text=${msg}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90"
            >
              <Users size={16} />
              Start Sponsoring
            </button>
          </div>
          <div className="space-y-6">
            <div className="p-8 bg-primary-foreground/5 border border-primary-foreground/10 rounded-[20px]">
              <p className="font-heading text-4xl font-light text-accent mb-2">
                $50
                <span className="text-xl text-primary-foreground/50">
                  /month
                </span>
              </p>
              <p className="font-body text-sm text-primary-foreground/60 mb-4">
                Sponsors one student for a month
              </p>
              <div className="w-full bg-primary-foreground/10 rounded-full h-1.5">
                <div className="bg-accent h-1.5 rounded-full w-[68%]" />
              </div>
              <p className="font-body text-xs text-primary-foreground/40 mt-2">
                68% of monthly spots filled
              </p>
            </div>
            <div className="p-8 bg-primary-foreground/5 border border-primary-foreground/10 rounded-[20px]">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">
                Current Need
              </p>
              <p className="font-heading text-2xl font-light text-primary-foreground mb-2">
                47 students awaiting sponsorship
              </p>
              <p className="font-body text-sm text-primary-foreground/60">
                These students are enrolled and ready to start but need a
                sponsor to begin their program.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div ref={faqRef} className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Questions
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="border border-border rounded-[16px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors duration-300"
                >
                  <span className="font-body text-sm font-medium text-foreground pr-8">
                    {q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-accent shrink-0" />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-muted-foreground shrink-0"
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 border-t border-border/50">
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mt-4">
                      {a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DonatePage;
