'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import styles from './Sidebar.module.css';
import UserProfilePopup from './UserProfilePopup';

const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const DeleteIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;

export default function Sidebar({ user, activeChatId, onChatSelect, onNewGuestChat }) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }
    const q = query(collection(db, 'chats', user.uid, 'sessions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().firstMessage || 'New Chat',
      }));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, [user]);

  const handleNewChat = async () => {
    if (!user) {
      onNewGuestChat();
      return;
    }

    const newChatRef = await addDoc(collection(db, 'chats', user.uid, 'sessions'), {
      createdAt: serverTimestamp(),
      firstMessage: 'New Chat'
    });
    onChatSelect(newChatRef.id);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!user || !chatId || !confirm('Anda yakin ingin menghapus chat ini?')) return;
    
    const chatDocRef = doc(db, 'chats', user.uid, 'sessions', chatId);
    await deleteDoc(chatDocRef);
    
    if (activeChatId === chatId) {
      onChatSelect(null);
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!user || !editingChatId || !renameValue.trim()) return;
    const chatDocRef = doc(db, 'chats', user.uid, 'sessions', editingChatId);
    await updateDoc(chatDocRef, { firstMessage: renameValue.trim() });
    setEditingChatId(null);
    setRenameValue('');
  };

  const startEditing = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setRenameValue(chat.title);
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}><h1 className={styles.sidebarTitle}>Portal AI</h1></div>
      <button onClick={handleNewChat} className={styles.newChatButton}>+ New Chat</button>
      
      {/* Hanya tampilkan riwayat chat jika pengguna login */}
      {user && (
        <div className={styles.chatsList}>
          <h2 className={styles.chatsTitle}>Chats</h2>
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`} onClick={() => editingChatId !== chat.id && onChatSelect(chat.id)}>
                {editingChatId === chat.id ? (
                  <form onSubmit={handleRenameSubmit} className={styles.renameForm}>
                    <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus onBlur={handleRenameSubmit} />
                  </form>
                ) : (
                  <span className={styles.chatTitle}>{chat.title.length > 20 ? `${chat.title.substring(0, 20)}...` : chat.title}</span>
                )}
                {editingChatId !== chat.id && (
                  <div className={styles.chatActions}>
                    <button onClick={(e) => startEditing(e, chat)} title="Rename"><EditIcon /></button>
                    <button onClick={(e) => handleDeleteChat(e, chat.id)} title="Delete"><DeleteIcon /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.userProfileSection}>
        {user ? (
          <>
            {isPopupOpen && <UserProfilePopup user={user} onClose={() => setPopupOpen(false)} />}
            <button className={styles.userProfileButton} onClick={() => setPopupOpen(true)}>
              <div><p><b>{user.displayName || 'User'}</b></p><p className={styles.userEmail}>{user.email}</p></div>
            </button>
          </>
        ) : (
          <button className={styles.loginButton} onClick={() => router.push('/login')}>
            <span>Login / Sign Up</span>
          </button>
        )}
      </div>
    </aside>
  );
}
