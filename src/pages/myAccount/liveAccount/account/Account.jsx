import { Skeleton, Stack } from "@mui/material";
import AccountDetailsAccordian from "../accountDetailsAccordian/AccountDetailsAccordian.jsx";
import { realListAccountDetails, demoListAccountDetails } from "./listTypeAccountDetailsData.js";
import { realGridAccountDetails, demoGridAccountDetails } from "./gridTypeAccountDetailsData.js";
import { useDispatch, useSelector } from "react-redux";
import AccountDetailsCard from "../AccountDetailsCard.jsx";
import Selector from "../../../../components/Selector.jsx";
import { useMt5AccountBalanceQuery, useMt5AccountListQuery } from "../../../../globalState/mt5State/mt5StateApis.js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState, useMemo, useEffect, useRef } from "react";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis.js"
import { setActiveMT5AccountLogin } from "../../../../globalState/mt5State/mt5StateSlice.js";
import { initiateMT5AccountDetailsSocketConnection } from "../../../../socketENV/MT5AccountDetailsSocketENV.js";
import { useBroadcast } from "../../../../hooks/useBroadcast.jsx";
import { notifyMt5AccountChange } from "../../../../utils/notifyMt5AccountChange.js";
import { setSelectedSymbol } from "../../../../globalState/terminalState/terminalSlice.js";

const SERVER_NAME = import.meta.env.VITE_SERVER_NAME

