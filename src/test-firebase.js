// test-firebase.js
// Run this in browser console to test Firebase configuration

import { auth, googleProvider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';

// Test Firebase initialization
console.log('Firebase Auth initialized:', auth);
console.log('Current user:', auth.currentUser);
console.log('Google Provider:', googleProvider);

// Test Google Auth Provider configuration
console.log('Google Provider scopes:', googleProvider._scopes);
console.log('Google Provider custom parameters:', googleProvider._customParameters);

// Function to test Google Sign-In
window.testGoogleSignIn = async () => {
  try {
    console.log('Testing Google Sign-In...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};

// Function to check current domain
window.checkDomain = () => {
  console.log('Current domain:', window.location.origin);
  console.log('Current hostname:', window.location.hostname);
  console.log('Firebase Auth Domain:', auth.config.authDomain);
};

console.log('Firebase test utilities loaded. Run testGoogleSignIn() or checkDomain() in console.');
