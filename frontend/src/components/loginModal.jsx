import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import requireAuth from '../hooks/requireAuth';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import RegisterModal from './registerModal';

const LoginModal = ({ onSuccess, onClose, switchToSignup, pendingTrip, onSkip }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e?.preventDefault();

        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          requireAuth(res.user);
          setError('');
          onClose(); // close modal
        } catch (err) {
          console.error(err.message);

          if (err.message.includes("auth/invalid-credential")) {
              setError("Incorrect email or password");
          } else if (err.message.includes("auth/invalid-email")) {
              setError("Please enter a valid email address");
          } else if (err.message.includes("auth/missing-password")) {
              setError("Please enter your password");
          } else {
              setError("Something went wrong. Please try again");
          }
        }
    };

    const handleCancel = () => {
        requireAuth(null); 
        onClose();
    };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <h2 className="auth-text">Welcome back, explorer!</h2>

        <form onSubmit={handleLogin} className="login-form" autoComplete="off">
          <input
            type="text"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="errorMessage">{error}</div>}

          <button type="submit" className="loginBtn" id="ModalBtn">Log In</button>
        </form>

        {/* <button className="cancelBtn" onClick={handleCancel}>Cancel</button> */}
        <div className="modalText">
            <h5>
                Don't have an account?{' '}
                <span onClick={switchToSignup} style={{ color: '#007bff', cursor: 'pointer' }}>
                    Sign Up
                </span>
            </h5>
        </div>
        <div className="skip-btn">
          <button className="skip" onClick={onSkip}>
              Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
