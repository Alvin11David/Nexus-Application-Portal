import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";

type ContactSubmissionInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
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
