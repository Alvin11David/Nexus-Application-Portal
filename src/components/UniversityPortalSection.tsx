import { ArrowRight, CalendarDays, MapPin, Newspaper, Sparkles } from "lucide-react";

const quickOptions = [
  "Prospective student: admissions and programs",
  "Current student: timetable and support",
  "Parent/guardian: tuition and campus life",
  "Research partner: labs and innovation",
  "Alumni: events and giving",
];

const stories = [
  {
    date: "11 March, 2026",
    title: "Engineering students complete climate-tech field challenge",
    excerpt:
      "A cross-disciplinary cohort tested water and soil sensing systems with local communities in a week-long practicum.",
  },
  {
    date: "10 March, 2026",
    title: "Scholars encouraged to build mentorship networks early",
    excerpt:
      "Career services and faculty leaders launched a new mentorship track focused on career readiness and confidence.",
  },
  {
    date: "10 March, 2026",
    title: "Institute team wins national conservation innovation challenge",
    excerpt:
      "Students designed a low-cost biodiversity monitoring kit that impressed judges for impact and scalability.",
  },
];

const events = [
  {
    day: "13",
    month: "Mar",
    mode: "Hybrid (Physical & Virtual)",
    title: "Public Dialogue: Women Leading Public Institutions",
    venue: "Senate Hall and Online Stream",
  },
  {
    day: "18",
    month: "Mar",
    mode: "Physical",
    title: "Satellite Data & Interferometry Professional Course",
    venue: "GIS Center, Innovation Building",
  },
  {
    day: "22",
    month: "Mar",
    mode: "Hybrid (Physical & Virtual)",
    title: "National Conference on Communication 2026",
    venue: "Main Auditorium and Online",
  },
];

const innovationArticles = [
  "University partners with manufacturing leaders to accelerate practical innovation",
  "Researchers awarded grant for crop safety using plant-based antifungal systems",
  "Cross-border research lecture spotlights collaboration opportunities in Africa",
  "Innovation Office publishes 2026 research and enterprise report",
  "Data science lab launches open guide for ethical AI in higher education",
  "Medical engineering team unveils maternal safety monitoring prototype",
];

const UniversityPortalSection = () => {
  return (
    <section className="py-28 md:py-36 px-8 md:px-16 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div id="quick-links" className="mb-24">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-5">
          Quick Links
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-border rounded-[20px] p-6 md:p-8 bg-background">
            <p className="font-heading text-3xl md:text-4xl font-light text-foreground leading-tight mb-5">
              Use the choices below to access the resources you need immediately.
            </p>
            <label className="font-body text-xs tracking-[0.18em] uppercase text-muted-foreground block mb-2">
              Select Option
            </label>
            <select className="w-full bg-background border border-border rounded-[20px] px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40">
              {quickOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <p className="font-body text-sm text-muted-foreground mt-4">
              This list highlights the most requested paths. If you cannot find what
              you need, contact us and we will guide you directly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: "Join",
                text: "Begin your admission journey and discover scholarship routes.",
              },
              {
                title: "Visit",
                text: "Book a campus tour, open lecture, or faculty meet-and-greet.",
              },
              {
                title: "Give",
                text: "Support student success, research, and community impact.",
              },
            ].map((item) => (
              <button
                key={item.title}
                className="text-left border border-border rounded-[20px] p-5 bg-background group transition-all duration-500 hover:border-accent/40 hover:bg-accent/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-2xl font-light text-foreground group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
                <p className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {item.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="campus-updates" className="mb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Happening Around Campus
            </p>
            <h3 className="font-heading text-4xl md:text-5xl font-light text-foreground">
              Stories, research, and opportunities
            </h3>
          </div>
          <button className="font-body text-xs tracking-[0.2em] uppercase text-foreground border border-border px-5 py-2.5 rounded-[20px] hover:border-accent hover:text-accent transition-colors duration-300">
            View More Stories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story) => (
            <article
              key={story.title}
              className="border border-border rounded-[20px] bg-background p-6 group transition-all duration-500 hover:border-accent/40 hover:bg-accent/5"
            >
              <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                {story.date}
              </p>
              <h4 className="font-heading text-2xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                {story.title}
              </h4>
              <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
                {story.excerpt}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-foreground group-hover:text-accent transition-colors duration-300"
              >
                Continue Reading <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>

      <div id="events" className="mb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h3 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Upcoming Events & Activities
          </h3>
          <a
            href="#"
            className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-accent transition-colors duration-300"
          >
            View Events Portal
          </a>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <article
              key={event.title}
              className="border border-border rounded-[20px] p-5 md:p-6 bg-background group transition-all duration-500 hover:border-accent/40 hover:bg-accent/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-3">
                  <div className="w-14 h-14 rounded-[16px] border border-border flex flex-col items-center justify-center bg-secondary/30 group-hover:border-accent/50 transition-colors duration-300">
                    <span className="font-heading text-xl leading-none text-foreground">
                      {event.day}
                    </span>
                    <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                      {event.month}
                    </span>
                  </div>
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                    {event.mode}
                  </span>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-heading text-2xl font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {event.title}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground inline-flex items-center gap-2">
                    <MapPin size={14} /> {event.venue}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-foreground group-hover:text-accent transition-colors duration-300"
                  >
                    Details <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div id="innovation" className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Research & Innovation
          </h3>
        </div>
        <p className="font-body text-muted-foreground mb-8 max-w-3xl">
          Articles from our labs, field projects, and industry collaborations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {innovationArticles.map((article) => (
            <a
              key={article}
              href="#"
              className="group border border-border rounded-[20px] p-5 bg-background transition-all duration-500 hover:border-accent/40 hover:bg-accent/5"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <Newspaper size={14} className="text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                <span className="font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                  Research Article
                </span>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed group-hover:text-accent transition-colors duration-300">
                {article}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div
        id="newsletter"
        className="border border-border rounded-[20px] p-6 md:p-8 bg-background flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h3 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-2">
            Do not miss any updates
          </h3>
          <p className="font-body text-muted-foreground">
            Get our latest campus stories and event alerts in your inbox.
          </p>
        </div>
        <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="min-w-[260px] border border-border rounded-[20px] px-4 py-3 bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-[20px] hover:bg-primary/90 transition-colors duration-300 inline-flex items-center justify-center gap-2"
          >
            Subscribe <CalendarDays size={14} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default UniversityPortalSection;
