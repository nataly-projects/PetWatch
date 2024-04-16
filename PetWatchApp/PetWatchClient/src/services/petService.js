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

export const getPetsByUserId = async (userId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/user/${userId}`);
      console.log('response from getPetsByUserId: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
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

export const getPetNote = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/note/${petId}`);
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

export const getPetWeightTracker = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/weight-track/${petId}`);
      console.log('response from getPetWeightTracker: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};


export const getPetActivityLog = async (petId) => {
  try {
      const response = await axios.get(`${BASE_API_URL}/pets/activity/${petId}`);
      console.log('response from getPetActivityLog: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
  } catch (error) {
    throw error; 
  }
};

export const getPetUpcomingEvents = async (petId) => {
  try{ 
    const response = await axios.get(`${BASE_API_URL}/pets/upcoming/${petId}`);
    console.log('response from getPetUpcomingEvents: ', response);
    if (response && response.data) {
        return response.data;
    }
    return null;
  } catch (error) {
    throw error; 
  }
}

export const getPetExpensesArrays = async (petId) => {
  try{ 
    const response = await axios.get(`${BASE_API_URL}/pets/expenses-array/${petId}`);
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

  export const addPet = async (pet) => {
    console.log('add pet service: ', pet);
    // try {
    //   const response = await axios.post(`${BASE_API_URL}/pets/${pet.owner}`, pet, {
    //     headers: {
    //     'Content-Type': 'multipart/form-data',
    //     },
    // });
    //   console.log('response from addPet: ', response);
    //   if (response && response.data) {
    //       return response.data;
    //   }
    //   return null;
    // } catch (error) {
    //   throw error; 
    // }
  };

  export const addPetVaccineRecord = async (petId, vaccinationRecord) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/vaccinationRecord/${petId}`, vaccinationRecord);
      console.log('response from addPetVaccineRecord: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetRoutineCare = async (petId, routineCare) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/routineCare/${petId}`, routineCare);
      console.log('response from addPetRoutineCare: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetNote = async (petId, note) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/note/${petId}`, note);
      console.log('response from addPetNote: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetExpense = async (petId, expense) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/expense/${petId}`, expense);
      console.log('response from addPetExpense: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetAllergy = async (petId, allergyData) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/allergy/${petId}`, allergyData);
      console.log('response from addPetAllergy: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetMedication = async (petId, medicationData) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/medication/${petId}`, medicationData);
      console.log('response from addPetMedication: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetVetVisit = async (petId, vetVisitData) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/pets/vet-visit/${petId}`, vetVisitData);
      console.log('response from addPetVetVisit: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const addPetActivity = async (petId, selectedActivity, data) => {
    switch (selectedActivity.name) {
      case 'VACCINE_RECORD':
          return addPetVaccineRecord(petId, data);
      case 'ROUTINE_CARE':
          return addPetRoutineCare(petId, data);
      case 'EXPENSE':
          return addPetExpense(petId, data);
      case 'NOTE':
          return addPetNote(petId, data);
      case 'ALLERGY':
          return addPetAllergy(petId, data);
      case 'MEDICATION':
          return addPetMedication(petId, data);
      case 'VET_VISIT':
          return addPetVetVisit(petId, data);
      // case 'OTHER':
      //     return addOtherActivity(petId, data);
      default:
          throw new Error('Invalid activity type');
  }
  };

  export const updateNoteById = async (note) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/pets/note/${note._id}`, note);
      console.log('response from updateNoteById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };

  export const deleteNoteById = async (note) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/pets/note/${note._id}`);
      console.log('response from deleteNoteById: ', response);
      if (response && response.data) {
          return response.data;
      }
      return null;
    } catch (error) {
      throw error; 
    }
  };











