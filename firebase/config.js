// firebase/config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjVJqb7i9A6m18vZBZwA5n8_szKjKoA0k",
  authDomain: "user-minigame.firebaseapp.com",
  projectId: "user-minigame",
  storageBucket: "user-minigame.firebasestorage.app",
  messagingSenderId: "540982168831",
  appId: "1:540982168831:web:52f5aa77df903c165b50ca",
  measurementId: "G-0H6YDDTLD4"
};

// Initialize Firebase
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    const auth = getAuth(app);
    const db = getFirestore(app);

    export { app, auth, db };