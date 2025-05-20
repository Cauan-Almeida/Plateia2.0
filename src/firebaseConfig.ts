// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsbmVAcvKo2JjIlsWP1ATzBlxFhLoj9os",
  authDomain: "plateia-e13ee.firebaseapp.com",
  projectId: "plateia-e13ee",
  storageBucket: "plateia-e13ee.firebasestorage.app",
  messagingSenderId: "792031758617",
  appId: "1:792031758617:web:b09fd462607aa9d2641d88",
  measurementId: "G-FJ815MBXS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };