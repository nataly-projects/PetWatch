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

export const fetchUserActivityLog = async (userId, token) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/activity/${userId}` , {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}

export const fetchUserExpensesArray = async (userId, token) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/expenses/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Access forbidden. You do not have permission to access this resource.');

        }
        console.log(error);
        throw error; 
    }
}

export const fetchUserUpcomingEvents = async (userId, token) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/upcoming/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        console.log('response from fetchUserUpcomingEvents: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
        console.log(error);
        throw error; 
    }
}

export const fetchUserNotes = async (userId, token) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/notes/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        console.log('response from fetchUserNotes: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
        console.log(error);
        throw error; 
    }
}

export const fetchUserAccountSettings = async (userId, token) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/settings/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        console.log('response from fetchUserAccountSettings: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
        console.log(error);
        throw error; 
    }
}

export const updateUserSettings = async (userId, updateSettings, token) => {
    try{
        const response = await axios.put(`${BASE_API_URL}/users/settings/${userId}`, {updateSettings}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
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

export const sendContactMessage = async (messageData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/users/contact`, {messageData});
        console.log(response);
        if (response && response.data) {
            return true;
        }  
        return false;
    } catch (error) {
        throw error;
    }
};

export const editUserDetails = async (userId, userData, token) => {
    try {
        console.log('editUserDetails: ', userData);
        const response = await axios.put(`${BASE_API_URL}/users/${userId}`, {userData}, {
            headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
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

export const changePassword = async (changePasswordData, token) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/users/change-password`, { changePasswordData }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response && response.data){
            return true;
        }
        return false;
    } catch (error) {
       throw error;
    }
};

export const fetchUserPetsActivitiesForMonth = async (userId, token, year, month) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/calendar-activities/${userId}/${year}/${month}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response && response.data){
            return response.data
        }
        return null;
    } catch (error) {
        console.log(error);
       throw error;
    }
};