function Account() {

    const channel = useBroadcast("logout");

    const { activeMT5AccountType } = useSelector(state => state.mt5)

    const { myAccountLayout } = useSelector((state) => state.myAccount);

    const [activeAccountDetails, setActiveAccountDetails] = useState(null)

    const socketRef = useRef()

    const dispatch = useDispatch()

    const { activeMT5AccountLogin } = useSelector(state => state.mt5)

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mt5Accounts = !userDataLoading && userData?.data?.mt5AccountList

    const realMT5Accounts = mt5Accounts?.filter(item => item?.accountType === "REAL")
    const demoMT5Accounts = mt5Accounts?.filter(item => item?.accountType === "DEMO")

    const handleSetActiveMt5Account = (value) => {
        const nextId = typeof value === "object" ? String(value?.target?.value || "") : String(value || "");
        if (!nextId || nextId === activeMT5AccountLogin) return;

        dispatch(setActiveMT5AccountLogin(nextId));
        // dispatch(setSelectedSymbol(null));
        notifyMt5AccountChange(nextId, channel);
    };

    const defaultActiveMT5AccountLogin = activeMT5AccountType == "Real" ? realMT5Accounts?.[0]?.Login : demoMT5Accounts?.[0]?.Login

    const { data, isLoading } = useMt5AccountListQuery({
        page: 1,
        sizePerPage: 10,
        search: activeMT5AccountLogin || defaultActiveMT5AccountLogin
    })

    const activeAccount = useMemo(() => {
        return data?.data?.mt5AccountList?.[0] || null;
    }, [data]);

    const { data: accountBalance, isLoading: accountBalanceLoading } = useMt5AccountBalanceQuery({ login: activeAccount?.Login, flag: 1 }, { skip: !activeAccount?.Login })

    // const activeAccountBalance = accountBalance?.data?.answer?.balance?.user

    useEffect(() => {
        if (!activeAccount?.Login || !token) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
            setActiveAccountDetails(null)
        }

        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: activeAccount.Login,
            token,
            accountData
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [activeAccount?.Login, token]);

    const accountData = (data) => {
        if (data) {
            setActiveAccountDetails(data?.marginDetails ? data?.marginDetails : data)
        }
    }

    const realMT5LoginIds = useMemo(() => {
        return Array.isArray(realMT5Accounts) ? realMT5Accounts.map(item => item.Login) : [];
    }, [mt5Accounts]);

    const demoMT5LoginIds = useMemo(() => {
        return Array.isArray(demoMT5Accounts) ? demoMT5Accounts.map(item => item.Login) : [];
    }, [mt5Accounts]);

    const detailsData = useMemo(() => ({
        "Actual leverage": activeAccountDetails ? activeAccountDetails?.MarginLeverage || "- - - - -" : "- - - - -",
        "Free margin": activeAccountDetails ? activeAccountDetails?.MarginFree || "0.00 USD" : "0.00 USD",
        "Unrealized P&L": activeAccountDetails ? activeAccountDetails?.Profit || "0.00 USD" : "0.00 USD",
        "Equity": activeAccountDetails ? activeAccountDetails?.Equity || "0.00 USD" : "0.00 USD",
        "Credit": activeAccountDetails ? activeAccountDetails?.Credit || "0.00 USD" : "0.00 USD"
    }), [activeAccount, activeAccountDetails]);

    const accountTypeDetails = useMemo(() => ({
        type: activeAccount?.accountType || "-",
        MTVersion: "MT5",
        groupType: activeAccount?.group?.name || "-",
        groupMaxLeverage: activeAccount?.group?.leverage || 0,
        accountId: activeAccount?.Login || "-",
        totalAmount: activeAccount?.Balance || 0
    }), [activeAccount]);

    const detailsID = useMemo(() => [
        { type: "Server", id: SERVER_NAME, icon: ContentCopyIcon },
        { type: "MT5 login", id: activeAccount?.Login || "-", icon: ContentCopyIcon }
    ], [activeAccount]);

    const listAccountData = activeMT5AccountType === "Real" ? realListAccountDetails : demoListAccountDetails;
    const gridAccountData = activeMT5AccountType === "Real" ? realGridAccountDetails : demoGridAccountDetails;

    useEffect(() => {
        if (activeMT5AccountType === "Real") {
            if (!realMT5Accounts?.some(acc => acc.Login === activeMT5AccountLogin)) {
                dispatch(setActiveMT5AccountLogin(realMT5Accounts?.[0]?.Login || null));
                dispatch(setSelectedSymbol(null));
            }
        } else {
            if (!demoMT5Accounts?.some(acc => acc.Login === activeMT5AccountLogin)) {
                dispatch(setActiveMT5AccountLogin(demoMT5Accounts?.[0]?.Login || null));
                dispatch(setSelectedSymbol(null));
            }
        }
    }, [activeMT5AccountType, realMT5Accounts, demoMT5Accounts, activeMT5AccountLogin, dispatch]);

    const items = activeMT5AccountType === "Real" ? realMT5LoginIds : demoMT5LoginIds
    const value = activeMT5AccountLogin || (activeMT5AccountType === "Real" ? realMT5Accounts?.[0]?.Login : demoMT5Accounts?.[0]?.Login)

    return (
        <Stack>
            {
                isLoading
                    ?
                    <Skeleton sx={{ mt: "2rem" }} width={"250px"} height={"40px"} />
                    :
                    <Selector
                        items={items}
                        value={value}
                        onChange={(e) => handleSetActiveMt5Account(e.target.value)}
                        showDefaultOption={false}
                        width={"250px"}
                        selectSx={{ mt: "2rem" }}
                    />
            }
            {/* <AccountTypeAndPattern /> */}
            {
                myAccountLayout === "list" ?

                    <AccountDetailsAccordian
                        accountDetailsData={detailsData}
                        activeAccountDetails={activeAccountDetails}
                        accountDetailsID={detailsID}
                        actionButtons={listAccountData.actionButtons}
                        accountTypeDetails={accountTypeDetails}
                        activeAccountBalance={activeAccountDetails ? activeAccountDetails?.Balance || "0.00 USD" : "0.00 USD"}
                        activeAccountBalanceLoading={accountBalanceLoading}
                    />
                    :
                    <AccountDetailsCard
                        accountDetailsData={gridAccountData.detailsData}
                        accountTypeAndNumber={gridAccountData.accountTypeAndNumber}
                        actionButtons={gridAccountData.actionButtons}
                    // menuData={gridAccountData.menuData}
                    />
            }
        </Stack>
    );
}

export default Account;