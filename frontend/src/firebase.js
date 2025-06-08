import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const FIREBASE_APIKEY = import.meta.env.VITE_FIREBASE_APIKEY;
const FIREBASE_AUTHDOMAIN = import.meta.env.VITE_FIREBASE_AUTHDOMAIN;
const FIREBASE_PROJECTID = import.meta.env.VITE_FIREBASE_PROJECTID;
const FIREBASE_STORAGEBUCKET = import.meta.env.VITE_FIREBASE_STORAGEBUCKET;
const FIREBASE_MESSAGINGSENDERID = import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID;
const FIREBASE_APPID = import.meta.env.VITE_FIREBASE_APPID;

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);