import React, { useState } from 'react';
import { Sidebar } from './Sidebar.component';
import './EmployeeLayout.component.css';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="employee-layout">
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