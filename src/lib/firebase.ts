import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAW6AZzmeJG2mJ-u9evLsLluy2e2gEt2fg",
  authDomain: "iteach-f4dc5.firebaseapp.com",
  projectId: "iteach-f4dc5",
  storageBucket: "iteach-f4dc5.firebasestorage.app",
  messagingSenderId: "54316127796",
  appId: "1:54316127796:web:b966b946c1c9caa0e25c61",
  measurementId: "G-FH4V6BL8F1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Enable multi-tab persistence
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}