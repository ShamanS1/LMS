const Material = require('../models/material.model');
const Course = require('../models/course.model');
const path = require('path');
const Section = require('../models/section.model');


// Add material
exports.addMaterial = async (req, res) => {
  try {
    const { courseId, sectionId, title, type, content } = req.body;

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (
      course.tutor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized to add material' });
    }
    //create section
    const section = await Section.findById(sectionId);
if (!section || section.course.toString() !== courseId)
  return res.status(400).json({ message: 'Invalid section' });

    // create material
    const material = await Material.create({
        course: courseId,
        section: sectionId,
        title, type, content, 
        createdBy: req.user._id
      });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add material', error: err.message });
  }
};

// Get all materials for a course
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId });
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch materials', error: err.message });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) return res.status(404).json({ message: 'Material not found' });

    if (
      material.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete material' });
    }

    await material.deleteOne();
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete material', error: err.message });
  }
};

exports.downloadMaterial = async (req, res) => {
    try {
      const mat = await Material.findById(req.params.id);
      if (!mat) {
        return res.status(404).json({ message: 'Material not found' });
      }
      if (mat.type !== 'file') {
        return res.status(400).json({ message: 'Material is not a downloadable file' });
      }
  
      // Fetch course to check enrollment / ownership
      const course = await Course.findById(mat.course);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const isTutorOrAdmin =
        course.tutor.toString() === req.user._id.toString() ||
        req.user.role === 'admin';
      const isEnrolled = course.enrolledStudents.includes(req.user._id);
  
      if (!(isTutorOrAdmin || isEnrolled)) {
        return res.status(403).json({ message: 'Forbidden: not enrolled or not owner' });
      }
  
      // Material.content holds the relative URL "/uploads/filename.ext"
      const filePath = path.join(__dirname, '..', mat.content);
      // Set header to expose 'Content-Disposition' to frontend
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

return res.download(filePath, err => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending file' });
  }
});

    } catch (err) {
      res.status(500).json({ message: 'Download failed', error: err.message });
    }
    
  };

  