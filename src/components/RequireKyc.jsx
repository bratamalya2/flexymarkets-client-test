import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis";
import Loader from "../components/Loader"
import RequiredBankVerification from "./RequiredBankVerification";

const RequireKyc = ({ children, isBankVerificationRequired }) => {
    // console.log(isBankVerificationRequired)
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });

    if (isLoading) return <Loader />;

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified;

    // if (isBankVerificationRequired) {
    //     <RequiredBankVerification children={children} />
    // } else{

    // }

    return (isKycVerified) ? children : <Navigate to="/client/kyc" replace />;
};

export default RequireKyc;