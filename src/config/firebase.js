import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDQS-fXz7tjkmKSU21JLfFKoj92XrXIYfg",
  authDomain: "neon-defence.firebaseapp.com",
  projectId: "neon-defence",
  storageBucket: "neon-defence.appspot.com",
  messagingSenderId: "886512554155",
  appId: "1:886512554155:web:563417afaba9775724a7ee",
};

export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);
