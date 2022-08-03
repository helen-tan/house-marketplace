// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI_txAMa2roK9rQmVqWFIu6xYm84nrY_I",
  authDomain: "house-marketplace-app-ae136.firebaseapp.com",
  projectId: "house-marketplace-app-ae136",
  storageBucket: "house-marketplace-app-ae136.appspot.com",
  messagingSenderId: "614979690993",
  appId: "1:614979690993:web:e0bf028f65116a7614e450"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
