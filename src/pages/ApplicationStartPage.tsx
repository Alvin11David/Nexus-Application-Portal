import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import {
  submitApplicationSubmission,
  type ApplicationSubmissionInput,
} from "@/integrations/firebase/mutations";

const applicationSteps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Register on our admissions portal with your email. You'll receive a confirmation link to activate your account.",
  },
  {
    number: "02",
    title: "Complete Profile",
    desc: "Provide your personal and contact details exactly as they appear on official documents.",
  },
  {
    number: "03",
    title: "Academic Background",
    desc: "Submit your academic history, selected program, and personal statement.",
  },
  {
    number: "04",
    title: "Upload Documents",
    desc: "Confirm all required documents are ready and uploaded.",
  },
  {
    number: "05",
    title: "Pay Application Fee",
    desc: "Confirm payment details and provide your transaction reference.",
  },
  {
    number: "06",
    title: "Review & Submit",
    desc: "Review all details and submit your application for admissions processing.",
  },
] as const;

type ApplicationStartData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  guardianName: string;
  guardianPhone: string;
  program: string;
  startDate: string;
  previousInstitution: string;
  highestQualification: string;
  gpa: string;
  personalStatement: string;
  howDidYouHear: string;
  documentsConfirmed: boolean;
  transcriptUploaded: boolean;
  idUploaded: boolean;
  recommendationUploaded: boolean;
  statementUploaded: boolean;
  applicationFeePaid: boolean;
  paymentMethod: string;
  paymentReference: string;
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

const qualifications = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Other",
];

const hearAboutOptions = [
  "University Website",
  "Social Media",
  "Education Fair",
  "Recommendation",
  "Publication",
  "Other",
];

const OTP_API_BASE = "http://127.0.0.1:5055";

