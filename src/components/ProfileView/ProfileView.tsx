import React, { useEffect, useState } from 'react';
import CreateAxiosInstance from '../../services/axiosService';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import './ProfileView.css';

interface IUserData {
    userId: string;
}

interface ProfileData {
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

interface DocumentData {
    type: string;
    path: string;
}

const ProfileView: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileData | null>(null);
    const authUser = useAuthUser<IUserData>();
    const axiosInstance = CreateAxiosInstance();

    useEffect(() => {
        const userId = authUser?.userId;
        if (userId) {
            fetchProfile(userId);
            fetchDocuments(userId);
        }
    }, [authUser]);

    const fetchProfile = async (userId: string) => {
        try {
            const response = await axiosInstance.get<ProfileData>(`http://localhost:5270/api/Profile/${userId}`);
            setProfile(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchDocuments = async (userId: string) => {
        try {
            const response = await axiosInstance.get<DocumentData[]>(`http://localhost:5270/api/Document/${userId}/documents`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSaveClick = async () => {
        const userId = authUser?.userId;
        if (userId && formData) {
            try {
                await axiosInstance.post(`http://localhost:5270/api/Profile/${userId}`, formData);
                setProfile(formData);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const getRelativePath = (absolutePath: string) => {
        const basePath = "/home/alvin/Documents/backend-storage/";
        return absolutePath.replace(basePath, '');
    };

    return (
        <div className="profile-view-container">
            <h1>Profile Information</h1>
            {profile && formData && (
                <div className="profile-details">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                            />
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                placeholder="Surname"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address"
                            />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                            />
                            <input
                                type="text"
                                name="county"
                                value={formData.county}
                                onChange={handleInputChange}
                                placeholder="County"
                            />
                            <input
                                type="text"
                                name="ci"
                                value={formData.ci}
                                onChange={handleInputChange}
                                placeholder="CI"
                            />
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleInputChange}
                                placeholder="Mother's Name"
                            />
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                                placeholder="Father's Name"
                            />
                            <input
                                type="text"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                placeholder="Birth Date"
                            />
                            <input
                                type="text"
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                placeholder="Grade"
                            />
                            <p><strong>Is Verified:</strong> {profile.isVerified}</p>
                            <button onClick={handleSaveClick} className="save-button">Save</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Surname:</strong> {profile.surname}</p>
                            <p><strong>Phone:</strong> {profile.phone}</p>
                            <p><strong>Address:</strong> {profile.address}</p>
                            <p><strong>City:</strong> {profile.city}</p>
                            <p><strong>County:</strong> {profile.county}</p>
                            <p><strong>CI:</strong> {profile.ci}</p>
                            <p><strong>Mother's Name:</strong> {profile.motherName}</p>
                            <p><strong>Father's Name:</strong> {profile.fatherName}</p>
                            <p><strong>Birth Date:</strong> {profile.birthDate}</p>
                            <p><strong>Is Verified:</strong> {profile.isVerified}</p>
                            <p><strong>Grade:</strong> {profile.grade}</p>
                            <button onClick={handleEditClick} className="edit-button">Edit</button>
                        </>
                    )}
                </div>
            )}
            <h2>Uploaded Documents</h2>
            <div className="document-list">
                {documents.map((doc, index) => (
                    <div key={index} className="document-item">
                        <a href={`http://localhost:5270/documents/${getRelativePath(doc.path)}`} target="_blank" rel="noopener noreferrer" className="document-link">View Document</a>
                        <p className="document-type"><strong>Type:</strong> {doc.type}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileView;
