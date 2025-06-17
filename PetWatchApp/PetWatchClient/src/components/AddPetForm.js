import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import {Button,Box,Typography,TextField,Radio,RadioGroup,FormControlLabel,FormControl,Avatar,Divider,} from '@mui/material';
import petDefaultImage from '../images/paw.png';
import { addPet, addPetAdditionalImages } from '../services/petService';
import HealthInformation from './HealthInformation';
import VaccinationRecords from './VaccinationRecords';
import RoutineCare from './RoutineCare';
import Expenses from './Expenses';
import VetVisits from './VetVisits';
import Notes from './Notes';

const AddPetForm = ({open, handleClose} ) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [selectedImageProfile, setSelectedImageProfile] = useState(null);
    const [additionalPhotos, setAdditionalPhotos] = useState([]); 
    const [basicDetails, setBasicDetails] = useState({ name: '', species: '', breed: '' });
    const [additionalDetails, setAdditionalDetails] = useState({ age: '', weight: '', description: '' });
    const [chipAndBirthday, setChipAndBirthday] = useState({ chipNumber: '', birthday: '' });
    const [activityRecords, setActivityRecords] = useState({
        vaccinationRecord: [],
        routineCareRecord: [],
        expensesRecord: [],
        notesRecord: [],
        vetVisitsRecord: [],
        allergies: [],
        medications: [],
        medicalConditions: [],
      });
    const [showActivity, setShowActivity] = useState({
        vaccine: false,
        routineCare: false,
        allergy: false,
        medication: false,
        expense: false,
        vetVisit: false,
        note: false,
        medicalCondition: false,
    });

    const [currentSection, setCurrentSection] = useState(1);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setBasicDetails({ name: '', species: '', breed: '' });
        setAdditionalDetails({ age: '', weight: '', description: '' });
        setChipAndBirthday({ chipNumber: '', birthday: '' });
        setActivityRecords({
            vaccinationRecord: [],
            routineCareRecord: [],
            expensesRecord: [],
            notesRecord: [],
            vetVisitsRecord: [],
            allergies: [],
            medications: [],
            medicalConditions: [],
        });
        setShowActivity({
            vaccine: false,
            routineCare: false,
            allergy: false,
            medication: false,
            expense: false,
            vetVisit: false,
            note: false,
            medicalCondition: false,
        });
        setSelectedImageProfile(null);
        setAdditionalPhotos([]);
        setErrors({});
        setCurrentSection(1);
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

    if (!open) return null;

    const handleCloseWithReset = () => {
        resetForm();
        handleClose();
    };

    const handleAddItem = (type, item) => {
        setActivityRecords((prevRecords) => ({
            ...prevRecords,
            [type]: [...prevRecords[type], item],
        }));
    };

    const handleDeleteItem = (type, index) => {
        setActivityRecords((prevRecords) => ({
            ...prevRecords,
            [type]: prevRecords[type].filter((_, i) => i !== index),
        }));
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPet = {
            ...basicDetails,
            ...additionalDetails,
            chip: chipAndBirthday.chipNumber,
            birthday: chipAndBirthday.birthday,
            owner: user._id,
            ...activityRecords,
        };

        const formData = new FormData();
        formData.append('newPet', JSON.stringify(newPet));
        if (selectedImageProfile) formData.append('image', selectedImageProfile);

        try {
            await addPet(formData, token, newPet.owner);
            toast.success('Pet added successfully!');
            handleClose();
        } catch (error) {
            if (error.response && error.response.status === 401) navigate('/login');
            toast.error('Failed to add pet. Please try again.');
        }
    };

    const validateSection1 = () => {
        const newErrors = {};
        if (!basicDetails.name) newErrors.name = 'Name is required';
        if (!basicDetails.species) newErrors.species = 'Species is required';
        if (!basicDetails.breed) newErrors.breed = 'Breed is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSection2 = () => {
        const newErrors = {};
        if (!additionalDetails.age) newErrors.age = 'Age is required';
        if (!additionalDetails.weight) newErrors.weight = 'Weight is required';
        if (!additionalDetails.description) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const handleActivityToggle = (activityType) => {
        setShowActivity((prev) => ({ ...prev, [activityType]: !prev[activityType] }));
    };

    const handleActivitySave = (activityType, data) => {
        setActivityRecords((prevRecords) => ({
            ...prevRecords,
            [activityType]: [...prevRecords[activityType], data],
        }));
        handleActivityToggle(activityType);
    };

    const handleActivityDelete = (activityType, index) => {
        setActivityRecords((prevRecords) => ({
          ...prevRecords,
          [activityType]: prevRecords[activityType].filter((_, i) => i !== index),
        }));
    };

    const handleDeletePhoto = (indexToDelete) => {
        setAdditionalPhotos((prevPhotos) => prevPhotos.filter((photo, index) => index !== indexToDelete));
    };

    const handleNext = () => {
        const validations = [validateSection1, validateSection2];
        if (currentSection <= 2 && !validations[currentSection - 1]()) return;
        setCurrentSection((prev) => (prev < 10 ? prev + 1 : prev));
    };

    const handlePrevious = () => setCurrentSection((prev) => (prev > 1 ? prev - 1 : prev));


    return (    
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
            <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '80%',
                maxWidth: 600,
                p: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                overflowY: 'auto',
                position: 'relative',
            }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5">Welcome to the Add New Pet Process!</Typography>
                    <FontAwesomeIcon icon={faTimes} onClick={handleCloseWithReset} style={{ cursor: 'pointer' }} />
                </Box>
                <Divider />

                {currentSection === 1 && (
                <Box sx={{ mt: 3 }}>
                    {/* Section 1 - Basic Details */}
                    <Typography variant="h6">Section 1: Basic Details</Typography>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                        src={selectedImageProfile ? URL.createObjectURL(selectedImageProfile) : petDefaultImage}
                        sx={{ width: 100, height: 100, m: 'auto', border: '1px solid #ccc' }}
                    />
                    <Box
                        {...profileImageDropzone.getRootProps()}
                        sx={{
                        maxWidth: 'fit-content',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: '2px dashed #ccc',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        cursor: 'pointer',
                        p: 1,
                        mt: 2,
                        }}
                    >
                        <input {...profileImageDropzone.getInputProps()} />
                        <Typography>Drag & drop an image here, or click to select one</Typography>
                    </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Name:</Typography>
                        <TextField
                            fullWidth
                            placeholder="Name"
                            value={basicDetails.name}
                            onChange={(e) => setBasicDetails({ ...basicDetails, name: e.target.value })}
                            sx={{ mt: 2 }}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Box>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Species:</Typography>
                        <RadioGroup
                            row
                            value={basicDetails.species}
                            onChange={(e) => setBasicDetails({ ...basicDetails, species: e.target.value })}
                        >
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>
                        {errors.species && <Typography color="error">{errors.species}</Typography>}
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Breed"
                        value={basicDetails.breed}
                        onChange={(e) => setBasicDetails({ ...basicDetails, breed: e.target.value })}
                        sx={{ mt: 2 }}
                        error={!!errors.breed}
                        helperText={errors.breed}
                    />
                </Box>
                )}

                {currentSection === 2 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Section 2: Additional Details</Typography>
                    <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Age:</Typography>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="Age"
                        value={additionalDetails.age}
                        onChange={(e) => setAdditionalDetails({ ...additionalDetails, age: e.target.value })}
                        sx={{ mt: 2 }}
                        error={!!errors.age}
                        helperText={errors.age}
                    />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Weight:</Typography>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="Weight"
                        value={additionalDetails.weight}
                        onChange={(e) => setAdditionalDetails({ ...additionalDetails, weight: e.target.value })}
                        sx={{ mt: 2 }}
                        error={!!errors.weight}
                        helperText={errors.weight}
                    />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Description:</Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Description"
                        value={additionalDetails.description}
                        onChange={(e) => setAdditionalDetails({ ...additionalDetails, description: e.target.value })}
                        sx={{ mt: 2 }}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    </Box>
                </Box>
                )}

                {/* Section 3 - Chip and Birthday */}
                {currentSection === 3 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Section 3: Chip and Birthday</Typography>
                    <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Chip Number:</Typography>
                    <TextField
                        fullWidth
                        placeholder="Chip Number"
                        value={chipAndBirthday.chipNumber}
                        onChange={(e) => setChipAndBirthday({ ...chipAndBirthday, chipNumber: e.target.value })}
                    />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Birthday:</Typography>
                    <TextField
                        fullWidth
                        type="date"
                        value={chipAndBirthday.birthday}
                        onChange={(e) => setChipAndBirthday({ ...chipAndBirthday, birthday: e.target.value })}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    </Box>
                </Box>
                )}

                {/* Section 4 - Health Information */}
                {currentSection === 4 && 
                <HealthInformation
                    medicalConditions={activityRecords.medicalConditions}
                    allergies={activityRecords.allergies}
                    medications={activityRecords.medications}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                />
                }
  

                {/* Section 5 - Vaccination Records */}
                {currentSection === 5 && 
                    <VaccinationRecords
                    vaccinationRecords={activityRecords.vaccinationRecord}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                    />
                }
                

                {/* Section 6 - Routine Care Records */}
                {currentSection === 6 && 
                    <RoutineCare
                    routineCareRecords={activityRecords.routineCareRecord}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                    />
                }

                {/* Section 7 - Expense Records */}
                {currentSection === 7 && (
                    <Expenses
                    expensesRecord={activityRecords.expensesRecord}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                    />
                )}

                {/* Section 8 - Vet Visit Records */}
                {currentSection === 8 && (
                    <VetVisits
                    vetVisitsRecord={activityRecords.vetVisitsRecord}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                    />
                )}

                {/* Section 9 - Notes Record */}
                {currentSection === 9 && (
                    <Notes
                    notesRecord={activityRecords.notesRecord}
                    onAdd={handleAddItem}
                    onDelete={handleDeleteItem}
                    />
                )}

                {/* Section 10 - Additional Photos */}
                {currentSection === 10 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Section 10: Gallery</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Button variant="contained" {...additionalPhotosDropzone.getRootProps()}>
                        <input {...additionalPhotosDropzone.getInputProps()} />
                        Add Photos
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {additionalPhotos.map((photo, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            <Avatar
                            src={URL.createObjectURL(photo)}
                            variant="rounded"
                            sx={{ width: 100, height: 100 }}
                            />
                            <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => handleDeletePhoto(index)}
                            style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                cursor: 'pointer',
                                background: 'white',
                                borderRadius: '50%',
                                padding: '2px',
                            }}
                            />
                        </Box>
                        ))}
                    </Box>
                    </Box>
                </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    {currentSection > 1 && (
                        <Button variant="outlined" onClick={handlePrevious}>
                        Previous
                        </Button>
                    )}
                    {currentSection < 10 ? (
                        <Button variant="contained" onClick={handleNext}>
                        Next
                        </Button>
                    ) : (
                        <Button variant="contained" type="submit">
                        Submit
                        </Button>
                    )}
                </Box>

            </Box>
        </Box>

    );

}

export default AddPetForm;
