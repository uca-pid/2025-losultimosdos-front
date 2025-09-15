// src/App.tsx

import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import ClassList from './components/ClassList';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import './styles/pro.css';

import AuthedLayout from './components/AuthedLayout';
import { Routing } from './routes/routing';

type Role = 'admin' | 'user';

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload));
    return typeof json.userId === 'number' ? json.userId : Number(json.userId) || null;
  } catch {
    return null;
  }
}

const AppInner: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | null>(() => {
    const stored = localStorage.getItem('role');
    return stored === 'admin' || stored === 'user' ? stored : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const userId = useMemo(() => (token ? getUserIdFromToken(token) : null), [token]);

  const finishAuth = (userRole: Role, jwt: string) => {
    setRole(userRole);
    setToken(jwt);
    localStorage.setItem('role', userRole);
    localStorage.setItem('token', jwt);
    navigate(userRole === 'admin' ? '/admin' : '/user', { replace: true });
  };

  const handleLogin = (userRole: Role, jwt: string) => finishAuth(userRole, jwt);
  const handleSignup = (userRole: Role, jwt: string) => finishAuth(userRole, jwt);

  const onLogout = () => {
    setRole(null);
    setToken(null);
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const RequireAuth: React.FC<{ children: React.ReactNode; allow: Role[] }> = ({ children, allow }) => {
    if (!role || !token) return <Navigate to="/login" replace />;
    if (!allow.includes(role)) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <Routing />
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routing />
  </BrowserRouter>
);

export default App;
