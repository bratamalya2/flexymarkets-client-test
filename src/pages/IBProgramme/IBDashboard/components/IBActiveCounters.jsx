import { Skeleton, Stack, Typography, Card, CardContent, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useSelector } from 'react-redux';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useLiveAccountQuery } from '../../../../globalState/ibState/ibStateApis';

function IBActiveCounters() {
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const { data: liveAccount, isLoading: liveAccountLoading } = useLiveAccountQuery();

    const totalAccount = !liveAccountLoading && liveAccount?.data;
    const totalActiveTraders = totalAccount?.activeTraders?.length || 0;

    const data = [
        {
            name: "Active Traders",
            icon: GroupIcon,
            color: "#00E396",
            value: totalActiveTraders,
            isLoading: liveAccountLoading
        },
        {
            name: "Active IB",
            icon: PersonIcon,
            color: "#008FFB",
            value: 0,
            isLoading: false
        },
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: selectedTheme === 'dark' ? '#fff' : 'inherit' }}>
                Active Status
            </Typography>
            <Grid container spacing={2}>
                {data.map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Card
                            sx={{
                                bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#fff",
                                borderRadius: "16px",
                                boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
                                border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "none"
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" fontWeight="500" mb={0.5}>
                                        {item.name}
                                    </Typography>
                                    {item.isLoading ? (
                                        <Skeleton width={60} height={40} />
                                    ) : (
                                        <Typography variant="h4" fontWeight="bold" color={selectedTheme === 'dark' ? '#fff' : 'text.primary'}>
                                            {item.value}
                                        </Typography>
                                    )}
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: selectedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : item.color + '20',
                                    color: item.color
                                }}>
                                    <item.icon fontSize="medium" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default IBActiveCounters;
