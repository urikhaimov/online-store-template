import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3NlV8DFRgJPAio26-PgLerVK-ECwGteo",
  authDomain: "onlinestoretemplate-59d3e.firebaseapp.com",
  projectId: "onlinestoretemplate-59d3e",
  storageBucket: "onlinestoretemplate-59d3e.appspot.com",
  messagingSenderId: "492588425642",
  appId: "1:492588425642:web:9eec725046f10937830bd3",
  measurementId: "G-6YG7D3FZPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);
