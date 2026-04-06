import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const projectFirebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA-xugaUp-q-ckorpS9STvSqukTVXeB3TA",
  authDomain: "universityportal2026.firebaseapp.com",
  projectId: "universityportal2026",
  storageBucket: "universityportal2026.firebasestorage.app",
  messagingSenderId: "464773454654",
  appId: "1:464773454654:web:c3507664d238461bebaa6f",
};

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? projectFirebaseConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? projectFirebaseConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ?? projectFirebaseConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    projectFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ??
    projectFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? projectFirebaseConfig.appId,
};

const requiredKeys: Array<keyof FirebaseOptions> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

export const isFirebaseConfigured = requiredKeys.every((key) =>
  Boolean(firebaseConfig[key]),
);

export const firebaseApp = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
