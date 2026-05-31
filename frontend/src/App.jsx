import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from './pages/DailyCheckIn';
import WaterTracker from './pages/WaterTracker';
import Analytics from './pages/Analytics';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

// Import Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Protected Route Wrapper Component
function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Drawer */}
        <main className="flex-1 flex overflow-hidden bg-slate-950 relative">
          <div className="absolute top-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/checkin" 
            element={
              <ProtectedLayout>
                <DailyCheckIn />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/water-tracker" 
            element={
              <ProtectedLayout>
                <WaterTracker />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedLayout>
                <Analytics />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/reminders" 
            element={
              <ProtectedLayout>
                <Reminders />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <ProtectedLayout>
                <Achievements />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            } 
          />

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
