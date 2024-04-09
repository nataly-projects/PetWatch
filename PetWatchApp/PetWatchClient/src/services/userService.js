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
        const response = await axios.post(`${BASE_API_URL}/users/register`, { fullName, email, phone, password });
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
        const response = await axios.get(`${BASE_API_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserActivityLog = async (userId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/activity/${userId}`);
        console.log('response from fetchUserActivityLog: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
      throw error; 
    }
}

export const fetchUserExpensesArray = async (userId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/expenses/${userId}`);
        console.log('response from fetchUserExpensesArray: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
      throw error; 
    }
}

export const fetchUserUpcomingEvents = async (userId) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/upcoming/${userId}`);
        console.log('response from fetchUserUpcomingEvents: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
      throw error; 
    }
}

export const fetchUserNotes = async (userId) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/notes/${userId}`);
        console.log('response from fetchUserNotes: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
      throw error; 
    }
}




export const resetPasswordRequest = async (email) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/users/reset-password-request`, { email });
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
        const response = await axios.post(`${BASE_API_URL}/users/reset-password-code`, { email, code });
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
        const response = await axios.post(`${BASE_API_URL}/users/reset-password`, { email, newPassword });
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
        const response = await axios.post(`${BASE_API_URL}/users/contact`, {userId: (user ? user._Id : null), fullName, email, message });
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
        const response = await axios.put(`${BASE_API_URL}/users/${userId}`, formData, {
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

