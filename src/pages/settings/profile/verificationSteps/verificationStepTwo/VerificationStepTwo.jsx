import { Stack, Typography, Button, Fade, Box, useMediaQuery } from '@mui/material';
import CustomTooltip from '../../../../../components/CustomTooltip';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useGetUserDataQuery } from '../../../../../globalState/userState/userStateApis';
import { useGetDocumentDataQuery } from '../../../../../globalState/complianceState/complianceStateApis';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function VerificationStepTwo() {

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const { data: documentData, isLoading: documentDataLoading } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const documentUploaded = !documentDataLoading && documentData?.data?.status

    const isKycVerified = !userDataLoading && userData?.data?.userData?.isKycVerified

    const matches = useMediaQuery('(max-width:630px)')

    let tooltipValue = ""

    if (!isKycVerified && !documentUploaded) {
        tooltipValue = "Complete step 1 to continue"
    } else if (!isKycVerified && documentUploaded) {
        tooltipValue = ""
    }

    return (
        <Stack>
            <Typography fontSize={"13px"} color="textSecondary">Provide a document confirming your name</Typography>
            <Typography mt={".5rem"}>{isKycVerified ? "Profile information verified" : "Add profile information"}</Typography>
            <Typography fontSize={"13px"} color="textSecondary" mt={"2rem"}>Features and limits</Typography>
            <CustomTooltip
                title={
                    tooltipValue &&
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                        }}
                    >
                        <NotInterestedIcon fontSize='16px' color="textSecondary" />
                        <Typography fontSize={"13px"} color="textSecondary">{tooltipValue}</Typography>
                    </Box>
                }
                arrow
                placement='top'
                slots={{
                    transition: Fade,
                }}
            >
                <Button
                    variant='contained'
                    fullWidth={matches}
                    disabled={isKycVerified}
                    component={!tooltipValue && Link}
                    to={"/client/kyc"}
                    sx={{
                        mt: "2rem",
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        alignSelf: "self-start",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >{isKycVerified ? "Completed" : "Complete now"}</Button>
            </CustomTooltip>
        </Stack>
    )
}

export default VerificationStepTwo;