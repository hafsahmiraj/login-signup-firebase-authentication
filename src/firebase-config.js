// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBfUWzNwqVE6I5xGlWQBeAyDaHfcPTpcVo",
  authDomain: "auth-demo-ca90e.firebaseapp.com",
  projectId: "auth-demo-ca90e",
  storageBucket: "auth-demo-ca90e.firebasestorage.app",
  messagingSenderId: "998137223863",
  appId: "1:998137223863:web:523a5eb3969a6ca5ad4b32"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider with additional scopes and custom parameters
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };
