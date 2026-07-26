// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "playtubelogin-b72f9.firebaseapp.com",
  projectId: "playtubelogin-b72f9",
  storageBucket: "playtubelogin-b72f9.firebasestorage.app",
  messagingSenderId: "334000676939",
  appId: "1:334000676939:web:3c07954d958db5592eedce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}