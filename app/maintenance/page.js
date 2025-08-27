'use client';

import React from 'react';

const MaintenanceIcon = () => (
  <svg 
    width="80" 
    height="80" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ marginBottom: '1.5rem', color: '#4A5568' }}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

export default function MaintenancePage() {
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);
          font-family: 'Inter', sans-serif;
          color: #2D3748;
          text-align: center;
          padding: 2rem;
        }

        .card {
          background-color: white;
          padding: 3rem 4rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          max-width: 600px;
          width: 100%;
          animation: fadeIn 0.8s ease-out;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1A202C;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #718096;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .progress-bar {
          height: 8px;
          width: 100%;
          background-color: #E2E8F0;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 2.5rem;
        }

        .progress-bar-inner {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          background-size: 200% 200%;
          border-radius: 4px;
          animation: progress-animation 2s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress-animation {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 640px) {
          .card {
            padding: 2rem 1.5rem;
          }
          .title {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
      
      <div className="container">
        <div className="card">
          <MaintenanceIcon />
          <h1 className="title">Sedang dalam Perbaikan</h1>
          <p className="subtitle">
            Kami sedang melakukan beberapa pembaruan untuk meningkatkan pengalaman Anda. 
            Portal AI akan segera kembali. Terima kasih atas kesabaran Anda!
          </p>
          <div className="progress-bar">
            <div className="progress-bar-inner"></div>
          </div>
        </div>
      </div>
    </>
  );
}
