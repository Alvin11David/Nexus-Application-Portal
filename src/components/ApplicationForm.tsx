import { useState } from "react";
import { z } from "zod";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Invalid phone number").max(20),
  dateOfBirth: z.string().min(1, "Required"),
  nationality: z.string().trim().min(1, "Required").max(100),
  address: z.string().trim().min(1, "Required").max(500),
  city: z.string().trim().min(1, "Required").max(100),
  postalCode: z.string().trim().min(1, "Required").max(20),
  country: z.string().trim().min(1, "Required").max(100),
  program: z.string().min(1, "Please select a program"),
  startDate: z.string().min(1, "Required"),
  previousInstitution: z.string().trim().min(1, "Required").max(200),
  highestQualification: z.string().min(1, "Required"),
  gpa: z.string().trim().min(1, "Required").max(10),
  personalStatement: z.string().trim().min(50, "Minimum 50 characters").max(5000),
  howDidYouHear: z.string().min(1, "Required"),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
});

type ApplicationData = z.infer<typeof applicationSchema>;

const programs = [
  "Philosophy & Ethics",
  "Theoretical Physics",
  "Comparative Literature",
  "Biomedical Engineering",
  "Mathematical Sciences",
  "Architecture & Urban Design",
];

const qualifications = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Other",
];

const hearAbout = [
  "University Website",
  "Social Media",
  "Education Fair",
  "Recommendation",
  "Publication",
  "Other",
];

interface ApplicationFormProps {
  onClose: () => void;
}

