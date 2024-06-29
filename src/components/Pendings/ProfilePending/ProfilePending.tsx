import React from 'react';
import './ProfilePending.css';
import { useNavigate } from 'react-router-dom';

const AccountVerificationPending: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="verification-pending-container">
      <div className="verification-pending-dialog">
        <h2>Account Verification Pending</h2>
        <p>Your account is currently under verification. Please be patient as we process your request.</p>
        <button className="continue-button" onClick={handleContinue}>
          Continue using website without account privileges
        </button>
      </div>
    </div>
  );
};

export default AccountVerificationPending;