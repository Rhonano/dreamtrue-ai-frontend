import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import LoginForm from './components/LoginForm';
import CompanyAnalysisForm from './components/CompanyAnalysisForm';
import AnalysisLoading from './components/AnalysisLoading';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState<'login' | 'form' | 'loading' | 'dashboard'>('login');
  const [companyName, setCompanyName] = useState('');

  // Check if user is authenticated
  if (state.user && currentView === 'login') {
    setCurrentView('dashboard');
  }

  const handleAnalysisSubmit = (name: string) => {
    setCompanyName(name);
    setCurrentView('loading');
    
    // Simulate 2-3 minute analysis
    setTimeout(() => {
      setCurrentView('dashboard');
    }, 5000); // 5 seconds for demo (would be 2-3 minutes in production)
  };

  const handleLogout = () => {
    setCurrentView('login');
    setCompanyName('');
  };

  if (currentView === 'login') {
    return <LoginForm />;
  }

  if (currentView === 'form') {
    return <CompanyAnalysisForm onLogout={handleLogout} onSubmit={handleAnalysisSubmit} />;
  }

  if (currentView === 'loading') {
    return <AnalysisLoading companyName={companyName} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;