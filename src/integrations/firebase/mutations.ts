import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";

export type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type PartnershipPayload = {
  name: string;
  email: string;
  organization?: string;
  partnershipGoal: string;
  message: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

type SubjectGradeEntry = {
  subject: string;
  grade: string;
};

export type ApplicationSubmissionInput = {
  email: string;
  otherNames: string;
  gender: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  address: string;
  postalAddress: string;
  city: string;
  postalCode: string;
  country: string;
  districtOfOrigin: string;
  hasNationalIdOrPassport: "yes" | "no";
  birthCertificateOrNationalIdDetails: string;
  passportPhotoUploaded: boolean;
  passportPhotoUrl: string;
  guardianName: string;
  guardianType: string;
  guardianPhone: string;
  nextOfKinRelationship: string;
  isUgandan: "yes" | "no";
  applicationType: string;
  entryScheme: string;
  program: string;
  startDate: string;
  previousInstitution: string;
  highestQualification: string;
  academicCredentialLevel: string;
  academicCredentialsDetails: string;
  birthCertificateUrl: string;
  uceIndexNumber: string;
  uceYearOfSitting: string;
  uceSecondSitting: boolean;
  uceSecondIndexNumber: string;
  uceSecondYearOfSitting: string;
  uceTotalAggregates: string;
  uceDivision: "" | "1" | "2" | "3" | "4" | "U";
  oLevelSchoolName: string;
  uaceIndexNumber: string;
  uaceYearOfSitting: string;
  uaceSecondSitting: boolean;
  uaceSecondIndexNumber: string;
  uaceSecondYearOfSitting: string;
  uaceTotalPoints: string;
  uacePrincipalSubjects: SubjectGradeEntry[];
  uaceGeneralPaperGrade: string;
  uaceIctOrSubMathSubject: string;
  uaceIctOrSubMathGrade: string;
  oLevelResultSlipUrl: string;
  aLevelResultSlipUrl: string;
  academicTranscriptUrl: string;
  nationalIdOrPassportUrl: string;
  countryIdDocumentUrl: string;
  refereeLetterUrl: string;
  personalStatementAttachmentUrl: string;
  oLevelSubjects: SubjectGradeEntry[];
  certificateSubjects: SubjectGradeEntry[];
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

export const submitContactSubmission = async (payload: ContactPayload) => {
  const contactEndpoint = API_BASE_URL.endsWith("/")
    ? `${API_BASE_URL}contact/`
    : `${API_BASE_URL}/contact/`;

  let response: Response;
  try {
    response = await fetch(contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        subject: payload.subject ?? "",
        message: payload.message,
      }),
    });
  } catch {
    throw new Error(
      "Could not reach the contact API. Confirm Django is running and restart Vite after env changes.",
    );
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const parsed =
      data && typeof data === "object"
        ? (data as { detail?: string; message?: string })
        : {};
    throw new Error(
      parsed.detail ?? parsed.message ?? "Could not submit contact message.",
    );
  }

  return data;
};

export const submitApplicationSubmission = async (
  payload: ApplicationSubmissionInput,
) => {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return addDoc(collection(db, "Applications"), {
    email: payload.email,
    other_names: payload.otherNames,
    gender: payload.gender,
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone: payload.phone,
    date_of_birth: payload.dateOfBirth,
    marital_status: payload.maritalStatus,
    nationality: payload.nationality,
    address: payload.address,
    postal_address: payload.postalAddress,
    city: payload.city,
    postal_code: payload.postalCode,
    country: payload.country,
    district_of_origin: payload.districtOfOrigin,
    has_national_id_or_passport: payload.hasNationalIdOrPassport === "yes",
    birth_certificate_or_national_id_details:
      payload.birthCertificateOrNationalIdDetails,
    passport_photo_uploaded: payload.passportPhotoUploaded,
    passport_photo_url: payload.passportPhotoUrl,
    guardian_name: payload.guardianName,
    guardian_type: payload.guardianType,
    guardian_phone: payload.guardianPhone,
    next_of_kin_relationship: payload.nextOfKinRelationship,
    is_ugandan: payload.isUgandan === "yes",
    application_type: payload.applicationType,
    entry_scheme: payload.entryScheme,
    program: payload.program,
    start_date: payload.startDate,
    previous_institution: payload.previousInstitution,
    highest_qualification: payload.highestQualification,
    academic_credential_level: payload.academicCredentialLevel,
    academic_credentials_details: payload.academicCredentialsDetails,
    birth_certificate_url: payload.birthCertificateUrl,
    uce_index_number: payload.uceIndexNumber,
    uce_year_of_sitting: payload.uceYearOfSitting,
    uce_second_sitting: payload.uceSecondSitting,
    uce_second_index_number: payload.uceSecondIndexNumber,
    uce_second_year_of_sitting: payload.uceSecondYearOfSitting,
    uce_total_aggregates: payload.uceTotalAggregates,
    uce_division: payload.uceDivision,
    o_level_school_name: payload.oLevelSchoolName,
    uace_index_number: payload.uaceIndexNumber,
    uace_year_of_sitting: payload.uaceYearOfSitting,
    uace_second_sitting: payload.uaceSecondSitting,
    uace_second_index_number: payload.uaceSecondIndexNumber,
    uace_second_year_of_sitting: payload.uaceSecondYearOfSitting,
    uace_total_points: payload.uaceTotalPoints,
    uace_principal_subjects: payload.uacePrincipalSubjects,
    uace_general_paper_grade: payload.uaceGeneralPaperGrade,
    uace_ict_or_sub_math_subject: payload.uaceIctOrSubMathSubject,
    uace_ict_or_sub_math_grade: payload.uaceIctOrSubMathGrade,
    o_level_result_slip_url: payload.oLevelResultSlipUrl,
    a_level_result_slip_url: payload.aLevelResultSlipUrl,
    academic_transcript_url: payload.academicTranscriptUrl,
    national_id_or_passport_url: payload.nationalIdOrPassportUrl,
    country_id_document_url: payload.countryIdDocumentUrl,
    referee_letter_url: payload.refereeLetterUrl,
    personal_statement_attachment_url: payload.personalStatementAttachmentUrl,
    o_level_subjects: payload.oLevelSubjects,
    certificate_subjects: payload.certificateSubjects,
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

export async function submitPartnershipSubmission(data: PartnershipPayload) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const response = await fetch(`${baseUrl}/api/partnership-discussions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: data.name,
      email: data.email,
      organization: data.organization || "",
      partnership_goal: data.partnershipGoal,
      message: data.message,
    }),
  });

  let result: any = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const errorMessage =
      result?.detail || "Could not submit partnership request.";
    throw new Error(errorMessage);
  }

  return result;
}
