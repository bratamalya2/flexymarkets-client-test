import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis";
import Loader from "../components/Loader"

const RequiredBankVerification = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });

    if (isLoading) return <Loader />;

    const isBankVerified = !isLoading && data?.data?.userData?.isBankVerified

    return isBankVerified ? children : <Navigate to="/client/compliance/bank/add" replace />;
};

export default RequiredBankVerification;