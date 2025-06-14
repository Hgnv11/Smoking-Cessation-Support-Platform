import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Check for admin role
  if (requiredRole === 'admin' && user.role !== 'admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }
  // Check for mentor role
  if (requiredRole === 'mentor' && user.role !== 'mentor') {
    // Redirect to home if not mentor
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 