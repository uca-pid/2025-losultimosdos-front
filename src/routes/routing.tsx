import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Login from "../components/Login";
import Signup from "../components/Signup";
import { ProtectedResolver } from "./Resolvers/ProtectedResolver";
import { getUserIdFromToken } from "../utils/auth";
import AuthedLayout from "../components/AuthedLayout";
import ClassList from "../components/ClassList";
import AdminDashboard from "../components/AdminDashboard";
import ProfilePage from "../components/ProfilePage";

type Role = 'admin' | 'user';

export const Routing = () => {
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
        <Routes>
              <Route
                path="/"
                element={
                  !role ? <Navigate to="/login" replace /> : (role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/user" replace />)
                }
              />
        
              {/* Públicas */}
              <Route
                path="/login"
                element={<Login onLogin={handleLogin} onSwitchToSignup={() => navigate('/signup')} />}
              />
              <Route
                path="/signup"
                element={<Signup onSignup={handleSignup} onSwitchToLogin={() => navigate('/login')} />}
              />

            <Route path="/" element={<ProtectedResolver redirectPath="/login" />}>
                {/* User */}
                <Route
                    path="/user"
                    element={
                    <RequireAuth allow={['user']}>
                        <AuthedLayout role="user">
                        {userId !== null ? <ClassList userId={userId} /> : <div>Error: invalid token</div>}
                        </AuthedLayout>
                    </RequireAuth>
                    }
                />
            
                {/* Admin */}
                <Route
                    path="/admin"
                    element={
                    <RequireAuth allow={['admin']}>
                        <AuthedLayout role="admin">
                        <AdminDashboard />
                        </AuthedLayout>
                    </RequireAuth>
                    }
                />
            
                {/* Perfil (ambos roles) */}
                <Route
                    path="/profile"
                    element={
                    <RequireAuth allow={['admin', 'user']}>
                        <AuthedLayout role={(role as Role)}>
                        <ProfilePage onLogout={onLogout} />
                        </AuthedLayout>
                    </RequireAuth>
                    }
                />
            </Route>
        
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
    )
}