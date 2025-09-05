import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-gray-50">
      <aside className="border-r border-gray-200 bg-white">
        <Sidebar className="h-full" />
      </aside>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
