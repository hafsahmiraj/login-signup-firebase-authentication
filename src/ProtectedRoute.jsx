import { Navigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) return <p style={{padding: '2rem', textAlign: 'center'}}>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (!user.emailVerified) {
    // Sign out unverified user and redirect to login
    auth.signOut();
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
