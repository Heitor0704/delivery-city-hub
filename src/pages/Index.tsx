
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Add defensive logging to help debug issues
    console.log("Index page - Auth state:", { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user with role:", user.role);
      
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          console.log("Redirecting to admin dashboard");
          navigate('/admin-dashboard', { replace: true });
          break;
        case "cityManager":
          console.log("Redirecting to city manager dashboard");
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "owner":
          console.log("Redirecting to owner dashboard");
          navigate('/owner-dashboard', { replace: true });
          break;
        default:
          console.log("Unknown role or no role provided:", user.role);
          navigate('/', { replace: true });
      }
    } else if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login page");
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Add a simple loading state while role-based navigation is processing
  return isAuthenticated ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecionando...</p>
      </div>
    </div>
  ) : null;
};

export default Index;
