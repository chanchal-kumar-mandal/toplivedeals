import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../contexts/UserAuthContext';

const Register = () => {
  const [email, setEmail] = useState(''); // Use email for Firebase Auth
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { register, loadingAuth } = useAuth(); // Get loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      setIsError(true);
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }
    if (password.length < 6) { // Firebase default minimum password length is 6
      setMessage('Password must be at least 6 characters long.');
      setIsError(true);
      return;
    }

    const result = await register(email, password); // Await register
    if (result.success) {
      setMessage(result.message);
      setIsError(false);
      // Automatically logged in after registration by Firebase, redirect to admin
      setTimeout(() => navigate('/admin/products'), 1500);
    } else {
      setMessage(result.message);
      setIsError(true);
    }
  };

  if (loadingAuth) {
    return <div className="auth-container"><h2 className="section-title">Loading...</h2></div>;
  }

  return (
    <div className="auth-container">
      <h2 className="section-title">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {message && <div className={`form-message ${isError ? 'error' : 'success'}`}>{message}</div>}
        <div className="form-group">
          <label htmlFor="reg-email">Email:</label> {/* Changed to email */}
          <input
            type="email" // Changed to email type
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Password:</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn primary-btn">Register</button>
      </form>
      <p className="auth-footer-text">
        Already have an account? <Link to="/login" className="auth-link">Login here</Link>
      </p>
    </div>
  );
};

export default Register;