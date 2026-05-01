import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis";
import Loader from "./Loader";

const RequireVerification = ({ children, isKycRequired, isBankVerificationRequired, isHalfKycRequired }) => {
  const { token } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetUserDataQuery(undefined, { skip: !token });

  if (isLoading) return <Loader />;

  const user = data?.data?.userData;
  // const isAddressAdded = user?.address


  const isEmailVerified = user?.isEmailVerified
  const isMobileVerified = user?.isMobileVerified
  const isNameRegistered = user?.name

  const levelOneVerification = !!(isEmailVerified && isNameRegistered)


  // const isNameRegistered = user?.name
  const isKycVerified = user?.isKycVerified;
  const isBankVerified = user?.isBankVerified;

  if (isHalfKycRequired && !levelOneVerification) {
    return <Navigate to="/client/kyc" replace />
  }

  if (isKycRequired && !isKycVerified) {
    return <Navigate to="/client/kyc" replace />;
  }

  if (isBankVerificationRequired && !isBankVerified) {
    return <Navigate to="/client/compliance/bank/add" replace />;
  }

  return children;
};

export default RequireVerification;