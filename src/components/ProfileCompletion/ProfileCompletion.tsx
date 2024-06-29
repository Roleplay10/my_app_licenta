import React, { useState } from 'react';
import CreateAxiosInstance from '../../services/axiosService';
import './ProfileCompletion.css';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';

interface IUserData {
    userId: string;
}

const ProfileCompletion: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthDate: '',
        phone: '',
        city: '',
        county: '',
        address: '',
        ci: '',
        fatherName: '',
        motherName: '',
        grade: ''
    });

    const authUser = useAuthUser<IUserData>();
    const navigate = useNavigate();
    const axiosInstance = CreateAxiosInstance();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = authUser?.userId;
        try {
            const response = await axiosInstance.post(
                `http://localhost:5270/api/Profile/${userId}`,
                {
                    ...formData,
                    birthDate: formData.birthDate.toString()
                }
            );
            console.log('Profile updated successfully:', response.data);
            navigate('/profile-complition/additional');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-completion-container">
            <h1>Complete Your Profile</h1>
            <form className="profile-completion-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="surname">Surname</label>
                    <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="birthDate">Birthdate</label>
                    <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="county">County</label>
                    <input type="text" id="county" name="county" value={formData.county} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="ci">CI</label>
                    <input type="text" id="ci" name="ci" value={formData.ci} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="fatherName">Father's Name</label>
                    <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="motherName">Mother's Name</label>
                    <input type="text" id="motherName" name="motherName" value={formData.motherName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="grade">Bachelor Grade</label>
                    <input type="text" id="grade" name="grade" value={formData.grade} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default ProfileCompletion;
