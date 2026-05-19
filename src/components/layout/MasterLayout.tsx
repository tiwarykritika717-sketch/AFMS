import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MasterLayoutProps {
  children: ReactNode;
}

export default function MasterLayout({ children }: MasterLayoutProps) {
  return (
    <div className="flex min-h-screen bg-brand-grey-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-10 ml-72 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
