# 📝 Blogging Platform (MERN Stack)

![Banner](https://via.placeholder.com/1200x300.png?text=Blogging+Platform)  
*(👉 Replace this with your custom banner image)*

<p align="center">
  <a href="https://github.com/namanchauhanrajput/Blogify/stargazers">
    <img src="https://img.shields.io/github/stars/namanchauhanrajput/Blogify?style=for-the-badge&logo=github" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/namanchauhanrajput/Blogify/network/members">
    <img src="https://img.shields.io/github/forks/namanchauhanrajput/Blogify?style=for-the-badge&logo=github" alt="GitHub forks"/>
  </a>
  <a href="https://github.com/namanchauhanrajput/Blogify/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/namanchauhanrajput/Blogify?style=for-the-badge" alt="Contributors"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/ReactQuill-FFCE00?style=for-the-badge&logo=quill&logoColor=black"/>
</p>

---

A full-featured **Blogging Platform** built with the MERN stack (MongoDB, Express, React, Node.js).  
It allows users to **create, edit, delete, and explore blogs**, with authentication, image uploads, user search, and a rich text editor.  
Includes **Admin Dashboard** for managing users and blogs.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Register & Login with JWT
  - Protected routes for logged-in users

- ✍️ **Blog Management**
  - Create, update, delete blogs
  - Rich text editor (React Quill)
  - Upload blog images via Cloudinary

- 👤 **User Features**
  - User profile & dashboard
  - View blogs by author
  - 🔍 Search users by username/profile

- ❤️ **Engagement**
  - Like & comment system *(planned)*

- 🔎 **Search & Filter**
  - Search blogs by title/content
  - Categories & tags *(planned)*

- 🛠️ **Admin Dashboard**
  - Manage users
  - View & delete blogs
  - Handle reported content *(future scope)*

- 📱 **Responsive UI**
  - Mobile-first design with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router
- React Quill (rich text editor)
- Tailwind CSS / Framer Motion

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt for authentication
- Multer & Cloudinary for image uploads

---

## 📂 Folder Structure

```bash
Blogify/
├── client/         # React frontend
├── server/         # Express backend
├── models/         # Mongoose models
├── controllers/    # Business logic
├── routes/         # Express routes
├── middlewares/    # Custom middlewares
└── README.md