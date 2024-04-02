import axios from 'axios';


export const adoptPet = async (pet, adoptMessage, userId) => {
    try {
      console.log('onAdopt: ', adoptMessage);
      const response = await axios.post('/api/requests/', {
        message: adoptMessage,
        petName: pet.name,
        petId: pet._id,
        userReqId: userId,
        ownerId: pet.owner
      });
      if (response && response.data) {
        return response;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const deletePet = async (petId) => {
    try {
        const response = await axios.delete(`/api/pets/${petId}`);
        console.log('response from deletePet: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
      throw error; 
    }
  };

  export const editPet = async (pet) => {
    try {
      const response = await axios.put(`/api/pets/${pet._id}`, {petData: pet});
      console.log('response from editPet: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPet = async (pet) => {
    try {
      const response = await axios.post(`/api/pets/`, pet, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
      console.log('response from addPet: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const getUserAddedPets = async (userId) => {
    try {
        const response = await axios.get(`/api/pets/user/${userId}`);
        console.log('response from userAddedPets: ', response);
        if (response && response.data) {
            return response.data.pets;
        }
        return [];
    } catch (error) {
        console.error('Error fetching pets data:', error);
      throw error; 
    }
  };

  export const getUserAdoptedPets = async (userId) => {
    try {
        const response = await axios.get(`/api/requests/adopted-pets/${userId}`);
        console.log('response from userAoptedPets: ', response);
        let adoptArray = [];
        if (response && response.data && response.data.length > 0) {
            adoptArray = response.data
            .filter(req => req.status === 'ACCEPT')
            .map(req => req.petId);
            console.log('adoptArray: ', adoptArray);
        }
        return adoptArray;
    } catch (error) {
      throw error; 
    }
  };

  export const fetchCategoryPets = async (categoryName, userId) => {
    try {
        const response = await axios.get(`/api/pets/${categoryName}?userId=${userId}`); 
        console.log('response from fetchCategoryPets: ', response);
        if (response && response.data.pets) {
            return response.data.pets;
        }
        return null;
    } catch (error) {
      throw error; 
    }
  };

  export const getPetsByFilters = async (filters) => {
    try {
      const response = await axios.get('/api/pets', {
        params: {
          filters: JSON.stringify(filters)
        }
      });
      console.log('filters response : ', response);
      if (response && response.data && response.data.pets) {
        return response.data.pets;
      }
      return [];
    } catch(error) {
      throw error;
    }
  };



