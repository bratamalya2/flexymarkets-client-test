import { useState } from 'react';
import { Container, Box, Typography, Stack, Button, Grid, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import KYCList from './KYCList';
import { useIbKycReportQuery } from '../../../../globalState/ibState/ibStateApis.js';

function KYCListPage() {
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [globalFilter, setGlobalFilter] = useState('');

    // Use the KYC API endpoint from ibStateApis
    const { 
        data: apiResponse, 
        isLoading, 
        isError, 
        error 
    } = useIbKycReportQuery();

    // Log the response to debug
    console.log('KYC API Response:', apiResponse);

    // Extract the actual data from the response
    const kycData = apiResponse?.data;
    const totalCompletedKyc = kycData?.totalCompletedKyc || 0;
    const totalPendingKyc = kycData?.totalPendingKyc || 0;
    const totalKyc = totalCompletedKyc + totalPendingKyc;

    return (
        <Container maxWidth="xl" sx={{ mb: "2rem", mt: "2rem" }}>
            {/* Header with Back Button */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight={700}>
                    IB KYC Report
                </Typography>
            </Stack>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Total KYC Applications
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="#3b82f6">
                                {totalKyc}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <VerifiedIcon sx={{ fontSize: 40, color: '#10b981' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Verified
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="#10b981">
                                {totalCompletedKyc}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <PendingIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Pending
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="#f59e0b">
                                {totalPendingKyc}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* KYC Table with built-in search */}
            <KYCList
                data={kycData}
                isError={isError}
                showError={error?.data?.message || 'Error loading KYC list'}
                loading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
        </Container>
    );
}

export default KYCListPage;