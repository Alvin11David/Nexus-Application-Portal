import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { studyLinks } from "@/lib/studyLinks";

const StudyItemPage = () => {
  const { slug } = useParams();
  const item = studyLinks.find((entry) => entry.slug === slug);

  if (!item) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 md:pt-36 px-8 md:px-16 pb-20">
        <section className="max-w-5xl mx-auto">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-accent transition-colors duration-300 mb-6"
          >
            Back to Study at Veritas
          </Link>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-foreground leading-[0.95] mb-5">
            {item.title}
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {item.summary}
          </p>
        </section>

        <section className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "Overview",
            "Requirements",
            "Important Dates",
            "Downloads",
            "Contacts",
            "Frequently Asked Questions",
          ].map((block) => (
            <article
              key={block}
              className="border border-border rounded-[20px] p-5 bg-background transition-all duration-400 hover:border-accent/40 hover:bg-accent/5"
            >
              <h2 className="font-heading text-2xl font-light text-foreground mb-2">
                {block}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                This section for {item.title.toLowerCase()} is ready for your
                institutional content and can be connected to your CMS or API.
              </p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudyItemPage;
