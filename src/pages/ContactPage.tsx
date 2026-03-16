import { useEffect, useRef, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Heart,
  ArrowRight,
  Send,
  Users,
  Building,
  Globe,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import heroCampus from "@/assets/hero-campus.jpg";

gsap.registerPlugin(ScrollTrigger);

const partnerTypes = [
  {
    icon: Building,
    title: "Corporate Sponsors",
    description:
      "Partner your brand with a life-changing cause. Corporate sponsorships fund training programs and provide visibility within our growing community network.",
  },
  {
    icon: Globe,
    title: "NGOs & Donors",
    description:
      "We welcome partnerships with like-minded organizations working on poverty alleviation, women's empowerment, and youth development.",
  },
  {
    icon: Users,
    title: "Volunteers",
    description:
      "Share your skills with our students and staff. From workshop facilitation to mentorship and business coaching — your time makes a difference.",
  },
  {
    icon: Heart,
    title: "Individual Donors",
    description:
      "Become a regular supporter or make a one-time contribution. Every shilling goes directly toward training vulnerable youth and single mothers.",
  },
];

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-hero-text > *",
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
      if (partnersRef.current) {
        gsap.fromTo(
          partnersRef.current.querySelectorAll(".partner-card"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: partnersRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current.querySelectorAll(".contact-anim"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contactRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    )
      return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent",
        description: "Thank you! We'll get back to you within 24 hours.",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img
            src={heroCampus}
            alt="Contact us"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 contact-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">
            Get In Touch
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.92] mb-8 opacity-0">
            Contact &<br />
            <em className="text-accent">Partnerships</em>
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Whether you want to donate, partner, volunteer, or just learn more —
            we'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Info + Form */}
      <div ref={contactRef} className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div>
            <p className="contact-anim opacity-0 font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Find Us
            </p>
            <h2 className="contact-anim opacity-0 font-heading text-4xl md:text-5xl font-light text-foreground leading-tight mb-10">
              We're Here to Help
            </h2>
            <div className="space-y-8">
              <a
                href="mailto:info@instituteuganda.org"
                className="contact-anim opacity-0 group flex items-center gap-5 transition-colors duration-300 hover:text-accent"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    Email
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-accent transition-colors duration-300">
                    info@instituteuganda.org
                  </p>
                </div>
              </a>
              <a
                href="tel:+256700000000"
                className="contact-anim opacity-0 group flex items-center gap-5 transition-colors duration-300 hover:text-accent"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <Phone size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    Phone
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-accent transition-colors duration-300">
                    +256 700 000 000
                  </p>
                </div>
              </a>
              <a
                href="https://wa.me/256700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-anim opacity-0 group flex items-center gap-5 transition-colors duration-300 hover:text-accent"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <MessageCircle size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    WhatsApp
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-accent transition-colors duration-300">
                    Chat with us on WhatsApp
                  </p>
                </div>
              </a>
              <div className="contact-anim opacity-0 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    Plot 7, Nakawa Road
                    <br />
                    Kampala, Uganda
                  </p>
                  <a
                    href="https://maps.google.com/?q=Nakawa+Kampala+Uganda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-accent mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    View on Google Maps
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="contact-anim opacity-0 font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Send a Message
            </p>
            <div className="contact-anim opacity-0">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-5 py-4 bg-transparent border border-border rounded-[16px] font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-300"
              />
            </div>
            <div className="contact-anim opacity-0">
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-5 py-4 bg-transparent border border-border rounded-[16px] font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-300"
              />
            </div>
            <div className="contact-anim opacity-0">
              <input
                type="text"
                placeholder="Subject (e.g. Partnership, Donation, Volunteer)"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-5 py-4 bg-transparent border border-border rounded-[16px] font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-300"
              />
            </div>
            <div className="contact-anim opacity-0">
              <textarea
                placeholder="Your message..."
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="w-full px-5 py-4 bg-transparent border border-border rounded-[16px] font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
              />
            </div>
            <div className="contact-anim opacity-0">
              <button
                type="submit"
                disabled={sending}
                className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Partner With Us */}
      <div
        ref={partnersRef}
        className="px-8 md:px-16 py-24 md:py-32 bg-secondary/20"
      >
        <div className="max-w-2xl mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Collaborate
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-tight">
            Partner With Us
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 max-w-lg">
            We welcome all forms of partnership and collaboration. Whether
            you're a company, NGO, or individual — there's a way for you to be
            part of this mission.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="partner-card opacity-0 group p-8 bg-background border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.12)]"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-500">
                {title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <button
            onClick={() => {
              const msg = encodeURIComponent(
                "Hello, I'm interested in partnering with your institute. Please tell me more about partnership opportunities.",
              );
              window.open(
                `https://wa.me/256700000000?text=${msg}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="group flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-body text-sm tracking-[0.2em] uppercase rounded-[20px] transition-all duration-500 hover:bg-accent/90"
          >
            Discuss a Partnership
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

export default ContactPage;
