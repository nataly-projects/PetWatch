const express = require('express');

const petController = require('../controllers/petController');

const router = express.Router();

// router.get('/', petController.getPetsByFilters);
// router.post('/', petController.upload.single('image'), petController.addPet);
router.get('/user/:userId', petController.getPetsByUserId);
router.get('/:petId', petController.getPetsById);
// router.put('/:petId',petController.upload.single('image'),  petController.updatePet);
// router.delete('/:petId', petController.deletePet);

module.exports = router;
