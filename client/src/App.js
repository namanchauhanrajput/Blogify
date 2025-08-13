// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import { Home } from "./Pages/Home";
import { Register } from "./Pages/Register";
import { Login } from "./Pages/Login";
import { ForgotPassword } from "./Pages/ForgotPassword";
import { CreateBlog } from "./Pages/CreateBlog";
import { BlogDetail } from "./Pages/BlogDetail";
import { EditBlog } from "./Pages/EditBlog";

const RequireAuth = ({ children }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading...</div>;
  return token ? children : <Navigate to="/register" replace />;
};

const PublicOnly = ({ children }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading...</div>;
  return token ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

          {/* Protected */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><CreateBlog /></RequireAuth>} />
          <Route path="/blog/:id" element={<RequireAuth><BlogDetail /></RequireAuth>} />
          <Route path="/edit/:id" element={<RequireAuth><EditBlog /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
