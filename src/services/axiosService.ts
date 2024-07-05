import axios from "axios";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const CreateAxiosInstance = () => {
    const isAuthenticated = useIsAuthenticated();
    const axiosInstance = axios.create();
    const authHeader = useAuthHeader(); 

    axiosInstance.interceptors.request.use((config) => {
        if (isAuthenticated) { 
            if (authHeader) {
                config.headers.Authorization = authHeader 
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });
    
    return axiosInstance;
};

export default CreateAxiosInstance;
