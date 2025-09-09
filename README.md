# 📄 Resume Builder Platform

A full-stack web application to **create, manage, and download resumes** with support for multiple resume versions, custom sections, and profile picture uploads.

---

## 🚀 Features

* **Secure Authentication** (JWT-based login/signup).
* **Resume Management**:

  * Add personal details, education, experience, skills.
  * Add unlimited **custom sections** (e.g., Projects, Certifications).
  * Save multiple resume versions.
* **Profile Picture Upload** for a professional look.
* **PDF Generation** with multiple sections and clean formatting.
* **Dashboard** to view, edit, delete, and download resumes.
* **Responsive Frontend** built with React + Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend

* **React (Vite)** → Fast, modern, and minimal setup for SPAs.
* **Tailwind CSS** → Utility-first, responsive styling.
* **Axios** → For HTTP requests to the backend API.
* **React Router** → For navigation between pages (Login, Dashboard, Resume Builder).

### Backend

* **Node.js + Express** → Lightweight, scalable REST API framework.
* **MongoDB + Mongoose** → Flexible NoSQL database for storing users and resumes.
* **Multer** → Middleware for file uploads (profile pictures).
* **PDFKit** → Generate resumes as professional PDFs.
* **JWT (jsonwebtoken)** → Secure authentication & protected routes.
* **bcrypt** → For password hashing and security.

### Justification

* **React + Vite** → ensures fast development and production builds.
* **Tailwind CSS** → saves time with predefined responsive utilities.
* **Node + Express** → simple to expose REST APIs and handle uploads.
* **MongoDB** → ideal for storing dynamic resume sections with flexible schema.
* **Multer + PDFKit** → handles file uploads and PDF export without third-party SaaS.
* **JWT + bcrypt** → secure login system without complexity.

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/resume-platform.git
cd resume-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/resume_platform
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```


---

## 🏗️ Approach & Architecture

1. **Authentication**

   * User registers or logs in using email + password.
   * Passwords are hashed with **bcrypt**.
   * JWT is generated and stored in `localStorage` on the frontend.

2. **Resume Management**

   * User creates multiple resumes (each with personal details, education, experience, skills, custom sections).
   * Resumes are stored in MongoDB, linked to the user via `userId`.

3. **File Upload**

   * Profile pictures are uploaded via **Multer**, stored in `/uploads`.
   * Images are referenced in MongoDB and displayed in Dashboard & PDF.

4. **PDF Generation**

   * When user downloads a resume, **PDFKit** dynamically generates a professional PDF including profile photo, education, experience, skills, and custom sections.

5. **Frontend Flow**

   * **Login/Register → Dashboard → Resume Builder → Download PDF**
   * Fully responsive UI with Tailwind CSS.

---

## 📌 Future Improvements

* Add **multiple PDF templates** (choose style).
* Rich text editor for sections.
* Shareable public resume link (`/resume/:slug`).
* Cloud storage for profile pictures.

---

## 👨‍💻 Author

Developed as a **MERN Stack project** for resume building and PDF generation.

---

