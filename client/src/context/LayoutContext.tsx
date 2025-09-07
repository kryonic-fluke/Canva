import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutContextType {
  isSidebarOpen: boolean;
  isAuthPage: boolean; 
  toggleSidebar: () => void;
  closeSidebar: () => void; 
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const location = useLocation(); 

  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/signup') {
      setIsAuthPage(true);
      setIsSidebarOpen(false); 
    } else {
      setIsAuthPage(false);
    }
  }, [location.pathname]); 

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const value = {
    isSidebarOpen,
    isAuthPage,
    toggleSidebar,
    closeSidebar,
    setIsSidebarOpen,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};