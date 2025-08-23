'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import styles from './UserProfilePopup.module.css';

export default function UserProfilePopup({ onClose }) {
  const popupRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.popupContainer} ref={popupRef}>
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="User Avatar" className={styles.avatarImage} />
          ) : (

            user.email.charAt(0).toUpperCase()
          )}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.displayName || 'Anonymous User'}</p>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}