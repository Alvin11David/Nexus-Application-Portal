import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";

type ContactSubmissionInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type ApplicationSubmissionInput = {
  email: string;
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
  nextOfKinRelationship: string;
  isUgandan: "yes" | "no";
  program: string;
  startDate: string;
  previousInstitution: string;
  highestQualification: string;
  academicCredentialLevel: string;
  academicCredentialsDetails: string;
  gpa: string;
  personalStatement: string;
  howDidYouHear: string;
  documentsConfirmed: boolean;
  transcriptUploaded: boolean;
  idUploaded: boolean;
  countryIdUploaded: boolean;
  recommendationUploaded: boolean;
  statementUploaded: boolean;
  applicationFeePaid: boolean;
  paymentMethod: string;
  paymentReference: string;
  interviewPreference: string;
  termsAccepted: boolean;
  emailVerified: boolean;
};

export const submitContactSubmission = async (
  payload: ContactSubmissionInput,
) => {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return addDoc(collection(db, "contact_submissions"), {
    name: payload.name,
    email: payload.email,
    subject: payload.subject || "General Inquiry",
    message: payload.message,
    submitted_at: serverTimestamp(),
    read: false,
    responded: false,
  });
};

export const submitApplicationSubmission = async (
  payload: ApplicationSubmissionInput,
) => {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return addDoc(collection(db, "Applications"), {
    email: payload.email,
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone: payload.phone,
    date_of_birth: payload.dateOfBirth,
    nationality: payload.nationality,
    address: payload.address,
    city: payload.city,
    postal_code: payload.postalCode,
    country: payload.country,
    guardian_name: payload.guardianName,
    guardian_phone: payload.guardianPhone,
    next_of_kin_relationship: payload.nextOfKinRelationship,
    is_ugandan: payload.isUgandan === "yes",
    program: payload.program,
    start_date: payload.startDate,
    previous_institution: payload.previousInstitution,
    highest_qualification: payload.highestQualification,
    academic_credential_level: payload.academicCredentialLevel,
    academic_credentials_details: payload.academicCredentialsDetails,
    gpa: payload.gpa,
    personal_statement: payload.personalStatement,
    how_did_you_hear: payload.howDidYouHear,
    documents_confirmed: payload.documentsConfirmed,
    transcript_uploaded: payload.transcriptUploaded,
    id_uploaded: payload.idUploaded,
    country_id_uploaded: payload.countryIdUploaded,
    recommendation_uploaded: payload.recommendationUploaded,
    statement_uploaded: payload.statementUploaded,
    application_fee_paid: payload.applicationFeePaid,
    payment_method: payload.paymentMethod,
    payment_reference: payload.paymentReference,
    interview_preference: payload.interviewPreference,
    terms_accepted: payload.termsAccepted,
    email_verified: payload.emailVerified,
    status: "submitted",
    review_status: "pending",
    submitted_at: serverTimestamp(),
  });
};
