'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/firebase/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isPageLoading, setIsPageLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      setError('Gagal mendaftar dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Silakan masukkan alamat email Anda untuk mengatur ulang kata sandi.');
      return;
    }
    setError(null);
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError('Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);
          font-family: 'Inter', sans-serif;
          padding: 1rem;
        }
        .login-card {
          background-color: white;
          padding: 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-card h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .login-card p {
          color: #666;
          margin-bottom: 2rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-field {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          font-size: 1rem;
        }
        .input-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        .btn {
          padding: 0.9rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .btn-primary {
          background-color: #667eea;
          color: white;
        }
        .btn-google {
          background-color: #fff;
          color: #444;
          border: 1px solid #ddd;
          width: 100%;
        }
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #aaa;
          margin: 1.5rem 0;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #eee;
        }
        .version-info {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.8rem;
          color: #aaa;
          z-index: 100;
        }
        .forgot-password {
          font-size: 0.9rem;
          color: #667eea;
          text-decoration: none;
          cursor: pointer;
          margin-top: 0.5rem;
          display: inline-block;
        }
        .error-message, .success-message {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .error-message {
          color: #e53e3e;
          background-color: #fed7d7;
        }
        .success-message {
          color: #2f855a;
          background-color: #c6f6d5;
        }
        .signup-link {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #555;
        }
        .signup-link a {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
        }
        .copyright-info {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          font-size: 0.8rem;
          color: #aaa;
          z-index: 100;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .btn-google .spinner {
          border-color: rgba(0, 0, 0, 0.2);
          border-top-color: #667eea;
        }
        .full-page-loader {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .full-page-loader .spinner {
            width: 40px;
            height: 40px;
            border-width: 4px;
            border-color: rgba(0, 0, 0, 0.2);
            border-top-color: #667eea;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-container {
            align-items: flex-start;
            background: white;
          }
          .login-card {
            box-shadow: none;
            padding: 2rem 1rem;
            border-radius: 0;
          }
        }
      `}</style>
      <div className="login-container">
        {isPageLoading ? (
          <div className="full-page-loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="login-card">
            <h1>Welcome Back!</h1>
            <p>Masukkan email atau login dengan google</p>
            
            {error && <div className="error-message">{error}</div>}
            {resetEmailSent && <div className="success-message">Email berhasil di reset! Silakan periksa inbox Anda.</div>}

            <form onSubmit={handleLogin} className="login-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
                required
                disabled={isLoading}
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : 'Login'}
              </button>
              <div style={{textAlign: 'right'}}>
                <a onClick={handlePasswordReset} className="forgot-password">
                  Lupa Password?
                </a>
              </div>
            </form>
            
            <div className="divider">OR</div>

            <button onClick={handleGoogleSignIn} className="btn btn-google" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign In with Google
                </>
              )}
            </button>

            <div className="signup-link">
              Belum memiliki akun?{' '}
              <a href="/signup">SignUp</a>
            </div>
          </div>
        )}
      </div>
      <div className="version-info">v0.0.1</div>
      <div className="copyright-info">© 2025 Portal AI. All rights reserved.</div>
    </>
  );
}
