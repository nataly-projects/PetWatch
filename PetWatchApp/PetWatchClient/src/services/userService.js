import axios from 'axios';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/login`, {email, password});
      if (response && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw error;
    }
};

export const signupUser = async (fullName, email, phone, password) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/users/register`, { fullName, email, phone, password });
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

export const fetchUserDashboardData = async (userId, token) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/users/dashboard/${userId}` , {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
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
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
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
        if (response && response.data) {
            return response.data;
        }
        return null;

    } catch (error) {
        throw error; 
    }
}

export const fetchUserTasks = async (userId, token) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/tasks/${userId}`, {
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

export const addUserTask = async (userId, newTask, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/tasks/${userId}`, {newTask}, {
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
};

export const updateUserTask = async (userId, updateTask, token) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/users/tasks/${userId}/${updateTask._id}`, {updateTask}, {
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
};

export const deleteUserTask = async (userId, taskId, token) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/users/tasks/${userId}/${taskId}`, {
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
};

export const fetchUserAccountSettings = async (userId, token) => {
    try{
        const response = await axios.get(`${BASE_API_URL}/users/settings/${userId}`, {
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
        const response = await axios.put(`${BASE_API_URL}/users/${userId}`, {userData}, {
            headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
            },
        });
        if (response && response.data.updatedUser) {
            return response.data.updatedUser;
        }
        return null;
    } catch (error) {
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
       throw error;
    }
};

