import { Stack, Typography, Button, Fade, Box, useMediaQuery } from '@mui/material';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CustomTooltip from '../../../../../components/CustomTooltip';
import { useGetUserDataQuery } from '../../../../../globalState/userState/userStateApis';
import { useSelector } from 'react-redux';


function VerificationStepThree() {

    const matches = useMediaQuery('(max-width:630px)')

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && userData?.data?.userData?.isKycVerified

    const data = [
        {
            title: "Provide proof of your place of residence",
            list: [isKycVerified ? "Profile verified" : "Add profile information"]
        },
        {
            title: "Features and limits",
            list: [
                "Deposit up to 50000 USD, with the option to increase",
                "Global and local payment methods",
                "Bank card and crypto payments"
            ]
        }
    ];

    return (
        <Stack sx={{ gap: "1.5rem" }}>
            {data.map((item, i) => (
                <Box key={i}>
                    <Typography fontSize="13px" color="textSecondary">
                        {item.title}
                    </Typography>
                    <Box>
                        {item.list.map((listItem, index) => (
                            <Typography key={index} ml={"16px"} component="li" fontSize="16px">
                                {listItem}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            ))}

            <CustomTooltip
                title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <NotInterestedIcon fontSize="16px" color="textSecondary" />
                        <Typography fontSize="13px" color="textSecondary">
                            Complete step 2 to continue
                        </Typography>
                    </Box>
                }
                arrow
                placement="top"
                slots={{ transition: Fade }}
            >
                <Button
                    variant="contained"
                    fullWidth={matches}
                    disabled={isKycVerified}
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        alignSelf: "self-start",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Complete now
                </Button>
            </CustomTooltip>
        </Stack>
    );
}

export default VerificationStepThree;