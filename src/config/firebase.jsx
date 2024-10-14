// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWAbinZXwlhiidNVSMhejZgEZD4TGrygo",
  authDomain: "fuel-station-finder-65b62.firebaseapp.com",
  projectId: "fuel-station-finder-65b62",
  storageBucket: "fuel-station-finder-65b62.appspot.com",
  messagingSenderId: "655725153048",
  appId: "1:655725153048:web:8a0247284aca1e68e66c6d",
  measurementId: "G-0ZY56CNJXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
