import { Stack, Typography, Card, CardContent, Box, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from 'react-redux';

const PERFORMANCE_DATA = [
    { name: "Abdul Faiz Mohammed", email: "faizabdul2002@gmail.com", level: 1, lots: "10048.47", commission: "25,639.7600" },
    { name: "Abdul Faiz Mohammed", email: "faizabdul2002@gmail.com", level: 1, lots: "10048.47", commission: "25,639.7600" },
    { name: "Abdul Faiz Mohammed", email: "faizabdul2002@gmail.com", level: 1, lots: "10048.47", commission: "25,639.7600" },
    { name: "Abdul Faiz Mohammed", email: "faizabdul2002@gmail.com", level: 1, lots: "10048.47", commission: "25,639.7600" },
];

const TEAM_DATA = [
    { name: "Abdul Faiz Mohammed", code: "683292", commission: "25,639.7600", lots: "10048.47" },
    { name: "Abdul Faiz Mohammed", code: "683292", commission: "25,639.7600", lots: "10048.47" },
    { name: "Abdul Faiz Mohammed", code: "683292", commission: "25,639.7600", lots: "10048.47" },
    { name: "Abdul Faiz Mohammed", code: "683292", commission: "25,639.7600", lots: "10048.47" },
];

function PerformanceListItem({ item, type, theme }) {
    const isDark = theme === 'dark';

    return (
        <Box sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
            mb: 1.5,
            border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #eee',
            transition: 'all 0.2s',
            '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
                transform: 'translateX(5px)'
            }
        }}>
            <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 12, sm: 5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: isDark ? 'primary.dark' : 'primary.light', fontSize: '0.8rem' }}>
                            {item.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="600" color={isDark ? '#fff' : 'text.primary'}>
                                {item.name}
                            </Typography>
                            {type === 'analytics' && (
                                <Typography variant="caption" color="text.secondary">
                                    {item.email}
                                </Typography>
                            )}
                            {type === 'team' && (
                                <Typography variant="caption" color="text.secondary">
                                    Sub IB
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Grid>

                {type === 'analytics' ? (
                    <>
                        <Grid size={{ xs: 3, sm: 2 }}>
                            <Typography variant="caption" display="block" color="text.secondary">Level</Typography>
                            <Typography variant="body2" fontWeight="600">{item.level}</Typography>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 2 }}>
                            <Typography variant="caption" display="block" color="text.secondary">Lots</Typography>
                            <Typography variant="body2" fontWeight="600">{item.lots}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} textAlign="right">
                            <Typography variant="caption" display="block" color="text.secondary">Commission</Typography>
                            <Typography variant="body2" fontWeight="bold" color="#00E396">{item.commission}</Typography>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid size={{ xs: 3, sm: 2 }}>
                            <Typography variant="caption" display="block" color="text.secondary">Code</Typography>
                            <Typography variant="body2" color="#008FFB">{item.code}</Typography>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 2 }}>
                            <Typography variant="caption" display="block" color="text.secondary">Lots</Typography>
                            <Typography variant="body2" color="#00E396" fontWeight="600">{item.lots}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} textAlign="right">
                            <Typography variant="caption" display="block" color="text.secondary">Commission</Typography>
                            <Typography variant="body2" fontWeight="bold">{item.commission}</Typography>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
}

function IBPerformanceLists() {
    const { selectedTheme } = useSelector((state) => state.themeMode);

    return (
        <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{
                    height: '100%',
                    borderRadius: "16px",
                    bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#ffffff",
                    boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                    border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0"
                }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" mb={3}>Performance Analytics</Typography>
                        {PERFORMANCE_DATA.map((item, i) => (
                            <PerformanceListItem key={i} item={item} type="analytics" theme={selectedTheme} />
                        ))}
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{
                    height: '100%',
                    borderRadius: "16px",
                    bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#ffffff",
                    boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                    border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0"
                }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" mb={3}>IB Team Performance</Typography>
                        {TEAM_DATA.map((item, i) => (
                            <PerformanceListItem key={i} item={item} type="team" theme={selectedTheme} />
                        ))}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default IBPerformanceLists;
