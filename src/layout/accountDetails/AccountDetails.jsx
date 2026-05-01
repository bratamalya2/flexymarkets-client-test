import { Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"

function AccountDetails() {

    const { token } = useSelector((state) => state.auth);
    const { data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userName = data?.data?.userData?.name
    const userEmail = data?.data?.userData?.email

    const accountDetailsData = {
        name: userName || "",
        email: userEmail || "",
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const popperRef = useRef(null);
    const avatarRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            popperRef.current &&
            !popperRef.current.contains(event.target) &&
            avatarRef.current &&
            !avatarRef.current.contains(event.target)
        ) {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        if (anchorEl) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [anchorEl]);

    return (
        <Stack
            direction="column"
            sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                py: ".5rem",
                px: ".5rem",
                whiteSpace: "nowrap"
            }}
        >
            <>
                <Stack sx={{ alignItems: "flex-start" }}>
                    <Typography>{accountDetailsData.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{accountDetailsData.email}</Typography>
                </Stack>
            </>
        </Stack>
    );
}

export default AccountDetails;