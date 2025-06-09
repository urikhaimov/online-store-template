import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3NlV8DFRgJPAio26-PgLerVK-ECwGteo",
  authDomain: "onlinestoretemplate-59d3e.firebaseapp.com",
  projectId: "onlinestoretemplate-59d3e",
  storageBucket: "onlinestoretemplate-59d3e.firebasestorage.app",
  messagingSenderId: "492588425642",
  appId: "1:492588425642:web:9eec725046f10937830bd3",
  measurementId: "G-6YG7D3FZPN"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export auth and db
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
