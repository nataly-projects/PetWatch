import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays, getPetWeightTracker } from '../services/petService';
import WeightTracker from './WeightTracker';
import NoteSection from './NoteSection';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import AddActivityPopup from './AddActivityPopup';
import '../styles/PetProfile.css';


const PetProfile = () => {
  const location = useLocation();
  const { pet } = location.state;

  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const fetchData = async () => {
    try {
        const logs = await getPetActivityLog(pet._id);
        const events = await getPetUpcomingEvents(pet._id);
        const petExpenses = await getPetExpensesArrays(pet._id);
        const petWeights = await getPetWeightTracker(pet._id);
        console.log('####petExpenses: ', petExpenses);
        setActivityLogs(logs);
        setUpcomingEvents(events);
        setExpenses(petExpenses);
        setWeights(petWeights);
        setLoading(false);
    } catch (error) {
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
      <div>
          <p>Failed to fetch pet data. Please try again later.</p>
          <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const handleAddActivityClick = () => {
    setPopupVisible(true);
};

const handleActivitySelect = (activity) => {
    // Handle the selected activity here
    console.log('Selected activity:', activity);
    setPopupVisible(false);
    //TODO - need to call the right function in the pet service
    //accoridng to the activity select
};



  return (
    <div className="pet-profile-container">
      <div className="pet-details-card">
        <img src={pet.image} alt={pet.name} />
        <div className='pet-details-headers'>
          <div className='name-species-section'>
                <h3>{pet.name}</h3>
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
      
        <p> Breed: {pet.breed}</p>
        <p> Age: {pet.age} </p>
        <p> Weight: {pet.weight} kg</p>
        <p> About {pet.name}: {pet.description}</p>
        <p>Chip Number: {pet.chipNumber ? pet.chipNumber : 'No chip number'}</p>
      
        <div className="health-information">
          <h3>Health Information</h3>
          <p>Medications: {pet.medications.length > 0 ? pet.medications : 'No Medications'}</p>
          <p>Allergies: {pet.allergies.length > 0 ? pet.allergies : 'No Allergies'}</p>

          {/* <p>Vaccination Records: {pet.vaccinationRecords}</p>
          <p>Medical Conditions: {pet.medicalConditions}</p> */}
        </div>
        <button onClick={handleAddActivityClick}>Add Activity</button>
        {popupVisible && <AddActivityPopup onActivitySelect={handleActivitySelect} />}

      </div>

     

      <div className="activity-log">
        <ActivityLog
            activityLogs={activityLogs}
            upcomingEvents={upcomingEvents}
            petName={pet.name}
          />
      </div>

      <div className="weight-tracker">
        <h3>Weight Tracker</h3>
        <WeightTracker weightUpdateLogs={weights}/>
      </div>

      <div className="expenses">
        <ExpenseTracker 
        expenses={expenses}
        from={'pet'}
      />
        
        {/* {renderPetExpensesCharts()} */}
      </div>

      <div className="meal-planner">
        <h3>Meal Planner</h3>
        {/* TODO -Allow users to plan and schedule meals */}
      </div>

      <div className="gallery">
        <h3>Gallery</h3>
        {/* TODO - Display pet photos in a gallery */}
      </div>

      <div className="notes">
        {/* TODO - Allow users to add and view notes -
            show like a table - with column - 
            date created, update date, note, actions (edit, remove)
            and option to add row,
            and for each row - option to delte or remove
         */}
        <h3>Notes</h3>
         <NoteSection 
         propsNotes={pet.notes} 
         petId={pet._id} />
      </div>

      {/* <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        {// Display emergency contact information }
      </div> */}

      <div className="edit-delete-options">
        {/* TODO - Provide options to edit or delete pet profile */}
      </div>
    </div>
  );
};

export default PetProfile;
