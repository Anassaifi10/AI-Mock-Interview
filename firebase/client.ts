// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCh8fwqLh3y98wLrJNdBiXY5VVaF8-O-3Y",
  authDomain: "mockinterview-87a4a.firebaseapp.com",
  projectId: "mockinterview-87a4a",
  storageBucket: "mockinterview-87a4a.firebasestorage.app",
  messagingSenderId: "119716793702",
  appId: "1:119716793702:web:0979b758e95ca743900ca7",
  measurementId: "G-Y9064PSGYF"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);