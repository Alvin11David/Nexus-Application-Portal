import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getNewsArticleBySlug, newsArticles } from "@/lib/newsContent";

const NewsArticlePage = () => {
  const { slug } = useParams();
  const article = slug ? getNewsArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/not-found" replace />;
  }

  const relatedArticles = newsArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-8 md:px-16 pt-36 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.18em] uppercase text-accent mb-8"
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>

          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
            {article.category}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-[0.95] mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 font-body text-sm text-muted-foreground mb-8">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
          <p className="font-body text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
            {article.excerpt}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10 items-start">
            <article className="space-y-6">
              {article.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-body text-base text-foreground/90 leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </article>

            <aside className="border border-border rounded-[24px] p-6 bg-secondary/20">
              <p className="font-body text-[11px] tracking-[0.22em] uppercase text-accent mb-4">
                Key Takeaways
              </p>
              <div className="space-y-4">
                {article.highlights.map((highlight) => (
                  <p
                    key={highlight}
                    className="font-body text-sm text-muted-foreground leading-relaxed"
                  >
                    {highlight}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-3">
                Related Reading
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
                More from Veritas
              </h2>
            </div>
            <Link
              to="/news"
              className="font-body text-xs tracking-[0.18em] uppercase text-accent"
            >
              All News
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                to={`/news/${item.slug}`}
                className="group p-6 border border-border rounded-[20px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_18px_50px_-18px_hsl(var(--accent)/0.15)]"
              >
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-accent mb-3">
                  {item.category}
                </p>
                <h3 className="font-heading text-2xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {item.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 font-body text-xs tracking-[0.16em] uppercase text-accent">
                  Read Article
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsArticlePage;
