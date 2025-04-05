import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Fix added

const firebaseConfig = {
  apiKey: "AIzaSyDpFEJCrjRBSuAoJyxXj-hlUBw1-cpmi0s",
  authDomain: "univibe-1.firebaseapp.com",
  databaseURL: "https://univibe-1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "univibe-1",
  storageBucket: "univibe-1.appspot.com",
  messagingSenderId: "988112997834",
  appId: "1:988112997834:web:700f134ce68f9c38d4d333",
  measurementId: "G-WQ8E1Z5PR1",
};

// ✅ Ensure Firebase is initialized only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// ✅ Firestore & Realtime Database Initialization
const db = getFirestore(app);
const realTimeDb = getDatabase(app);

export { auth, db, realTimeDb };