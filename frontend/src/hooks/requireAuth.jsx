// src/hooks/requireAuth.js
import { auth } from '../firebase';

const requireAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // only need it once
      resolve(user); // either user object or null
    });
  });
};

export default requireAuth;
