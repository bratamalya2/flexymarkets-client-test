import { Card, CardContent, Skeleton, Stack, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { useGetUserDataQuery, useGetReferralListQuery } from "../../../../globalState/userState/userStateApis";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';

function IBStatsCards() {
    const { token } = useSelector((state) => state.auth);
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });
    const { data: listData, isLoading: referralIBLoading } = useGetReferralListQuery();

    const referralListData = listData?.data?.userList || [];
    const totalIBIncome = !isLoading && data?.data?.assetData?.totalIBIncome;
    const totalIBWithdrawl = !isLoading && data?.data?.assetData?.totalIBWithdrawl;
    const availableIBIncome = totalIBIncome - totalIBWithdrawl;

    const cardsData = [
        {
            heading: "Total IB Income",
            value: totalIBIncome || 0,
            type: "currency",
            icon: AttachMoneyIcon,
            color: "#00E396",
            gradient: "linear-gradient(135deg, rgba(0, 227, 150, 0.1) 0%, rgba(0, 227, 150, 0) 100%)"
        },
        {
            heading: "Withdraw Commission",
            value: totalIBWithdrawl || 0,
            type: "currency",
            icon: PriceCheckIcon,
            color: "#008FFB",
            gradient: "linear-gradient(135deg, rgba(0, 143, 251, 0.1) 0%, rgba(0, 143, 251, 0) 100%)"
        },
        {
            heading: "Available Commission",
            value: availableIBIncome || 0,
            type: "currency",
            icon: AccountBalanceWalletIcon,
            color: "#FEB019",
            gradient: "linear-gradient(135deg, rgba(254, 176, 25, 0.1) 0%, rgba(254, 176, 25, 0) 100%)"
        },
        {
            heading: "Total Volume",
            value: "0",
            type: "text",
            icon: BarChartIcon,
            color: "#775DD0",
            gradient: "linear-gradient(135deg, rgba(119, 93, 208, 0.1) 0%, rgba(119, 93, 208, 0) 100%)"
        },
        {
            heading: "Total Clients",
            value: referralListData?.length > 0 ? referralListData?.length : "0",
            type: "text",
            icon: GroupIcon,
            color: "#FF4560",
            gradient: "linear-gradient(135deg, rgba(255, 69, 96, 0.1) 0%, rgba(255, 69, 96, 0) 100%)"
        },
    ];

    const formatValue = (val, type) => {
        if (type === 'currency') {
            return Number(val).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            });
        }
        return val;
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                {cardsData.map((card, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={i}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: "16px",
                                bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#ffffff",
                                backgroundImage: selectedTheme === 'dark' ? card.gradient : 'none',
                                boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                                border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0",
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Box
                                            sx={{
                                                p: 1,
                                                borderRadius: '10px',
                                                bgcolor: selectedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : card.color + '20',
                                                color: card.color
                                            }}
                                        >
                                            <card.icon fontSize="small" />
                                        </Box>
                                    </Stack>

                                    <Box>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            sx={{
                                                color: selectedTheme === 'dark' ? '#fff' : '#333',
                                                fontSize: '1.5rem'
                                            }}
                                        >
                                            {(isLoading && referralIBLoading) ? <Skeleton width="60%" /> : (
                                                <>
                                                    {card.type === 'currency' && '$'}
                                                    {formatValue(card.value, card.type)}
                                                </>
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: selectedTheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                                                fontWeight: 500,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {card.heading}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default IBStatsCards;
