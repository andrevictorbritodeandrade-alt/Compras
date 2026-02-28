import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8akkXJR94Vg",
  authDomain: "gen-lang-client-0669556100.firebaseapp.com",
  projectId: "gen-lang-client-0669556100",
  storageBucket: "gen-lang-client-0669556100.firebasestorage.app",
  messagingSenderId: "611487846194",
  appId: "1:324211037832:web:362a46e6446ea37b85b13d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
