import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const projectFirebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBUK60Asm7pgjm0F1P2Lm11gHxJRgZya0g",
  authDomain: "institution-portal.firebaseapp.com",
  projectId: "institution-portal",
  storageBucket: "institution-portal.firebasestorage.app",
  messagingSenderId: "401202457232",
  appId: "1:401202457232:web:68bbf31d0abd6a64764615",
  measurementId: "G-E8NKEJSZFV",
};

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? projectFirebaseConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    projectFirebaseConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ?? projectFirebaseConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    projectFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ??
    projectFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? projectFirebaseConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ??
    projectFirebaseConfig.measurementId,
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
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const analytics =
  firebaseApp && typeof window !== "undefined"
    ? getAnalytics(firebaseApp)
    : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
