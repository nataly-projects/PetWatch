import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Grid, Typography, Button, IconButton, Avatar, Box, Card, CircularProgress } from '@mui/material';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays, 
  getPetWeightTracker, addPetActivity, deleteAllergyById, deleteMedicalConditionById, deleteMedicationById, deletePet,
updateMedicalConditionById, updateAllergyById, updateMedicationById, updatePetById } from '../services/petService';
import WeightTracker from './WeightTracker';
import NoteSection from './NoteSection';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import AddActivityPopup from './AddActivityPopup';
import EmergencyContactsSection from './EmergencyContactsSection';
import MealPlannerSection from './MealPlannerSection';
import HealthInformationSection from './HealthInformationSection';
import GallerySection from './gallerySection';
import { formatDate } from '../utils/utils';
import { ActivityType } from '../utils/utils';
import petDefaultImage from '../images/paw.png';
import EditPetDetailsModal from './EditPetDetailsModal';
import EditItemModal from './EditItemModal';
import { FormFieldsType } from '../utils/utils';

const PetProfile = () => {
  const location = useLocation();
  const { pet } = location.state;
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
console.log(pet);
  const [petDetails, setPetDetails] = useState(pet);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [activityRecords, setActivityRecords] = useState({
    activityLogs: [],
    upcomingEvents: [],
    expensesRecord: [],
    allergies: [],
    medications: [],
    medicalConditions: [],
    weights: [],
    notes: []
  });

  const [editHealthModalVisible, setEditHealthModalVisible] = useState(false); 
  const [itemToEdit, setItemToEdit] = useState(null); 
  const [healthEditType, setHealthEditType] = useState(null); 
  const [editBasicDetailsModalVisible, setEditBasicDetailsModalVisible] = useState(false); 


  const fetchData = async () => {
    try {
        const logs = await getPetActivityLog(petDetails._id, token);
        const events = await getPetUpcomingEvents(petDetails._id, token);
        const petExpenses = await getPetExpensesArrays(petDetails._id, token);
        const petWeights = await getPetWeightTracker(petDetails._id, token);
        setActivityRecords((prevRecords) => ({
          ...prevRecords,
          activityLogs: logs,
          upcomingEvents: events,
          expensesRecord: petExpenses,
          allergies: pet.allergies,
          medications: pet.medications,
          medicalConditions: pet.medicalConditions,
          weights: petWeights,
          notes: pet.notes
        }));
        setLoading(false);
    } catch (error) {
      handleError(error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petDetails) {
        fetchData();
    }
  }, [petDetails]);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      console.error('UNAUTHORIZED_ERROR');
      navigate('/login');
    } else {
      console.error('Error fetching data:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <Typography>Failed to fetch pet data. Please try again later.</Typography>
        <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }

  const handleAddActivityClick = () => {
    setPopupVisible(true);
  };

  const handleCancel = () => {
    setPopupVisible(false);
  }

  const handleActivitySelect = async (selectedActivity, data) => {
      // Handle the selected activity here
      setPopupVisible(false);
      try{
        await addPetActivity(petDetails._id, selectedActivity, data, token);
        toast.success('Activity added successfully!');
        fetchData();
      } catch (error) {
        handleError(error);
        toast.error('Failed to adding activity. Please try again.');
    }
  };

  const handleHealthEdit = (item, type) => {
    console.log('health type: ', type);
    setItemToEdit(item);
    setHealthEditType(type);
    setEditHealthModalVisible(true);
  };

  const handleEditSubmit = async (updatedItem, type) => {
    try {
      // Dynamically select the update function based on type
      const updateFunctions = {
        [ActivityType.MEDICAL_CONDITION]: updateMedicalConditionById,
        [ActivityType.MEDICATION]: updateMedicationById,
        [ActivityType.ALLERGY]: updateAllergyById,
        pet: updatePetById, // handle pet update separately if needed
      };
  
      // Call the respective update function
      if (updateFunctions[type]) {
        await updateFunctions[type](updatedItem, token);
  
        // Update the local state in `activityRecords`
        setActivityRecords((prevRecords) => ({
          ...prevRecords,
          [type.toLowerCase()]: prevRecords[type.toLowerCase()].map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          ),
        }));
  
        toast.success(`${type} updated successfully!`);
      }
  
      // Close modal if editing health details or pet details
      if (type === 'pet') {
        setEditBasicDetailsModalVisible(false);
      } else {
        setEditHealthModalVisible(false);
      }
      fetchData();
    } catch (error) {
      toast.error(`Failed to update ${type}. Please try again.`);
    }
  };

  const handleDelete = async (item, type) => {
    try {
      // Dynamically select the delete function based on type
      const deleteFunctions = {
        [ActivityType.MEDICAL_CONDITION]: deleteMedicalConditionById,
        [ActivityType.MEDICATION]: deleteMedicationById,
        [ActivityType.ALLERGY]: deleteAllergyById,
        pet: deletePet, // handle pet deletion separately if needed
      };
  
      // Call the respective delete function
      if (deleteFunctions[type]) {
        await deleteFunctions[type](item._id, token);
  
        // Update local state by removing the deleted item
        setActivityRecords((prevRecords) => ({
          ...prevRecords,
          [type.toLowerCase()]: prevRecords[type.toLowerCase()].filter(
            (record) => record._id !== item._id
          ),
        }));
  
        toast.success(`${type} deleted successfully!`);
        fetchData();
      }
    } catch (error) {
      toast.error(`Failed to delete ${type}. Please try again.`);
    }
  };


  return (
    <Box sx={{ padding: 3 }}>
    <Card sx={{ backgroundColor: '#f2f2f2', padding: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">{petDetails.name}</Typography>
          <FontAwesomeIcon
            icon={petDetails.species === 'MALE' ? faMars : faVenus}
            style={{ marginLeft: 8, color: petDetails.species === 'MALE' ? '#007bff' : '#ff69b4' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={() => setEditBasicDetailsModalVisible(true)}>
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Avatar
            src={petDetails.image ? `http://localhost:5001/${petDetails.image}` : petDefaultImage}
            alt={petDetails.name}
            sx={{ width: 120, height: 120, mt: 2, border: '1px solid #ccc' }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography>Breed: {petDetails.breed}</Typography>
          <Typography>Age: {petDetails.age}</Typography>
          <Typography>Weight: {petDetails.weight} kg</Typography>
          <Typography>Birthday: {petDetails.birthday ? formatDate(petDetails.birthday) : 'No Birthday date added'}</Typography>
          <Typography>About {petDetails.name}: {petDetails.description}</Typography>
          <Typography>Chip Number: {petDetails.chipNumber || 'No chip number'}</Typography>
        </Grid>
      </Grid>
    </Card>

    <Box sx={{ mb: 4 }}>
      <HealthInformationSection
        medicalConditions={activityRecords.medicalConditions}
        medications={activityRecords.medications}
        allergies={activityRecords.allergies}
        onEdit={handleHealthEdit}
        onDelete={handleDelete}
      />
    </Box>

    <Box display="flex"  mb={3}>
      <Button variant="contained" onClick={handleAddActivityClick}>Add Activity</Button>
    </Box>

    {popupVisible && (
      <AddActivityPopup
        onActivitySelect={handleActivitySelect}
        onClose={handleCancel}
      />
    )}

    <Box sx={{ mb: 4 }}>
      <ActivityLog
        activityLogs={activityRecords.activityLogs}
        upcomingEvents={activityRecords.upcomingEvents}
        petName={petDetails.name}
      />
    </Box>

    <Box sx={{ mb: 4 }}>
      <WeightTracker weightUpdateLogs={activityRecords.weights} />
    </Box>

    <Box sx={{ mb: 4 }}>
      <ExpenseTracker propsExpenses={activityRecords.expensesRecord} from="pet" petName={petDetails.name} token={token} />
    </Box>

    <Box sx={{ mb: 4 }}>
      <MealPlannerSection propsMeals={petDetails.mealPlanner} petId={petDetails._id} token={token} />
    </Box>

    <Box sx={{ mb: 4 }}>
      <GallerySection additionalImages={petDetails.additionalImages} petId={petDetails._id} token={token} />
    </Box>

    <Box sx={{ mb: 4 }}>
      <NoteSection propsNotes={activityRecords.notes} petId={petDetails._id} />
    </Box>

    <Box sx={{ mb: 4 }}>
      <EmergencyContactsSection propsContacts={petDetails.emergencyContacts} petId={petDetails._id} token={token} />
    </Box>

    {editHealthModalVisible && (
      <EditItemModal 
      item={itemToEdit}
      type={healthEditType}
      onClose={() => setEditHealthModalVisible(false)}
      onSubmit={handleEditSubmit}
      />
    )}

    {editBasicDetailsModalVisible && (
      <EditItemModal 
        item={petDetails}
        type={FormFieldsType.PET}
        onClose={() => setEditBasicDetailsModalVisible(false)}
        onSubmit={handleEditSubmit}
      />
    )}
  </Box>
  );
};

export default PetProfile;
