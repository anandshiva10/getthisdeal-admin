// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
// const firebaseConfig = {
//   apiKey: "AIzaSyCEhW9jzlZ2CK1hNeuWljoYX2gCo1xohFs",
//   authDomain: "fir-2660e.firebaseapp.com",
//   projectId: "fir-2660e",
//   storageBucket: "fir-2660e.appspot.com",
//   messagingSenderId: "773431946962",
//   appId: "1:773431946962:web:64a40abfbc5e6b6895870b"
// };
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore= getFirestore(app)