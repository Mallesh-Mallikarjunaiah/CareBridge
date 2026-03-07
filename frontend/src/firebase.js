// src/firebase.js
// This file initializes Firebase ONCE for the entire app
// Every other file imports from here instead of initializing again

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// All values come from your .env file
// VITE_ prefix is required for Vite to expose them to the frontend
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app instance
// This connects your frontend to your Firebase project
const app = initializeApp(firebaseConfig);

// Auth instance — used for all login/signup/logout operations
export const auth = getAuth(app);

// Google provider — used for "Sign in with Google" button
// We configure it to always show the account picker
// so users can choose which Google account to use
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });