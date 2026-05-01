import { Button, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material"
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import { useSelector } from "react-redux";

function SavingData() {

    const matches = useMediaQuery('(min-width:450px)');

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    // const isAddressAdded = data?.data?.userData?.address
    // const isNameRegistered = data?.data?.userData?.name
    // const isKycVerified = data?.data?.userData?.isKycVerified

    // 

    const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified
    const isMobileVerified = !isLoading && data?.data?.userData?.isMobileVerified
    const isNameRegistered = !isLoading && data?.data?.userData?.name

    const levelOneVerification = !!(isEmailVerified && isNameRegistered)

    return (
        <Stack
            sx={{
                my: "2rem",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.2rem"
            }}
        >
            <SaveOutlinedIcon sx={{ fontSize: "2.5rem", color: "#b0b0b0" }} />
            <Typography variant="h4" fontWeight={"bold"} fontSize={"1.2rem"}>You don't have any savings data yet</Typography>
            <Typography color="textSecondary" width={matches ? "400px" : "100%"} textAlign={"center"}>Create a real account and start trading to see how our better-than-market conditions reduce your trading costs and protect against stop outs.</Typography>
            {/* <Tooltip
                title={
                    !levelOneVerification && <Typography fontSize={"12px"}>Complete level one verification</Typography>
                }
            > */}
            <Button
                // component={levelOneVerification && Link}
                component={Link}
                to={"/client/newAccount"}
                variant='contained'
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{
                    textTransform: "none",
                    width: "auto",
                    boxShadow: "none",
                    color: "white",
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Open new account</Button>
            {/* </Tooltip> */}
        </Stack>
    )
}

export default SavingData;