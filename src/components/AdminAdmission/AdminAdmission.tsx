import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAdmission.css';
import CreateAxiosInstance from '../../services/axiosService';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

interface Department {
  name: string;
  numbers: number;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}

interface Student {
  name: string;
  surname: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  ci: string;
  motherName: string;
  fatherName: string;
  birthDate: string;
  isVerified: string;
  grade: string | null;
}

interface IUserData {
  userId: string;
}

const AdminAdmission: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [studentData, setStudentData] = useState<{ [key: string]: Student[] }>({});
  const axiosInstance = CreateAxiosInstance();
  const auth = useAuthUser<IUserData>();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5270/api/Department', {
          headers: { accept: 'text/plain' }
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentDataTemp: { [key: string]: Student[] } = {};
        for (const department of departments) {
          if (department.isOpen) {
            const response = await axiosInstance.get(`http://localhost:5270/api/Profile/${encodeURIComponent(department.name)}/${department.startDate}`, {
              headers: {
                'accept': 'text/plain'
              }
            });
            studentDataTemp[department.name] = response.data;
          }
        }
        setStudentData(studentDataTemp);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [departments]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);

    if (value) {
      const filtered = departments.filter(dept =>
        dept.isOpen && studentData[dept.name]?.some(student =>
          student.name.toLowerCase().includes(value.toLowerCase()) || student.surname.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments.filter(dept => dept.isOpen));
    }
  };

  const openDepartments = filter ? filteredDepartments : departments.filter(dept => dept.isOpen);
  const closedDepartments = departments.filter(dept => !dept.isOpen);

  return (
    <div className="admin-admission-container">
      <h1>Admin Admission Page</h1>

      <h2>Open Departments</h2>
      <input
        type="text"
        placeholder="Filter by student name"
        value={filter}
        onChange={handleFilterChange}
        className="filter-input"
      />
      {openDepartments.length > 0 ? (
        openDepartments.map((department, index) => (
          <div key={index} className="department-section">
            <h3>{department.name}</h3>
            {studentData[department.name]?.length > 0 ? (
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData[department.name]
                    .filter(student =>
                      student.name.toLowerCase().includes(filter.toLowerCase()) ||
                      student.surname.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map((student, idx) => (
                      <tr key={idx}>
                        <td>{student.name}</td>
                        <td>{student.surname}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No students have applied to this department.</p>
            )}
          </div>
        ))
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
    </div>
  );
};

export default AdminAdmission;
