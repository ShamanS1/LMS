# SmartLearn LMS

Welcome to the SmartLearn LMS project! This repository contains the source code for the SmartLearn Learning Management System. The system is designed to facilitate online education for students, tutors, and administrators. It provides a platform for managing courses, tracking learning progress, uploading and accessing educational materials, and generating certificates upon course completion.       
Here is a very detailed and precise description of your project, including the technologies used and step-by-step instructions on how to run it.

---

## Project Description

**SmartLearn LMS** is a comprehensive Learning Management System designed to facilitate online education for students, tutors, and administrators. The platform provides a seamless experience for managing courses, tracking learning progress, uploading and accessing educational materials, and generating certificates upon course completion. The system is architected with a modern web technology stack, ensuring scalability, security, and a responsive user interface.

### Core Features

- **User Authentication & Authorization:** Secure login and registration for students, tutors, and admins, with role-based access control.
- **Course Management:** Tutors can create, update, and delete courses, upload various materials (videos, notes, PDFs, YouTube links), and organize content into modules.
- **Student Dashboard:** Students can enroll in courses, view materials, track their progress, and see completion status with visual indicators.
- **Progress Tracking:** Automatic tracking of completed materials and courses, with progress bars and completion badges.
- **Certificate Generation:** Upon course completion, students can download a dynamically generated PDF certificate.
- **Admin Panel:** Administrators can manage users, oversee course content, and monitor platform activity.
- **Responsive UI:** The frontend is fully responsive, providing an optimal experience on desktops, tablets, and mobile devices.
- **RESTful API:** The backend exposes a secure REST API for all major operations, supporting frontend integration and potential third-party extensions.

---

## Technologies Used

### Frontend

- **Angular (v19.2.8):** Main framework for building the single-page application (SPA).
- **TypeScript:** Strongly-typed language for scalable and maintainable frontend code.
- **Tailwind CSS:** Utility-first CSS framework for rapid and consistent UI development.
- **HTML5 & CSS3:** Markup and styling for the user interface.
- **Angular CLI:** For project scaffolding, building, and serving the application.

### Backend

- **Node.js:** JavaScript runtime environment for the backend server.
- **Express.js:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database for storing users, courses, materials, and progress data.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB, managing schemas and models.
- **JWT (jsonwebtoken):** For secure authentication and authorization.
- **bcryptjs:** For password hashing and security.
- **Multer:** Middleware for handling file uploads (e.g., course materials).
- **Puppeteer:** For generating PDF certificates programmatically.
- **dotenv:** For managing environment variables.
- **CORS:** Middleware to enable cross-origin requests.
- **Nodemon:** For automatic server reloading during development.

---

## How to Run the Project

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (Node package manager)
- **MongoDB** (running locally or accessible remotely)
- **Angular CLI** (install globally with `npm install -g @angular/cli`)

### 1. Clone the Repository

Navigate to your workspace directory:
```
c:\Users\Administrator\Desktop\LMS
```
(Assuming the project folders are `lms-backend` and `lms-frontend` inside this directory.)

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:
    ```bash
    cd lms-backend
    ```
2. Install backend dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables:
    - Create a `.env` file in the `lms-backend` directory.
    - Add the following (replace values as needed):
      ```
      MONGODB_URI=mongodb://localhost:27017/smartlearn
      JWT_SECRET=your_jwt_secret
      PORT=5000
      ```
4. Start the backend server:
    ```bash
    npm start
    ```
   - The backend server will run (by default) at `http://localhost:5000`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
    ```bash
    cd lms-frontend
    ```
2. Install frontend dependencies:
    ```bash
    npm install
    ```
3. Start the Angular development server:
    ```bash
    ng serve
    ```
   - The frontend will be available at `http://localhost:4200`.

### 4. Access the Application

- Open your browser and go to `http://localhost:4200` to use the LMS.
- Ensure MongoDB is running and accessible by the backend.

### 5. Building for Production

To build the frontend for production deployment:
```bash
ng build
```
- The build artifacts will be stored in the `dist/` directory.

---

## Additional Notes

- **CORS:** Ensure CORS is properly configured in the backend for frontend-backend communication.
- **Environment Variables:** Adjust `.env` settings as needed for your deployment environment.
- **Certificate Generation:** Puppeteer may require additional system dependencies; refer to the [Puppeteer documentation](https://pptr.dev/) if you encounter issues.
- **Database:** Make sure MongoDB is running before starting the backend server.

---
That's it! You should now have the LMS up and running on your local machine. If you encounter any issues or have questions, feel free to reach out.
        