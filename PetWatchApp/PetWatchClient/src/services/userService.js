import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export const loginUser = async (email, password) => {
    console.log('user service - loginUser');
    try {
      const response = await axios.post(`${BASE_API_URL}/users/login`, {email, password});
      console.log(response);

      if (response && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw error;
    }
};

export const signupUser = async (fullName, email, phone, password) => {
    console.log('user service - signupUser');
    try {
        const response = await axios.post('/api/users/register', { fullName, email, phone, password });
        console.log(response);

        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
      throw error;
    }
};
  
export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const resetPasswordRequest = async (email) => {
    try {
        const response = await axios.post('/api/users/reset-password-request', { email });
        if (response && response.data){
            return true;
        }
        return false;
    } catch (error) {
       throw error;
    }
};

export const validateResetPasswordCode = async (email, code) => {
    try {
        const response = await axios.post('/api/users/reset-password-code', { email, code });
        if (response && response.data) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const response = await axios.post('/api/users/reset-password', { email, newPassword });
        if (response && response.data){
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};

export const sendContactMessage = async (user, fullName, email, message) => {
    console.log('user service - sendContactMessage ', fullName);
    try {
        const response = await axios.post('/api/users/contact', {userId: (user ? user._Id : null), fullName, email, message });
        console.log(response);
        if (response && response.data) {
            return true;
        }  
        return false;
    } catch (error) {
        throw error;
    }
};

export const editUserDetails = async (userId, formData) => {
    try {
        const response = await axios.put(`/api/users/${userId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        console.log('response: ', response);
        if (response && response.data.updatedUser) {
            return response.data.updatedUser;
        }
        return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

