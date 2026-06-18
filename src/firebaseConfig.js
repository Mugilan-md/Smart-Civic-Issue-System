import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQENc5Iz0kNfSdYI_JCkxMp21UBv5xbKU",
  authDomain: "smart-civic-issue-system-2df1f.firebaseapp.com",
  projectId: "smart-civic-issue-system-2df1f",
  storageBucket: "smart-civic-issue-system-2df1f.firebasestorage.app",
  messagingSenderId: "441878343352",
  appId: "1:441878343352:web:cdbb88261b2458bb090e4d",
  measurementId: "G-E2DBCBZHR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
