import { Skeleton, Stack } from "@mui/material";
import AccountDetailsAccordian from "../accountDetailsAccordian/AccountDetailsAccordian.jsx";
import { realListAccountDetails, demoListAccountDetails } from "./listTypeAccountDetailsData.js";
import { realGridAccountDetails, demoGridAccountDetails } from "./gridTypeAccountDetailsData.js";
import { useDispatch, useSelector } from "react-redux";
import AccountDetailsCard from "../AccountDetailsCard.jsx";
import { useMt5AccountListQuery } from "../../../../globalState/mt5State/mt5StateApis.js";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis.js"
import { useBroadcast } from "../../../../hooks/useBroadcast.jsx";

function Account() {

    const channel = useBroadcast("logout");
    const { activeMT5AccountType } = useSelector(state => state.mt5)
    const { myAccountLayout } = useSelector((state) => state.myAccount);
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth);

    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mt5Accounts = !userDataLoading && userData?.data?.mt5AccountList
    const realMT5Accounts = mt5Accounts?.filter(item => item?.accountType === "REAL")
    const demoMT5Accounts = mt5Accounts?.filter(item => item?.accountType === "DEMO")

    const accountsToShow = activeMT5AccountType === "Real" ? realMT5Accounts : demoMT5Accounts;
    const listAccountData = activeMT5AccountType === "Real" ? realListAccountDetails : demoListAccountDetails;
    const gridAccountData = activeMT5AccountType === "Real" ? realGridAccountDetails : demoGridAccountDetails;

    return (
        <Stack>
            {userDataLoading ? (
                <Skeleton sx={{ mt: "2rem" }} width={"100%"} height={"100px"} />
            ) : (
                <Stack gap="1rem">
                    {myAccountLayout === "list" ? (
                        accountsToShow?.map((account) => (
                            <AccountDetailsAccordian
                                key={account.Login}
                                account={account}
                                actionButtons={listAccountData.actionButtons}
                            />
                        ))
                    ) : (

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {accountsToShow?.map((account) => (
                                <AccountDetailsCard
                                    key={account.Login}
                                    accountDetailsData={gridAccountData.detailsData}
                                    accountTypeAndNumber={{ type: account.accountType, number: account.Login }}
                                    actionButtons={gridAccountData.actionButtons}
                                />
                            ))}
                        </Box>
                    )}
                </Stack>
            )}
        </Stack>
    );
}

export default Account;