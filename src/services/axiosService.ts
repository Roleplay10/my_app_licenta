import axios from "axios";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const CreateAxiosInstance = () => {
    const isAuthenticated = useIsAuthenticated();
    const axiosInstance = axios.create();
    const authHeader = useAuthHeader(); // This returns the string directly


    // console.log('IsAuthenticated:', isAuthenticated);
    // console.log('AuthHeader:', authHeader);

    axiosInstance.interceptors.request.use((config) => {
        if (isAuthenticated) { // Directly use the boolean value
            if (authHeader) {
                config.headers.Authorization = authHeader // Directly use the authHeader string
            } else {
                // console.log('No auth header found');
            }
        } else {
            // console.log('User is not authenticated');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });
    
    return axiosInstance;
};

export default CreateAxiosInstance;
