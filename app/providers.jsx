'use client';

import { SessionProvider } from 'next-auth/react';
import { GlobalProvider } from '@/context/GlobalContext';
import { ToastContainer } from 'react-toastify';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <GlobalProvider>
        {children}
        <ToastContainer />
      </GlobalProvider>
    </SessionProvider>
  );
} 