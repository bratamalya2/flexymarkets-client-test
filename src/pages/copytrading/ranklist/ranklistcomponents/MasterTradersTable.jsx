import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Typography,
    Chip,
    Button,
    useTheme,
    Stack,
    alpha,
    Container,
    Skeleton,
    Alert,
    TablePagination
} from '@mui/material';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMasterTraderListQuery } from '../../../../globalState/socialTrading/socialTradingApis.js';
import { useNavigate } from 'react-router-dom';
import { useAddMasterTraderIntoWatchListMutation } from '../../../../globalState/socialTrading/socialTradingApis.js';
import { useDispatch } from 'react-redux';
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice";
import ModalComponent from "../../../../components/ModalComponent";
import SubscriptionSettings from './SubscriptionSettings';



const MasterTradersTable = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError } = useMasterTraderListQuery({
        page: page + 1,
        sizePerPage: rowsPerPage
    });

    const [addMasterTraderIntoWatchList, { isLoading: isAddingToWatchList }] = useAddMasterTraderIntoWatchListMutation();

    const traders = data?.data?.masterTraders || [];
    const totalRecords = data?.data?.totalRecords || 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return (
            <Container sx={{ mb: "2rem" }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider }}>
                    <Stack spacing={2}>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                        ))}
                    </Stack>
                </Paper>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ mb: "2rem" }}>
                <Alert severity="error">Failed to load Master Traders list.</Alert>
            </Container>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatPercentage = (value) => {
        return `${parseFloat(value).toFixed(2)}%`;
    };

    const handleNavigateToDetails = (traderId) => {
        navigate(`/client/copyTrading/master-trader-details/${traderId}`);
    }

    const handleToggleWatchList = async (traderId) => {
        try {
            let response = await addMasterTraderIntoWatchList({ masterTraderId: traderId }).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to update watch list. Please try again later.", severity: "error" }));
            }
        }
    };

    return (
        <Container sx={{ mb: "2rem" }}>
            <TableContainer component={Paper} elevation={0} sx={{
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 4,
                bgcolor: 'background.paper'
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="master traders table">
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.action.hover, 0.1) : '#fafafa' }}>
                        <TableRow>
                            <TableCell><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">#</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Trader</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Account</Typography></TableCell>
                            {/* <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Balance</Typography></TableCell> */}
                            <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Profit</Typography></TableCell>
                            {/* <TableCell align="center"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Copiers</Typography></TableCell> */}
                            <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Return</Typography></TableCell>
                            <TableCell align="center"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Status</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {traders.map((trader, index) => (
                            <TableRow
                                key={trader.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: theme.palette.action.hover } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" fontWeight="bold">{index + 1}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            src={trader.profileImage}
                                            alt={trader.user.name}
                                            sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}
                                        >
                                            {trader.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">{trader.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{trader.user.country}</Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Chip label={trader?.mt5Login || 'N/A'} size="small" variant="outlined" />
                                </TableCell>
                                {/* <TableCell align="right">
                                    <Typography variant="body2" fontWeight="medium">
                                        {formatCurrency(trader.latestStats.currentBalance)}
                                    </Typography>
                                </TableCell> */}
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        sx={{ color: trader.latestStats.totalPnL >= 0 ? 'success.main' : 'error.main' }}
                                    >
                                        {formatCurrency(trader.latestStats.totalPnL)}
                                    </Typography>
                                </TableCell>
                                {/* <TableCell align="center">
                                    <Typography variant="body2">{trader.latestStats.totalCopiers}</Typography>
                                </TableCell> */}
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        sx={{ color: trader.latestStats.totalPnLPercentage >= 0 ? 'success.main' : 'error.main' }}
                                    >
                                        {formatPercentage(trader.latestStats.totalPnLPercentage)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={trader.status}
                                        size="small"
                                        color={trader.status === 'ACTIVE' ? 'success' : 'default'}
                                        variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                    <ModalComponent
                                        btnName={"Subscribe"}
                                        Content={SubscriptionSettings}
                                        contentData={{masterTraderId: trader.id}}
                                        btnSx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            fontWeight: 'bold',
                                            ml: 1
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            fontWeight: 'bold',
                                            ml: 1
                                        }}
                                        onClick={() => handleNavigateToDetails(trader?.id)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        disabled={isAddingToWatchList}
                                        variant="contained"
                                        size="small"
                                        color={trader.isWatching ? "error" : "primary"}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            fontWeight: 'bold',
                                            ml: 1
                                        }}
                                        onClick={() => handleToggleWatchList(trader?.id)}
                                    >
                                        Add To Watch List
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container >
    );
};

export default MasterTradersTable;