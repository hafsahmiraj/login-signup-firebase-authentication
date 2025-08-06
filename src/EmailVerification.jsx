import { useState, useEffect } from 'react';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase-config';
import { useNavigate, Link } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsVerified(currentUser.emailVerified);
        if (currentUser.emailVerified) {
          // User is verified, redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        // If no user is authenticated, redirect to signup
        navigate('/signup');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Check verification status every 2 seconds for faster detection
    const interval = setInterval(async () => {
      if (user && !user.emailVerified) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          setSuccess('Email verified successfully! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!user || resendCooldown > 0) return;

    try {
      await sendEmailVerification(user);
      setSuccess('Verification email sent! Please check your inbox.');
      setError('');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
      setSuccess('');
      console.error(error);
    }
  };


  if (isLoading) {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="success-icon">✓</div>
          <h1 className="verification-title">Email Verified!</h1>
          <p className="verification-subtitle">
            Your email has been successfully verified. You will be redirected to the dashboard shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="email-icon">📧</div>
        <h1 className="verification-title">Verify Your Email</h1>
        <p className="verification-subtitle">
          We've sent a verification link to <strong>{user?.email}</strong>
        </p>
        <p className="verification-text">
          Please check your inbox and click the verification link to activate your account.
        </p>
        
        <div className="auto-check-info">
          <p>🔄 Automatically checking for verification...</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="verification-actions">
          <button 
            onClick={handleResendVerification}
            disabled={resendCooldown > 0}
            className="resend-button"
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : 'Resend Verification Email'
            }
          </button>
        </div>

        <p className="login-link">
          Want to use a different email? <Link to="/signup">Sign up again</Link>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
