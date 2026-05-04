import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setNotification } from "../globalState/notificationState/notificationStateSlice";
import { logoutThunk } from "../globalState/auth/authThunk";

function TokenExpiryHandler() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, tokenExpTime } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!token || !tokenExpTime) return;

        let timeoutId;

        const checkExpiry = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const expiryTime = Number(tokenExpTime);

            if (!Number.isFinite(expiryTime)) {
                dispatch(logoutThunk());
                return;
            }

            const timeLeft = expiryTime - currentTime;

            if (timeLeft <= 0) {
                dispatch(logoutThunk());
                dispatch(setNotification({
                    open: true,
                    message: "Session expired. Please log in again.",
                    severity: "info",
                }));
                return;
            }

            // Max delay for setTimeout is 2^31-1 (2147483647 ms, approx 24.8 days)
            // If the delay is larger, it overflows and executes immediately
            const MAX_TIMEOUT = 2147483647;
            const delay = Math.min(timeLeft * 1000, MAX_TIMEOUT);
            
            timeoutId = setTimeout(checkExpiry, delay);
        };

        checkExpiry();

        return () => clearTimeout(timeoutId);
    }, [token, tokenExpTime, dispatch, navigate]);

    return null;
}

export default TokenExpiryHandler;
