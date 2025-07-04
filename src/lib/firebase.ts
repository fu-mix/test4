// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Your Firebase project configuration.
 *
 * IMPORTANT: These keys are meant to be public and are used to identify your
 * Firebase project on the client-side. They need to be available when the app
 * is built and when server-side code (like in `actions.ts`) runs.
 *
 * For this reason, they must be stored in a .env file at the root of your project,
 * prefixed with NEXT_PUBLIC_. This is the standard and secure way to handle
 * this type of configuration in a Next.js application.
 *
 * You can find these values in your Firebase project console.
 * Go to Project Settings (click the ⚙️ gear icon) > General tab.
 * In the "Your apps" card, select the Web app.
 * The `projectId` is also listed under the "Your project" section on the same page.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// We check if the app is already initialized to avoid errors during hot-reloading.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
