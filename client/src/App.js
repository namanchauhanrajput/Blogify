import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Notifications from "./Pages/Notifications";
import "./index.css";

import SearchUsers from "./Pages/SearchUsers";

// --- Admin imports (integrated into main app)
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/components/AdminLayout";
import UsersPage from "./admin/pages/UsersPage";
import BlogsPage from "./admin/pages/BlogsPage";

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/register" replace />;
};

const PublicRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : element;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/register", "/login", "/forgot-password"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<PublicRoute element={<Register />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/create-blog" element={<ProtectedRoute element={<CreateBlog />} />} />
          <Route path="/my-profile" element={<ProtectedRoute element={<MyProfile />} />} />
          <Route path="/profile/:userId" element={<ProtectedRoute element={<UserProfile />} />} />
          <Route path="/edit-blog/:id" element={<ProtectedRoute element={<EditBlog />} />} />
          <Route path="/blog/:id" element={<ProtectedRoute element={<BlogDetail />} />} />
          <Route path="/comments/:id" element={<ProtectedRoute element={<Comment />} />} />

           <Route
          path="/search-users"
          element={<ProtectedRoute element={<SearchUsers />} />}
        />

          {/* Admin nested routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* note: these child routes are relative to /admin */}
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="blogs" element={<BlogsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
