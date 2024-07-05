// src/components/ProfileList/ProfileList.tsx

import React, { useState, useEffect } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import CreateAxiosInstance from '../../services/axiosService';
import './AdminProfileApproval.css';

interface Profile {
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
  grade: string;
}

interface Document {
  type: string;
  path: string;
}
interface IUserData{
    userId : string;
}

const AdminProfileApproval : React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser<IUserData>();
  const axiosInstance = CreateAxiosInstance();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:5270/api/Profile', {
          headers: { 'accept': 'text/plain' }
        });
        setProfiles(response.data.filter((profile: Profile) => profile.isVerified === 'pending'));
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = async (profile: Profile) => {  
    if (expandedProfile === profile.ci) {
      setExpandedProfile(null);
      setDocuments([]);
    } else {
      setExpandedProfile(profile.ci);
      try {
        const response = await axiosInstance.get(`http://localhost:5270/api/Document/${auth?.userId}/documents`, {
          headers: { 'accept': '*/*' }
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    }
  };

  const handleApproveProfile = async (profile: Profile) => {
    try {
      await axiosInstance.post(`http://localhost:5270/api/Profile/approve/${profile.name}/${profile.surname}`);
      //setProfiles(prevProfiles => prevProfiles.filter(p => p.ci !== profile.ci));
      setExpandedProfile(null);
      setDocuments([]);
    } catch (error) {
      console.error('Error approving profile:', error);
    }
  };
  const getRelativePath = (absolutePath: string) => {
    const basePath = "/home/alvin/Documents/backend-storage/";
    return absolutePath.replace(basePath, '');
    };

  return (
    <div className="profile-list-container">
      <h1>Pending Profiles</h1>
      {profiles.length > 0 ? (
        <table className="profile-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td onClick={() => handleProfileClick(profile)}>{profile.name}</td>
                  <td onClick={() => handleProfileClick(profile)}>{profile.surname}</td>
                  <td>
                    <button onClick={() => handleApproveProfile(profile)}>Approve</button>
                  </td>
                </tr>
                {expandedProfile === profile.ci && (
                  <tr>
                    <td colSpan={3}>
                      <div className="profile-details">
                        <p><strong>Phone:</strong> {profile.phone}</p>
                        <p><strong>Address:</strong> {profile.address}</p>
                        <p><strong>City:</strong> {profile.city}</p>
                        <p><strong>County:</strong> {profile.county}</p>
                        <p><strong>CI:</strong> {profile.ci}</p>
                        <p><strong>Mother's Name:</strong> {profile.motherName}</p>
                        <p><strong>Father's Name:</strong> {profile.fatherName}</p>
                        <p><strong>Birth Date:</strong> {profile.birthDate}</p>
                        <p><strong>Grade:</strong> {profile.grade}</p>
                        <h3>Documents</h3>
                        <ul>
                          {documents.map((doc, docIndex) => (
                            <li key={docIndex}>
                              <a
                                href={`http://localhost:5270/documents${getRelativePath(doc.path)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="document-link"
                              >
                                {doc.type}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending profiles available.</p>
      )}
    </div>
  );
};

export default AdminProfileApproval;
