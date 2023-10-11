// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByBo2_JR3Lz1XTOzX0VDbAFTLDpFD1mJs",
  authDomain: "front-end-f41ce.firebaseapp.com",
  projectId: "front-end-f41ce",
  storageBucket: "front-end-f41ce.appspot.com",
  messagingSenderId: "734676623753",
  appId: "1:734676623753:web:892968d06e0b886101c158",
  measurementId: "G-C1Z0330JHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);