import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0p6I_bUMt-cGOSQsYwTrSOiQU8JhXnts",
  authDomain: "planaway-v0.firebaseapp.com",
  projectId: "planaway-v0",
  storageBucket: "planaway-v0.firebasestorage.app",
  messagingSenderId: "155462035992",
  appId: "1:155462035992:web:f5ab4d3ab6e5720b7a316d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);