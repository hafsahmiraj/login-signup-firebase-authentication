import { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase-config';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import './Loading.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowResendVerification(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setUnverifiedUser(userCredential.user);
        setError('Please verify your email before signing in. Check your inbox for a verification link.');
        setShowResendVerification(true);
        // Sign out the user since they haven't verified their email
        await auth.signOut();
        return;
      }
      
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    setSuccess('');
    setShowResendVerification(false);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google accounts are automatically verified
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups and try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    
    try {
      await sendEmailVerification(unverifiedUser);
      setSuccess('Verification email sent! Please check your inbox.');
      setShowResendVerification(false);
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {showResendVerification && (
          <div className="verification-section">
            <p className="verification-text">Didn't receive the email?</p>
            <button 
              type="button" 
              onClick={handleResendVerification}
              className="resend-button"
            >
              Resend Verification Email
            </button>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
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
          
          <button type="submit" className={`login-button ${isLoading ? 'button-loading' : ''}`} disabled={isLoading || isGoogleLoading}>
            {isLoading && <span className="button-spinner"></span>}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button 
          className={`google-signin-button ${isGoogleLoading ? 'button-loading' : ''}`}
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading && <span className="button-spinner"></span>}
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
        </button>
        
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
