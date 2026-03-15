import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import { footerQuickLinks, socialLinks } from "@/lib/resourceContent";
import { toast } from "@/hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

const resources = [
  { label: "About Institute", href: "/about/institute" },
  { label: "Facts & Figures", href: "/about/facts-figures" },
  { label: "Visit Institute", href: "/about/visit" },
  { label: "Alumni", href: "/about/alumni" },
  { label: "History Timeline", href: "/about/history" },
  { label: "Admissions Lists", href: "/admissions/lists" },
  { label: "How to Apply", href: "/admissions/how-to-apply" },
  { label: "Courses Listings", href: "/admissions/courses" },
  { label: "Fees & Payment", href: "/admissions/fees" },
  { label: "International Students", href: "/admissions/international" },
  { label: "Scholarships", href: "/admissions/scholarships" },
  { label: "Learning Online", href: "/admissions/online" },
  { label: "FAQ", href: "/admissions/faq" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const cols = contentRef.current.querySelectorAll(".footer-col");
        gsap.fromTo(
          cols,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    toast({
      title: "Subscribed",
      description: `Updates will be sent to ${email.trim()}.`,
    });
    setEmail("");
  };

  return (
    <footer ref={footerRef} className="bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div ref={contentRef} className="px-8 md:px-16 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          {/* Brand & Contact */}
          <div className="footer-col lg:col-span-1 opacity-0">
            <h3 className="font-heading text-3xl font-light tracking-[0.2em] uppercase mb-6">
              Institute University
            </h3>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed mb-8">
              A community of inquiry, innovation, and service, where students
              and faculty build solutions for society.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:admissions@instituteuniversity.edu"
                className="group flex items-center gap-3 font-body text-sm text-primary-foreground/70 transition-colors duration-500 hover:text-primary-foreground"
              >
                <Mail
                  size={16}
                  className="text-primary-foreground/40 group-hover:text-accent transition-colors duration-500"
                />
                <span className="relative">
                  admissions@instituteuniversity.edu
                  <span className="absolute -bottom-0.5 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </span>
              </a>
              <a
                href="tel:+12125551847"
                className="group flex items-center gap-3 font-body text-sm text-primary-foreground/70 transition-colors duration-500 hover:text-primary-foreground"
              >
                <Phone
                  size={16}
                  className="text-primary-foreground/40 group-hover:text-accent transition-colors duration-500"
                />
                <span className="relative">
                  +1 (212) 555-1847
                  <span className="absolute -bottom-0.5 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-primary-foreground/40 mt-0.5 shrink-0"
                />
                <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
                  P.O. Box 7062
                  <br />
                  Institute Hill Road
                  <br />
                  Kampala, Uganda
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col opacity-0">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/40 mb-8">
              Quick Links
            </p>
            <ul className="space-y-4">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 font-body text-sm text-primary-foreground/70 transition-all duration-500 hover:text-primary-foreground hover:translate-x-1"
                  >
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all duration-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col opacity-0">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/40 mb-8">
              About & Admissions
            </p>
            <ul className="space-y-4">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 font-body text-sm text-primary-foreground/70 transition-all duration-500 hover:text-primary-foreground hover:translate-x-1"
                  >
                    <span className="w-0 h-px bg-accent group-hover:w-4 transition-all duration-500" />
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-60 transition-opacity duration-500 -ml-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="footer-col opacity-0">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/40 mb-8">
              Connect
            </p>
            <div className="flex gap-3 mb-10">
              {socialLinks.map((s) => {
                const Icon =
                  s.label === "Instagram"
                    ? Instagram
                    : s.label === "Twitter"
                    ? Twitter
                    : s.label === "LinkedIn"
                    ? Linkedin
                    : Youtube;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                    className="group w-10 h-10 border border-primary-foreground/20 flex items-center justify-center transition-all duration-500 hover:border-accent hover:bg-accent/10"
                  >
                    <Icon
                      size={16}
                      className="text-primary-foreground/60 group-hover:text-accent transition-colors duration-500"
                    />
                  </a>
                );
              })}
            </div>

            <p className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mb-4">
              Stay Informed
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex border-b border-primary-foreground/20 group focus-within:border-accent transition-colors duration-500"
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="flex-1 bg-transparent font-body text-sm text-primary-foreground py-3 placeholder:text-primary-foreground/30 focus:outline-none"
              />
              <button type="submit" className="px-3 text-primary-foreground/40 hover:text-accent transition-colors duration-500">
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        ref={bottomRef}
        className="border-t border-primary-foreground/10 px-8 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 opacity-0"
      >
        <p className="font-body text-xs text-primary-foreground/30 tracking-wider">
          © {new Date().getFullYear()} Veritas Institute. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          {[
            { label: "Privacy Policy", href: "/legal/privacy-policy" },
            { label: "Terms of Use", href: "/legal/terms-of-use" },
            { label: "Accessibility", href: "/legal/accessibility" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group font-body text-xs text-primary-foreground/30 tracking-wider transition-colors duration-500 hover:text-primary-foreground/70 relative"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
