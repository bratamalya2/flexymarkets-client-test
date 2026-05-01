import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAuthRoute = () => {
    const { token } = useSelector(state => state.auth);

    return token ? <Navigate to="/client" replace /> : <Outlet />;
};

export default ProtectedAuthRoute;