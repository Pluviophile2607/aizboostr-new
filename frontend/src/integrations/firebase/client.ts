// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE8SaSbT_m87m0CYAFNOc_a4MHZcddaX4",
  authDomain: "aizboostr-fbfd0.firebaseapp.com",
  projectId: "aizboostr-fbfd0",
  storageBucket: "aizboostr-fbfd0.firebasestorage.app",
  messagingSenderId: "107756353600",
  appId: "1:107756353600:web:687102aefc24d6289ec7a5",
  measurementId: "G-NB49W2ZXGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes to ensure access token is returned
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Initialize Firebase Storage
export const storage = getStorage(app);

export { analytics };
export default app;
