import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '80vh' }}></div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
