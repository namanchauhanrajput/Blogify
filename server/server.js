const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./router/auth-router");
const blogRoute = require("./router/blog-router");
const connectDB = require("./config/db.js");
const errorMiddleware = require("./middlewares/error-middleware.js");
require("dotenv").config();

// ✅ Allowed origins list
const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "https://bloging-platform-nine.vercel.app" // Deployed frontend
];

// ✅ Dynamic origin check
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,DELETE,PUT,PATCH,HEAD",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Test route for CORS check
app.get("/", (req, res) => {
  res.send("CORS is working fine 🚀");
});

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
