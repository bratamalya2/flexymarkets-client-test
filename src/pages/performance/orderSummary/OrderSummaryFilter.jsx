import { Stack } from "@mui/material"
import Selector from "../../../components/Selector";
import { useState } from "react"
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import { useSelector } from "react-redux";

// const account = [{ name: "All accounts" }, { name: "#404714946", description: "MT5 Standard" }]

const timeRange = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 365 days"]

function OrderSummaryFilter() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified

    const mt5AccountIds = (data?.data?.mt5AccountList)?.map(item => item?.Login)

    const mt5AccountList = ["All accounts", ...mt5AccountIds || []]

    const [accountType, setAccountType] = useState(
        // account.length > 0 ? account[0].name : ""
        mt5AccountList?.[0] || ""
    )

    const handleChangeAccount = (event) => {
        setAccountType(event.target.value);
    };
    const [timeRangeType, setTimeRangeType] = useState(timeRange[0])

    const handleChangeTimeRange = (event) => {
        setTimeRangeType(event.target.value);
    };

    return (
        <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: "1rem", }}>
            <Selector
                onChange={handleChangeAccount}
                showDefaultOption={false}
                shouldBeDisabled={!isKycVerified}
                items={mt5AccountList}
                value={accountType}
                width={{ xs: "100%", sm: "400px" }}
            />
            <Selector
                onChange={handleChangeTimeRange}
                showDefaultOption={false}
                items={timeRange}
                value={timeRangeType}
                icon={CalendarMonthOutlinedIcon}
            />
        </Stack>
    )
}

export default OrderSummaryFilter;