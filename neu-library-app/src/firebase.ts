import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx3FOxVTdeh3wd_g0ZHkwuqoHDEHd1nNw",
  authDomain: "neu-library-app-dece3.firebaseapp.com",
  projectId: "neu-library-app-dece3",
  storageBucket: "neu-library-app-dece3.firebasestorage.app",
  messagingSenderId: "339311179814",
  appId: "1:339311179814:web:0b2b5a72566d4d3f068ee7",
  measurementId: "G-H3MY52DDBV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);