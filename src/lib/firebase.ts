// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * To get these values, create a new Web project in your Firebase console.
 * Go to Project Settings > General > Your apps > Web app.
 *
 * Then, add these keys to your .env file at the root of your project.
 *
 * NEXT_PUBLIC_FIREBASE_API_KEY=...
 * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 * NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
 * NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
 * NEXT_PUBLIC_FIREBASE_APP_ID=...
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
