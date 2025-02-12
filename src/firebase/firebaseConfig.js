// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkoIJIOoLva_FZy2mGdgSldnscSni92LM",
  authDomain: "style-capsule-b266a.firebaseapp.com",
  databaseURL: "https://style-capsule-b266a-default-rtdb.firebaseio.com",
  projectId: "style-capsule-b266a",
  storageBucket: "style-capsule-b266a.firebasestorage.app",
  messagingSenderId: "621905055760",
  appId: "1:621905055760:web:77d68599d7737715797a95",
  measurementId: "G-RSKBK28P2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }