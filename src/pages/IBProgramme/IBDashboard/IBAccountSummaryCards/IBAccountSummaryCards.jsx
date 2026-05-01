import { Card, CardContent, Skeleton, Stack, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis";
import { useGetReferralListQuery } from "../../../../globalState/userState/userStateApis";


function IBAccountSummaryCards() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });

    const { data: listData, isLoading: referralIBLoading } = useGetReferralListQuery();

    const referralListData = listData?.data?.userList || [];

    const totalIBIncome = !isLoading && data?.data?.assetData?.totalIBIncome
    const totalIBWithdrawl = !isLoading && data?.data?.assetData?.totalIBWithdrawl
    const availableIBIncome = totalIBIncome - totalIBWithdrawl

    const IBAccountSummaryCardsData = [
        {
            heading: "Total IB Income",
            total: Number(totalIBIncome || 0).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }) || "0",
            type: "amount"
        },
        {
            heading: "Withdraw Commission",
            total: Number(totalIBWithdrawl || 0).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }) || "0",
            type: "amount"
        },
        {
            heading: "Available Commission",
            total: Number(availableIBIncome || 0).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }) || "0",
            type: "amount"
        },
        {
            heading: "Total Volume",
            total: "0"
        },
        {
            heading: "Total Clients",
            total: referralListData?.length > 0 ? referralListData?.length : "0"
        },
    ]

    const { selectedTheme } = useSelector((state) => state.themeMode)

    return (
        <Stack mt={"2rem"}>
            <Grid container size={12} spacing={2}>
                {
                    IBAccountSummaryCardsData.map((data, i) => (
                        <Grid size={{ xs: 6, sm: 2.4 }} key={i}>
                            <Card sx={{ boxShadow: "none", borderRadius: "10px", bgcolor: selectedTheme !== "dark" && "#f5f5f5" }}>
                                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    {(isLoading && referralIBLoading) ? <Skeleton /> : <Typography fontSize={"1.5rem"}>{data.type && "$"}{data.total}</Typography>}
                                    <Typography fontSize={".8rem"} fontWeight={"bold"} color="#999999" textAlign={"center"}>{data.heading}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default IBAccountSummaryCards;