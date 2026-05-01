import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useGetDocumentDataQuery } from "../../globalState/complianceState/complianceStateApis";
import { useSelector } from "react-redux";

function KycVerificationSidebar() {

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isEmailVerified = !isLoading && userData?.data?.userData?.isEmailVerified
    const isMobileVerified = !isLoading && userData?.data?.userData?.isMobileVerified
    const userName = !isLoading && userData?.data?.userData?.name

    const { data: docData } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const areDocsUploaded = docData?.data?.status == "PENDING"

    const data = [
        {
            name: "Verify email",
            verified: isEmailVerified || false,
            icon: CheckCircleIcon
        },
        {
            name: "Verify phone",
            verified: isMobileVerified || false,
            icon: CheckCircleIcon
        },
        {
            name: "Personal information",
            verified: userName || false,
            icon: CheckCircleIcon
        },
        // {
        //     name: "Economic profile",
        //     verified: false,
        //     icon: CheckCircleIcon
        // },
        {
            name: "Verify documents",
            verified: areDocsUploaded || false,
            icon: WatchLaterIcon
        }
    ]

    return (
        <Stack>
            {
                data.map((item, i) => (
                    <Box key={i} sx={{ width: "220px", p: "20px 16px", display: "flex", justifyContent: "space-between" }}>
                        <Typography>{item.name}</Typography>
                        {item.verified && <item.icon sx={{ color: item.name === "Verify documents" ? "#e3e33d" : "#46cd7c", fontSize: "1.7rem" }} />}
                    </Box>
                ))
            }
        </Stack>
    )
}

export default KycVerificationSidebar;