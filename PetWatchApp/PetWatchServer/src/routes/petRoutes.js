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

router.put('/note/:noteId', petController.updateNoteById);
router.delete('/note/:noteId', petController.deleteNote);

// router.put('/allergy/:allergyId', petController.);
// router.delete('/allergy/:allergyId', petController.);

// router.put('/medication/:medicationId', petController.);
// router.delete('/medication/:medicationId', petController.);

// router.put('/vet-visit/:vetVisitId', petController.);
// router.delete('/vet-visit/:vetVisitId', petController.);


// router.put('/:petId',petController.upload.single('image'),  petController.updatePetById);
router.put('/:petId',  petController.updatePetById);
router.delete('/:petId', petController.deletePet);

// router.post('/:userId', petController.upload.single('image'), petController.addPet);


module.exports = router;
