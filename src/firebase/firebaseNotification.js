import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCkoIJIOoLva_FZy2mGdgSldnscSni92LM",
    authDomain: "style-capsule-b266a.firebaseapp.com",
    databaseURL: "https://style-capsule-b266a-default-rtdb.firebaseio.com",
    projectId: "style-capsule-b266a",
    storageBucket: "style-capsule-b266a.firebasestorage.app",
    messagingSenderId: "621905055760",
    appId: "1:621905055760:web:5cb33e10b6792151797a95",
    measurementId: "G-WRNWY3NTVK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission to receive notifications
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "BABrrNKuYCpbp-Zpyp0jlWwnVhIa99znctnfzqKunbj1WkrF0CX7gDMyaO534TDwCx_YwFqTMAUWNrjkTWKOCAc" });
    if (token) {
      console.log("Firebase Token:", token);
      return token;
    } else {
      console.log("No token received.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
};

// Handle incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      resolve(payload);
    });
  });

export { messaging };
