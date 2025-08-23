'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import ReactMarkdown from 'react-markdown';
import styles from './ChatView.module.css';
import ThemeToggleButton from './ThemeToggleButton';

const AttachIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

export default function ChatView({ user, authLoading, activeChatId, onChatSelect, onMenuClick }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messageListRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (user && activeChatId) {
      const q = query(collection(db, 'chats', user.uid, 'sessions', activeChatId, 'messages'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else {
      setMessages([{ role: 'ai', content: 'Halo! Ada yang bisa saya bantu? Riwayat tidak akan disimpan jika anda tidak Login.' }]);
    }
  }, [user, activeChatId, authLoading]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || isLoading) return;

    const userMessageContent = input;
    setInput('');
    
    if (!user) {
      const userMessage = { role: 'user', content: userMessageContent, imageUrl: imagePreview };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      const formData = new FormData();
      formData.append('prompt', userMessageContent);
      if (imageFile) formData.append('image', imageFile);
      try {
        const geminiResponse = await fetch('/api/chat', { method: 'POST', body: formData });
        if (!geminiResponse.ok) throw new Error('API Error');
        const data = await geminiResponse.json();
        setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
      } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, terjadi kesalahan.' }]);
      } finally {
        setIsLoading(false);
        removeImage();
      }
      return;
    }

    setIsLoading(true);
    let permanentImageUrl = null;

    if (imageFile) {
      permanentImageUrl = imagePreview;
    }
    
    const userMessage = { 
      role: 'user', 
      content: userMessageContent,
      imageUrl: permanentImageUrl
    };

    let currentChatId = activeChatId;
    if (!currentChatId) {
      const newChatRef = await addDoc(collection(db, 'chats', user.uid, 'sessions'), {
        createdAt: serverTimestamp(),
        firstMessage: userMessageContent || "Image"
      });
      currentChatId = newChatRef.id;
      onChatSelect(currentChatId);
    }
    
    const messagesRef = collection(db, 'chats', user.uid, 'sessions', currentChatId, 'messages');
    await addDoc(messagesRef, { ...userMessage, createdAt: serverTimestamp() });

    if (messages.length === 0) {
      await updateDoc(doc(db, 'chats', user.uid, 'sessions', currentChatId), { firstMessage: userMessageContent || "Image" });
    }

    const formData = new FormData();
    formData.append('prompt', userMessageContent);
    if (imageFile) formData.append('image', imageFile);

    try {
      const geminiResponse = await fetch('/api/chat', { method: 'POST', body: formData });
      if (!geminiResponse.ok) throw new Error('API Error');
      const data = await geminiResponse.json();
      await addDoc(messagesRef, { role: 'ai', content: data.message, createdAt: serverTimestamp() });
    } catch (error) {
      await addDoc(messagesRef, { role: 'ai', content: 'Maaf, terjadi kesalahan.', createdAt: serverTimestamp() });
    } finally {
      setIsLoading(false);
      removeImage();
    }
  };
  
  const [isModelPopupOpen, setModelPopupOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini Flash');
  const popupRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) setModelPopupOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef]);
  const models = ['Gemini Flash', 'Coming Soon', 'Coming Soon']; // 'Hugging Face', 'OpenRouter',
  const handleSelectModel = (model) => {
    if (model !== 'Coming Soon') setSelectedModel(model);
    setModelPopupOpen(false);
  };

  return (
    <div className={styles.chatViewContainer}>
      <div className={styles.chatHeader}>
        <button onClick={onMenuClick} className={styles.menuButton}>☰</button>
        <ThemeToggleButton />
      </div>
      
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
            <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
              {msg.imageUrl && <img src={msg.imageUrl} alt="User upload" className={styles.chatImage} onError={(e) => { e.target.style.display = 'none'; }} />}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.ai}`}>
            <div className={`${styles.messageBubble} ${styles.aiBubble}`}>
              <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          {imagePreview && (
            <div className={styles.imagePreviewContainer}>
              <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              <button onClick={removeImage} className={styles.removeImageButton}>&times;</button>
            </div>
          )}
          <div className={styles.inputControls}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
            <button type="button" onClick={() => fileInputRef.current.click()} className={styles.attachButton}><AttachIcon /></button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
              placeholder="Type a message"
              className={styles.textarea}
              rows="1"
              disabled={isLoading}
            />
            <div className={styles.formActions} ref={popupRef}>
              {isModelPopupOpen && (
                <div className={styles.modelPopup}>
                  {models.map((model, index) => (
                    <button key={index} type="button" className={`${styles.modelItem} ${model === 'Coming Soon' ? styles.disabled : ''} ${selectedModel === model ? styles.selected : ''}`} onClick={() => handleSelectModel(model)} disabled={model === 'Coming Soon'}>
                      {model} {selectedModel === model && ' ✓'}
                    </button>
                  ))}
                </div>
              )}
              <button type="button" className={styles.modelSelector} onClick={() => setModelPopupOpen(!isModelPopupOpen)}>
                {selectedModel}
              </button>
              <button type="submit" className={styles.sendButton} disabled={isLoading || (!input.trim() && !imageFile)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
