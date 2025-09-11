import React, { useState } from 'react';
import './AuthForm.css';

type Role = 'admin' | 'user';

interface SignupResponse {
  role: Role;
  token: string;
  message?: string;
}

interface SignupProps {
  onSignup: (role: Role, token: string) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data: SignupResponse = await response.json();
      if (response.ok) {
        onSignup(data.role, data.token);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-title">Create Your GymCloud Account</div>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div style={{ margin: '12px 0', textAlign: 'center' }}>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />{' '}
            Gym User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />{' '}
            Gym Admin
          </label>
        </div>
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <button
          type="button"
          className="auth-secondary-button"
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;