import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../../contexts/UserAuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState(''); // Use email for Firebase Auth
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loadingAuth } = useAuth(); // Get loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password); // Await login
    if (result.success) {
      navigate('/admin/products'); // Redirect to admin panel on successful login
    } else {
      setError(result.message);
    }
  };

  if (loadingAuth) {
    return <div className="auth-container"><h2 className="section-title">Loading...</h2></div>;
  }

  return (
    <div className="auth-container">
      <h2 className="section-title">Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="form-message error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label> {/* Changed to email */}
          <input
            type="email" // Changed to email type
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username" // For browser autofill
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // For browser autofill
          />
        </div>
        <button type="submit" className="btn primary-btn">Login</button>
      </form>
      <p className="auth-footer-text">
        Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
      </p>
    </div>
  );
};

export default Login;