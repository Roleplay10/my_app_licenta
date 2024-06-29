// src/components/Popup/LoginPopup.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Popup.css';

interface LoginPopupProps {
  show: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Login Required</h2>
        <p>You need to log in first.</p>
        <button className="close-button" onClick={handleLogin}>Go to Login</button>
      </div>
    </div>
  );
};

export default LoginPopup;
