import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { studyLinks } from "@/lib/studyLinks";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Wallet,
} from "lucide-react";

const admissionStats = [
  { label: "Programs", value: "143+" },
  { label: "Annual Intakes", value: "3" },
  { label: "Scholarship Tracks", value: "18" },
  { label: "Application Support", value: "24/7" },
];

const pathways = [
  {
    title: "Undergraduate Entry",
    detail:
      "Direct entry through national qualifications, diploma progression, or equivalent international certification.",
  },
  {
    title: "Postgraduate Entry",
    detail:
      "Coursework and research programs with faculty review, proposal assessment, and supervisor matching.",
  },
  {
    title: "Mature Age Entry",
    detail:
      "Alternative pathway with aptitude evaluation, interview panel, and prior-learning consideration.",
  },
  {
    title: "International Entry",
    detail:
      "Credential equivalency support, visa guidance, and orientation for global applicants.",
  },
];

const applicationJourney = [
  "Choose a program and confirm eligibility.",
  "Create your applicant profile and verify email.",
  "Complete the online form and upload documents.",
  "Pay the application fee and submit.",
  "Track review status and interview invites.",
  "Receive admission decision and complete enrollment.",
];

const entryRequirements = [
  {
    title: "Undergraduate",
    items: [
      "Certified secondary education results or equivalent.",
      "Program-specific subject requirements.",
      "Valid ID or passport copy.",
    ],
  },
  {
    title: "Postgraduate",
    items: [
      "Recognized bachelor's degree transcript.",
      "Curriculum vitae and statement of purpose.",
      "Two academic or professional referees.",
    ],
  },
  {
    title: "International",
    items: [
      "Equivalent qualification assessment.",
      "Proof of language proficiency where required.",
      "Passport biodata page and permit documentation.",
    ],
  },
];

const importantDates = [
  { phase: "Application Portal Opens", date: "02 April 2026" },
  { phase: "Priority Scholarship Deadline", date: "30 May 2026" },
  { phase: "General Application Deadline", date: "21 June 2026" },
  { phase: "Admission Decision Release", date: "18 July 2026" },
  { phase: "Registration & Orientation", date: "11-22 August 2026" },
];

const requiredDocuments = [
  "Academic transcripts and result slips",
  "National ID or passport",
  "Recent passport-size photo",
  "Program-specific portfolio or proposal (where applicable)",
  "Proof of application fee payment",
  "Recommendation letters for postgraduate study",
];

const financeOptions = [
  "Flexible installment schedules for tuition payments",
  "Merit and need-based scholarships",
  "Student loan guidance and documentation support",
  "Employer sponsorship coordination for professional programs",
];

const admissionFaqs = [
  {
    question: "Can I apply to multiple programs in one intake?",
    answer:
      "Yes. You can submit up to three program choices and rank them by preference in your application profile.",
  },
  {
    question: "How long does application review take?",
    answer:
      "Most applications are reviewed within 10 to 15 working days after complete documentation and payment confirmation.",
  },
  {
    question: "Can I edit my form after submission?",
    answer:
      "Minor edits can be requested through the admissions helpdesk before the deadline. Major changes require a fresh submission.",
  },
  {
    question: "Do you accept transfer students?",
    answer:
      "Yes. Credit transfer is available subject to departmental review and equivalency approval.",
  },
];

