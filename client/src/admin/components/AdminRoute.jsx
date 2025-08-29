import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // not logged in -> go to login
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  // logged in but not admin -> go to home
  if (!user || !user.isAdmin) return <Navigate to="/" state={{ from: location }} replace />;

  return children;
}