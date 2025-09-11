import React from 'react';

interface Props {
  onLogout: () => void;
}

const LogoutButton: React.FC<Props> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="auth-secondary-button"
      style={{ position: 'relative' }}
      aria-label="Logout"
      title="Logout"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
