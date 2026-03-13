import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgKF5Z_3tPNhaG038DSS1c5-3igVzu_Xo",
  authDomain: "archon-auth-780ab.firebaseapp.com",
  projectId: "archon-auth-780ab",
  storageBucket: "archon-auth-780ab.firebasestorage.app",
  messagingSenderId: "1092873251503",
  appId: "1:1092873251503:web:7413b537d4eeac96d0c25a",
  measurementId: "G-VL7YB6E2N6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
};
