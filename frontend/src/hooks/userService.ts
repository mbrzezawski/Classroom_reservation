import { API_URL } from '../api';
import axios from 'axios';


export const createUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}) => {
    return axios.post(API_URL + "/users", {
        ...userData,
        enabled: true,
    });
};