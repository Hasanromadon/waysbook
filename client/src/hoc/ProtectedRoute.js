import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, redirectPath = '/' }) => {
  console.log('userrrrr', user);
  if (!user?.user?.role === 'admin') {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