const ApplicationForm = ({ onClose }: ApplicationFormProps) => {
  const [formData, setFormData] = useState<Partial<ApplicationData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const steps = [
    { title: "Personal Information", fields: ["firstName", "lastName", "email", "phone", "dateOfBirth", "nationality"] },
    { title: "Address", fields: ["address", "city", "postalCode", "country"] },
    { title: "Academic Background", fields: ["program", "startDate", "previousInstitution", "highestQualification", "gpa"] },
    { title: "Personal Statement", fields: ["personalStatement", "howDidYouHear", "agreeTerms"] },
  ];

  const validateStep = () => {
    const currentFields = steps[step].fields;
    const stepErrors: Record<string, string> = {};

    const result = applicationSchema.safeParse({
      ...Object.fromEntries(currentFields.map(f => [f, (formData as Record<string, unknown>)[f] ?? ""])),
      // Fill other fields with valid defaults to isolate validation
      ...Object.fromEntries(
        Object.keys(applicationSchema.shape)
          .filter(k => !currentFields.includes(k))
          .map(k => [k, k === "agreeTerms" ? true : k === "personalStatement" ? "x".repeat(50) : k === "email" ? "a@b.c" : k === "phone" ? "1234567" : k === "dateOfBirth" ? "2000-01-01" : "placeholder"])
      ),
    });

    if (!result.success) {
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        if (currentFields.includes(field)) {
          stepErrors[field] = err.message;
        }
      });
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitted(true);
      }
    }
  };

  const inputClasses = "w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-700";
  const selectClasses = "w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-700 appearance-none cursor-pointer";
  const labelClasses = "font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block";
  const errorClasses = "font-body text-xs text-destructive mt-1";

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 py-32">
        <div className="w-16 h-px bg-accent mb-12" />
        <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground text-center mb-8">
          Application Received
        </h2>
        <p className="body-text text-muted-foreground text-center max-w-md mb-12">
          Thank you, {formData.firstName}. Your application to the {formData.program} program
          has been submitted. We will be in touch within 10 business days.
        </p>
        <button
          onClick={onClose}
          className="px-12 py-4 border border-foreground font-body text-sm tracking-[0.3em] uppercase text-foreground transition-colors duration-700 hover:bg-accent hover:border-accent hover:text-accent-foreground"
        >
          Return to Site
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 md:px-16 py-16 md:py-24 max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-4 mb-16">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center gap-4">
            <button
              onClick={() => i < step && setStep(i)}
              className={`font-body text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
                i === step ? "text-foreground" : i < step ? "text-accent cursor-pointer" : "text-muted-foreground"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground mb-4">
        {steps[step].title}
      </h2>
      <p className="body-text text-muted-foreground mb-16">
        Step {step + 1} of {steps.length}
      </p>

      {/* Step 0: Personal */}
      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <label className={labelClasses}>First Name</label>
            <input className={inputClasses} value={formData.firstName ?? ""} onChange={e => updateField("firstName", e.target.value)} placeholder="Enter your first name" />
            {errors.firstName && <p className={errorClasses}>{errors.firstName}</p>}
          </div>
          <div>
            <label className={labelClasses}>Last Name</label>
            <input className={inputClasses} value={formData.lastName ?? ""} onChange={e => updateField("lastName", e.target.value)} placeholder="Enter your last name" />
            {errors.lastName && <p className={errorClasses}>{errors.lastName}</p>}
          </div>
          <div>
            <label className={labelClasses}>Email Address</label>
            <input className={inputClasses} type="email" value={formData.email ?? ""} onChange={e => updateField("email", e.target.value)} placeholder="your@email.com" />
            {errors.email && <p className={errorClasses}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input className={inputClasses} type="tel" value={formData.phone ?? ""} onChange={e => updateField("phone", e.target.value)} placeholder="+1 234 567 890" />
            {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClasses}>Date of Birth</label>
            <input className={inputClasses} type="date" value={formData.dateOfBirth ?? ""} onChange={e => updateField("dateOfBirth", e.target.value)} />
            {errors.dateOfBirth && <p className={errorClasses}>{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className={labelClasses}>Nationality</label>
            <input className={inputClasses} value={formData.nationality ?? ""} onChange={e => updateField("nationality", e.target.value)} placeholder="Enter your nationality" />
            {errors.nationality && <p className={errorClasses}>{errors.nationality}</p>}
          </div>
        </div>
      )}

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="md:col-span-2">
            <label className={labelClasses}>Street Address</label>
            <input className={inputClasses} value={formData.address ?? ""} onChange={e => updateField("address", e.target.value)} placeholder="Enter your street address" />
            {errors.address && <p className={errorClasses}>{errors.address}</p>}
          </div>
          <div>
            <label className={labelClasses}>City</label>
            <input className={inputClasses} value={formData.city ?? ""} onChange={e => updateField("city", e.target.value)} placeholder="Enter your city" />
            {errors.city && <p className={errorClasses}>{errors.city}</p>}
          </div>
          <div>
            <label className={labelClasses}>Postal Code</label>
            <input className={inputClasses} value={formData.postalCode ?? ""} onChange={e => updateField("postalCode", e.target.value)} placeholder="Enter postal code" />
            {errors.postalCode && <p className={errorClasses}>{errors.postalCode}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Country</label>
            <input className={inputClasses} value={formData.country ?? ""} onChange={e => updateField("country", e.target.value)} placeholder="Enter your country" />
            {errors.country && <p className={errorClasses}>{errors.country}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Academic */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="md:col-span-2">
            <label className={labelClasses}>Program of Interest</label>
            <select className={selectClasses} value={formData.program ?? ""} onChange={e => updateField("program", e.target.value)}>
              <option value="">Select a program</option>
              {programs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.program && <p className={errorClasses}>{errors.program}</p>}
          </div>
          <div>
            <label className={labelClasses}>Preferred Start Date</label>
            <select className={selectClasses} value={formData.startDate ?? ""} onChange={e => updateField("startDate", e.target.value)}>
              <option value="">Select intake</option>
              <option value="fall-2026">Fall 2026</option>
              <option value="spring-2027">Spring 2027</option>
              <option value="fall-2027">Fall 2027</option>
            </select>
            {errors.startDate && <p className={errorClasses}>{errors.startDate}</p>}
          </div>
          <div>
            <label className={labelClasses}>GPA / Score</label>
            <input className={inputClasses} value={formData.gpa ?? ""} onChange={e => updateField("gpa", e.target.value)} placeholder="e.g. 3.8 / 4.0" />
            {errors.gpa && <p className={errorClasses}>{errors.gpa}</p>}
          </div>
          <div>
            <label className={labelClasses}>Previous Institution</label>
            <input className={inputClasses} value={formData.previousInstitution ?? ""} onChange={e => updateField("previousInstitution", e.target.value)} placeholder="Name of school or college" />
            {errors.previousInstitution && <p className={errorClasses}>{errors.previousInstitution}</p>}
          </div>
          <div>
            <label className={labelClasses}>Highest Qualification</label>
            <select className={selectClasses} value={formData.highestQualification ?? ""} onChange={e => updateField("highestQualification", e.target.value)}>
              <option value="">Select qualification</option>
              {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            {errors.highestQualification && <p className={errorClasses}>{errors.highestQualification}</p>}
          </div>
        </div>
      )}

      {/* Step 3: Statement */}
      {step === 3 && (
        <div className="space-y-8">
          <div>
            <label className={labelClasses}>Personal Statement</label>
            <p className="font-body text-xs text-muted-foreground mb-4">
              In no more than 5,000 characters, tell us why you wish to study at Veritas
              and what question drives your intellectual curiosity.
            </p>
            <textarea
              className={`${inputClasses} min-h-[200px] resize-y border rounded-sm p-4`}
              value={formData.personalStatement ?? ""}
              onChange={e => updateField("personalStatement", e.target.value)}
              placeholder="Begin writing here..."
            />
            <p className="font-body text-xs text-muted-foreground mt-2">
              {(formData.personalStatement ?? "").length} / 5,000 characters
            </p>
            {errors.personalStatement && <p className={errorClasses}>{errors.personalStatement}</p>}
          </div>
          <div>
            <label className={labelClasses}>How did you hear about us?</label>
            <select className={selectClasses} value={formData.howDidYouHear ?? ""} onChange={e => updateField("howDidYouHear", e.target.value)}>
              <option value="">Select an option</option>
              {hearAbout.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            {errors.howDidYouHear && <p className={errorClasses}>{errors.howDidYouHear}</p>}
          </div>
          <div className="flex items-start gap-3 pt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={!!formData.agreeTerms}
              onChange={e => updateField("agreeTerms", e.target.checked)}
              className="mt-1 accent-accent"
            />
            <label htmlFor="agreeTerms" className="font-body text-sm text-foreground leading-relaxed">
              I confirm that all information provided is accurate and I agree to the terms
              and conditions of the Veritas Institute application process.
            </label>
          </div>
          {errors.agreeTerms && <p className={errorClasses}>{errors.agreeTerms}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : onClose()}
          className="font-body text-sm tracking-[0.2em] uppercase text-muted-foreground transition-colors duration-500 hover:text-foreground"
        >
          {step > 0 ? "Previous" : "Cancel"}
        </button>
        <button
          onClick={handleNext}
          className="px-10 py-3 bg-foreground font-body text-sm tracking-[0.3em] uppercase text-background transition-colors duration-700 hover:bg-accent"
        >
          {step < steps.length - 1 ? "Continue" : "Submit Application"}
        </button>
      </div>
    </div>
  );
};

export default ApplicationForm;
