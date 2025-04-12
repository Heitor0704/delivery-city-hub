
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Se estiver autenticado, redireciona para o dashboard apropriado
      switch (user.role) {
        case "owner":
          navigate('/owner-dashboard');
          break;
        case "cityManager":
          navigate('/city-manager-dashboard');
          break;
        case "admin":
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      // Se não estiver autenticado, redireciona para a página de login
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return null; // Esta página apenas redireciona
};

export default Index;
