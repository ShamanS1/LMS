const Course = require('../models/course.model');
const Section  = require('../models/section.model');
const Material = require('../models/material.model');

exports.getCourseStructure = async (req, res) => {
    const { id } = req.params;
    const sections = await Section.find({ course: id })
      .sort('order')
      .lean();
    const materials = await Material.find({ course: id })
      .lean();
  
    // group materials by section
    const grouped = sections.map(sec => ({
      ...sec,
      materials: materials.filter(m => m.section.toString() === sec._id.toString())
    }));
  
    res.json(grouped);
  };

// Create course
exports.createCourse = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);

    const { title, description, category } = req.body;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    const newCourse = await Course.create({
      title,
      description,
      category,
      thumbnail,
      tutor: req.user._id
    });

    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
};



// Get all published courses
exports.getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('tutor', 'name');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
  }
};

// Update course (only by creator)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this course' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
};

// Toggle publish status
exports.togglePublishStatus = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
  
      if (!course)
        return res.status(404).json({ message: 'Course not found' });
  
      // Only the course owner (tutor) or admin can toggle
      if (
        course.tutor.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Unauthorized to change publish status' });
      }
  
      course.isPublished = !course.isPublished;
      await course.save();
  
      res.status(200).json({
        message: `Course is now ${course.isPublished ? 'published' : 'unpublished'}`,
        course
      });
    } catch (err) {
      res.status(500).json({ message: 'Error toggling publish status', error: err.message });
    }
  };

exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found or not published' });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
};

// View student’s enrolled courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user._id });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// Tutor views enrolled students
exports.getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('enrolledStudents', 'name email');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (
      course.tutor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized to view enrolled students' });
    }

    res.status(200).json(course.enrolledStudents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
};

// Unenroll from a course
exports.unenrollFromCourse = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
  
      if (!course)
        return res.status(404).json({ message: 'Course not found' });
  
      const isEnrolled = course.enrolledStudents.includes(req.user._id);
  
      if (!isEnrolled)
        return res.status(400).json({ message: 'You are not enrolled in this course' });
  
      course.enrolledStudents = course.enrolledStudents.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
  
      await course.save();
  
      res.status(200).json({ message: 'Unenrolled successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Unenrollment failed', error: err.message });
    }
  };
  

  