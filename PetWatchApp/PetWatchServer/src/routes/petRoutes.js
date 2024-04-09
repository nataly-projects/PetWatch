const express = require('express');

const petController = require('../controllers/petController');

const router = express.Router();

// router.get('/', petController.getPetsByFilters);
// router.post('/:userId', petController.upload.single('image'), petController.addPet);

router.get('/user/:userId', petController.getPetsByUserId);
router.get('/:petId', petController.getPetById);
router.get('/vaccinationRecord/:petId', petController.getPetVaccinationRecord);
router.get('/routineCare/:petId', petController.getPetRoutineCare);
router.get('/note/:petId', petController.getPetNote);
router.get('/expense/:petId', petController.getPetExpense);
router.get('/activity/:petId', petController.getPetActivityLog);
router.get('/upcoming/:petId', petController.getPetUpcomingEvents);
router.get('/expenses-array/:petId', petController.getPetExpensesArrays);

router.post('/:userId', petController.addPet);
router.post('/vaccinationRecord/:petId', petController.addPetVaccineRecord);
router.post('/routineCare/:petId', petController.addPetRoutineCare);
router.post('/note/:petId', petController.addPetNote);
router.post('/expense/:petId', petController.addPetExpense);

router.put('/note/:noteId', petController.updateNoteById);
router.delete('/note/:noteId', petController.deleteNote);


// router.put('/:petId',petController.upload.single('image'),  petController.updatePetById);
router.put('/:petId',  petController.updatePetById);
router.delete('/:petId', petController.deletePet);

module.exports = router;
