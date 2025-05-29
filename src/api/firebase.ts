import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyD3NlV8DFRgJPAio26-PgLerVK-ECwGteo",
  authDomain: "onlinestoretemplate-59d3e.firebaseapp.com",
  projectId: "onlinestoretemplate-59d3e",
  storageBucket: "onlinestoretemplate-59d3e.firebasestorage.app",
  messagingSenderId: "492588425642",
  appId: "1:492588425642:web:9eec725046f10937830bd3",
  measurementId: "G-6YG7D3FZPN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
