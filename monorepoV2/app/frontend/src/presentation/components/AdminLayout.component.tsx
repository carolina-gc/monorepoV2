import React, { useState } from 'react';
import { Sidebar } from './Sidebar.component';
import './AdminLayout.component.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={setSidebarCollapsed} 
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
}; 