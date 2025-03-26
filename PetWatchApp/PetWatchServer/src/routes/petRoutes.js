const express = require('express');
const petController = require('../controllers/petController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();


// Middleware to authenticate token
router.use(authenticateToken);

router.get('/user/:userId', petController.getPetsByUserId);
router.get('/:petId', petController.getPetById);
router.get('/vaccinationRecord/:petId', petController.getPetVaccinationRecord);
router.get('/routineCare/:petId', petController.getPetRoutineCare);
router.get('/note/:petId', petController.getPetNote);
router.get('/expense/:petId', petController.getPetExpense);
router.get('/activity/:petId', petController.getPetActivityLog);
router.get('/upcoming/:petId', petController.getPetUpcomingEvents);
router.get('/expenses-array/:petId', petController.getPetExpensesArrays);
router.get('/weight-track/:petId', petController.getPetWeightTracker);
router.get('/allergy/:petId', petController.getPetAllergies);
router.get('/medication/:petId', petController.getPetMedications);
router.get('/vet-visit/:petId', petController.getPetVetVisits);
router.get('/meal/:petId', petController.getPetMealPlanner);
router.get('/contact/:petId', petController.getPetEmergencyContacts);
router.get('/medical-condition/:petId', petController.getPetMedicalConditions);
const { singleImageUpload, multipleImagesUpload } = petController;

router.post('/:userId',singleImageUpload, petController.addPet);
router.post('/additional-images/:petId',multipleImagesUpload, petController.uploadAdditionalImageToNewPet);

router.post('/vaccinationRecord/:petId', petController.addPetVaccineRecord);
router.post('/routineCare/:petId', petController.addPetRoutineCare);
router.post('/note/:petId', petController.addPetNote);
router.post('/expense/:petId', petController.addPetExpense);
router.post('/allergy/:petId', petController.addPetAllergy);
router.post('/medication/:petId', petController.addPetMedication);
router.post('/vet-visit/:petId', petController.addPetVetVisit);
router.post('/meal/:petId', petController.addPetMealPlanner);
router.post('/contact/:petId', petController.addPetEmergencyContacts);
router.post('/medical-condition/:petId', petController.addPetMedicalCondition);

router.put('/note/:noteId', petController.updateNoteById);
router.delete('/note/:noteId', petController.deleteNote);

router.put('/allergy/:allergyId', petController.updateAllergyById);
router.delete('/allergy/:allergyId', petController.deleteAllergy);

router.put('/medication/:medicationId', petController.updateMedicationById);
router.delete('/medication/:medicationId', petController.deleteMedication);

router.put('/vet-visit/:vetVisitId', petController.updateVetVisitById);
router.delete('/vet-visit/:vetVisitId', petController.deleteMedication);

router.put('/meal/:mealId', petController.updateMealPlannerById);
router.delete('/meal/:mealId', petController.deleteMealPlanner);

router.put('/expense/:expenseId', petController.updateExpenserById);
router.delete('/expense/:expenseId', petController.deleteExpense);

router.put('/contact/:contactId', petController.updateEmergencyContactById);
router.delete('/contact/:contactId', petController.deleteEmergencyContact);

router.put('/medical-condition/:conditionId', petController.updateMedicalConditionById);
router.delete('/medical-condition/:conditionId', petController.deleteMedicalCondition);

// router.put('/:petId',petController.upload.single('image'),  petController.updatePetById);
router.put('/:petId',  petController.updatePetById);
router.delete('/:petId', petController.deletePet);

module.exports = router;
