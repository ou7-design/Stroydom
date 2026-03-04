import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsQWon-bZxnWSIilOzBJDeQt2VISoIu5w",
  authDomain: "stroydom-ca1b7.firebaseapp.com",
  projectId: "stroydom-ca1b7",
  storageBucket: "stroydom-ca1b7.firebasestorage.app",
  messagingSenderId: "19837341540",
  appId: "1:19837341540:web:2976822ca65347b89a7471",
  measurementId: "G-KR4YMFY4V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
