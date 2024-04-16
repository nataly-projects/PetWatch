import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RoutineCareActivityItems, VaccineRecordType, ActivityType } from '../utils/utils';
import VaccineRecordActivity from './VaccineRecordActivity';
import RoutineCareActivity from './RoutineCareActivity';
import AllergyActivity from './AllergyActivity';
import MedicationActivity from './MedicationActivity';
import { formatDate } from '../utils/utils';
import { addPet } from '../services/petService';
import '../styles/AddPetForm.css';

const AddPetForm = () => {
    const user = useSelector((state) => state.user);

    const [basicDetails, setBasicDetails] = useState({
        name: '',
        species: '',
        breed: ''
    });
    const [additionalDetails, setAdditionalDetails] = useState({
        age: '',
        weight: '',
        description: ''
    });
    const [chipAndBirthday, setChipAndBirthday] = useState({
        chipNumber: '',
        birthday: ''
    });

    const [vaccinationRecord, setVaccinationRecord] = useState([]);
    const [routineCareRecord, setRoutineCareRecord] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [medications, setMedications] = useState([]);
    const [selectedVaccineType, setSelectedVaccineType] = useState(null);
    const [selectedRoutineCareType, setSelectedRoutineCareType] = useState(null);
    const [showAllergyActivity, setShowAllergyActivity] = useState(false);
    const [showMedicationActivity, setShowMedicationActivity] = useState(false);

    const [currentSection, setCurrentSection] = useState(1);
    const [errors, setErrors] = useState({});

    const createPetObject = () => {
        const pet = {
            name: basicDetails.name,
            species: basicDetails.species,
            breed: basicDetails.breed,
            age: additionalDetails.age,
            weight: additionalDetails.weight,
            description: additionalDetails.description,
            chip: chipAndBirthday.chipNumber ? chipAndBirthday.chipNumber : null,
            birthday: chipAndBirthday.birthday ? chipAndBirthday.birthday : null,
            medications: medications,
            allergies: allergies,
            vaccinationRecord: vaccinationRecord,
            routineCareRecord: routineCareRecord,
            owner: user._id
        };
        return pet;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newPet = createPetObject();
        try{
            await addPet(newPet);
            toast.success('Pet added successfully!');
          } catch (error) {
            console.error('Error while adding pet:', error);
            toast.error('Failed to adding pet. Please try again.');
        }
    };

    const validateSection1 = () => {
        const validationErrors = {section1: {}};
        if (!basicDetails.name) {
            validationErrors.section1.name = 'Name is required';
        }
        if (!basicDetails.species) {
            validationErrors.section1.species = 'Species is required';
        }
        if (!basicDetails.breed) {
            validationErrors.section1.breed = 'Breed is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors.section1).length === 0;
    }

    const validateSection2 = () => {
        const validationErrors = {section2: {}};
        if (!additionalDetails.age) {
            validationErrors.section2.age = 'Age is required';
        }
        if (!additionalDetails.weight) {
            validationErrors.section2.weight = 'Weight is required';
        }
        if (!additionalDetails.description) {
            validationErrors.section2.description = 'Description is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors.section2).length === 0;
    }

    const handleItemClick = (activityType, type) => {
        switch (activityType) {
            case ActivityType.VACCINE_RECORD:
                setSelectedVaccineType(type);
                break;
            case ActivityType.ROUTINE_CARE:
                setSelectedRoutineCareType(type);
                break;
            case ActivityType.ALLERGY:
                setShowAllergyActivity(true);
                break;
            case ActivityType.MEDICATION:
                setShowMedicationActivity(true);
                break;
            default:
                break;
        }
    };

    // Function to handle saving data for each activity
    const handleActivitySave = (activityType, data) => {
        console.log('handleActivitySave: ', data);
        switch (activityType) {
            case ActivityType.VACCINE_RECORD:
                setVaccinationRecord([...vaccinationRecord, data]);
                setSelectedVaccineType(null);
                break;
            case ActivityType.ROUTINE_CARE:
                setRoutineCareRecord([...routineCareRecord, data]);
                setSelectedRoutineCareType(null);
                break;
            case ActivityType.ALLERGY:
                setAllergies([...allergies, data]);
                setShowAllergyActivity(false);
                break;
            case ActivityType.MEDICATION:
                setMedications([...medications, data]);
                setShowMedicationActivity(false);
                break;
            default:
                break;
        }
    };

    const handleDeleteActivityItem = (index, activityType) => {
        switch (activityType) {
            case ActivityType.VACCINE_RECORD:
                const updatedVaccinationRecord = [...vaccinationRecord];
                updatedVaccinationRecord.splice(index, 1);
                setVaccinationRecord(updatedVaccinationRecord);
                break;
            case ActivityType.ROUTINE_CARE:
                const updatedRoutineCareRecord = [...routineCareRecord];
                updatedRoutineCareRecord.splice(index, 1);
                setRoutineCareRecord(updatedRoutineCareRecord);
                break;
            case ActivityType.ALLERGY:
                const updatedAllergies = [...allergies];
                updatedAllergies.splice(index, 1);
                setAllergies(updatedAllergies);
                break;
            case ActivityType.MEDICATION:
                const updatedMedicatios = [...medications];
                updatedMedicatios.splice(index, 1);
                setMedications(updatedMedicatios);
                break;
            default:
                break;
        }
    };

    // Function to move to the next section
    const handleNext = () => {

        if(currentSection === 1) {
            if (validateSection1()) {
                setCurrentSection(currentSection + 1);
            }
        }

        else if(currentSection === 2) {
            if (validateSection2()) {
                setCurrentSection(currentSection + 1);
            }
        }
        else if (currentSection < 6) {
            if (currentSection === 4) {
                setShowAllergyActivity(false);
                setShowMedicationActivity(false);
            }
            if (currentSection === 5) {
                setSelectedVaccineType(null);
            }
            setCurrentSection(currentSection + 1);
        }
    };

    // Function to move to the previous section
    const handlePrevious = () => {
        if (currentSection > 1) {
            if (currentSection === 4) {
                setShowAllergyActivity(false);
                setShowMedicationActivity(false);
            }
            if (currentSection === 5) {
                setSelectedVaccineType(null);
            }
            if (currentSection === 6) {
                setSelectedRoutineCareType(null);
            }
            setCurrentSection(currentSection - 1);
        }
    };

    return (      
        <div className="add-pet-form-container">
            <div className="add-pet-form">
                <h2>Welcome to the Add New Pet Process!</h2>
                <p>Please provide the following details about your pet:</p>
                <form onSubmit={handleSubmit}>

                    {/* Section 1 - basic details */}
                    {currentSection === 1 && (
                    <div className="form-section">
                        <h3>Section 1: Basic Details</h3>
                        
                        <div className="input-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={basicDetails.name}
                                onChange={(e) => setBasicDetails({ ...basicDetails, name: e.target.value })}
                                required
                            />
                        {errors.section1 && errors.section1.name && <div className="error-message">{errors.section1.name}</div>} 
                        </div>
                        <div className="input-group">
                            <label>Species:</label>
                            <input
                                type="text"
                                placeholder="Species"
                                value={basicDetails.species}
                                onChange={(e) => setBasicDetails({ ...basicDetails, species: e.target.value })}
                                required
                            />
                        { errors.section1 && errors.section1.species && <div className="error-message">{errors.section1.species}</div>}
                        </div>
                        <div className="input-group">
                            <label>Breed:</label>
                            <input
                                type="text"
                                placeholder="Breed"
                                value={basicDetails.breed}
                                onChange={(e) => setBasicDetails({ ...basicDetails, breed: e.target.value })}
                                required
                            />
                        {errors.section1 && errors.section1.breed && <div className="error-message">{errors.section1.breed}</div>}
                        </div>
                    </div>
                    )}

                    {/* Section 2 - additional details */}
                    {currentSection === 2 && (
                    <div className="form-section">
                        <h3>Section 2: Additional Details</h3>
                        <div className="input-group">
                            <label>Age:</label>
                            <input 
                                type="number" 
                                value={additionalDetails.age} 
                                onChange={(e) => setAdditionalDetails({ ...additionalDetails, age: e.target.value })} 
                                placeholder="Age" 
                                required
                            />
                        {errors.section2 && errors.section2.age && <div className="error-message">{errors.section2.age}</div>} 
                        </div>

                        <div className="input-group">
                            <label>Weight:</label>
                            <input 
                                type="number" 
                                value={additionalDetails.weight} 
                                onChange={(e) => setAdditionalDetails({ ...additionalDetails, weight: e.target.value })} 
                                placeholder="Weight" 
                                required
                            />
                        {errors.section2 && errors.section2.weight && <div className="error-message">{errors.section2.weight}</div>} 
                        </div>

                        <div className="input-group">
                            <label>Description:</label>
                            <textarea 
                                value={additionalDetails.description} 
                                onChange={(e) => setAdditionalDetails({ ...additionalDetails, description: e.target.value })} 
                                placeholder="Description" 
                                required
                            />
                            {errors.section2 && errors.section2.description && <div className="error-message">{errors.section2.description}</div>} 
                        </div>
                    </div>
                    )}

                    {/* Section 3 - chip & birtahdy */}
                    {currentSection === 3 && (
                    <div className="form-section">
                        <h3>Section 3: Chip Number and Birthday</h3>
                        <div className="input-group">
                            <label>Chip Number:</label>
                            <input 
                                type="text" 
                                value={chipAndBirthday.chipNumber} 
                                onChange={(e) => setChipAndBirthday({ ...chipAndBirthday, chipNumber: e.target.value })} 
                                placeholder="Chip Number" 
                            />
                        </div>

                        <div className="input-group">
                            <label>Birthday:</label>  
                            <input 
                                type="datetime-local" 
                                id="appointmentDateTime" 
                                name="appointmentDateTime" 
                                value={chipAndBirthday.birthday} 
                                onChange={(e) => setChipAndBirthday({ ...chipAndBirthday, birthday: e.target.value })} 
                            />
                        </div>
                    </div>
                    )}

                    {/* Section 4 - Health Information */}
                    {currentSection === 4 && (
                    <div className="form-section">
                        <h3>Section 4: Health Information</h3>

                        {allergies.length > 0 && (
                            <>
                            <h4>Allergires: </h4>
                            <div className="activity-section">
                                { allergies.map((item, index) => (    
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p>{item.name}</p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.ALLERGY)} />
                                    </div>
                                    <p>Date: {formatDate(item.date)}</p>
                                    <p>Treatment: {item.treatment}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add Allergy: </h4>
                        <button className='button' onClick={() => handleItemClick(ActivityType.ALLERGY)}> Add new allergy </button>
                            {showAllergyActivity && (<AllergyActivity onSave={(data) => handleActivitySave(ActivityType.ALLERGY, data)} /> )}
                        {medications.length > 0 && (
                            <>
                            <h4>Medications: </h4>
                            <div className="activity-section">
                            {medications.map((item, index) => (
                            <div key={index} className="activity-card">
                                <div className="activity-card-header">
                                    <p>{item.name}</p>
                                    <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.MEDICATION)} />
                                </div>
                                <p>dosage: {item.dosage}</p>
                                <p>Start Date: {formatDate(item.startDate)}</p>
                                <p>End Date: {formatDate(item.startDate)}</p>

                            </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add Medication: </h4>
                            <button className='button' onClick={() => handleItemClick(ActivityType.MEDICATION)}> Add new medication </button>
                            {showMedicationActivity && ( <MedicationActivity onSave={(data) => handleActivitySave(ActivityType.MEDICATION, data)} /> )}
                        <p>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Section 5 - Vaccination Records */}
                    {currentSection === 5 && (
                    <div className="form-section">
                        <h3>Section 5: Vaccination Record</h3>
                        {vaccinationRecord.length > 0 && ( 
                        <>
                         <h4>Vaccination Records: </h4>
                         <div className="activity-section">
                            {vaccinationRecord.map((item, index) => (
                                <div key={index} className="activity-card">
                                     <div className="activity-card-header">
                                        <p><strong>{item.vaccineType}</strong></p>
                                        <FontAwesomeIcon className='activity-card-icon'  
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.VACCINE_RECORD)} />
                                    </div>
                                    <p>Date: {formatDate(item.date)}</p>
                                    <p>Next Date: {formatDate(item.nextDate)}</p>
                                </div>
                            ))}
                         </div>
                        </>
                        )}
                        <h4>Add Vaccine: </h4>
                        <p>Choose the type of the vaccince</p>
                        <div className="activity-items-grid">
                            {VaccineRecordType.map((item, idx) => (
                                <div key={idx} className="activity-items-card" onClick={() => handleItemClick(ActivityType.VACCINE_RECORD ,item)}>
                                {item.icon ? <FontAwesomeIcon className="icon" icon={item.icon} /> : null}
                                {item.value}
                                </div>
                            ))}
                        </div>
                        {selectedVaccineType && (
                            <VaccineRecordActivity onSave={(data) => handleActivitySave(ActivityType.VACCINE_RECORD, data)} vaccineType={selectedVaccineType} />
                        )}
                        <p>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Section 6 - Routine Care Records */}
                    {currentSection === 6 && (
                    <div className="form-section">
                        <h3>Section 6: Routine Care Record</h3>
                        {routineCareRecord.length > 0 && (
                            <>
                            <h4>Routine Care Records: </h4>
                            <div className="activity-section">
                            {routineCareRecord.map((item, index) => (
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p><strong>{item.activity}</strong></p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.ROUTINE_CARE)} />
                                    </div>
                                    <p>Date: {formatDate(item.date)}</p>
                                    <p>Next Date: {formatDate(item.nextDate)}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add Routine Care: </h4>
                        <p>Choose the type of the routine care</p>
                        <div className="activity-items-grid">
                            {RoutineCareActivityItems.map((item, idx) => (
                                <div key={idx} className="activity-items-card" onClick={() => handleItemClick(ActivityType.ROUTINE_CARE ,item)}>
                                {item.icon ? <FontAwesomeIcon className="icon" icon={item.icon} /> : null}
                                <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                        {selectedRoutineCareType && (
                            <RoutineCareActivity onSave={(data) => handleActivitySave(ActivityType.ROUTINE_CARE, data)} routineCareType={selectedRoutineCareType} />
                        )}
                        <p>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="navigation-buttons">
                        {currentSection > 1 && <button type="button" onClick={handlePrevious}>Previous</button>}
                        {currentSection < 6 && <button type="button" onClick={handleNext}>Next</button>}
                        {currentSection === 6 && <button type="submit">Submit</button>}
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AddPetForm;
