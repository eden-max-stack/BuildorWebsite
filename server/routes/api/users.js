const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');

// router.get('/invite', usersController.inviteUsers);
router.get('/', usersController.getAllUsers);
router.post('/save-profile', usersController.saveUserData);
router.get('/get-user-data', usersController.getData);
router.get('/get-user-dashboard', usersController.getDashboardData);
router.get('/get-user-techstack', usersController.getUserTechStack);
router.get('/get-career-goal', usersController.getCareerGoal);

module.exports = router;