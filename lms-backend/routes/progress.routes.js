const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const permit = require('../middlewares/role');
const {
  toggleCompletion,
  getMyProgress,
  getStudentProgress,
  getAllProgress
} = require('../controllers/progress.controller');

// Student toggles a material as done/undone
router.post(
  '/:courseId/materials/:materialId/toggle',
  protect,
  permit('student'),
  toggleCompletion
);

// Student views their own progress
router.get(
  '/:courseId',
  protect,
  permit('student'),
  getMyProgress
);

// Tutor/Admin views one student
router.get(
  '/:courseId/student/:studentId',
  protect,
  permit('tutor', 'admin'),
  getStudentProgress
);

// Tutor/Admin views all students
router.get(
  '/:courseId/all',
  protect,
  permit('tutor', 'admin'),
  getAllProgress
);

module.exports = router;
