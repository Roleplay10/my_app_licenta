// src/components/Admission/Admission.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import './Admission.css';
import LoginPopup from '../Popup/LoginPopup';
import ApplyPopup from '../Popup/ApplyPopup';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import CreateAxiosInstance from '../../services/axiosService';

interface Department {
  name: string;
  numbers: number;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}

interface IUserData {
  userId: string;
}

const Admission: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appliedDepartments, setAppliedDepartments] = useState<Department[]>([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [refreshData, setRefreshData] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser<IUserData>();
  const axiosInstance = CreateAxiosInstance();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isAuthenticated && auth?.userId) {
          const response = await axiosInstance.get(`http://localhost:5270/api/Profile/${auth.userId}`, {
            headers: { 'accept': 'text/plain' }
          });
          setIsVerified(response.data.isVerified === 'verified');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5270/api/Department', {
          headers: { 'accept': 'text/plain' }
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchAppliedDepartments = async () => {
      try {
        if (isAuthenticated && auth?.userId) {
          const response = await axiosInstance.get(
            `http://localhost:5270/api/Department/GetDepartamentByStudentId/${auth.userId}`
          );
          setAppliedDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching applied departments:', error);
      }
    };

    fetchProfile();
    fetchDepartments();
    fetchAppliedDepartments();
  }, [refreshData]);

  const handleApplyClick = (department: Department) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
    } else {
      setSelectedDepartment(department);
      setShowApplyPopup(true);
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleCloseApplyPopup = () => {
    setShowApplyPopup(false);
    setSelectedDepartment(null);
  };

  const handleConfirmApply = async () => {
    try {
      const response1 = await axiosInstance.get(
        `http://localhost:5270/api/Department/GetDepartmentNameAndStartDate/${selectedDepartment?.name}/${selectedDepartment?.startDate}`
      );

      await axiosInstance.post(
        'http://localhost:5270/api/Request',
        {
          userId: auth?.userId,
          departamentId: response1.data
        }
      );

      setRefreshData(prev => !prev);
    } catch (error) {
      console.error('Error confirming application:', error);
    }

    console.log('Application confirmed for:', selectedDepartment?.name);
    handleCloseApplyPopup();
  };

  const isDepartmentApplied = (department: Department) => {
    return appliedDepartments.some(appliedDepartment => appliedDepartment.name === department.name && appliedDepartment.startDate === department.startDate);
  };

  const openDepartments = departments.filter(dept => dept.isOpen && !isDepartmentApplied(dept));
  const closedDepartments = departments.filter(dept => !dept.isOpen);

  if (!isVerified) {
    return <p>Account not verified yet.</p>;
  }

  return (
    <div className="admission-container">
      <h1>Admission Departments</h1>

      <h2>Applied Departments</h2>
      {appliedDepartments.length > 0 ? (
        <table className="department-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Numbers</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {appliedDepartments.map((department, index) => (
              <tr key={index}>
                <td>{department.name}</td>
                <td>{department.numbers}</td>
                <td>{department.startDate}</td>
                <td>{department.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No applied departments available.</p>
      )}

      <h2>Open Departments</h2>
      {openDepartments.length > 0 ? (
        <table className="department-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Numbers</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {openDepartments.map((department, index) => (
              <tr key={index}>
                <td>{department.name}</td>
                <td>{department.numbers}</td>
                <td>{department.startDate}</td>
                <td>{department.endDate}</td>
                <td>
                  <button
                    className="apply-button"
                    onClick={() => handleApplyClick(department)}
                  >
                    Apply Here
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No open departments available.</p>
      )}

      <h2>Closed Departments</h2>
      {closedDepartments.length > 0 ? (
        <table className="department-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Numbers</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {closedDepartments.map((department, index) => (
              <tr key={index}>
                <td>{department.name}</td>
                <td>{department.numbers}</td>
                <td>{department.startDate}</td>
                <td>{department.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No closed departments available.</p>
      )}

      <LoginPopup show={showLoginPopup} onClose={handleCloseLoginPopup} />
      <ApplyPopup
        show={showApplyPopup}
        departmentName={selectedDepartment?.name || ''}
        startDate={selectedDepartment?.startDate || ''}
        onClose={handleCloseApplyPopup}
        onConfirm={handleConfirmApply}
      />
    </div>
  );
};

export default Admission;
