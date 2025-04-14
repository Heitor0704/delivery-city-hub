
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("Index page - Auth state:", { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user with role:", user.role);
      
      // Redirect based on user role
      switch (user.role) {
        case "owner":
          console.log("Redirecting to owner dashboard");
          navigate('/owner-dashboard', { replace: true });
          break;
        case "cityManager":
          console.log("Redirecting to city manager dashboard");
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "admin":
          console.log("Redirecting to admin dashboard");
          navigate('/admin-dashboard', { replace: true });
          break;
        default:
          console.log("Unknown role, redirecting to root");
          navigate('/', { replace: true });
      }
    } else if (!isAuthenticated) {
      console.log("User not authenticated, staying on login page");
      // Stay on current page (login) if user is not authenticated
    }
  }, [isAuthenticated, user, navigate]);

  // This page only redirects
  return null;
};

export default Index;
