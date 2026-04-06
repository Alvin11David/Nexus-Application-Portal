import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const applicationSteps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Register on our admissions portal with your email. You'll receive a confirmation link to activate your account.",
  },
  {
    number: "02",
    title: "Complete Application",
    desc: "Fill out the comprehensive application form with your academic history, personal background, and program preferences.",
  },
  {
    number: "03",
    title: "Upload Documents",
    desc: "Submit required documents including transcripts, test scores, essays, and letters of recommendation.",
  },
  {
    number: "04",
    title: "Pay Application Fee",
    desc: "Non-refundable application fee ($75 for domestic, $150 for international applicants).",
  },
  {
    number: "05",
    title: "Interview (Optional)",
    desc: "Selected candidates will be invited for interviews conducted online or in-person at our campus.",
  },
  {
    number: "06",
    title: "Decision",
    desc: "Receive your admission decision via email. Awarded students have 30 days to confirm enrollment.",
  },
];

const ApplicationStartPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-8 md:px-16 pt-36 pb-24">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/admissions/how-to-apply"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.18em] uppercase text-accent mb-8"
          >
            <ArrowLeft size={14} />
            Back to How to Apply
          </Link>

          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Application Portal
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-[0.95] mb-6">
              Start Your Application
            </h1>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              Follow the same six-step process from the admissions guide. Use the
              step controls below to move through each stage in order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
            <aside className="border border-border rounded-[24px] p-5 bg-secondary/10 h-fit">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-accent mb-4">
                Process Tracker
              </p>
              <div className="space-y-3">
                {applicationSteps.map((step, index) => {
                  const isComplete = index < activeStep;
                  const isActive = index === activeStep;

                  return (
                    <button
                      key={step.number}
                      onClick={() => setActiveStep(index)}
                      className={`w-full text-left rounded-[14px] border px-4 py-3 transition-colors duration-300 ${
                        isActive
                          ? "border-accent/40 bg-accent/10"
                          : "border-border hover:border-accent/25"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                            isComplete
                              ? "border-accent bg-accent text-accent-foreground"
                              : isActive
                                ? "border-accent text-accent"
                                : "border-border text-muted-foreground"
                          }`}
                        >
                          {isComplete ? <Check size={14} /> : step.number}
                        </div>
                        <p className="font-body text-xs tracking-[0.08em] uppercase text-foreground">
                          {step.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="border border-border rounded-[24px] p-8 md:p-10 bg-background">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Step {applicationSteps[activeStep].number}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-6">
                {applicationSteps[activeStep].title}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                {applicationSteps[activeStep].desc}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() =>
                    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                  disabled={activeStep === 0}
                  className="px-6 py-3 border border-border rounded-[14px] font-body text-xs tracking-[0.2em] uppercase text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setActiveStep((prev) =>
                      prev < applicationSteps.length - 1 ? prev + 1 : prev,
                    )
                  }
                  disabled={activeStep === applicationSteps.length - 1}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-[14px] font-body text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </button>

                {activeStep === applicationSteps.length - 1 && (
                  <Link
                    to="/contact"
                    className="px-6 py-3 border border-accent/40 text-accent rounded-[14px] font-body text-xs tracking-[0.2em] uppercase"
                  >
                    Confirm Enrollment
                  </Link>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationStartPage;