import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays, 
  getPetWeightTracker, getPetNote, getPetMealPlanner, getPetEmergencyContact, addPetActivity } from '../services/petService';
import WeightTracker from './WeightTracker';
import NoteSection from './NoteSection';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import AddActivityPopup from './AddActivityPopup';
import EmergencyContactsSection from './EmergencyContactsSection';
import MealPlannerSection from './MealPlannerSection';
import { formatDate } from '../utils/utils';
import petDefaultImage from '../images/paw.png';
import '../styles/PetProfile.css';


const PetProfile = () => {
  const location = useLocation();
  const { pet, currencySign } = location.state;
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weights, setWeights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [meals, setMeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const fetchData = async () => {
    try {
        const logs = await getPetActivityLog(pet._id, token);
        const events = await getPetUpcomingEvents(pet._id, token);
        const petExpenses = await getPetExpensesArrays(pet._id, token);
        const petWeights = await getPetWeightTracker(pet._id, token);
        const petNotes = await getPetNote(pet._id, token);
        const petMeals = await getPetMealPlanner(pet._id, token);
        const petContacts = await getPetEmergencyContact(pet._id, token);
        setActivityLogs(logs);
        setUpcomingEvents(events);
        setExpenses(petExpenses);
        setWeights(petWeights);
        setNotes(petNotes);
        setMeals(petMeals);
        setContacts(petContacts);
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
    if (pet) {
        fetchData();
    }
  }, [pet]);


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
        await addPetActivity(pet._id, selectedActivity, data, token);
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

  return (
    <div className="pet-profile-container">
      <div className="pet-details-card">
        <div className='pet-details-headers'>
          <div className='name-species-section'>
                <h1>{pet.name}</h1>
                {pet.species === 'MALE' ? (
                <FontAwesomeIcon icon={faMars}  /> 
                ) : (
                <FontAwesomeIcon icon={faVenus}  /> 
                )} 
          </div>
          <div className='pet-details-actions'>
            <FontAwesomeIcon icon={faEdit}  /> 
            <FontAwesomeIcon icon={faTrash}  /> 
          </div>
        </div>
        <img className='img-profile'
          src={pet.image ? `http://localhost:5001/${pet.image}` : petDefaultImage} alt={pet.name} 
        />
        <p> Breed: {pet.breed}</p>
        <p> Age: {pet.age} </p>
        <p> Weight: {pet.weight} kg</p>
        <p> Birthday: {pet.birthday ? formatDate(pet.birthday) : 'No Birthday date added'} </p>
        <p> About {pet.name}: {pet.description}</p>
        <p>Chip Number: {pet.chipNumber ? pet.chipNumber : 'No chip number'}</p>
      
        <div className="health-information">
          <h3>Health Information</h3>
          <h4>Medications:</h4>
          <div className="health-info-cards">
            {pet.medications.length > 0 ? (
                pet.medications.map(medication => (
                    <div className="health-info-card" key={medication._id}>
                      <div className='health-info-header'>
                        <h4>{medication.name}</h4>
                        <div className="health-info-actions">
                          <FontAwesomeIcon icon={faEdit}  />
                          <FontAwesomeIcon icon={faTrash}  />
                        </div>
                      </div>
                        <p><strong>Dosage:</strong> {medication.dosage}</p>
                        {medication.note && <p><strong>Note:</strong> {medication.note}</p>}
                        <p><strong>Start From:</strong> {new Date(medication.startDate).toLocaleDateString()} - 
                        <strong>End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}
                        </p>
                    </div>
                ))
            ) : (
                <p>No Medications</p>
            )}
        </div>

        <h4>Allergies:</h4>
          <div className="health-info-cards">
            {pet.allergies.length > 0 ? (
                pet.allergies.map(allergy => (
                    <div className="health-info-card" key={allergy._id}>
                      <div className='health-info-header'>
                        <h4>{allergy.name}</h4>
                        <div className="health-info-actions">
                          <FontAwesomeIcon icon={faEdit}  />
                          <FontAwesomeIcon icon={faTrash}  />
                        </div>
                      </div>
                        <p><strong>treatment:</strong> {allergy.treatment}</p>
                        {allergy.note && <p><strong>Note:</strong> {allergy.note}</p>}
                        <p><strong>Date:</strong> {new Date(allergy.date).toLocaleDateString()} </p>
                    </div>
                ))
            ) : (
                <p>No Allergies</p>
            )}
        </div>
          {/* <p>Allergies: {pet.allergies.length > 0 ? pet.allergies : 'No Allergies'}</p> */}

          {/* <p>Vaccination Records: {pet.vaccinationRecords}</p>
          <p>Medical Conditions: {pet.medicalConditions}</p> */}
        </div>
        <button className='btn' onClick={handleAddActivityClick}>Add Activity</button>
        {popupVisible && <AddActivityPopup onActivitySelect={handleActivitySelect} onClose={handleCancel}/>}

      </div>

    
      <div className="activity-log">
        <ActivityLog
            activityLogs={activityLogs}
            upcomingEvents={upcomingEvents}
            petName={pet.name}
          />
      </div>

      <div className="weight-tracker">
        <WeightTracker weightUpdateLogs={weights}/>
      </div>

      <div className="expenses">
        <ExpenseTracker 
        expenses={expenses}
        from={'pet'}
        petName={pet.name}
        currencySign={currencySign}
        />
      </div>

      <div className="meal-planner">
        <MealPlannerSection 
        propsMeals={meals}
        petId={pet._id} 
        token={token} 
        />
      </div>

      <div className="gallery">
        <h3>Gallery</h3>
        {/* //TODO - create component / add option to add new photos and upload them */}
        {
          pet.additionalImages && pet.additionalImages.length > 0 
          ?
          (
            <>
            <p>Additional Photos:</p>
            <div className="additional-photos">
            {pet.additionalImages.map((photo, index) => (
                <img
                key={index}
                className="additional-photo"
                src={`http://localhost:5001/${photo}`}  

                alt={`Additional Photo ${index + 1}`}
                />
            ))} 
            </div>
            </>   
          )  
          :
          (<p>No photos in the gallery yet.</p>  )      
        }
      </div>

      <div className="notes">
        <NoteSection 
        propsNotes={notes}
        petId={pet._id} 
        />
      </div>

      <div className="emergency-contacts">
        <EmergencyContactsSection 
        propsContacts={contacts}
        petId={pet._id} 
        token={token} 
        />
      </div>

    </div>
  );
};

export default PetProfile;
