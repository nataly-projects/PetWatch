import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { RoutineCareActivityItems, VaccineRecordType, ActivityType, ExpenseCategory } from '../utils/utils';
import VaccineRecordActivity from './VaccineRecordActivity';
import RoutineCareActivity from './RoutineCareActivity';
import AllergyActivity from './AllergyActivity';
import MedicationActivity from './MedicationActivity';
import ExpenseActivity from './ExpenseActivity';
import VetVisitActivity from './VetVisitActivity';
import NoteActivity from './NoteActivity';
import MedicalConditionActivity from './MedicalConditionActivity';
import petDefaultImage from '../images/paw.png';
import { formatDate } from '../utils/utils';
import { addPet, addPetAdditionalImages } from '../services/petService';
import '../styles/AddPetForm.css';

const AddPetForm = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [selectedImageProfile, setSelectedImageProfile] = useState(null);
    const [additionalPhotos, setAdditionalPhotos] = useState([]); 

    const [basicDetails, setBasicDetails] = useState({
        name: '',
        species: '',
        breed: ''    });
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
    const [expensesRecord, setExpensesRecord] = useState([]);
    const [notesRecord, setNotesRecord] = useState([]);
    const [vetVisitsRecord, setVetVisitsRecord] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [medications, setMedications] = useState([]);
    const [medicalConiditons, setMedicalConiditons] = useState([]);
    const [selectedVaccineType, setSelectedVaccineType] = useState(null);
    const [selectedRoutineCareType, setSelectedRoutineCareType] = useState(null);
    const [selectedExpenseType, setSelectedExpenseType] = useState(null);
    const [showAllergyActivity, setShowAllergyActivity] = useState(false);
    const [showMedicationActivity, setShowMedicationActivity] = useState(false);
    const [showVetVisitActivity, setShowVetVisitActivity] = useState(false);
    const [showNoteActivity, setShowNoteActivity] = useState(false);
    const [showMedicalConiditionActivity, setShowMedicalConiditionActivity] = useState(false);


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
            expenses: expensesRecord,
            notes: notesRecord,
            vetVisits: vetVisitsRecord,
            medicalConiditons: medicalConiditons,
            owner: user._id
        };
        return pet;
    };

    const onProfileImageDrop = (acceptedFiles) => {
        console.log(acceptedFiles);
        if (acceptedFiles && acceptedFiles.length > 0) {
            const selectedImage = acceptedFiles[0];
            setSelectedImageProfile(selectedImage);
        }
    };

    const onAdditionalPhotosDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const newPhotos = acceptedFiles[0];
            const updatedAdiitionalPhotos = [...additionalPhotos, newPhotos];
            setAdditionalPhotos(updatedAdiitionalPhotos);
        }
    };

    const profileImageDropzone = useDropzone({
        onDrop: onProfileImageDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: false,
    });
    
    const additionalPhotosDropzone = useDropzone({
        onDrop: onAdditionalPhotosDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: true,
    });


    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPet = createPetObject();
        const formData = new FormData();
        formData.append('newPet', JSON.stringify(newPet));
        formData.append('image', (selectedImageProfile ? selectedImageProfile : null));

        try{
            const response = await addPet(formData, token, newPet.owner);
            toast.success('Pet added successfully!');
            if (response.pet && additionalPhotos.length > 0 ) {
                console.log('there is additional images! ', response.pet);
                const formData = new FormData();
                // Append additional images one by one
                additionalPhotos.forEach((image) => {
                    formData.append('additionalImages', image);
                });
                await addPetAdditionalImages(formData, token, response.pet._id);
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
            console.error('Error while adding pet:', error);
            toast.error('Failed to adding pet. Please try again.');
        }
    };

    const validateSection1 = () => {
        console.log('basicDetails: ', basicDetails);
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
            case ActivityType.EXPENSE:
                setSelectedExpenseType(type);
                break;
            case ActivityType.VET_VISIT:
                setShowVetVisitActivity(true);
                break;
            case ActivityType.NOTE:
                setShowNoteActivity(true);
                break;
            case ActivityType.MEDICAL_CONDITION:
                setShowMedicalConiditionActivity(true);
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
            case ActivityType.EXPENSE:
                setExpensesRecord([...expensesRecord, data]);
                setSelectedExpenseType(null);
                break;
            case ActivityType.VET_VISIT:
                setVetVisitsRecord([...vetVisitsRecord, data]);
                setShowVetVisitActivity(false);
                break;
            case ActivityType.NOTE:
                setNotesRecord([...notesRecord, data]);
                setShowNoteActivity(false);
                break;
            case ActivityType.MEDICAL_CONDITION:
                setMedicalConiditons([...medicalConiditons, data]);
                setShowMedicalConiditionActivity(false);
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
            case ActivityType.EXPENSE:
                const updatedExpenseRecord = [...expensesRecord];
                updatedExpenseRecord.splice(index, 1);
                setExpensesRecord(updatedExpenseRecord);
                break;
            case ActivityType.VET_VISIT:
                const updatedVetVisits = [...vetVisitsRecord];
                updatedVetVisits.splice(index, 1);
                setVetVisitsRecord(updatedVetVisits);
                break;
            case ActivityType.NOTE:
                const updatedNotes = [...notesRecord];
                updatedNotes.splice(index, 1);
                setNotesRecord(updatedNotes);
                break;
            case ActivityType.MEDICAL_CONDITION:
                const updatedMedicalConsitions = [...medicalConiditons];
                updatedMedicalConsitions.splice(index, 1);
                setMedicalConiditons(updatedMedicalConsitions);
                break;
            default:
                break;
        }
    };

    const handleDeletePhoto = (indexToDelete) => {
        setAdditionalPhotos((prevPhotos) => prevPhotos.filter((photo, index) => index !== indexToDelete));
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
        else if (currentSection < 10) {
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
            if (currentSection === 7) {
                setSelectedExpenseType(null);
            }
            if (currentSection === 8) {
                setShowVetVisitActivity(false);
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
            if (currentSection === 7) {
                setSelectedExpenseType(null);
            }
            if (currentSection === 8) {
                setShowVetVisitActivity(false);
            }
            if (currentSection === 9) {
                setShowNoteActivity(false);
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
                        <div className="pet-image-container">
                            <label> Pet image:</label>
                            <img className="pet-image"
                            src={ (selectedImageProfile ? URL.createObjectURL(selectedImageProfile) : petDefaultImage)} 
                            alt="Pet Profile Image" 
                            />
                            <div className="upload-overlay"  {...profileImageDropzone.getRootProps()}>
                                <input  {...profileImageDropzone.getInputProps()} />
                                <p>Drag & drop an image here, or click to select one</p>
                            </div>
                        </div>
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
                            <div className='radio-buttons'> 
                                <div>
                                    <input
                                        type="radio"
                                        id="male"
                                        name="species"
                                        value="MALE"
                                        checked={basicDetails.species === 'MALE'}
                                        onChange={(e) => setBasicDetails({ ...basicDetails, species: e.target.value })}
                                    />
                                    <label htmlFor="male">Male</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="female"
                                        name="species"
                                        value="FEMALE"
                                        checked={basicDetails.species === 'FEMALE'}
                                        onChange={(e) => setBasicDetails({ ...basicDetails, species: e.target.value })}
                                    />
                                    <label htmlFor="female">Female</label>
                                </div>
                            </div>
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

                        {medicalConiditons.length > 0 && (
                            <>
                            <h4>Medical Conditions: </h4>
                            <div className="activity-section">
                                { medicalConiditons.map((item, index) => (    
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p>{item.name}</p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.MEDICAL_CONDITION)} />
                                    </div>
                                    <p>Desciption: {item.description}</p>
                                    <p>Diagnose Date: {formatDate(item.dateDiagnosed)}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add Medical Condition: </h4>
                        <button className='button' onClick={() => handleItemClick(ActivityType.MEDICAL_CONDITION)}> Add new medical condition </button>
                            {showMedicalConiditionActivity && (
                                <div className='add-activity-card'>
                                    <MedicalConditionActivity 
                                    onSave={(data) => handleActivitySave(ActivityType.MEDICAL_CONDITION, data)} 
                                    onClose={() => setShowMedicalConiditionActivity(false)}/> 
                                </div>
                            )}
                        
                        <hr />

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
                            {showAllergyActivity && (
                                <div className='add-activity-card'>
                                    <AllergyActivity 
                                    onSave={(data) => handleActivitySave(ActivityType.ALLERGY, data)} 
                                    onClose={() => setShowAllergyActivity(false)}/> 
                                </div>
                            )}
                        
                        <hr />

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
                            {showMedicationActivity && ( 
                                <div className='add-activity-card'>
                                    <MedicationActivity 
                                    onSave={(data) => handleActivitySave(ActivityType.MEDICATION, data)} 
                                    onClose={() => setShowMedicationActivity(false)} /> 
                                </div>
                            )}
                        
                        <p className='optional-section'>You can add this information later in the pet profile. 
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
                            <div className='add-activity-card'>
                                <VaccineRecordActivity 
                                onSave={(data) => handleActivitySave(ActivityType.VACCINE_RECORD, data)} 
                                vaccineType={selectedVaccineType} 
                                onClose={() => setSelectedVaccineType(null)} />
                            </div>
                        )}
                        <p className='optional-section'>You can add this information later in the pet profile. 
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
                            <div className='add-activity-card'>
                                <RoutineCareActivity 
                                onSave={(data) => handleActivitySave(ActivityType.ROUTINE_CARE, data)} 
                                routineCareType={selectedRoutineCareType} 
                                onClose={() => setSelectedRoutineCareType(null)}/>
                            </div>
                        )}
                        <p className='optional-section'>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Section 7 - Expenses Records */}
                    {currentSection === 7 && (
                    <div className="form-section">
                        <h3>Section 7: Expenses Record</h3>
                        {expensesRecord.length > 0 && (
                            <>
                            <h4>Expenses Records: </h4>
                            <div className="activity-section">
                            {expensesRecord.map((item, index) => (
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p><strong>{item.category}</strong></p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.EXPENSE)} />
                                    </div>
                                    <p>amount: {item.amount}</p>
                                    <p>Date: {formatDate(item.date)}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add Expense: </h4>
                        <p>Choose the type of the expense</p>
                        <div className="activity-items-grid">
                            {ExpenseCategory.map((item, idx) => (
                                <div key={idx} className="activity-items-card" onClick={() => handleItemClick(ActivityType.EXPENSE ,item)}>
                                {item.icon ? <FontAwesomeIcon className="icon" icon={item.icon} /> : null}
                                <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                        {selectedExpenseType && (
                            <div className='add-activity-card'>
                                <ExpenseActivity 
                                onSave={(data) => handleActivitySave(ActivityType.EXPENSE, data)} 
                                expenseCategory={selectedExpenseType} 
                                onClose={() => setSelectedExpenseType(null)}
                                />
                            </div>
                        )}
                        <p className='optional-section'>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Section 8 - Vet Visit Records */}
                    {currentSection === 8 && (
                    <div className="form-section">
                        <h3>Section 8: Vet Visits Record</h3>
                        {vetVisitsRecord.length > 0 && (
                            <>
                            <h4>Vet Visits Records: </h4>
                            <div className="activity-section">
                            {vetVisitsRecord.map((item, index) => (
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p><strong>{item.reason}</strong></p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.VET_VISIT)} />
                                    </div>
                                    { item.examination && <p>examination: {item.examination}</p> }
                                    <p>Date: {formatDate(item.date)}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add vet visit: </h4>
                        <button className='button' onClick={() => handleItemClick(ActivityType.VET_VISIT)}> Add new vet visit </button>

                        {showVetVisitActivity && (
                            <div className='add-activity-card'>
                                <VetVisitActivity 
                                onSave={(data) => handleActivitySave(ActivityType.VET_VISIT, data)} 
                                onClose={() => setShowVetVisitActivity(false)}
                                />
                            </div>
                        )}
                        <p className='optional-section'>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                     {/* Section 9 - Notes Records */}
                     {currentSection === 9 && (
                    <div className="form-section">
                        <h3>Section 9: Notes Record</h3>
                        {notesRecord.length > 0 && (
                            <>
                            <h4>Notes Records: </h4>
                            <div className="activity-section">
                            {notesRecord.map((item, index) => (
                                <div key={index} className="activity-card">
                                    <div className="activity-card-header">
                                        <p><strong>{item.content}</strong></p>
                                        <FontAwesomeIcon className='activity-card-icon' 
                                        icon={faTrash} 
                                        onClick={() => handleDeleteActivityItem(index, ActivityType.NOTE)} />
                                    </div>
                                    <p>Date: {formatDate(Date.now())}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                        <h4>Add note: </h4>
                        <button className='button' onClick={() => handleItemClick(ActivityType.NOTE)}> Add new note </button>

                        {showNoteActivity && (
                            <div className='add-activity-card'>
                                <NoteActivity 
                                onSave={(data) => handleActivitySave(ActivityType.NOTE, data)} 
                                onClose={() => setShowNoteActivity(false)}
                                />
                            </div>
                        )}
                        <p className='optional-section'>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Section 10 - Adiitional photos */}
                    {currentSection === 10 && (
                    <div className="form-section">
                        <h3>Section 10: Gallery</h3>
                        {additionalPhotos.length > 0 && (
                            <>
                            <h4>{basicDetails.name} Photos: </h4>
                            <div className="additional-photos">
                                {additionalPhotos.map((photo, index) => (
                                <div key={index} className="additional-photo-wrapper">
                                    <img
                                    key={index}
                                    className="additional-photo"
                                    src={URL.createObjectURL(photo)}
                                    alt={`Additional Photo ${index + 1}`}
                                    />
                                    <FontAwesomeIcon icon={faTimes} className='delete-photo-icon' onClick={() => handleDeletePhoto(index)}/>
                                </div>
                                ))}
                            </div>
                            </>
                        )}
                        {/* <h4>Add another photo: </h4> */}
                        <div className="upload-overlay" {...additionalPhotosDropzone.getRootProps()}>
                            <input {...additionalPhotosDropzone.getInputProps()} />
                            <p>Drag 'n' drop an image here, or click to select one</p>
                        </div>
                        <p className='optional-section'>You can add this information later in the pet profile. 
                            However, it's important to add all pet info for tracking and analysis.</p>
                    </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="navigation-buttons">
                        {currentSection > 1 && <button type="button" onClick={handlePrevious}>Previous</button>}
                        {currentSection < 10 && <button type="button" onClick={handleNext}>Next</button>}
                        {currentSection === 10 && <button type="submit">Submit</button>}
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AddPetForm;
