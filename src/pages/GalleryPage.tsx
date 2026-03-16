import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroCampus from "@/assets/hero-campus.jpg";
import aboutHero from "@/assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

type Category = "All" | "Training" | "Graduation" | "Community" | "Projects";

const galleryItems: {
  src: string;
  alt: string;
  caption: string;
  category: Omit<Category, "All">;
}[] = [
  {
    src: heroCampus,
    alt: "Tailoring class in session",
    caption: "Tailoring students perfecting their craft",
    category: "Training",
  },
  {
    src: aboutHero,
    alt: "Graduation ceremony",
    caption: "Class of 2023 Graduation Day",
    category: "Graduation",
  },
  {
    src: heroCampus,
    alt: "Electrical installation training",
    caption: "Students practice electrical wiring",
    category: "Training",
  },
  {
    src: aboutHero,
    alt: "Community outreach event",
    caption: "Outreach day in Nakawa",
    category: "Community",
  },
  {
    src: heroCampus,
    alt: "Student project display",
    caption: "Graduates showcase their business products",
    category: "Projects",
  },
  {
    src: aboutHero,
    alt: "Beauty therapy class",
    caption: "Beauty therapy practical session",
    category: "Training",
  },
  {
    src: heroCampus,
    alt: "Welding in workshop",
    caption: "Welding fabrication workshop",
    category: "Training",
  },
  {
    src: aboutHero,
    alt: "Graduation group photo",
    caption: "Tailoring graduates, Class of 2022",
    category: "Graduation",
  },
  {
    src: heroCampus,
    alt: "Soap products display",
    caption: "Soap making graduates display their products",
    category: "Projects",
  },
  {
    src: aboutHero,
    alt: "Community gathering",
    caption: "Community partners meeting",
    category: "Community",
  },
  {
    src: heroCampus,
    alt: "Plumbing training",
    caption: "Students in plumbing practical session",
    category: "Training",
  },
  {
    src: aboutHero,
    alt: "Student project market",
    caption: "Graduates sell products at community market",
    category: "Projects",
  },
];

const categories: Category[] = [
  "All",
  "Training",
  "Graduation",
  "Community",
  "Projects",
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-hero-text > *",
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
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.querySelectorAll(".gallery-item"),
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    });
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden rounded-none">
          <img
            src={heroCampus}
            alt="Gallery hero"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-primary/70 rounded-none" />
        </div>
        <div className="relative z-10 px-8 md:px-16 pb-24 pt-40 gallery-hero-text max-w-4xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-6 opacity-0">
            Photo Gallery
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-primary-foreground leading-[0.92] mb-8 opacity-0">
            See the Impact
            <br />
            <em className="text-accent">In Action</em>
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl leading-relaxed opacity-0">
            Photos from our training sessions, graduation ceremonies, student
            projects, and community activities.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="px-8 md:px-16 pt-16 pb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div ref={gridRef} className="px-8 md:px-16 pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(({ src, alt, caption }, i) => (
            <button
              key={i}
              className="gallery-item opacity-0 group relative overflow-hidden rounded-[20px] aspect-square cursor-pointer"
              onClick={() => setLightboxImg({ src, alt, caption })}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-500 rounded-[20px] flex items-end">
                <p className="font-body text-sm text-primary-foreground px-5 py-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] bg-primary/95 flex items-center justify-center p-8"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="w-full max-h-[75vh] object-contain rounded-[20px]"
            />
            <p className="font-body text-sm text-primary-foreground/70 mt-4 text-center">
              {lightboxImg.caption}
            </p>
            <button
              onClick={() => setLightboxImg(null)}
              className="block mx-auto mt-6 font-body text-xs tracking-[0.3em] uppercase text-accent hover:text-primary-foreground transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
