'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/firebase/config';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (name.trim() === '') {
      setError('Silakan masukkan nama Anda.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      router.push('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Alamat email ini sudah digunakan.');
      } else if (error.code === 'auth/weak-password') {
        setError('Kata sandi minimal harus 6 karakter.');
      } else {
        setError('Gagal membuat akun. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
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

  return (
    <>
      <style jsx>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);
          font-family: 'Inter', sans-serif;
          padding: 1rem;
        }
        .signup-card {
          background-color: white;
          padding: 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .signup-card h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .signup-card p {
          color: #666;
          margin-bottom: 2rem;
        }
        .signup-form {
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
          transition: background-color 0.2s;
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
        .error-message {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: #e53e3e;
          background-color: #fed7d7;
          border: 1px solid #fbb6b6;
        }
        .login-link {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #555;
        }
        .login-link a {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
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
        .version-info {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.8rem;
          color: #aaa;
          z-index: 100;
        }
        .copyright-info {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          font-size: 0.8rem;
          color: #aaa;
          z-index: 100;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 480px) {
          .signup-container {
            align-items: flex-start;
            background: white;
          }
          .signup-card {
            box-shadow: none;
            padding: 2rem 1rem;
            border-radius: 0;
          }
        }
      `}</style>
      <div className="signup-container">
        {isPageLoading ? (
          <div className="full-page-loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="signup-card">
            <h1>Buat Akun</h1>
            <p>Bergabunglah untuk memulai perjalanan Anda.</p>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSignUp} className="signup-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                className="input-field"
                required
                disabled={isLoading}
              />
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
                placeholder="Kata Sandi"
                className="input-field"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Kata Sandi"
                className="input-field"
                required
                disabled={isLoading}
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : 'Daftar'}
              </button>
            </form>
            
            <div className="divider">ATAU</div>

            <button onClick={handleGoogleSignUp} className="btn btn-google" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Daftar dengan Google
                </>
              )}
            </button>

            <div className="login-link">
              Sudah punya akun?{' '}
              <a href="/login">Masuk</a>
            </div>
          </div>
        )}
      </div>
      <div className="version-info">v0.0.1</div>
      <div className="copyright-info">©2025 Muhammad Fazli M.</div>
    </>
  );
}
