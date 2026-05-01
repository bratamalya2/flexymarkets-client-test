import OpenAccountPlanCards from "../../../../../components/OpenAccountPlanCards";
import { Box, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useGroupListQuery } from "../../../../../globalState/groupState/groupStateApis";
import { mergePlansWithGroups } from "../../../../../utils/mergePlansWithGroups";
import { Icon } from "@iconify/react";
import Selector from "../../../../../components/Selector"
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";

function OpenAccountPlanSection() {

    const [groupType, setGroupType] = useState("REAL")

    const { data, isFetching } = useGroupListQuery({
        page: 1,
        sizePerPage: 10,
        search: "",
        type: groupType
    })

    const groupList = data?.data?.groupList

    const mergedPlans = mergePlansWithGroups(groupList);

    function handleChange(e) {
        setGroupType(e.target.value)
    }

    const { selectedTheme } = useSelector(state => state.themeMode)

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });

    const userDetails = userData?.data?.userData

    const isEmailVerified = !userDataLoading && userDetails.isEmailVerified
    // const isMobileVerified = !userDataLoading && userDetails.isMobileVerified
    const isNameRegistered = !userDataLoading && userDetails.name
    const isKycVerified = !userDataLoading && userDetails.isKycVerified

    const verificationRequired = groupType == "REAL" ? isKycVerified : !!(isEmailVerified && isNameRegistered)

    const verificationRequiredTooltip = groupType == "REAL" ? "Full Kyc verification is required" : "Level one kyc verification is required"

    return (
        <Container>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Stack sx={{ flexDirection: "row", gap: "1.2rem", alignItems: "center" }}>
                    <Link to={"/client/myAccount"} style={{ color: selectedTheme === "dark" ? "white" : "black", lineHeight: "0", fontSize: "1.5rem" }}><ArrowBackIcon /></Link>
                    <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>Open New Account</Typography>
                </Stack>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "500" }}>MT5</Typography>
            </Box>
            <Selector
                items={["REAL", "DEMO"]}
                selectSx={{ mt: "2rem" }}
                width={"250px"}
                value={groupType}
                showDefaultOption={false}
                height="35px"
                onChange={handleChange}
            />
            {
                isFetching
                    ?
                    <Stack
                        sx={{
                            flexDirection: "row",
                            overflow: "auto",
                            gap: "1.2rem",
                            py: "2rem",
                        }}
                    >
                        {[...Array(4)].map((_, i) => (
                            <Box key={i}>
                                <OpenAccountPlanCards
                                    loading={isFetching}
                                    width={"320px"}
                                    height={"400px"}
                                    planType={"MT5"}
                                />
                            </Box>
                        ))}
                    </Stack>
                    :
                    <Stack sx={{ flexDirection: "row", overflow: "auto", gap: "1.2rem", py: "2rem" }}>
                        {
                            mergedPlans.length > 0
                                ?
                                mergedPlans.map((plan, index) => (
                                    <Box key={index}>
                                        <OpenAccountPlanCards
                                            {...plan}
                                            loading={isFetching}
                                            width={"320px"}
                                            height={"430px"}
                                            planType={"MT5"}
                                            verificationRequired={verificationRequired}
                                            verificationRequiredTooltip={verificationRequiredTooltip}
                                        />
                                    </Box>
                                ))
                                :
                                <Box sx={{ width: "100%", height: "400px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Icon icon="fluent:collections-empty-24-regular" width={"100px"} color={"primary.main"} />
                                    <Typography fontWeight={"bold"} fontSize={"1.2rem"}>No plan exist</Typography>
                                </Box>
                        }
                    </Stack>
            }
            <Box sx={{ display: "flex", p: 2.5, gap: ".5rem", mt: "2rem", bgcolor: "#e8f3fe", border: "1px solid #bedefd", borderRadius: "10px" }}>
                <InfoOutlinedIcon sx={{ color: "primary.main" }} />
                <Typography color="black">Detailed information on our instruments and trading conditions can be found on the <Typography component={Link} sx={{ color: "primary.main" }}>Contract Specifications</Typography> page.</Typography>
            </Box>
        </Container>
    );
};

export default OpenAccountPlanSection;