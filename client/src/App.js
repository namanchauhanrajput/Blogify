import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Register } from "./Pages/Register";
import { Login } from "./Pages/Login";
import { CreateBlog } from "./Pages/CreateBlog";
import { ForgotPassword } from "./Pages/ForgotPassword";
import { ThemeProvider } from "./context/ThemeContext";
import { Home } from "./Pages/Home";
import Navbar from "./components/Navbar";
import MyProfile from "./Pages/MyProfile";
import UserProfile from "./Pages/UserProfile";
import { EditBlog } from "./Pages/EditBlog";
import BlogDetail from "./Pages/BlogDetail";
import Comment from "./Pages/Comment";
import { Notifications } from "./Pages/Notifications";
import "./index.css";

// Protected wrapper
const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/register" replace />;
};

// Public wrapper
const PublicRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : element;
};

const App = () => {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/register"
            element={<PublicRoute element={<Register />} />}
          />
          <Route
            path="/login"
            element={<PublicRoute element={<Login />} />}
          />
          <Route
            path="/forgot-password"
            element={<PublicRoute element={<ForgotPassword />} />}
          />
          <Route path="/notifications" element={<Notifications />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/create-blog"
            element={<ProtectedRoute element={<CreateBlog />} />}
          />
          <Route
            path="/my-profile"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          <Route
            path="/profile/:userId"
            element={<ProtectedRoute element={<UserProfile />} />}
          />
          <Route
            path="/edit-blog/:id"
            element={<ProtectedRoute element={<EditBlog />} />}
          />
          <Route
            path="/blog/:id"
            element={<ProtectedRoute element={<BlogDetail />} />}
          />
          <Route
            path="/comments/:id"
            element={<ProtectedRoute element={<Comment />} />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
