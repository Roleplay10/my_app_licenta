import React, { useState } from 'react';
import CreateAxiosInstance from '../../services/axiosService';
import './DocumentUpload.css';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';

interface IUserData {
    userId: string;
}

const DocumentUpload: React.FC = () => {
    const [files, setFiles] = useState<{
        ci: File | null,
        bachelorsDiploma: File | null,
        mothersCi: File | null,
        fathersCi: File | null
    }>({
        ci: null,
        bachelorsDiploma: null,
        mothersCi: null,
        fathersCi: null
    });

    const authUser = useAuthUser<IUserData>();
    const navigate = useNavigate();
    const axiosInstance = CreateAxiosInstance();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList.length > 0) {
            setFiles(prevFiles => ({
                ...prevFiles,
                [name]: fileList[0]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = authUser?.userId;
        const formData = new FormData();

        if (files.ci) {
            formData.append('documents', files.ci);
            formData.append('types', 'ci');
        }
        if (files.bachelorsDiploma) {
            formData.append('documents', files.bachelorsDiploma);
            formData.append('types', 'bachelorsDiploma');
        }
        if (files.mothersCi) {
            formData.append('documents', files.mothersCi);
            formData.append('types', 'mothersCi');
        }
        if (files.fathersCi) {
            formData.append('documents', files.fathersCi);
            formData.append('types', 'fathersCi');
        }

        try {
            const response = await axiosInstance.post(
                `http://localhost:5270/api/Document/${userId}/multiple`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('Documents uploaded successfully:', response.data);
            await axiosInstance.post(`http://localhost:5270/api/Profile/${userId}/toPending`)
            navigate('/profile-pending');
        } catch (error) {
            console.error('Error uploading documents:', error);
        }
    };

    return (
        <div className="document-upload-container">
            <h1>Upload Documents</h1>
            <form className="document-upload-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ci">CI</label>
                    <input type="file" id="ci" name="ci" accept="image/*,.pdf" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="bachelorsDiploma">Bachelor's Diploma</label>
                    <input type="file" id="bachelorsDiploma" name="bachelorsDiploma" accept="image/*,.pdf" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="mothersCi">Mother's CI</label>
                    <input type="file" id="mothersCi" name="mothersCi" accept="image/*,.pdf" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="fathersCi">Father's CI</label>
                    <input type="file" id="fathersCi" name="fathersCi" accept="image/*,.pdf" onChange={handleFileChange} />
                </div>
                <button type="submit" className="submit-button">Upload</button>
            </form>
        </div>
    );
};

export default DocumentUpload;
