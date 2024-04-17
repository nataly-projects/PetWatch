import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays, 
  getPetWeightTracker, getPetNote, addPetActivity } from '../services/petService';
import WeightTracker from './WeightTracker';
import NoteSection from './NoteSection';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import AddActivityPopup from './AddActivityPopup';
import { formatDate } from '../utils/utils';
import '../styles/PetProfile.css';


const PetProfile = () => {
  const location = useLocation();
  const { pet, currencySign } = location.state;

  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weights, setWeights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const fetchData = async () => {
    try {
        const logs = await getPetActivityLog(pet._id);
        const events = await getPetUpcomingEvents(pet._id);
        const petExpenses = await getPetExpensesArrays(pet._id);
        const petWeights = await getPetWeightTracker(pet._id);
        const petNotes = await getPetNote(pet._id);
        setActivityLogs(logs);
        setUpcomingEvents(events);
        setExpenses(petExpenses);
        setWeights(petWeights);
        setNotes(petNotes);
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

  const handleCancel = () => {
    setPopupVisible(false);
  }

  const handleActivitySelect = async (selectedActivity, data) => {
      // Handle the selected activity here
      console.log('Selected activity:', selectedActivity);
      console.log('data:', data);
      setPopupVisible(false);
      try{
        await addPetActivity(pet._id, selectedActivity, data);
        toast.success('Activity added successfully!');
        fetchData();
      } catch (error) {
        console.error('Error adding activity:', error);
        toast.error('Failed to adding activity. Please try again.');
    }

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
        currencySign={currencySign}
      />
        
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
         <NoteSection 
         notes={notes}
         petId={pet._id} />
      </div>

      {/* <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        {// Display emergency contact information }
      </div> */}

    </div>
  );
};

export default PetProfile;
