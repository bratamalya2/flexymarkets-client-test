import { useState } from 'react';
import { Container, Box, Typography, Stack, Button, Grid, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useNavigate } from 'react-router-dom';
import IBTransactionList from './IBTransactionList.jsx';
import { useGetIbClientTrxListQuery } from '../../../../globalState/userState/userStateApis.js'; // Adjust path as needed


function IBTransactionListPage() {
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [globalFilter, setGlobalFilter] = useState('');

    // Call the API WITHOUT search parameter since it's not supported
    const { 
        data: apiResponse, 
        isLoading, 
        isError, 
        error 
    } = useGetIbClientTrxListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        // Remove search parameter - API doesn't support it
    });

    // Extract the actual data from the response
    const transactionData = apiResponse?.data;
    const totalDeposit = transactionData?.totalDeposit || 0;
    const totalWithdraw = transactionData?.totalWithdraw || 0;

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
                    IB Client Transactions
                </Typography>
            </Stack>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
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
                        <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#10b981' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Total Deposit
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="#10b981">
                                ${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        <CurrencyExchangeIcon sx={{ fontSize: 40, color: '#ef4444' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Total Withdraw
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="#ef4444">
                                ${totalWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Transaction Table with frontend filtering */}
            <IBTransactionList
                data={transactionData}
                isError={isError}
                showError={error?.data?.message || 'Error loading transaction list'}
                loading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
        </Container>
    );
}

export default IBTransactionListPage;