const StudyItemPage = () => {
  const { slug } = useParams();
  const item = studyLinks.find((entry) => entry.slug === slug);
  const isJoinAdmissions = item?.slug === "join-admissions";

  if (!item) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 md:pt-36 px-8 md:px-16 pb-20">
        <section className="max-w-6xl mx-auto">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-accent transition-colors duration-300 mb-6"
          >
            Back to Study at Veritas
          </Link>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-foreground leading-[0.95] mb-5 max-w-5xl">
            {item.title}
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-4xl leading-relaxed">
            {item.summary}
          </p>
        </section>

        {isJoinAdmissions ? (
          <>
            <section className="max-w-6xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {admissionStats.map((stat) => (
                <article
                  key={stat.label}
                  className="border border-border/60 rounded-[20px] p-5 bg-gradient-to-br from-background to-secondary/20"
                >
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="font-heading text-3xl md:text-4xl font-light text-foreground">
                    {stat.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="max-w-6xl mx-auto mt-10 border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap size={18} className="text-accent" />
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">
                  Admission Pathways
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathways.map((pathway) => (
                  <article
                    key={pathway.title}
                    className="border border-border/50 rounded-[20px] p-5 bg-background transition-all duration-300 hover:border-accent/40 hover:bg-accent/5"
                  >
                    <h2 className="font-heading text-2xl font-light text-foreground mb-2">
                      {pathway.title}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {pathway.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
              <article className="lg:col-span-3 border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-4">
                  Step-by-Step
                </p>
                <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-[0.95] mb-6">
                  Application Journey
                </h2>
                <div className="space-y-4">
                  {applicationJourney.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-4 border border-border/50 rounded-[18px] p-4"
                    >
                      <span className="w-8 h-8 rounded-full border border-accent/50 bg-accent/10 text-accent flex items-center justify-center font-body text-xs shrink-0">
                        {index + 1}
                      </span>
                      <p className="font-body text-sm md:text-base text-foreground leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="lg:col-span-2 border border-border/60 rounded-[24px] p-6 md:p-8 bg-gradient-to-br from-background to-secondary/25">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-4">
                  Important Dates
                </p>
                <div className="space-y-4">
                  {importantDates.map((dateItem) => (
                    <div
                      key={dateItem.phase}
                      className="border border-border/50 rounded-[16px] p-4"
                    >
                      <p className="font-body text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1">
                        {dateItem.phase}
                      </p>
                      <p className="font-heading text-xl font-light text-foreground">
                        {dateItem.date}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <article className="border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck2 size={18} className="text-accent" />
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">
                    Required Documents
                  </p>
                </div>
                <ul className="space-y-3">
                  {requiredDocuments.map((doc) => (
                    <li key={doc} className="flex items-start gap-3">
                      <BadgeCheck size={16} className="text-accent mt-0.5 shrink-0" />
                      <span className="font-body text-sm text-foreground leading-relaxed">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={18} className="text-accent" />
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">
                    Fees & Funding
                  </p>
                </div>
                <ul className="space-y-3">
                  {financeOptions.map((itemText) => (
                    <li key={itemText} className="flex items-start gap-3">
                      <ArrowRight size={14} className="text-accent mt-1 shrink-0" />
                      <span className="font-body text-sm text-foreground leading-relaxed">
                        {itemText}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="max-w-6xl mx-auto mt-10 border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
              <div className="flex items-center gap-2 mb-5">
                <FileText size={18} className="text-accent" />
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">
                  Entry Requirements by Level
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entryRequirements.map((group) => (
                  <article
                    key={group.title}
                    className="border border-border/50 rounded-[20px] p-5"
                  >
                    <h3 className="font-heading text-2xl font-light text-foreground mb-3">
                      {group.title}
                    </h3>
                    <ul className="space-y-2">
                      {group.items.map((requirement) => (
                        <li
                          key={requirement}
                          className="font-body text-sm text-muted-foreground leading-relaxed"
                        >
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <article className="border border-border/60 rounded-[24px] p-6 md:p-8 bg-background">
                <div className="flex items-center gap-2 mb-5">
                  <HelpCircle size={18} className="text-accent" />
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">
                    Frequently Asked Questions
                  </p>
                </div>
                <div className="space-y-4">
                  {admissionFaqs.map((faq) => (
                    <article
                      key={faq.question}
                      className="border border-border/50 rounded-[16px] p-4"
                    >
                      <h3 className="font-body text-sm uppercase tracking-[0.08em] text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="border border-border/60 rounded-[24px] p-6 md:p-8 bg-gradient-to-br from-background to-secondary/25">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-4">
                  Need Help?
                </p>
                <h2 className="font-heading text-4xl font-light text-foreground leading-[0.95] mb-5">
                  Admissions Support Desk
                </h2>
                <div className="space-y-3 mb-6">
                  <p className="font-body text-sm text-foreground inline-flex items-center gap-2">
                    <Mail size={14} className="text-accent" /> admissions@institute.ac.ug
                  </p>
                  <p className="font-body text-sm text-foreground inline-flex items-center gap-2">
                    <Phone size={14} className="text-accent" /> +256 700 123 456
                  </p>
                  <p className="font-body text-sm text-foreground inline-flex items-center gap-2">
                    <MapPin size={14} className="text-accent" /> Registrar Block, Main Campus
                  </p>
                  <p className="font-body text-sm text-foreground inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-accent" /> Monday-Friday, 8:00 AM - 5:00 PM
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-[16px] font-body text-xs tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors duration-300">
                    Start Application <ArrowRight size={14} />
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-accent/40 text-accent rounded-[16px] font-body text-xs tracking-[0.15em] uppercase hover:bg-accent/10 transition-colors duration-300">
                    Download Guide <FileText size={14} />
                  </button>
                </div>
              </article>
            </section>
          </>
        ) : (
          <section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StudyItemPage;
