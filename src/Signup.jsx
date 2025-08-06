import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase-config';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';
import './Loading.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      setSuccess('Account created successfully! Please check your email to verify your account.');
      
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to verification page after a short delay
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google accounts are automatically verified
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups and try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in instead.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join us today and get started</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" className={`signup-button ${isLoading ? 'button-loading' : ''}`} disabled={isLoading || isGoogleLoading}>
            {isLoading && <span className="button-spinner"></span>}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button 
          className={`google-signin-button ${isGoogleLoading ? 'button-loading' : ''}`}
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading && <span className="button-spinner"></span>}
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isGoogleLoading ? 'Signing up with Google...' : 'Sign up with Google'}
        </button>
        
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
