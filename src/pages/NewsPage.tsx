import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar } from "lucide-react";
import newsHero from "@/assets/news-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const featuredNews = {
  title: "Veritas Institute Ranks Among Top 200 Universities Globally",
  date: "March 8, 2026",
  excerpt: "For the first time in its history, Veritas Institute has entered the top 200 of the World University Rankings, reflecting sustained investment in research, faculty excellence, and global partnerships.",
  category: "Institutional",
};

const newsItems = [
  { title: "New $12M AI Research Lab Opens on Campus", date: "Feb 28, 2026", category: "Research", excerpt: "The state-of-the-art facility will house 60 researchers and focus on ethical AI applications for healthcare." },
  { title: "Student Startup Raises $2.4M in Seed Funding", date: "Feb 15, 2026", category: "Innovation", excerpt: "AgriSense, founded by two Veritas engineering students, secures backing for its precision agriculture platform." },
  { title: "Spring Graduation Ceremony Celebrates 3,200 Graduates", date: "Jan 30, 2026", category: "Campus", excerpt: "The largest graduating class in university history includes students from 48 countries." },
  { title: "Partnership with MIT for Joint Research Program", date: "Jan 18, 2026", category: "Partnerships", excerpt: "A five-year collaboration to advance quantum computing research and student exchange." },
  { title: "Campus Sustainability Initiative Reduces Emissions by 40%", date: "Jan 5, 2026", category: "Sustainability", excerpt: "Solar installations and energy efficiency upgrades contribute to Veritas' carbon-neutral 2030 goal." },
  { title: "Faculty Member Wins Prestigious MacArthur Fellowship", date: "Dec 12, 2025", category: "Faculty", excerpt: "Prof. Nadia Ochieng recognized for groundbreaking work in tropical disease genomics." },
];

const events = [
  { title: "Open Day 2026", date: "April 15, 2026", type: "Admissions" },
  { title: "Research Symposium", date: "April 22, 2026", type: "Academic" },
  { title: "Alumni Gala Dinner", date: "May 10, 2026", type: "Community" },
  { title: "International Culture Week", date: "May 18–24, 2026", type: "Student Life" },
];

const NewsPage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".news-hero-text > *", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.3 });
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power3.inOut", delay: 0.4 });
      }
      if (newsRef.current) {
        gsap.fromTo(newsRef.current.querySelectorAll(".news-card"), { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: newsRef.current, start: "top 80%" },
        });
      }
      if (eventsRef.current) {
        gsap.fromTo(eventsRef.current.querySelectorAll(".event-item"), { x: 40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: eventsRef.current, start: "top 80%" },
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
          <img ref={imageRef} src={newsHero} alt="University news" className="w-full h-full object-cover rounded-none" />
          <div className="absolute inset-0 bg-primary/65 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 news-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">News & Events</p>
          <h1 className="font-heading text-5xl md:text-8xl font-light text-primary-foreground leading-[0.9] mb-8 opacity-0">
            Stories That<br />Inspire
          </h1>
        </div>
      </div>

      {/* Featured */}
      <div className="px-8 md:px-16 py-24 border-b border-border">
        <div className="max-w-4xl">
          <span className="inline-block font-body text-[10px] tracking-[0.3em] uppercase text-accent border border-accent/30 px-3 py-1 rounded-full mb-6">{featuredNews.category}</span>
          <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground leading-tight mb-6">{featuredNews.title}</h2>
          <p className="font-body text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">{featuredNews.excerpt}</p>
          <div className="flex items-center gap-6">
            <span className="font-body text-xs text-muted-foreground">{featuredNews.date}</span>
            <span className="group inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-accent cursor-pointer">
              Read Full Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div ref={newsRef} className="px-8 md:px-16 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((n) => (
            <div key={n.title} className="news-card opacity-0 group p-8 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.12)] cursor-pointer">
              <span className="inline-block font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-4">{n.category}</span>
              <h3 className="font-heading text-xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-500">{n.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{n.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-muted-foreground/60">{n.date}</span>
                <ArrowRight size={16} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div ref={eventsRef} className="px-8 md:px-16 py-32 bg-primary">
        <div className="max-w-2xl mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Upcoming Events</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-primary-foreground leading-tight">Mark Your Calendar</h2>
        </div>
        <div className="space-y-0">
          {events.map((e) => (
            <div key={e.title} className="event-item opacity-0 group flex items-center justify-between py-8 border-t border-primary-foreground/10 last:border-b cursor-pointer">
              <div className="flex items-center gap-6">
                <Calendar size={18} className="text-accent shrink-0" />
                <div>
                  <h3 className="font-heading text-2xl font-light text-primary-foreground group-hover:text-accent transition-colors duration-500">{e.title}</h3>
                  <p className="font-body text-xs text-primary-foreground/50">{e.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary-foreground/40 border border-primary-foreground/15 px-3 py-1 rounded-full">{e.type}</span>
                <ArrowRight size={16} className="text-primary-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
