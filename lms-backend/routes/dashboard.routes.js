const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const permit = require('../middlewares/role');

const { getStudentDashboard, getAdminDashboard, getTutorDashboard } = require('../controllers/dashboard.controller');

// Student dashboard
router.get('/student', protect, getStudentDashboard);

// Admin dashboard
router.get('/admin',protect,permit('admin'),getAdminDashboard);

//Tutor dashboard
router.get('/tutor', protect, permit('tutor'), getTutorDashboard);

module.exports = router;
