import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis"

function ProtectedRoute() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    if (!token) return <Navigate to="/accounts" replace />;

    return <Outlet context={{ isLoading, data }} />;
}

export default ProtectedRoute;