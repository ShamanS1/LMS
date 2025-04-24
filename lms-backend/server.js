const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const materialRoutes = require('./routes/material.routes');
//const enrollmentRoutes = require('./routes/enrollment.routes');
const path = require('path');
const progressRoutes = require('./routes/progress.routes');
const sectionRoutes = require('./routes/section.routes');
const dashboardRoutes = require('./routes/dashboard.routes');




dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // your frontend URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true, // allow session cookies
  exposedHeaders: ['Authorization','Content-Disposition'], // expose headers for token authentication
 //  maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded files

// DB
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

// TODO: Load routes here (auth, courses, etc.)
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
//app.use('/api/enrollments', enrollmentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/progress', progressRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/dashboard', dashboardRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
