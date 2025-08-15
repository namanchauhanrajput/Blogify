import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Register } from "./Pages/Register";
import { Login } from "./Pages/Login";
import { CreateBlog } from "./Pages/CreateBlog";
import { ForgotPassword } from "./Pages/ForgotPassword";
import { Home } from "./Pages/Home";
import Navbar from "./components/Navbar"; // Navbar import kiya

// Wrapper for protected routes
const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/register" replace />;
};

// Wrapper for public routes
const PublicRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : element;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<PublicRoute element={<Register />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
          <Route path="/create-blog" element={<CreateBlog />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
