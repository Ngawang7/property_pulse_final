'use client';

import { usePathname } from 'next/navigation';

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main className={`flex-grow ${!isHomePage ? 'pt-20' : ''}`}>
      {children}
    </main>
  );
};

export default ClientLayout; 