import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Menu, X, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { studyLinks } from "@/lib/studyLinks";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Home", href: "/", badge: "Welcome" },
  { label: "Students", href: "/students", badge: "Community" },
  { label: "Research", href: "/research", badge: "Discovery" },
  { label: "About", href: "/about", badge: "Heritage" },
  { label: "News", href: "/news", badge: "Updates" },
  { label: "Quick Links", href: "/quick-links", badge: "Tools" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studyMenuOpen, setStudyMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 },
      );
    }
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    navigate(href);
  };

  const openStudyMenu = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setStudyMenuOpen(true);
  };

  const closeStudyMenu = () => {
    closeTimerRef.current = window.setTimeout(() => {
      setStudyMenuOpen(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const isActive = (href: string) => location.pathname === href;

  const navbarEl = (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 opacity-0 ${
        scrolled || mobileOpen
          ? "bg-background/90 backdrop-blur-md shadow-[0_1px_0_hsl(var(--border))]"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-8 md:px-16 py-5">
        <button
          onClick={() => navigate("/")}
          className={`font-heading text-xl md:text-2xl font-light tracking-[0.3em] uppercase transition-colors duration-700 ${
            scrolled || mobileOpen ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          Veritas
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div
            className="relative"
            onMouseEnter={openStudyMenu}
            onMouseLeave={closeStudyMenu}
          >
            <button
              onClick={() => navigate("/study")}
              className={`font-body text-xs tracking-[0.2em] uppercase transition-all duration-500 relative group inline-flex items-center gap-1.5 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              } ${location.pathname.startsWith("/study") ? "!text-accent" : ""}`}
            >
              Study at Veritas
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${studyMenuOpen ? "rotate-180" : "rotate-0"}`}
              />
              <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[min(1080px,calc(100vw-6rem))] rounded-[24px] border border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-500 ${
                studyMenuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-12">
                <div className="col-span-8 p-6 md:p-7 border-r border-border/70">
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-body text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
                      Join / Admissions
                    </p>
                    <button
                      onClick={() => navigate("/study")}
                      className="font-body text-[11px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors duration-300"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {studyLinks.map((item, i) => (
                      <button
                        key={item.slug}
                        onClick={() => {
                          navigate(`/study/${item.slug}`);
                          setStudyMenuOpen(false);
                        }}
                        className="group text-left rounded-[16px] border border-transparent hover:border-accent/35 hover:bg-accent/5 px-3 py-2.5 transition-all duration-300"
                        style={{
                          transitionDelay: studyMenuOpen
                            ? `${i * 10}ms`
                            : "0ms",
                        }}
                      >
                        <p className="font-body text-xs uppercase tracking-[0.12em] text-foreground group-hover:text-accent transition-colors duration-300">
                          {item.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-4 p-6 md:p-7 bg-gradient-to-b from-secondary/35 to-background">
                  <p className="font-body text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-4">
                    Studying at Veritas
                  </p>
                  <h3 className="font-heading text-3xl font-light leading-tight text-foreground mb-4">
                    Learn by doing, guided by global standards.
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                    With over 143 programs across 10 colleges, Veritas
                    combines critical scholarship with practical outcomes.
                  </p>
                  <button
                    onClick={() => {
                      navigate("/study/courses-programs");
                      setStudyMenuOpen(false);
                    }}
                    className="w-full rounded-[16px] px-4 py-3 border border-accent/40 text-left transition-all duration-300 hover:bg-accent/10"
                  >
                    <span className="font-body text-xs tracking-[0.16em] uppercase text-accent">
                      Courses & Programs
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={`font-body text-xs tracking-[0.2em] uppercase transition-all duration-500 relative group ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              } ${isActive(item.href) ? "!text-accent" : ""}`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 w-full h-px bg-accent transition-transform duration-500 origin-left ${isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden relative z-10 transition-colors duration-500 ${
            scrolled || mobileOpen ? "text-foreground" : "text-primary-foreground"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

    </nav>
  );

  const mobileMenu = mobileOpen
    ? createPortal(
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-6 md:hidden"
          style={{ zIndex: 9999, backgroundColor: 'hsl(60, 7%, 95%)' }}
        >
          {/* Close button inside overlay */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-8 text-foreground"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate("/study");
            }}
            className={`font-heading text-2xl font-light tracking-[0.15em] uppercase transition-all duration-500 hover:text-accent ${
              location.pathname.startsWith("/study") ? "text-accent" : "text-foreground"
            }`}
          >
            Study at Veritas
          </button>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={`font-heading text-2xl font-light tracking-[0.15em] uppercase transition-all duration-500 hover:text-accent ${isActive(item.href) ? "text-accent" : "text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {navbarEl}
      {mobileMenu}
    </>
  );
};

export default Navbar;
