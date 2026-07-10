import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

// Injected/configured variables
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyCiiIQHdD7ZDmlJPlS68sdIPWSrEGsHMAk",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "velora-crm-ai.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "velora-crm-ai",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "velora-crm-ai.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029119383137",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:1029119383137:web:c703673956414332917c20",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-G21S91059Q"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit
};
export type { User };
