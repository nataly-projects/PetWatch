const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/reset-password-request', userController.requestPasswordReset);
router.post('/reset-password-code', userController.resetPasswordCode);
router.post('/reset-password', userController.resetPassword);
router.post('/contact', userController.ContactUsMessage);

// Middleware to authenticate token
router.use(authenticateToken);

router.get('/:userId', userController.getUserById);
router.get('/activity/:userId', userController.getUserActivityLog);
router.get('/expenses/:userId', userController.getUserExpensesArrays);
router.get('/upcoming/:userId', userController.getUserUpcomingEvents);
router.get('/notes/:userId', userController.getUserNotes);
router.get('/settings/:userId', userController.getUserAccountSettings);
router.get('/calendar-activities/:userId/:year/:month', userController.getUserPetsActivitiesForMonth);
router.get('/tasks/:userId', userController.getUserTasks);

router.post('/change-password', userController.changePassword);
router.post('/tasks/:userId', userController.addUserTask);

router.put('/:userId', userController.updateUserById);
router.put('/settings/:userId', userController.updateUserAccountSettings);
router.put('/tasks/:userId/:taskId', userController.updateUserTask);

// router.put('/:userId', userController.upload.single('imageUrl'), userController.updateUserById);
router.delete('/tasks/:userId/:taskId', userController.deleteUserTask);

module.exports = router;

