import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQiXs9905KjUw6Jx9rwoNMDezHbPZzwAg",
  authDomain: "safeher-c2018.firebaseapp.com",
  projectId: "safeher-c2018",
  storageBucket: "safeher-c2018.firebasestorage.app",
  messagingSenderId: "889456912613",
  appId: "1:889456912613:web:e9dcc7788374025f78cc0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);