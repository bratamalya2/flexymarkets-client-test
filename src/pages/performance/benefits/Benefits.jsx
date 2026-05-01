import { Stack, Typography, Box, Fade } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Selector from "../../../components/Selector";
import { useState } from "react";
import SavingData from "./SavingData";
import CustomTooltip from "../../../components/CustomTooltip";
import AvailableBenefits from "./AvailableBenefits";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import { useSelector } from "react-redux";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

// const account = [{ name: "All accounts" }, { name: "#404714946", description: "MT5 Standard" }]

function Benefits() {

    // const { token } = useSelector((state) => state.auth);
    // const { data, isLoading } = useGetUserDataQuery(undefined, {
    //     skip: !token,
    //     refetchOnMountOrArgChange: true,
    // })

    // const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified

    // const mt5AccountIds = (data?.data?.mt5AccountList)?.map(item => item?.Login)

    // const mt5AccountList = ["All accounts", ...mt5AccountIds || []]

    // const [accountType, setAccountType] = useState(
    //     // account.length > 0 ? account[0].name : ""
    //     mt5AccountList?.[0] || ""
    // )

    // const handleChangeAccount = (event) => {
    //     setAccountType(event.target.value);
    // };

    return (
        <Stack mt={"2rem"}>
            <Box
                sx={{
                    mb: "2rem",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: ".5rem"
                }}
            >
                <Typography variant='h6' fontWeight={"700"} fontSize={"1.5rem"}>Our benefits have saved you</Typography>
                <CustomTooltip
                    title={
                        <Stack>
                            <Typography fontWeight={"bold"} fontSize={"13px"}>{SHORT_BRAND_NAME} benefits</Typography>
                            <Typography fontSize={"12px"}>
                                This shows you how much in dollars each trading benefit has saved you by either restoring losses, reducing trading costs or protecting you from stop outs.
                            </Typography>
                        </Stack>
                    }
                    arrow
                    placement='top'
                    slots={{
                        transition: Fade,
                    }}
                >
                    <InfoOutlinedIcon />
                </CustomTooltip>
            </Box>
            {/* <Selector
                onChange={handleChangeAccount}
                shouldBeDisabled={!isKycVerified}
                showDefaultOption={false}
                items={mt5AccountList}
                value={accountType}
                width={{ xs: "100%", sm: "400px" }}
            /> */}
            <SavingData />
            <AvailableBenefits />
        </Stack>
    )
}

export default Benefits;