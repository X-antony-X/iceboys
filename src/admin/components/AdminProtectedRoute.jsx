import { Navigate, Outlet } from 'react-router-dom';
import { useAdminUser } from './useAdminUser';

const AdminProtectedRoute = () => {
  const { data: user, isLoading } = useAdminUser();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;