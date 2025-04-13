
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Se estiver autenticado, redireciona para o dashboard apropriado
      // Usando o tipo_usuario da tabela Usuarios
      switch (user.role) {
        case "owner":
          navigate('/owner-dashboard', { replace: true });
          break;
        case "cityManager":
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "admin":
          navigate('/admin-dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } else {
      // Se não estiver autenticado, redireciona para a página de login
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return null; // Esta página apenas redireciona
};

export default Index;
