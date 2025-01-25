import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <Toaster position="top-right" />
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}