const ApplicationStartPage = () => {
  const [formData, setFormData] = useState<ApplicationStartData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    guardianName: "",
    guardianPhone: "",
    program: "",
    startDate: "",
    previousInstitution: "",
    highestQualification: "",
    gpa: "",
    personalStatement: "",
    howDidYouHear: "",
    documentsConfirmed: false,
    transcriptUploaded: false,
    idUploaded: false,
    recommendationUploaded: false,
    statementUploaded: false,
    applicationFeePaid: false,
    paymentMethod: "",
    paymentReference: "",
    interviewPreference: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState<string>("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const updateField = <K extends keyof ApplicationStartData>(
    key: K,
    value: ApplicationStartData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep = (step: number) => {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.email.trim()) nextErrors.email = "Email is required.";
      if (!formData.password.trim()) {
        nextErrors.password = "Password is required.";
      } else if (formData.password.trim().length < 6) {
        nextErrors.password = "Password must be at least 6 characters.";
      }
      if (!formData.confirmPassword.trim()) {
        nextErrors.confirmPassword = "Please confirm your password.";
      } else if (formData.confirmPassword !== formData.password) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }
      if (!otpVerified) {
        nextErrors.otp = "Please verify your email with the OTP code.";
      }
    }

    if (step === 1) {
      if (!formData.firstName.trim())
        nextErrors.firstName = "First name is required.";
      if (!formData.lastName.trim())
        nextErrors.lastName = "Last name is required.";
      if (!formData.phone.trim())
        nextErrors.phone = "Phone number is required.";
      if (!formData.dateOfBirth.trim())
        nextErrors.dateOfBirth = "Date of birth is required.";
      if (!formData.nationality.trim())
        nextErrors.nationality = "Nationality is required.";
      if (!formData.address.trim()) nextErrors.address = "Address is required.";
      if (!formData.city.trim()) nextErrors.city = "City is required.";
      if (!formData.country.trim()) nextErrors.country = "Country is required.";
      if (!formData.guardianName.trim())
        nextErrors.guardianName = "Guardian name is required.";
      if (!formData.guardianPhone.trim())
        nextErrors.guardianPhone = "Guardian phone is required.";
    }

    if (step === 2) {
      if (!formData.program.trim())
        nextErrors.program = "Please select a program.";
      if (!formData.startDate.trim())
        nextErrors.startDate = "Please select a start date.";
      if (!formData.previousInstitution.trim()) {
        nextErrors.previousInstitution = "Previous institution is required.";
      }
      if (!formData.highestQualification.trim()) {
        nextErrors.highestQualification = "Highest qualification is required.";
      }
      if (!formData.gpa.trim()) nextErrors.gpa = "GPA/score is required.";
      if (formData.personalStatement.trim().length < 50) {
        nextErrors.personalStatement =
          "Personal statement must be at least 50 characters.";
      }
      if (!formData.howDidYouHear.trim()) {
        nextErrors.howDidYouHear = "Please tell us how you heard about us.";
      }
    }

    if (step === 3) {
      if (!formData.documentsConfirmed) {
        nextErrors.documentsConfirmed = "Please confirm document readiness.";
      }
      if (!formData.transcriptUploaded) {
        nextErrors.transcriptUploaded = "Transcript confirmation is required.";
      }
      if (!formData.idUploaded) {
        nextErrors.idUploaded = "ID/Passport confirmation is required.";
      }
      if (!formData.recommendationUploaded) {
        nextErrors.recommendationUploaded =
          "Recommendation letter confirmation is required.";
      }
      if (!formData.statementUploaded) {
        nextErrors.statementUploaded =
          "Personal statement confirmation is required.";
      }
    }

    if (step === 4) {
      if (!formData.applicationFeePaid) {
        nextErrors.applicationFeePaid = "Please confirm fee payment.";
      }
      if (!formData.paymentMethod.trim()) {
        nextErrors.paymentMethod = "Payment method is required.";
      }
      if (!formData.paymentReference.trim()) {
        nextErrors.paymentReference = "Payment reference is required.";
      }
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

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setSubmittingApplication(true);
    setSubmissionStatus("");

    try {
      const payload: ApplicationSubmissionInput = {
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        guardianName: formData.guardianName.trim(),
        guardianPhone: formData.guardianPhone.trim(),
        program: formData.program,
        startDate: formData.startDate,
        previousInstitution: formData.previousInstitution.trim(),
        highestQualification: formData.highestQualification,
        gpa: formData.gpa.trim(),
        personalStatement: formData.personalStatement.trim(),
        howDidYouHear: formData.howDidYouHear,
        documentsConfirmed: formData.documentsConfirmed,
        transcriptUploaded: formData.transcriptUploaded,
        idUploaded: formData.idUploaded,
        recommendationUploaded: formData.recommendationUploaded,
        statementUploaded: formData.statementUploaded,
        applicationFeePaid: formData.applicationFeePaid,
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference.trim(),
        interviewPreference: formData.interviewPreference,
        termsAccepted: formData.termsAccepted,
        emailVerified: otpVerified,
      };

      const submission = await submitApplicationSubmission(payload);
      setApplicationId(submission.id);
      setSubmitted(true);
      setSubmissionStatus(
        "Your application has been saved to Firestore and submitted successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save application. Please try again.";
      setSubmissionStatus(message);
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleSendOtp = async () => {
    const email = formData.email.trim().toLowerCase();
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return;
    }

    setSendingOtp(true);
    setOtpStatus("");
    setOtpVerified(false);

    try {
      const res = await fetch(`${OTP_API_BASE}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !payload.ok) {
        setOtpStatus(payload.error ?? "Failed to send OTP.");
        return;
      }

      setOtpSent(true);
      setOtpStatus(payload.message ?? "OTP sent. Check your email.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send OTP.";
      setOtpStatus(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = formData.email.trim().toLowerCase();
    const code = otpCode.trim();

    if (!code) {
      setErrors((prev) => ({ ...prev, otp: "Enter the 5-digit OTP code." }));
      return;
    }

    setVerifyingOtp(true);
    setOtpStatus("");

    try {
      const res = await fetch(`${OTP_API_BASE}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        verified?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !payload.ok || !payload.verified) {
        setOtpVerified(false);
        setOtpStatus(payload.error ?? "Invalid OTP.");
        return;
      }

      setOtpVerified(true);
      setOtpStatus(payload.message ?? "Email verified successfully.");
      setErrors((prev) => {
        const next = { ...prev };
        delete next.otp;
        return next;
      });
    } catch (error) {
      setOtpVerified(false);
      const message =
        error instanceof Error ? error.message : "Failed to verify OTP.";
      setOtpStatus(message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const completedSteps = useMemo(
    () => applicationSteps.map((_, index) => index < furthestStep),
    [furthestStep],
  );

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
              Complete every section to submit a full application. You can only
              move to the next step once the current step is valid.
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
                          {isLocked ? (
                            <Lock size={12} className="text-muted-foreground" />
                          ) : null}
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
                    Your full application has been received. We will contact you
                    at {formData.email || "your email"} with next steps.
                  </p>
                  {applicationId ? (
                    <p className="font-body text-sm text-foreground mb-4">
                      Application Reference: {applicationId}
                    </p>
                  ) : null}
                  {submissionStatus ? (
                    <p className="font-body text-sm text-muted-foreground mb-6 max-w-2xl">
                      {submissionStatus}
                    </p>
                  ) : null}
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
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Email
                          </label>
                          <input
                            value={formData.email}
                            onChange={(e) => {
                              updateField("email", e.target.value);
                              setOtpSent(false);
                              setOtpVerified(false);
                              setOtpCode("");
                              setOtpStatus("");
                            }}
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            type="email"
                            placeholder="you@example.com"
                            disabled={otpVerified}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Password
                            </label>
                            <input
                              value={formData.password}
                              onChange={(e) =>
                                updateField("password", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="password"
                              placeholder="At least 6 characters"
                            />
                            {errors.password && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.password}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Confirm Password
                            </label>
                            <input
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                updateField("confirmPassword", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="password"
                              placeholder="Re-enter password"
                            />
                            {errors.confirmPassword && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="border border-border rounded-[14px] p-4 space-y-3 bg-secondary/10">
                          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Email Verification (OTP)
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={sendingOtp || otpVerified}
                              className="px-4 py-2 rounded-[10px] border border-accent/40 text-accent font-body text-xs tracking-[0.16em] uppercase disabled:opacity-50"
                            >
                              {sendingOtp
                                ? "Sending..."
                                : otpSent
                                  ? "Resend OTP"
                                  : "Send OTP"}
                            </button>

                            <input
                              value={otpCode}
                              onChange={(e) =>
                                setOtpCode(
                                  e.target.value.replace(/\D/g, "").slice(0, 5),
                                )
                              }
                              placeholder="Enter 5-digit OTP"
                              className="border border-border rounded-[10px] px-3 py-2 bg-transparent font-body text-sm w-[180px]"
                              disabled={!otpSent || otpVerified}
                            />

                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={!otpSent || verifyingOtp || otpVerified}
                              className="px-4 py-2 rounded-[10px] bg-accent text-accent-foreground font-body text-xs tracking-[0.16em] uppercase disabled:opacity-50"
                            >
                              {verifyingOtp
                                ? "Verifying..."
                                : otpVerified
                                  ? "Verified"
                                  : "Verify OTP"}
                            </button>
                          </div>

                          {otpStatus ? (
                            <p
                              className={`text-xs ${otpVerified ? "text-green-600" : "text-muted-foreground"}`}
                            >
                              {otpStatus}
                            </p>
                          ) : null}
                          {errors.otp ? (
                            <p className="text-xs text-destructive">
                              {errors.otp}
                            </p>
                          ) : null}
                        </div>
                      </>
                    )}

                    {activeStep === 1 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              First Name
                            </label>
                            <input
                              value={formData.firstName}
                              onChange={(e) =>
                                updateField("firstName", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.firstName && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Last Name
                            </label>
                            <input
                              value={formData.lastName}
                              onChange={(e) =>
                                updateField("lastName", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.lastName && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Phone Number
                            </label>
                            <input
                              value={formData.phone}
                              onChange={(e) =>
                                updateField("phone", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="tel"
                            />
                            {errors.phone && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.phone}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Date of Birth
                            </label>
                            <input
                              value={formData.dateOfBirth}
                              onChange={(e) =>
                                updateField("dateOfBirth", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="date"
                            />
                            {errors.dateOfBirth && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.dateOfBirth}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Nationality
                            </label>
                            <input
                              value={formData.nationality}
                              onChange={(e) =>
                                updateField("nationality", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.nationality && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.nationality}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Address
                          </label>
                          <input
                            value={formData.address}
                            onChange={(e) =>
                              updateField("address", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            type="text"
                          />
                          {errors.address && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              City
                            </label>
                            <input
                              value={formData.city}
                              onChange={(e) =>
                                updateField("city", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.city && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.city}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Postal Code
                            </label>
                            <input
                              value={formData.postalCode}
                              onChange={(e) =>
                                updateField("postalCode", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Country
                            </label>
                            <input
                              value={formData.country}
                              onChange={(e) =>
                                updateField("country", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.country && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.country}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Guardian Name
                            </label>
                            <input
                              value={formData.guardianName}
                              onChange={(e) =>
                                updateField("guardianName", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.guardianName && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.guardianName}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Guardian Phone
                            </label>
                            <input
                              value={formData.guardianPhone}
                              onChange={(e) =>
                                updateField("guardianPhone", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="tel"
                            />
                            {errors.guardianPhone && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.guardianPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {activeStep === 2 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Program
                            </label>
                            <select
                              value={formData.program}
                              onChange={(e) =>
                                updateField("program", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            >
                              <option value="">Select a program</option>
                              {programOptions.map((program) => (
                                <option key={program} value={program}>
                                  {program}
                                </option>
                              ))}
                            </select>
                            {errors.program && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.program}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Preferred Start Date
                            </label>
                            <select
                              value={formData.startDate}
                              onChange={(e) =>
                                updateField("startDate", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            >
                              <option value="">Select date</option>
                              <option value="June 2026">June 2026</option>
                              <option value="September 2026">
                                September 2026
                              </option>
                              <option value="January 2027">January 2027</option>
                            </select>
                            {errors.startDate && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.startDate}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Previous Institution
                          </label>
                          <input
                            value={formData.previousInstitution}
                            onChange={(e) =>
                              updateField("previousInstitution", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            type="text"
                          />
                          {errors.previousInstitution && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.previousInstitution}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Highest Qualification
                            </label>
                            <select
                              value={formData.highestQualification}
                              onChange={(e) =>
                                updateField(
                                  "highestQualification",
                                  e.target.value,
                                )
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            >
                              <option value="">Select qualification</option>
                              {qualifications.map((q) => (
                                <option key={q} value={q}>
                                  {q}
                                </option>
                              ))}
                            </select>
                            {errors.highestQualification && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.highestQualification}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              GPA / Score
                            </label>
                            <input
                              value={formData.gpa}
                              onChange={(e) =>
                                updateField("gpa", e.target.value)
                              }
                              className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                              type="text"
                            />
                            {errors.gpa && (
                              <p className="text-xs text-destructive mt-2">
                                {errors.gpa}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Personal Statement
                          </label>
                          <textarea
                            value={formData.personalStatement}
                            onChange={(e) =>
                              updateField("personalStatement", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm min-h-[160px]"
                            placeholder="Tell us why you want to join Veritas (minimum 50 characters)."
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            {formData.personalStatement.length} characters
                          </p>
                          {errors.personalStatement && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.personalStatement}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            How did you hear about us?
                          </label>
                          <select
                            value={formData.howDidYouHear}
                            onChange={(e) =>
                              updateField("howDidYouHear", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                          >
                            <option value="">Select one option</option>
                            {hearAboutOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {errors.howDidYouHear && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.howDidYouHear}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {activeStep === 3 && (
                      <div className="space-y-4">
                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.documentsConfirmed}
                            onChange={(e) =>
                              updateField(
                                "documentsConfirmed",
                                e.target.checked,
                              )
                            }
                            className="mt-1"
                          />
                          I confirm I have prepared all required documents.
                        </label>
                        {errors.documentsConfirmed && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.documentsConfirmed}
                          </p>
                        )}

                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.transcriptUploaded}
                            onChange={(e) =>
                              updateField(
                                "transcriptUploaded",
                                e.target.checked,
                              )
                            }
                            className="mt-1"
                          />
                          Academic transcript uploaded.
                        </label>
                        {errors.transcriptUploaded && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.transcriptUploaded}
                          </p>
                        )}

                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.idUploaded}
                            onChange={(e) =>
                              updateField("idUploaded", e.target.checked)
                            }
                            className="mt-1"
                          />
                          National ID/Passport uploaded.
                        </label>
                        {errors.idUploaded && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.idUploaded}
                          </p>
                        )}

                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.recommendationUploaded}
                            onChange={(e) =>
                              updateField(
                                "recommendationUploaded",
                                e.target.checked,
                              )
                            }
                            className="mt-1"
                          />
                          Recommendation letter uploaded.
                        </label>
                        {errors.recommendationUploaded && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.recommendationUploaded}
                          </p>
                        )}

                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.statementUploaded}
                            onChange={(e) =>
                              updateField("statementUploaded", e.target.checked)
                            }
                            className="mt-1"
                          />
                          Personal statement uploaded.
                        </label>
                        {errors.statementUploaded && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.statementUploaded}
                          </p>
                        )}
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="space-y-4">
                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.applicationFeePaid}
                            onChange={(e) =>
                              updateField(
                                "applicationFeePaid",
                                e.target.checked,
                              )
                            }
                            className="mt-1"
                          />
                          I confirm application fee payment (Domestic: $75,
                          International: $150).
                        </label>
                        {errors.applicationFeePaid && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.applicationFeePaid}
                          </p>
                        )}

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Payment Method
                          </label>
                          <select
                            value={formData.paymentMethod}
                            onChange={(e) =>
                              updateField("paymentMethod", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                          >
                            <option value="">Select method</option>
                            <option value="Mobile Money">Mobile Money</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Card Payment">Card Payment</option>
                          </select>
                          {errors.paymentMethod && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.paymentMethod}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Payment Reference
                          </label>
                          <input
                            value={formData.paymentReference}
                            onChange={(e) =>
                              updateField("paymentReference", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                            type="text"
                            placeholder="Transaction ID / receipt number"
                          />
                          {errors.paymentReference && (
                            <p className="text-xs text-destructive mt-2">
                              {errors.paymentReference}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Interview Preference (Optional)
                          </label>
                          <select
                            value={formData.interviewPreference}
                            onChange={(e) =>
                              updateField("interviewPreference", e.target.value)
                            }
                            className="mt-2 w-full border border-border rounded-[12px] px-4 py-3 bg-transparent font-body text-sm"
                          >
                            <option value="">No preference</option>
                            <option value="Online">Online</option>
                            <option value="In-person">In-person</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeStep === 5 && (
                      <div className="space-y-4">
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                          Review completed details and submit your application.
                          Admission decisions are sent via email.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-body text-foreground">
                          <p>
                            <span className="text-muted-foreground">
                              Applicant:
                            </span>{" "}
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Email:
                            </span>{" "}
                            {formData.email}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Program:
                            </span>{" "}
                            {formData.program}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Start Date:
                            </span>{" "}
                            {formData.startDate}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Payment Method:
                            </span>{" "}
                            {formData.paymentMethod || "Not selected"}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Reference:
                            </span>{" "}
                            {formData.paymentReference || "Not provided"}
                          </p>
                        </div>
                        <label className="inline-flex items-start gap-3 font-body text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={formData.termsAccepted}
                            onChange={(e) =>
                              updateField("termsAccepted", e.target.checked)
                            }
                            className="mt-1"
                          />
                          I confirm the information provided is accurate and I
                          accept the application terms.
                        </label>
                        {errors.termsAccepted && (
                          <p className="text-xs text-destructive">
                            {errors.termsAccepted}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

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
                        disabled={submittingApplication}
                        className="px-6 py-3 bg-accent text-accent-foreground rounded-[14px] font-body text-xs tracking-[0.2em] uppercase"
                      >
                        {submittingApplication
                          ? "Submitting..."
                          : "Submit Application"}
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
