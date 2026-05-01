import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import { Box, Divider, Stack, Typography, Button, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setProfileVerificationStep } from '../../../../../globalState/profileState/ProfileStateSlices';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useGetUserDataQuery } from '../../../../../globalState/userState/userStateApis';

function VerificationStepOneListing() {

    const dispatch = useDispatch()

    const matches = useMediaQuery('(max-width:630px)')

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userEmail = !isLoading && userData?.data?.userData?.email

    const data = [
        {
            icon: EmailOutlinedIcon,
            stepNo: "1.",
            title: "Confirm email address",
            content: userEmail
        },
        {
            icon: PhoneAndroidOutlinedIcon,
            stepNo: "2.",
            title: "Confirm phone number",
            content: "Please verify your mobile number"
        },
        {
            icon: ContentPasteOutlinedIcon,
            stepNo: "3.",
            title: "Add profile information",
            content: "Please add more information about you"
        }
    ]

    return (
        <Stack>
            <Typography fontWeight={"bold"} fontSize={"1.8rem"}>
                Verification steps
            </Typography>
            <Typography fontSize={"14px"} color="textSecondary">
                This process takes less than 5 minutes
            </Typography>
            <Stack mt={"2rem"}>
                {data.map((item, i) => (
                    <div key={i}>
                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
                            <item.icon sx={{ fontSize: "1.8rem", color: "#6c8595" }} />
                            <Stack>
                                <Box sx={{ display: "flex", gap: "5px" }}>
                                    <Typography>{item.stepNo}</Typography>
                                    <Typography>{item.title}</Typography>
                                </Box>
                                <Typography fontSize={"14px"} color="textSecondary">{item.content}</Typography>
                            </Stack>
                        </Stack>
                        <Divider sx={{ my: "1rem" }} />
                    </div>
                ))}
            </Stack>
            <Box
                sx={{
                    my: "2rem",
                    display: "flex",
                    flexDirection: matches ? "column" : "row",
                    gap: "1rem",
                    justifyContent: "flex-end"
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7", }
                    }}
                >
                    Do it later
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        "&:hover": { boxShadow: "none" }
                    }}
                    onClick={() => dispatch(setProfileVerificationStep('email'))}
                >
                    Get Started
                </Button>
            </Box>
            <Stack sx={{ flexDirection: "row", gap: "5px", justifyContent: "center", alignItems: "center" }}>
                <LockOutlinedIcon fontSize="14px" />
                <Typography fontSize={"14px"}>All data is encrypted for security</Typography>
            </Stack>
        </Stack>
    );
}

export default VerificationStepOneListing;