import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setNotification } from "../globalState/notificationState/notificationStateSlice";
import { setTokenExpTime } from "../globalState/auth/authSlice";
import { logoutThunk } from "../globalState/auth/authThunk";

function TokenExpiryHandler() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tokenExpTime, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!tokenExpTime) return;

        // Stale tokenExpTime with no active session — clear silently
        if (!token) {
            dispatch(setTokenExpTime(null));
            return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = tokenExpTime - currentTime;

        const handleTokenExpiry = () => {
            dispatch(logoutThunk());
            dispatch(setNotification({
                open: true,
                message: "Session expired. Please log in again.",
                severity: "info",
            }));
        };

        if (timeLeft <= 0) {
            handleTokenExpiry();
            return;
        }

        // setTimeout overflows a 32-bit int past ~24.8 days; skip scheduling — re-evaluated on next mount
        const timeoutMs = timeLeft * 1000;
        if (timeoutMs > 2_147_483_647) return;

        const timeout = setTimeout(handleTokenExpiry, timeoutMs);
        return () => clearTimeout(timeout);
    }, [tokenExpTime, token, dispatch, navigate]);

    return null;
}

export default TokenExpiryHandler;
