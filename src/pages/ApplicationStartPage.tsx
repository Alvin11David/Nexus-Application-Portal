import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";

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

type ApplicationStartData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  program: string;
  startDate: string;
  documentsConfirmed: boolean;
  applicationFeePaid: boolean;
  interviewPreference: string;
  termsAccepted: boolean;
};

const programOptions = [
  "Bachelor Of Scinece In Computer Science",
  "Electrical Installation",
  "Welding & Fabrication",
  "Beauty Therapy",
  "Auto Mechanics",
  "Soap & Cosmetics Making",
];

const ApplicationStartPage = () => {
  const [formData, setFormData] = useState<ApplicationStartData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    program: "",
    startDate: "",
    documentsConfirmed: false,
    applicationFeePaid: false,
    interviewPreference: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const validateStep = (step: number) => {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.email.trim()) nextErrors.email = "Email is required.";
      if (!formData.password.trim()) {
        nextErrors.password = "Password is required.";
      } else if (formData.password.trim().length < 6) {
        nextErrors.password = "Password must be at least 6 characters.";
      }
    }

    if (step === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
      if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
      if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
      if (!formData.program.trim()) nextErrors.program = "Please select a program.";
      if (!formData.startDate.trim()) nextErrors.startDate = "Please select a start date.";
    }

    if (step === 2 && !formData.documentsConfirmed) {
      nextErrors.documentsConfirmed = "Please confirm document upload readiness.";
    }

    if (step === 3 && !formData.applicationFeePaid) {
      nextErrors.applicationFeePaid = "Please confirm application fee payment.";
    }

    if (step === 5 && !formData.termsAccepted) {
      nextErrors.termsAccepted = "You must accept terms before submitting.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    const nextStep = Math.min(activeStep + 1, applicationSteps.length - 1);
    setFurthestStep((prev) => Math.max(prev, nextStep));
    setActiveStep(nextStep);
  };

  const handleSubmit = () => {
    if (!validateStep(5)) return;
    setSubmitted(true);
  };

  const completedSteps = useMemo(
    () => applicationSteps.map((_, index) => index < furthestStep),
    [furthestStep],
  );

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
              Follow the same six-step process from the admissions guide. Use
              the step controls below to move through each stage in order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
            <aside className="border border-border rounded-[24px] p-5 bg-secondary/10 h-fit">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-accent mb-4">
                Process Tracker
              </p>
              <div className="space-y-3">
                {applicationSteps.map((step, index) => {
                  const isComplete = completedSteps[index];
                  const isActive = index === activeStep;
                  const isLocked = index > furthestStep;

                  return (
                    <button
                      key={step.number}
                      onClick={() => !isLocked && setActiveStep(index)}
                      disabled={isLocked}
                      className={`w-full text-left rounded-[14px] border px-4 py-3 transition-colors duration-300 ${
                        isActive
                          ? "border-accent/40 bg-accent/10"
                          : isLocked
                            ? "border-border/60 opacity-55 cursor-not-allowed"
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
                        <p className="font-body text-xs tracking-[0.08em] uppercase text-foreground flex items-center gap-2">
                          {step.title}
                          {isLocked ? <Lock size={12} className="text-muted-foreground" /> : null}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="border border-border rounded-[24px] p-8 md:p-10 bg-background">
              {submitted ? (
                <div>
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                    Application Submitted
                  </p>
                  <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-6">
                    Thank You, {formData.firstName || "Applicant"}
                  </h2>
                  <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                    Your application has been recorded and follows the full six-step admissions process.
                    We will contact you using {formData.email || "your email"} with next actions.
                  </p>
                  <Link
                    to="/admissions/how-to-apply"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-accent/40 text-accent rounded-[14px] font-body text-xs tracking-[0.2em] uppercase"
                  >
                    Back to Guide
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Step {applicationSteps[activeStep].number}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-6">
                {applicationSteps[activeStep].title}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                {applicationSteps[activeStep].desc}
              </p>

              <div className="space-y-6 mb-10">
                {activeStep === 0 && (
                  <>
                    <div>
                      <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                        type="email"
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-xs text-destructive mt-2">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                      <input
                        value={formData.password}
                        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                        className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                        type="password"
                        placeholder="At least 6 characters"
                      />
                      {errors.password && <p className="text-xs text-destructive mt-2">{errors.password}</p>}
                    </div>
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">First Name</label>
                        <input
                          value={formData.firstName}
                          onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                          className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                          type="text"
                        />
                        {errors.firstName && <p className="text-xs text-destructive mt-2">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Last Name</label>
                        <input
                          value={formData.lastName}
                          onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                          className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                          type="text"
                        />
                        {errors.lastName && <p className="text-xs text-destructive mt-2">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone Number</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                        type="tel"
                      />
                      {errors.phone && <p className="text-xs text-destructive mt-2">{errors.phone}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Program</label>
                        <select
                          value={formData.program}
                          onChange={(e) => setFormData((p) => ({ ...p, program: e.target.value }))}
                          className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                        >
                          <option value="">Select a program</option>
                          {programOptions.map((program) => (
                            <option key={program} value={program}>{program}</option>
                          ))}
                        </select>
                        {errors.program && <p className="text-xs text-destructive mt-2">{errors.program}</p>}
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Preferred Start Date</label>
                        <select
                          value={formData.startDate}
                          onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                          className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                        >
                          <option value="">Select date</option>
                          <option value="June 2026">June 2026</option>
                          <option value="September 2026">September 2026</option>
                          <option value="January 2027">January 2027</option>
                        </select>
                        {errors.startDate && <p className="text-xs text-destructive mt-2">{errors.startDate}</p>}
                      </div>
                    </div>
                  </>
                )}

                {activeStep === 2 && (
                  <div>
                    <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.documentsConfirmed}
                        onChange={(e) => setFormData((p) => ({ ...p, documentsConfirmed: e.target.checked }))}
                        className="mt-1"
                      />
                      I have prepared and uploaded all required documents (transcripts, scores, essay, recommendations).
                    </label>
                    {errors.documentsConfirmed && (
                      <p className="text-xs text-destructive mt-2">{errors.documentsConfirmed}</p>
                    )}
                  </div>
                )}

                {activeStep === 3 && (
                  <div>
                    <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.applicationFeePaid}
                        onChange={(e) => setFormData((p) => ({ ...p, applicationFeePaid: e.target.checked }))}
                        className="mt-1"
                      />
                      I confirm application fee payment (Domestic: $75, International: $150).
                    </label>
                    {errors.applicationFeePaid && (
                      <p className="text-xs text-destructive mt-2">{errors.applicationFeePaid}</p>
                    )}
                  </div>
                )}

                {activeStep === 4 && (
                  <div>
                    <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Interview Preference (Optional)</label>
                    <select
                      value={formData.interviewPreference}
                      onChange={(e) => setFormData((p) => ({ ...p, interviewPreference: e.target.value }))}
                      className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                    >
                      <option value="">No preference</option>
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-4">
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      Review completed details and submit your application. Admission decisions are sent via email.
                    </p>
                    <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData((p) => ({ ...p, termsAccepted: e.target.checked }))}
                        className="mt-1"
                      />
                      I confirm the information provided is accurate and I accept the application terms.
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-xs text-destructive">{errors.termsAccepted}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))}
                  disabled={activeStep === 0}
                  className="px-6 py-3 border border-border rounded-[14px] font-body text-xs tracking-[0.2em] uppercase text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {activeStep < applicationSteps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-[14px] font-body text-xs tracking-[0.2em] uppercase"
                  >
                    Next Step
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                    />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-[14px] font-body text-xs tracking-[0.2em] uppercase"
                  >
                    Submit Application
                  </button>
                )}
              </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationStartPage;
