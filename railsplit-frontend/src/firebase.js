import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpty-ReasoRqZVH5xT5hKsjYgYuuY3coo",
  authDomain: "railsplit-luckylinux.firebaseapp.com",
  projectId: "railsplit-luckylinux",
  storageBucket: "railsplit-luckylinux.firebasestorage.app",
  messagingSenderId: "729292169560",
  appId: "1:729292169560:web:78e9d022efd0b1242f052d",
  measurementId: "G-7BN40JY3T6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);