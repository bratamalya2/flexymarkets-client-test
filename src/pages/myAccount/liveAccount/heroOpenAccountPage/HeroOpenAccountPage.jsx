import { Container, Tooltip, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { Icon } from "@iconify/react";
import { useSelector } from 'react-redux';


function HeroOpenAccountPage() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    // const isAddressAdded = !isLoading && data?.data?.userData?.address
    // const isNameRegistered = !isLoading && data?.data?.userData?.name
    // const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified

    const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified
    const isMobileVerified = !isLoading && data?.data?.userData?.isMobileVerified
    const isNameRegistered = !isLoading && data?.data?.userData?.name

    const levelOneVerification = !!(isEmailVerified && isNameRegistered)

    return (
        <Container
            sx={{
                display: "flex",
                py: "8rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px"
            }}
        >
            <Icon icon="mingcute:empty-box-line" width={"80px"} color={"primary.main"} />
            <Typography>You don’t have any MT5 account</Typography>
            {/* <Tooltip title={!levelOneVerification && "Complete level one verification"}> */}
            <Button
                // component={levelOneVerification && Link}
                component={Link}
                to={"/client/newAccount"}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                    textTransform: "capitalize",
                    bgcolor: "#f3f5f7",
                    '&:hover': {
                        bgcolor: "#f3f5f7",
                    },
                    color: "black",
                    boxShadow: "none !important",
                    px: "1.5rem"
                }}
            >
                Open New Account
            </Button>
            {/* </Tooltip> */}
        </Container>
    )
}

export default HeroOpenAccountPage