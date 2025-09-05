import React from 'react';
import Sidebar from './Sidebar';

type PageWithSidebarProps = {
  title?: string;
  children: React.ReactNode;
};

export default function PageWithSidebar({ title, children }: PageWithSidebarProps) {
  return (
    <section className="w-full">
      {title && (
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </header>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <div className="h-fit lg:sticky lg:top-20 lg:self-start">
          <Sidebar />
        </div>

        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}
