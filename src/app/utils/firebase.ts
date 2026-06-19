import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: "AIzaSyDtX9QONmfqENqvsdueCXjVa7BnyPWMoJI",
  authDomain: "cloud-implement.firebaseapp.com",
  projectId: "cloud-implement",
  storageBucket: "cloud-implement.firebasestorage.app",
  messagingSenderId: "220100384895",
  appId: "1:220100384895:android:d0ba7c87664f839826874a"
};

// Initialize Firebase only on web platform
let app: any = null;
let storage: any = null;
let db: any = null;

if (Capacitor.getPlatform() === 'web') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    storage = getStorage(app);
    db = getFirestore(app);
    console.log("Firebase Web SDK initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Web SDK:", error);
  }
}

export { app, storage, db };
