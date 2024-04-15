import React, { useState } from 'react';
import '../styles/AddPetForm.css';

const AddPetForm = () => {
  
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
  const [healthInformation, setHealthInformation] = useState('');
  const [vaccinationRecord, setVaccinationRecord] = useState('');
  const [routineCareRecord, setRoutineCareRecord] = useState('');

  const [currentSection, setCurrentSection] = useState(1);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to submit the form data
  };

  // Function to move to the next section
  const handleNext = () => {
    if (currentSection < 6) {
        setCurrentSection(currentSection + 1);
      }
  };

  // Function to move to the previous section
  const handlePrevious = () => {
    if (currentSection > 1) {
        setCurrentSection(currentSection - 1);
      }
  };

  return (      
    <div className="add-pet-form-container">
        <div className="add-pet-form">
            <h2>Welcome to the Add New Pet Process!</h2>
            <p>Please provide the following details about your pet:</p>
            <form onSubmit={handleSubmit}>
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
                    </div>
                </div>
                )}
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
                    </div>

                    <div className="input-group">
                        <label>Description:</label>
                        <textarea 
                            value={additionalDetails.description} 
                            onChange={(e) => setAdditionalDetails({ ...additionalDetails, description: e.target.value })} 
                            placeholder="Description" 
                            required
                        />
                    </div>
                </div>
                )}
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
                {currentSection === 4 && (
                <div className="form-section">
                    <h3>Section 4: Health Information</h3>
                    {/* //TODO - show the add allergy activity and add medication activity */}
                    <p>You can add this information later in the pet profile. 
                        However, it's important to add all pet info for tracking and analysis.</p>
                </div>
                )}
                {currentSection === 5 && (
                <div className="form-section">
                    <h3>Section 5: Vaccination Record</h3>
                    {/* //TODO - show the add vaccination record activity */}
                    <p>You can add this information later in the pet profile. 
                        However, it's important to add all pet info for tracking and analysis.</p>
                </div>
                )}
                {currentSection === 6 && (
                <div className="form-section">
                    <h3>Section 6: Routine Care Record</h3>
                    {/* //TODO - show the add rouitne care activity */}
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
