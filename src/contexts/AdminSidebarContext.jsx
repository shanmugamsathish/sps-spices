import React, { createContext, useContext, useState } from 'react';

const AdminSidebarContext = createContext();

export const UseAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  }
  return context;
};

export const AdminSidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <AdminSidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};

