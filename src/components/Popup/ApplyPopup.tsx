// src/components/Popup/ApplyPopup.tsx

import React from 'react';
import './Popup.css';

interface ApplyPopupProps {
  show: boolean;
  departmentName: string;
  startDate: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ApplyPopup: React.FC<ApplyPopupProps> = ({ show, departmentName, startDate, onClose, onConfirm }) => {

  if (!show) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Apply to Department</h2>
        <p>Department: {departmentName}</p>
        <button className="apply-button" onClick={onConfirm}>Confirm Apply</button>
        <button className="close-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ApplyPopup;
