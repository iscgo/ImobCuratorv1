import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { ClientPortal } from './pages/ClientPortal';
import { VisitDetail } from './pages/VisitDetail'; 
import { Visits } from './pages/Visits'; 
import { PropertyImport } from './pages/PropertyImport';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { ClientManager } from './pages/ClientManager';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { LanguageProvider } from './contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper for Mobile Toggle */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar onLogout={onLogout} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
            darkMode={darkMode} 
            toggleTheme={toggleTheme} 
            toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Estado de Autenticação (Persiste em memória apenas para demo)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <LanguageProvider>
      <HashRouter>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visits" element={<Visits />} /> 
            <Route path="/import" element={<PropertyImport />} />
            <Route path="/clients" element={<ClientPortal />} />
            <Route path="/clients/:id" element={<ClientManager />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/analytics" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LanguageProvider>
  );
};



export default App;