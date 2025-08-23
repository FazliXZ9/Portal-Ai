'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import ChatView from '@/components/ChatView';
import styles from './page.module.css';

const FullPageLoader = () => (
  <div className={styles.fullPageLoader}>
    <div className={styles.spinner}></div>
  </div>
);

export default function Home() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [guestChatKey, setGuestChatKey] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  const handleNewGuestChat = () => {
    setActiveChatId(null);
    setGuestChatKey(prevKey => prevKey + 1);
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <main className={styles.main}>
      <div className={`${styles.sidebarWrapper} ${isMenuOpen ? styles.open : ''}`}>
        <Sidebar 
          user={user} 
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onNewGuestChat={handleNewGuestChat}
        />
      </div>

      {isMenuOpen && <div onClick={toggleMenu} className={styles.backdrop}></div>}

      <div className={styles.chatWrapper}>
        <ChatView 
          key={activeChatId || guestChatKey}
          user={user} 
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onMenuClick={toggleMenu} 
        />
      </div>
    </main>
  );
}
