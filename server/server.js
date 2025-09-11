const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./router/auth-router");
const blogRoute = require("./router/blog-router");
const adminRoute = require("./router/admin-router");
const notificationRoute = require("./router/notification-router");
const connectDB = require("./config/db.js");
const errorMiddleware = require("./middlewares/error-middleware.js");
const userRoutes = require("./router/userRoutes");
require("dotenv").config();

// CORS Options
const corsOptions = {
      origin: [
    "http://localhost:3000", // local dev
    // "https://bloging-platform-nine.vercel.app", 
    "https://blogifyi.vercel.app",  // ✅ vercel frontend
     // ✅ vercel frontend
  ],
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/admin", adminRoute);
// Routes
app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/notifications", notificationRoute);
// Users route
app.use("/api/users", userRoutes);

// Connect DB
connectDB();

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
