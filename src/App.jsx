import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { RideProvider, RideContext } from './context/RideContext';
import Login from './pages/Login';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import { Menu } from 'lucide-react';

const ProtectedRoute = ({ role, children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'customer' ? '/rider' : '/driver'} replace />;
  return children;
};

const AppShell = ({ children }) => {
  const { user, logout } = React.useContext(AuthContext);
  const { mapVisible } = React.useContext(RideContext);
  
  return (
    <div className={`relative w-screen h-screen overflow-hidden text-white font-sans transition-all duration-1000 ${!mapVisible ? 'app-mesh-bg' : 'bg-black'}`}>
      {user && (
        <div className="absolute top-6 left-6 z-50 animate-slide-up flex gap-3">
          <button className="bg-white/20 backdrop-blur-xl border border-white/20 text-white p-3.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 hover:scale-105 transition active:scale-95">
            <Menu size={24} strokeWidth={2.5} />
          </button>
          <button onClick={logout} className="bg-red-500/80 backdrop-blur-xl border border-red-500/20 text-white font-bold px-4 py-2 rounded-full shadow-[0_8px_32px_rgba(239,68,68,0.3)] hover:bg-red-600/80 transition">
            Logout
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RideProvider>
        <Router>
          <AppShell>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/rider" element={
                <ProtectedRoute role="customer">
                  <RiderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/driver" element={
                <ProtectedRoute role="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </AppShell>
        </Router>
      </RideProvider>
    </AuthProvider>
  );
}
