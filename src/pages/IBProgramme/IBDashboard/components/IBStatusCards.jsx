import { Skeleton, Stack, Typography, Card, CardContent, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useSelector } from 'react-redux';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useIbKycReportQuery, useLiveAccountQuery } from '../../../../globalState/ibState/ibStateApis';

function IBStatusCards() {
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const { data: IbKycData, isLoading: IBKycLoading } = useIbKycReportQuery();
    // const { data: liveAccount, isLoading: liveAccountLoading } = useLiveAccountQuery();

    const totalPendingKyc = IBKycLoading || !IbKycData?.status ? 0 : IbKycData.data.totalPendingKyc || 0;
    const totalCompletedKyc = IBKycLoading || !IbKycData?.status ? 0 : IbKycData.data.totalCompletedKyc || 0;

    const statusOverviewData = [
        {
            name: "KYC Status",
            icon: FindInPageIcon,
            pending: IbKycData?.status ? totalPendingKyc || 0 : 0,
            complete: IbKycData?.status ? totalCompletedKyc || 0 : 0,
            isLoading: IBKycLoading || false,
            color: "#00E396"
        },
        {
            name: "Live Account",
            icon: AutoAwesomeMotionIcon,
            pending: 0,
            complete: 0,
            isLoading: false,
            color: "#008FFB"
        },
        {
            name: "FTD Status",
            icon: MoneyOffIcon,
            pending: 0,
            complete: 0,
            isLoading: false,
            color: "#FEB019"
        },
        {
            name: "IB Status",
            icon: PersonIcon,
            pending: 0,
            complete: 0,
            isLoading: false,
            color: "#775DD0"
        }
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: selectedTheme === 'dark' ? '#fff' : 'inherit' }}>
                IB Status
            </Typography>
            <Grid container spacing={2}>
                {statusOverviewData.map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card
                            sx={{
                                bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#ffffff",
                                borderRadius: "16px",
                                boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                                border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0",
                                height: '100%'
                            }}
                        >
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: '8px',
                                        bgcolor: selectedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : item.color + '20',
                                        color: item.color
                                    }}>
                                        <item.icon fontSize="small" />
                                    </Box>
                                    <Typography fontWeight="600">{item.name}</Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                    <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: selectedTheme === 'dark' ? 'rgba(0, 227, 150, 0.1)' : 'rgba(0, 227, 150, 0.1)', borderRadius: '12px' }}>
                                        {item.isLoading ? <Skeleton width={30} height={30} sx={{ mx: 'auto' }} /> : (
                                            <Typography variant="h5" fontWeight="bold" color="#00E396">
                                                {item.complete}
                                            </Typography>
                                        )}
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={0.5}>
                                            <CheckCircleIcon sx={{ fontSize: 12, color: '#00E396' }} />
                                            <Typography variant="caption" color="text.secondary">Complete</Typography>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: selectedTheme === 'dark' ? 'rgba(255, 69, 96, 0.1)' : 'rgba(255, 69, 96, 0.1)', borderRadius: '12px' }}>
                                        {item.isLoading ? <Skeleton width={30} height={30} sx={{ mx: 'auto' }} /> : (
                                            <Typography variant="h5" fontWeight="bold" color="#FF4560">
                                                {item.pending}
                                            </Typography>
                                        )}
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={0.5}>
                                            <PendingIcon sx={{ fontSize: 12, color: '#FF4560' }} />
                                            <Typography variant="caption" color="text.secondary">Pending</Typography>
                                        </Stack>
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

export default IBStatusCards;