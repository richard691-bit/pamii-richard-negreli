// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoWX4SP4vJ5BKbgnKFTy-qJvFEpN64kzc",
  authDomain: "adicionarapp.firebaseapp.com",
  projectId: "adicionarapp",
  storageBucket: "adicionarapp.firebasestorage.app",
  messagingSenderId: "713610072088",
  appId: "1:713610072088:web:a150d0dc0e64996215336d",
  measurementId: "G-BS9TZ01SVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);