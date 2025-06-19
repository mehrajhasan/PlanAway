import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from '../hooks/requireAuth';
import LoginModal from './loginModal';

const RegisterModal = ({ onSuccess, onClose, switchToLogin, onSkip }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e?.preventDefault();
        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: new Date(),
        });

        requireAuth(user); // resolve pending auth
        onClose(); // close modal
        } catch (err) {
        console.error(err.message);
        if (err.message.includes('auth/email-already-in-use')) {
            setError('Email already in use');
        } else if (err.message.includes('auth/invalid-email')) {
            setError('Please enter a valid email address');
        } else if (err.message.includes('auth/weak-password')) {
            setError('Password should be at least 6 characters');
        } else {
            setError('Something went wrong. Please try again');
        }
        }
    };

    const handleCancel = () => {
        requireAuth(null); // cancelled
        onClose();
    };



  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <h2 className="auth-text">Start your adventure today!</h2>
        <form onSubmit={handleSignUp} className="login-form">
          <input
            type="text"
            placeholder="Email"
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
          <button type="submit" className="loginBtn" id="ModalBtn">Sign up</button>
        </form>
        {/* <button className="cancelBtn" onClick={handleCancel}>Cancel</button> */}
        <div className="modalText">
            <h5>
                Already have an account?{' '}
                <span onClick={switchToLogin} style={{ color: '#007bff', cursor: 'pointer' }}>
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

export default RegisterModal;
