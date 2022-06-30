import {initializeApp} from 'firebase/app';
import {getFirestore} from "firebase/firestore"
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBkYQKyVFrilQZzoWr9BrV35ozVvSYcEo",
  authDomain: "cofetarie-7590b.firebaseapp.com",
  databaseURL: "https://cofetarie-7590b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cofetarie-7590b",
  storageBucket: "cofetarie-7590b.appspot.com",
  messagingSenderId: "798293732399",
  appId: "1:798293732399:web:538ed21f05c2d6ed3d2ada",
  measurementId: "G-KLT5PNMJGL"
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const auth = getAuth(app);
