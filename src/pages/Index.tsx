import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/HeroSection";
import AcademicsSection from "@/components/AcademicsSection";
import ResearchSection from "@/components/ResearchSection";
import QuoteSection from "@/components/QuoteSection";
import ApplicationCTA from "@/components/ApplicationCTA";
import ApplicationForm from "@/components/ApplicationForm";
import FloatingApplyButton from "@/components/FloatingApplyButton";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [applicationOpen, setApplicationOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const openApplication = () => {
    if (!mainContentRef.current || applicationOpen) return;
    
    setApplicationOpen(true);

    gsap.to(mainContentRef.current, {
      height: 64,
      overflow: "hidden",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (formRef.current) {
          gsap.fromTo(formRef.current, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
          );
        }
      }
    });
  };

  const closeApplication = () => {
    if (!mainContentRef.current) return;

    gsap.to(mainContentRef.current, {
      height: "auto",
      overflow: "visible",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        setApplicationOpen(false);
        ScrollTrigger.refresh();
      }
    });
  };

  useEffect(() => {
    // Refresh ScrollTrigger after load
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Compressed content bar when application is open */}
      <div
        ref={mainContentRef}
        className={`relative ${applicationOpen ? 'cursor-pointer' : ''}`}
        onClick={applicationOpen ? closeApplication : undefined}
      >
        {applicationOpen && (
          <div className="h-16 flex items-center justify-between px-8 md:px-16 bg-primary">
            <span className="font-heading text-lg text-primary-foreground tracking-widest uppercase">
              Veritas Institute
            </span>
            <span className="font-body text-xs text-primary-foreground/60 tracking-wider uppercase">
              Click to return to site
            </span>
          </div>
        )}

        {!applicationOpen && (
          <>
            <HeroSection />
            <AcademicsSection />
            <ResearchSection />
            <QuoteSection />
            <ApplicationCTA onApply={openApplication} />
          </>
        )}
      </div>

      {/* Application Form */}
      {applicationOpen && (
        <div ref={formRef} className="opacity-0">
          <ApplicationForm onClose={closeApplication} />
        </div>
      )}

      {/* Floating Apply Button */}
      {!applicationOpen && (
        <FloatingApplyButton onClick={openApplication} />
      )}
    </div>
  );
};

export default Index;
