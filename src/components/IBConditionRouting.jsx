import { Navigate, useLocation } from 'react-router-dom';
import { useGetUserDataQuery } from '../globalState/userState/userStateApis';
import { useSelector } from 'react-redux';

const IBConditionRouting = ({ children }) => {

    const { token } = useSelector(state => state.auth)

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

    const location = useLocation();
    const links = [
        "/IBProgramme/IBDashboard",
        "/IBProgramme/myClients",
        "/IBProgramme/treeChart",
        "/IBProgramme/myCommission",
        "/IBProgramme/IBWithdraw",
        "/IBProgramme/teamDepositReport",
        "/IBProgramme/teamWithdrawReport"
    ];

    const isRestrictedPath = links.some(path => location.pathname.includes(path));

    if (!isIbOrSubIb && isRestrictedPath) {
        return <Navigate to="/client/IBProgramme/IBRequest" replace />;
    }

    return children;
};

export default IBConditionRouting;