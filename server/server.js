const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./router/auth-router");
const blogRoute = require("./router/blog-router");
const connectDB = require("./config/db.js");
const errorMiddleware = require("./middlewares/error-middleware.js");
require("dotenv").config();

// CORS Options
const corsOptions = {
    origin: [
      "http://localhost:3000", // Local development
      "https://bloging-platform-nine.vercel.app" // Deployed frontend
    ],
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);

// Connect DB
connectDB();

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
