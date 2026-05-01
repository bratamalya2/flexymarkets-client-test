import { Navigate } from 'react-router-dom';
import { useGetUserDataQuery } from '../globalState/userState/userStateApis';
import Loader from "../components/Loader"
import { useSelector } from 'react-redux';

const RedirectIfIB = ({ children }) => {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    if (isLoading) {
        return <Loader />
    }

    const isIb = data?.data?.userData?.isIb
    const isSubIb = data?.data?.userData?.isSubIb

    const isIbOrSubIb = (isIb || isSubIb)

    if (isIbOrSubIb) {
        return <Navigate to="/client/IBProgramme/IBDashboard" replace />;
    }

    return children;
};

export default RedirectIfIB;