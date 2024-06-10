import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays, 
  getPetWeightTracker, addPetActivity, deleteAllergyById, deleteMedicalConditionById, deleteMedicationById,
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
import EditHealthItemModal from './EditHealthItemModal';
import EditPetDetailsModal from './EditPetDetailsModal';
import '../styles/PetProfile.css';


const PetProfile = () => {
  const location = useLocation();
  const { pet, currencySign } = location.state;
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const [petDetails, setPetDetails] = useState(pet);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weights, setWeights] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

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
        setActivityLogs(logs);
        setUpcomingEvents(events);
        setExpenses(petExpenses);
        setWeights(petWeights);
        setMedications(pet.medications);
        setAllergies(pet.allergies);
        setMedicalConditions(pet.medicalConditions);
        setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        setError(true);
        setLoading(false);
        navigate('/login');
      }
        console.error('Error fetching data:', error);
        setError(true);
        setLoading(false);
    }
  };

  useEffect(() => {
    if (petDetails) {
        fetchData();
    }
  }, [petDetails]);


  if (loading) {
    return (
      <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
          <p>Failed to fetch pet data. Please try again later.</p>
          <button className='btn' onClick={fetchData}>Retry</button>
      </div>
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
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        console.error('Error adding activity:', error);
        toast.error('Failed to adding activity. Please try again.');
    }
  };

  const handleHealthEdit = (item, type) => {
    setItemToEdit(item);
    setHealthEditType(type);
    setEditHealthModalVisible(true);
  };

  const handleEditSubmit = async (updatedItem, type) => {
    try {
      switch (type) {
        case ActivityType.MEDICAL_CONDITION:
          console.log('edit medical condition ', updatedItem);
          // await updateMedicalConditionById(updatedItem, token);
          // setMedicalConditions(medicalConditions.map(condition => condition._id === updatedItem._id ? updatedItem : condition));
          toast.success('Medical Condition edit successfully!');
          break;
        case ActivityType.MEDICATION:
          console.log('edit medication', updatedItem);
          // await updateMedicationById(updatedItem, token);
          // setMedications(medications.map(medication => medication._id === updatedItem._id ? updatedItem : medication));
          toast.success('Medication edit successfully!');
          break;
        case ActivityType.ALLERGY:
          console.log('edit allergy ', updatedItem);
          // await updateAllergyById(updatedItem, token);
          // setAllergies(allergies.map(allergy => allergy._id === updatedItem._id ? updatedItem : allergy));
          toast.success('Allergy edit successfully!');
          break;
        case 'pet':
          console.log('edit pet ', updatedItem);
          // await updatePetById(updatedItem, token);
          // setAllergies(allergies.map(allergy => allergy._id === updatedItem._id ? updatedItem : allergy));
          toast.success(`${petDetails.name} edit successfully!`);
          break;
        default:
          return;
      }
      if(type === 'pet') {
        setEditBasicDetailsModalVisible(false);
      } else {
        setEditHealthModalVisible(false);
      }
      // fetchData();
    } catch (error) {
      toast.error('Failed to update item. Please try again.');
    }
  };

  const handleDelete = async (item, type) => {
    console.log('type: ', type);
    try {
      switch(type){
        case ActivityType.MEDICAL_CONDITION:
          await deleteMedicalConditionById(item._id, token);
          setMedicalConditions(medicalConditions.filter(conditon => conditon._id !== item._id));
          toast.success('Medical Condition deleted successfully!');
          return;
        case ActivityType.MEDICATION:
          await deleteMedicationById(item._id, token);
          setMedications(medications.filter(medication => medication._id !== item._id));
          toast.success('Medication deleted successfully!');
          return;
        case ActivityType.ALLERGY:
          await deleteAllergyById(item._id, token);
          setAllergies(allergies.filter(allergy => allergy._id !== item._id));
          toast.success('Allergy deleted successfully!');
          return;
        case 'pet':
          await deleteAllergyById(item._id, token);
          setAllergies(allergies.filter(allergy => allergy._id !== item._id));
          toast.success(`${petDetails.name} deleted successfully!`);
          return;
      }
    } catch (error) {
      toast.error('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="pet-profile-container">
      <div className="pet-details-card">
        <div className='pet-details-headers'>
          <div className='name-species-section'>
                <h1>{pet.name}</h1>
                {petDetails.species === 'MALE' ? (
                <FontAwesomeIcon icon={faMars} className='species-icon'/> 
                ) : (
                <FontAwesomeIcon icon={faVenus} className='species-icon'/> 
                )} 
          </div>
          <div className='pet-details-actions'>
            <FontAwesomeIcon icon={faEdit} onClick={() => setEditBasicDetailsModalVisible(true)} /> 
            <FontAwesomeIcon icon={faTrash}  /> 
          </div>
        </div>
        <img className='img-profile'
          src={petDetails.image ? `http://localhost:5001/${petDetails.image}` : petDefaultImage} alt={petDetails.name} 
        />
        <p> Breed: {petDetails.breed}</p>
        <p> Age: {petDetails.age} </p>
        <p> Weight: {petDetails.weight} kg</p>
        <p> Birthday: {petDetails.birthday ? formatDate(petDetails.birthday) : 'No Birthday date added'} </p>
        <p> About {petDetails.name}: {petDetails.description}</p>
        <p>Chip Number: {petDetails.chipNumber ? petDetails.chipNumber : 'No chip number'}</p>
      
        <div className="health-information">
          <HealthInformationSection 
          medicalConditions={medicalConditions}
          medications={medications}
          allergies={allergies}
          onEdit={handleHealthEdit}
          onDelete={handleDelete}
          />
        </div> 

        <button className='btn' onClick={handleAddActivityClick}>Add Activity</button>
        {popupVisible && <AddActivityPopup onActivitySelect={handleActivitySelect} onClose={handleCancel}/>} 

        </div>

    
      <div className="activity-log">
        <ActivityLog
          activityLogs={activityLogs}
          upcomingEvents={upcomingEvents}
          petName={petDetails.name}
        />
      </div>

      <div className="weight-tracker">
        <WeightTracker weightUpdateLogs={weights}/>
      </div>

      <div className="expenses">
        <ExpenseTracker 
        expenses={expenses}
        from={'pet'}
        petName={petDetails.name}
        currencySign={currencySign}
        />
      </div>

      <div className="meal-planner">
        <MealPlannerSection 
        propsMeals={petDetails.mealPlanner}
        petId={petDetails._id} 
        token={token} 
        />
      </div>

      <div className="gallery">
        <GallerySection 
        additionalImages={petDetails.additionalImages} 
        petId={petDetails._id}
        token={token}
        />
      </div>

      <div className="notes">
        <NoteSection 
        propsNotes={petDetails.notes}
        petId={petDetails._id} 
        />
      </div>

      <div className="emergency-contacts">
        <EmergencyContactsSection 
        propsContacts={petDetails.emergencyContacts}
        petId={petDetails._id} 
        token={token} 
        />
      </div>

      {editHealthModalVisible && (
        <EditHealthItemModal
          item={itemToEdit}
          type={healthEditType}
          onClose={() => setEditHealthModalVisible(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {editBasicDetailsModalVisible && (
        <EditPetDetailsModal
          pet={petDetails}
          onClose={() => setEditBasicDetailsModalVisible(false)}
          onSubmit={handleEditSubmit}
        />
      )}

    </div>
  );
};

export default PetProfile;
