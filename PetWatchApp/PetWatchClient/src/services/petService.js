import axios from 'axios';


const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;


export const getPetById = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/${petId}`);
      console.log('response from getPetById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetsByUserId = async (userId, token) => {

  try {
    const response = await axios.get(`${BASE_API_URL}/pets/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('response from getPetsByUserId: ', response);
    if (response && response.data) {
        return response.data;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

export const getPetVaccinationRecord = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/vaccinationRecord/${petId}`);
      console.log('response from getPetVaccinationRecord: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetRoutineCare = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/routineCare/${petId}`);
      console.log('response from getPetRoutineCare: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetNote = async (petId, token) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/note/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from getPetNote: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetExpense = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/expense/${petId}`);
      console.log('response from getPetExpense: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetAllergies = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/allergy/${petId}`);
      console.log('response from getPetAllergies: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetMedications = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/medication/${petId}`);
      console.log('response from getPetMedications: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetVetVisits = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/vet-visit/${petId}`);
      console.log('response from getPetVetVisits: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetWeightTracker = async (petId, token) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/weight-track/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from getPetWeightTracker: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};


export const getPetActivityLog = async (petId, token) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/activity/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from getPetActivityLog: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetUpcomingEvents = async (petId, token) => {
  try{ 
    const response = await axios.get(`${BASE_API_URL}/pets/upcoming/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('response from getPetUpcomingEvents: ', response);
    if (response && response.data) {
        return response.data;
    }
    return null;
  } catch (error) {
    throw error; 
  }
}

export const getPetExpensesArrays = async (petId, token) => {
  try{ 
    const response = await axios.get(`${BASE_API_URL}/pets/expenses-array/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('response from getPetExpensesArrays: ', response);
    if (response && response.data) {
        return response.data;
    }
    return null;
  } catch (error) {
    throw error; 
  }
}

  export const deletePet = async (petId) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/pets/${petId}`);
        console.log('response from deletePet: ', response);
        if (response && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
      throw error; 
    }
  };

  export const updatePetById = async (pet) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/pets/${pet._id}`, {petData: pet});
      console.log('response from updatePetById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPet = async (pet, token) => {
    console.log('add pet service: ', pet);
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/${pet.owner}`, {petData: pet}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  export const addPetVaccineRecord = async (petId, vaccinationRecord, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/vaccinationRecord/${petId}`, vaccinationRecord, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetVaccineRecord: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetRoutineCare = async (petId, routineCare, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/routineCare/${petId}`, routineCare, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetRoutineCare: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetNote = async (petId, noteData, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/note/${petId}`, {noteData}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetNote: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetExpense = async (petId, expense, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/expense/${petId}`, expense, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetExpense: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetAllergy = async (petId, allergyData, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/allergy/${petId}`, allergyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetAllergy: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetMedication = async (petId, medicationData, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/medication/${petId}`, medicationData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetMedication: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetVetVisit = async (petId, vetVisitData, token) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/vet-visit/${petId}`, vetVisitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from addPetVetVisit: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetActivity = async (petId, selectedActivity, data, token) => {
    switch (selectedActivity.name) {
      case 'VACCINE_RECORD':
          return addPetVaccineRecord(petId, data, token);
      case 'ROUTINE_CARE':
          return addPetRoutineCare(petId, data, token);
      case 'EXPENSE':
          return addPetExpense(petId, data, token);
      case 'NOTE':
          return addPetNote(petId, data, token);
      case 'ALLERGY':
          return addPetAllergy(petId, data, token);
      case 'MEDICATION':
          return addPetMedication(petId, data, token);
      case 'VET_VISIT':
          return addPetVetVisit(petId, data, token);
      // case 'OTHER':
      //     return addOtherActivity(petId, data, token);
      default:
          throw new Error('Invalid activity type');
  }
  };

  export const updateNoteById = async (updatedNote, token) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/pets/note/${updatedNote._id}`, {noteData: updatedNote}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from updateNoteById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const deleteNoteById = async (noteId, token) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/pets/note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response from deleteNoteById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };











