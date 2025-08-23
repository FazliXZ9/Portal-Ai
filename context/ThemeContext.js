// context/ThemeContext.js
'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Efek ini dijalankan saat komponen pertama kali dimuat
  useEffect(() => {
    // Cek tema yang tersimpan di localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      // Jika tidak ada, default ke 'light'
      document.body.className = 'light';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Simpan pilihan tema di localStorage
    localStorage.setItem('theme', newTheme);
    // Tambahkan class 'dark' atau 'light' ke body
    document.body.className = newTheme;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Buat custom hook agar lebih mudah digunakan
export const useTheme = () => useContext(ThemeContext);