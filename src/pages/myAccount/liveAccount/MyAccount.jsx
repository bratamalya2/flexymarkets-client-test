import { Button, Container, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux";
import Account from "./account/Account";
import { Link } from "react-router-dom";
import TabComponent from "../../../components/TabComponent";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import Tooltip from '@mui/material/Tooltip';
import { useMt5AccountListQuery } from "../../../globalState/mt5State/mt5StateApis";
import HeroOpenAccountPage from "./heroOpenAccountPage/HeroOpenAccountPage";
import Loader from "../../../components/Loader"
import { useEffect } from "react";
import { setActiveMT5AccountType } from "../../../globalState/mt5State/mt5StateSlice";

function MyAccount() {

    const dispatch = useDispatch()

    const { activeMT5AccountType } = useSelector(state => state.mt5)

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const { data: mt5AccountData, isLoading: mt5AccountLoading } = useMt5AccountListQuery({ page: "1", rowPerPage: "10" })

    const haveDemoMT5Account = !mt5AccountLoading && (mt5AccountData?.data?.mt5AccountList)?.filter(item => item?.accountType == "DEMO")?.length > 0
    const haveRealMT5Account = !mt5AccountLoading && (mt5AccountData?.data?.mt5AccountList)?.filter(item => item?.accountType == "REAL")?.length > 0

    // const isAddressAdded = !isLoading && data?.data?.userData?.address

    const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified
    const isMobileVerified = !isLoading && data?.data?.userData?.isMobileVerified
    const isNameRegistered = !isLoading && data?.data?.userData?.name

    const levelOneVerification = !!(isEmailVerified && isNameRegistered)

    function handleAccountToggle(newAlignment) {
        if (newAlignment) {
            dispatch(setActiveMT5AccountType(newAlignment))
        }
    }

    function handleAccount(activeMT5AccountType) {
        if (activeMT5AccountType == "Real") {
            return haveRealMT5Account ? <Account /> : <HeroOpenAccountPage />
        } else {
            return haveDemoMT5Account ? <Account /> : <HeroOpenAccountPage />
        }
    }

    useEffect(() => {
        if (!activeMT5AccountType) {
            dispatch(setActiveMT5AccountType("Real"))
        }
    }, [])

    return (
        <Stack>
            <Container>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "1rem",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>
                        My Accounts
                    </Typography>
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
                </Stack>
                <TabComponent
                    boxSx={{
                        mt: "1.2rem"
                    }}
                    items={["Real", "Demo"]}
                    onChange={(_, newAlignment) => handleAccountToggle(newAlignment)}
                    active={activeMT5AccountType}
                />
                <Stack mt={2}>
                    {
                        isLoading
                            ?
                            <Loader />
                            :
                            mt5AccountLoading
                                ?
                                <Loader />
                                :
                                handleAccount(activeMT5AccountType)
                    }
                </Stack>
            </Container>
        </Stack>
    );
}

export default MyAccount;