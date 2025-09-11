import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/pro.css';

interface Props {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

const AuthedLayout: React.FC<Props> = ({ children, role }) => {
  const home = role === 'admin' ? '/admin' : '/user';
  return (
    <div>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-dot" />
            <span>GymCloud</span>
            <span style={{opacity:.65,fontWeight:600}}>• {role === 'admin' ? 'Admin' : 'Usuario'}</span>
          </div>
          <nav className="nav">
            <NavLink to={home} className={({isActive}) => isActive ? 'active' : ''}>Inicio</NavLink>
            <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Perfil</NavLink>
          </nav>
        </div>
      </div>

      <main className="container">{children}</main>
    </div>
  );
};

export default AuthedLayout;
