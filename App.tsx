import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { LanguageProvider } from './contexts/LanguageContext';
import { MOCK_USER } from './constants';
import { UserProfile } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Routing Logic
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings user={user} onUpdateUser={updateUser} />;
      case 'import':
        return <div className="p-8 text-white">Import (To be implemented)</div>; // Placeholder for next steps
      case 'clients':
        return <div className="p-8 text-white">Clients (To be implemented)</div>;
      case 'properties':
        return <div className="p-8 text-white">Properties (To be implemented)</div>;
      case 'visits':
        return <div className="p-8 text-white">Visits (To be implemented)</div>;
      case 'reports':
        return <div className="p-8 text-white">Reports (To be implemented)</div>;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="bg-[#030305] min-h-screen text-white font-sans selection:bg-purple-500/30 selection:text-purple-200">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="flex">
            <Sidebar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage} 
                onLogout={handleLogout} 
            />
            <div className="flex-1 md:ml-64 transition-all duration-300">
              <Header user={user} />
              <main className="pt-20 min-h-screen">
                 {renderPage()}
              </main>
            </div>
          </div>
        )}
      </div>
    </LanguageProvider>
  );
}